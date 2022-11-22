import { fastHashCode } from "fast-hash-code";
import * as path from "path";
import rehypeMathjax from "rehype-mathjax";
import rehypeStringify from "rehype-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { remove } from "unist-util-remove";
import { select, selectAll } from "unist-util-select";
import { isUri } from "valid-url";
import YAML from "yaml";

import { rehypeAnkiMathjax } from "./lib/rehype-anki-mathjax";
import { remarkTagLink, TagLink } from "./lib/remark-tag-link";
import { INotePosition } from "./model";
import {
  BASIC_MODEL,
  IDeck,
  IFrontmatterConfig,
  INote,
  MediaInfo,
  MediaName,
} from "./model";

import type {
  Content,
  FrontmatterContent,
  Heading,
  Image,
  Resource,
  Alternative,
  Root as MdastRoot,
} from "mdast";

interface ParserConfig {
  // Render mathjax as svg, instead of Anki native mathjax syntax.
  // https://docs.ankiweb.net/math.html#mathjax.
  useSvgMathjax?: boolean;
}

export class Parser {
  #config: ParserConfig;

  constructor(config: ParserConfig) {
    this.#config = config;
  }

  private static readonly BASIC_CARD_TAG = "card";
  private static readonly CUSTOM_CARD_TAG_PREFIX = "card-";
  private static readonly DEFAULT_DECK_NAME = "Default";

  private static isH1(node: Content): boolean {
    return node.type === "heading" && node.depth === 1;
  }

  private static isH2(node: Content): boolean {
    return node.type === "heading" && node.depth === 2;
  }

  private async toHtml(nodes: Array<Content>): Promise<string> {
    const mdast: MdastRoot = {
      type: "root",
      children: nodes,
    };

    // TODO: remove the surrounding spaces as well.
    remove(mdast, "tagLink");

    const rehypeAst: any = await unified()
      .use(remarkRehype)
      .use(this.#config.useSvgMathjax ? rehypeMathjax : rehypeAnkiMathjax)
      .run(mdast);
    return unified().use(rehypeStringify).stringify(rehypeAst);
  }

  private static extractFieldName(fieldHeading: Heading): string {
    return (
      fieldHeading.children.find((c) => c.type === "tagLink")!! as TagLink
    ).data.name;
  }

  private static isBasicCardTag(tag: string): boolean {
    return tag === Parser.BASIC_CARD_TAG;
  }

  private static extractCustomModelName(tag: string): string | undefined {
    if (tag.startsWith(Parser.CUSTOM_CARD_TAG_PREFIX)) {
      return tag.substring(Parser.CUSTOM_CARD_TAG_PREFIX.length);
    }
  }

  /**
   * According to https://docs.ankiweb.net/importing.html#importing-media
   * Do not put subdirectories in the media folder, or some features will not work.
   *
   * Use normalized filename instead to avoid collisions when flattening all the media files.
   */
  private static normalizedFilename(resource: Resource & Alternative): string {
    const hash = fastHashCode(
      JSON.stringify({
        url: resource.url,
        alt: resource.alt,
        title: resource.title,
      }),
      {
        forcePositive: true,
      },
    );
    return `${hash}-${resource.url.split("/").at(-1)}`;
  }

  private static processAndExtraMedias(
    nodes: Array<Content>,
    dirpath?: string,
  ): Record<MediaName, MediaInfo> {
    const medias: Record<MediaName, MediaInfo> = {};
    for (const node of nodes) {
      selectAll("image", node).forEach((i) => {
        const image = i as Image;
        if (isUri(image.url)) {
          const filename = Parser.normalizedFilename(image);
          medias[filename] = { url: image.url };
          image.url = filename;
        } else {
          const absPath = path.resolve(dirpath || path.resolve(), image.url);
          const filename = Parser.normalizedFilename({
            ...image,
            url: path.relative(dirpath || path.resolve(), absPath),
          });
          medias[filename] = { absPath };
          image.url = filename;
        }
      });
    }

    return medias;
  }

  /**
   * NoteId is token at the end of card heading with format:
   * `\s+\^[0-9]+$`
   *
   * @returns nodeId, if present
   */
  private static extractNoteId(heading: Heading): string | undefined {
    const lastText = heading.children.at(-1);
    if (!lastText || lastText.type !== "text") {
      return;
    }

    const matches = lastText.value.match(/\s+\^([0-9]+)$/);
    if (matches && matches.length >= 2) {
      const nodeId: string = matches[1];
      lastText.value = lastText.value.substring(
        0,
        lastText.value.length - matches[0].length,
      );
      if (!lastText.value) {
        heading.children = heading.children.slice(
          0,
          heading.children.length - 1,
        );
      }
      return nodeId;
    }
  }

  private async toNote(
    nodes: Array<Content>,
    dirpath?: string,
  ): Promise<INote | undefined> {
    const heading = nodes[0] as Heading;
    const otherNodes = nodes.slice(1);
    const headingTags = selectAll("tagLink", heading).map(
      (n) => (n as TagLink).data.name,
    );

    if (!headingTags.length) {
      return;
    }

    const cardTag = headingTags[0]!!;
    const tags = headingTags.slice(1);
    if (
      !Parser.isBasicCardTag(cardTag) &&
      !Parser.extractCustomModelName(cardTag)
    ) {
      return;
    }

    const noteId = Parser.extractNoteId(heading);
    // TODO: remove the surrounding spaces as well.
    remove(heading, (n) => n.type === "tagLink");

    const medias = Parser.processAndExtraMedias(nodes, dirpath);
    const position: INotePosition = {
      startLine: nodes[0].position!!.start.line,
      endLine: nodes.at(-1)!!.position!!.end.line,
    };

    if (Parser.isBasicCardTag(cardTag)) {
      const front = await this.toHtml(heading.children);
      const back = await this.toHtml(otherNodes);

      return {
        ...BASIC_MODEL,
        noteId,
        position,
        values: {
          Front: front,
          Back: back,
        },
        tags,
        medias,
      };
    }

    // Custom card

    // Split fields based on ATX Heading 2.
    const fieldMds = otherNodes.reduce<Array<Array<Content>>>(
      (output, node) => {
        if (Parser.isH2(node)) {
          output.push([node]);
        } else if (output.length) {
          output[output.length - 1].push(node);
        }
        return output;
      },
      [],
    );
    const fields = await Promise.all(
      fieldMds.map(async (fieldMd) => {
        const heading = fieldMd[0] as Heading;
        return {
          name: Parser.extractFieldName(heading),
          value: await this.toHtml(
            (heading.children as Content[]).concat(fieldMd.slice(1)),
          ),
        };
      }),
    );

    return {
      modelName: Parser.extractCustomModelName(cardTag)!!,
      inOrderFields: fields.map((f) => f.name),
      noteId,
      position,
      values: fields.reduce(
        (record, f) => {
          record[f.name] = f.value;
          return record;
        },
        {} as Record<string, string>,
      ),
      tags,
      medias,
    };
  }

  private static parseFrontmatter(
    mdast: MdastRoot,
  ): IFrontmatterConfig | undefined {
    const yamlConfig = (select("yaml", mdast) as FrontmatterContent)?.value;
    if (yamlConfig) {
      return YAML.parse(yamlConfig);
    }
  }

  /**
   * Parse the markdown content into internal representation.
   *
   * @param content The content of the markdown.
   * @param dirpath The path to the parent directory of the markdown file.
   *   This is used to resolve the local media with the relative path.
   *   Fallback to cwd if not specified.
   * @returns
   */
  public async parse(content: string, dirpath?: string): Promise<IDeck> {
    const mdast = unified()
      .use(remarkParse)
      .use(remarkFrontmatter, ["yaml"])
      .use(remarkTagLink)
      .use(remarkMath)
      .parse(content);
    const frontmatterConfig = Parser.parseFrontmatter(mdast);

    // Split note based on ATX Heading 1.
    const noteMds = mdast.children.reduce<Array<Array<Content>>>(
      (output, node) => {
        if (Parser.isH1(node)) {
          output.push([node]);
        } else if (output.length) {
          output[output.length - 1].push(node);
        }
        return output;
      },
      [],
    );

    const notes = (
      await Promise.all(noteMds.map((it) => this.toNote(it, dirpath)))
    ).filter((n) => !!n) as Array<INote>;

    return {
      deckName: frontmatterConfig?.deckName || Parser.DEFAULT_DECK_NAME,
      notes,
      frontmatterConfig,
    };
  }
}
