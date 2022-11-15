import { parse } from "../src/parser";

describe("Parser", () => {
  it("Simple", async () => {
    const content = `
## Ignored
# Note 1
n1 text
## n1 h2
n1 text

# Note 2
## n2 h2
    `;

    expect(await parse(content)).toEqual({
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
});
