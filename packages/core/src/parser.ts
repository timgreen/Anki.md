import rehypeStringify from "rehype-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { remove } from "unist-util-remove";
import { select, selectAll } from "unist-util-select";
import YAML from "yaml";

import { remarkTagLink, TagLink } from "./lib/remark-tag-link";
import {
  BASIC_MODEL,
  IDeck,
  IFrontmatterConfig,
  INote,
  MediaName,
  MediaInfo,
} from "./model";

import type {
  Content,
  FrontmatterContent,
  Heading,
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

  const rehypeAst: any = await unified().use(remarkRehype).run(mdast);
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

function processAndExtraMedias(
  nodes: Array<Content>,
): Record<MediaName, MediaInfo> {
  const medias: Record<MediaName, MediaInfo> = {};

  // TODO: impl

  return medias;
}

async function toNote(nodes: Array<Content>): Promise<INote | undefined> {
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

  const medias = processAndExtraMedias(nodes);

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

export async function parse(content: string): Promise<IDeck> {
  const mdast = unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ["yaml"])
    .use(remarkTagLink)
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

  const notes = (await Promise.all(noteMds.map(toNote))).filter(
    (n) => !!n,
  ) as Array<INote>;

  return {
    deckName: frontmatterConfig?.deckName || DEFAULT_DECK_NAME,
    notes,
    frontmatterConfig,
  };
}
