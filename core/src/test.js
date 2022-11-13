import test from "tape";

import { parse } from "./parser.js";

test("Simple parser", async (t) => {
	const content = `
## Ignored
# Note 1
n1 text
## n1 h2
n1 text

# Note 2
## n2 h2
  `;

	t.deepEqual(await parse(content), {
		name: "TODO",
		notes: [
			{
				typeName: "Basic",
				fields: ["Front", "Back"],
				values: ["Note 1", "<p>n1 text</p>\n<h2>n1 h2</h2>\n<p>n1 text</p>"],
			},
			{
				typeName: "Basic",
				fields: ["Front", "Back"],
				values: ["Note 2", "<h2>n2 h2</h2>"],
			},
		],
	});
});
