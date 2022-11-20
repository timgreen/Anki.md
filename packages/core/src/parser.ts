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

function isH1(node: Content): boolean {
  return node.type === "heading" && node.depth === 1;
}

function isH2(node: Content): boolean {
  return node.type === "heading" && node.depth === 2;
}

async function toHtml(nodes: Array<Content>): Promise<string> {
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

function extractFieldName(node: Heading): string {
  return (node.children.find((n) => n.type === "tagLink")!! as TagLink).data
    .name;
}

const BASIC_CARD_TAG = "card";
const CUSTOM_CARD_TAG_PREFIX = "card-";

function isBasicCardTag(tag: string): boolean {
  return tag === BASIC_CARD_TAG;
}

function extractCustomModelName(tag: string): string | undefined {
  if (tag.startsWith(CUSTOM_CARD_TAG_PREFIX)) {
    return tag.substring(CUSTOM_CARD_TAG_PREFIX.length);
  }
}

/**
 * According to https://docs.ankiweb.net/importing.html#importing-media
 * Do not put subdirectories in the media folder, or some features will not work.
 *
 * Use normalized filename instead to avoid collisions when flattening all the media files.
 */
function normalizedFilename(resource: Resource & Alternative): string {
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

function processAndExtraMedias(
  nodes: Array<Content>,
  dirpath?: string,
): Record<MediaName, MediaInfo> {
  const medias: Record<MediaName, MediaInfo> = {};
  for (const node of nodes) {
    selectAll("image", node).forEach((i) => {
      const image = i as Image;
      if (isUri(image.url)) {
        const filename = normalizedFilename(image);
        medias[filename] = { url: image.url };
        image.url = filename;
      } else {
        const absPath = path.resolve(dirpath || path.resolve(), image.url);
        const filename = normalizedFilename({
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

async function toNote(
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
  if (!isBasicCardTag(cardTag) && !extractCustomModelName(cardTag)) {
    return;
  }

  // TODO: remove the surrounding spaces as well.
  remove(heading, (n) => n.type === "tagLink");

  const medias = processAndExtraMedias(nodes, dirpath);

  if (isBasicCardTag(cardTag)) {
    const front = await toHtml(heading.children);
    const back = await toHtml(nodes.slice(1));

    return {
      ...BASIC_MODEL,
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
  const fieldMds = nodes
    .slice(1)
    .reduce<Array<Array<Content>>>((output, node) => {
      if (isH2(node)) {
        output.push([node]);
      } else if (output.length) {
        output[output.length - 1].push(node);
      }
      return output;
    }, []);
  const fields = await Promise.all(
    fieldMds.map(async (fieldMd) => {
      const heading = fieldMd[0] as Heading;
      return {
        name: extractFieldName(heading),
        value: await toHtml(
          (heading.children as Content[]).concat(fieldMd.slice(1)),
        ),
      };
    }),
  );

  return {
    modelName: extractCustomModelName(cardTag)!!,
    inOrderFields: fields.map((f) => f.name),
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

const DEFAULT_DECK_NAME = "Default";

function parseFrontmatter(mdast: MdastRoot): IFrontmatterConfig | undefined {
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
export async function parse(content: string, dirpath?: string): Promise<IDeck> {
  const mdast = unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ["yaml"])
    .use(remarkTagLink)
    .use(remarkMath)
    .parse(content);
  const frontmatterConfig = parseFrontmatter(mdast);

  // Split note based on ATX Heading 1.
  const noteMds = mdast.children.reduce<Array<Array<Content>>>(
    (output, node) => {
      if (isH1(node)) {
        output.push([node]);
      } else if (output.length) {
        output[output.length - 1].push(node);
      }
      return output;
    },
    [],
  );

  const notes = (
    await Promise.all(noteMds.map((it) => toNote(it, dirpath)))
  ).filter((n) => !!n) as Array<INote>;

  return {
    deckName: frontmatterConfig?.deckName || DEFAULT_DECK_NAME,
    notes,
    frontmatterConfig,
  };
}
