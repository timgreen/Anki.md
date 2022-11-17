import rehypeStringify from "rehype-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { select } from "unist-util-select";
import YAML from "yaml";
import { visit } from "unist-util-visit";
import { remove } from "unist-util-remove";

import { BASIC_NOTE_TYPE, IDeck, INote } from "./model";
import { remarkTagLink, TagLink } from "./lib/remark-tag-link";

import type {
  Content,
  FrontmatterContent,
  Heading,
  Root as MdastRoot,
} from "mdast";

function isH1(node: Content): boolean {
  return node.type === "heading" && node.depth === 1;
}

async function toHtml(nodes: Array<Content>): Promise<string> {
  const mdast: MdastRoot = {
    type: "root",
    children: nodes,
  };

  remove(mdast, "tagLink");

  const rehypeAst: any = await unified().use(remarkRehype).run(mdast);
  return unified().use(rehypeStringify).stringify(rehypeAst);
}

async function toNote(nodes: Array<Content>): Promise<INote> {
  const tags: Array<string> = [];
  visit({ type: "root", children: nodes }, "tagLink", (node: TagLink) => {
    tags.push(node.data.name);
  });

  const front = await toHtml((nodes[0] as Heading).children);
  const back = await toHtml(nodes.slice(1));

  return {
    ...BASIC_NOTE_TYPE,
    values: [front, back],
    tags: tags,
  };
}

const DEFAULT_DECK_NAME = "Default";

interface IFrontmatterConfig {
  deckName?: string;
}

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

  // TODO: filter the one without #card tag

  const notes = await Promise.all(noteMds.map(toNote));

  return {
    deckName: frontmatterConfig?.deckName || DEFAULT_DECK_NAME,
    notes,
  };
}
