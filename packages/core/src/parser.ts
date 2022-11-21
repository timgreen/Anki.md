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

import { remarkTagLink, TagLink } from "./lib/remark-tag-link";
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

interface ParserConfig {}

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

  private static async toHtml(nodes: Array<Content>): Promise<string> {
    const mdast: MdastRoot = {
      type: "root",
      children: nodes,
    };

    // TODO: remove the surrounding spaces as well.
    remove(mdast, "tagLink");

    const rehypeAst: any = await unified()
      .use(remarkRehype)
      .use(rehypeMathjax)
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
   * NoteId is line next the card heading with format.
   * `^\^[0-9]+$`
   *
   * @returns nodeId & updated nodes.
   */
  private static extractNoteId(
    nodes: Array<Content>,
  ): [string | undefined, Array<Content>] {
    const [firstParagraph] = nodes;
    if (!firstParagraph || firstParagraph.type !== "paragraph") {
      return [undefined, nodes];
    }
    const [firstText] = firstParagraph.children;
    if (!firstText || firstText.type !== "text") {
      return [undefined, nodes];
    }

    const matches = firstText.value.match(/^\^([0-9]+)(\n|$)/);
    if (matches && matches.length >= 2) {
      const nodeId: string = matches[1];
      firstText.value = firstText.value.slice(matches[0].length);
      if (!firstText.value) {
        firstParagraph.children = firstParagraph.children.slice(1);
      }
      if (!firstParagraph.children.length) {
        return [nodeId, nodes.slice(1)];
      }
      return [nodeId, nodes];
    }

    return [undefined, nodes];
  }

  private static async toNote(
    nodes: Array<Content>,
    dirpath?: string,
  ): Promise<INote | undefined> {
    const heading = nodes[0] as Heading;
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

    // TODO: remove the surrounding spaces as well.
    remove(heading, (n) => n.type === "tagLink");
    const [noteId, otherNodes] = Parser.extractNoteId(nodes.slice(1));

    const medias = Parser.processAndExtraMedias(nodes, dirpath);

    if (Parser.isBasicCardTag(cardTag)) {
      const front = await Parser.toHtml(heading.children);
      const back = await Parser.toHtml(otherNodes);

      return {
        ...BASIC_MODEL,
        noteId,
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
          value: await Parser.toHtml(
            (heading.children as Content[]).concat(fieldMd.slice(1)),
          ),
        };
      }),
    );

    return {
      modelName: Parser.extractCustomModelName(cardTag)!!,
      inOrderFields: fields.map((f) => f.name),
      noteId,
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
      await Promise.all(noteMds.map((it) => Parser.toNote(it, dirpath)))
    ).filter((n) => !!n) as Array<INote>;

    return {
      deckName: frontmatterConfig?.deckName || Parser.DEFAULT_DECK_NAME,
      notes,
      frontmatterConfig,
    };
  }
}
