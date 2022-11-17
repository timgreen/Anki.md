import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import YAML from "yaml";
import rehypeStringify from "rehype-stringify";
import remarkFrontmatter from "remark-frontmatter";
import type { Root as MdastRoot } from "remark-frontmatter";
import { select } from "unist-util-select";

function isH1(node: any): boolean {
  return node.type === "heading" && node.depth === 1;
}

async function toHtml(nodes: Array<any>): Promise<string> {
  const mdast: MdastRoot = {
    type: "root",
    children: nodes,
  };

  const rehypeAst: any = await unified().use(remarkRehype).run(mdast);
  return await unified().use(rehypeStringify).stringify(rehypeAst);
}

async function toNote(nodes: Array<any>): Promise<any> {
  const front = await toHtml(nodes[0].children);
  const back = await toHtml(nodes.slice(1));

  return {
    typeName: "Basic",
    fields: ["Front", "Back"],
    values: [front, back],
  };
}

const DEFAULT_DECK_NAME = "Default";

interface FrontmatterConfig {
  deckName?: string;
}

function parseFrontmatter(mdast: MdastRoot): FrontmatterConfig | undefined {
  const yamlConfig = (select("yaml", mdast) as any)?.value;
  if (yamlConfig) {
    return YAML.parse(yamlConfig);
  }
}

export async function parse(content: string): Promise<any> {
  const mdast = unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ["yaml"])
    .parse(content);
  const frontmatterConfig = parseFrontmatter(mdast);

  // Split note based on ATX Heading 1.
  const noteMds = mdast.children.reduce<Array<any>>((output, node) => {
    if (isH1(node)) {
      output.push([node]);
    } else if (output.length) {
      output[output.length - 1].push(node);
    }
    return output;
  }, []);

  // TODO: filter the one without #card tag

  const notes = await Promise.all(noteMds.map(toNote));

  return {
    deckName: frontmatterConfig?.deckName || DEFAULT_DECK_NAME,
    notes,
  };
}
