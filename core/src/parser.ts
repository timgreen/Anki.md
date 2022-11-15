import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import type { MdastRoot } from "remark-rehype/lib";

function isH1(node: any): boolean {
  return node.type === "heading" && node.depth === 1;
}

async function toHtml(nodes: Array<any>): Promise<string> {
  const mast: MdastRoot = {
    type: "root",
    children: nodes,
  };

  const rehypeAst: any = await unified().use(remarkRehype).run(mast);
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

export async function parse(content: string): Promise<any> {
  const mast = unified().use(remarkParse).parse(content);

  // Split note based on ATX Heading 1.
  const noteMds = mast.children.reduce<Array<any>>((output, node) => {
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
    name: "TODO",
    notes,
  };
}
