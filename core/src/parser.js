import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

function isH1(node) {
	return node.type === "heading" && node.depth === 1;
}

async function toHtml(nodes) {
	const mast = {
		type: "root",
		children: nodes,
	};

	const rehypeAst = await unified().use(remarkRehype).run(mast);
	return await unified().use(rehypeStringify).stringify(rehypeAst);
}

async function toNote(nodes) {
	const front = await toHtml(nodes[0].children);
	const back = await toHtml(nodes.slice(1));

	return {
		typeName: "Basic",
		fields: ["Front", "Back"],
		values: [front, back],
	};
}

export async function parse(content) {
	const mast = unified().use(remarkParse).parse(content);

	// Split note based on ATX Heading 1.
	const noteMds = mast.children.reduce((output, node) => {
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
