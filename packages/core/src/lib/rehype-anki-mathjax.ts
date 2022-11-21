import { Root } from "hast";
import { toText } from "hast-util-to-text";
import { Plugin } from "unified";
import { SKIP, visit } from "unist-util-visit";

/**
 * Anki uses `\(` and `\)` for inline equations, and `\[` and `\]` for display equations.
 *
 * Also see: https://docs.ankiweb.net/math.html#mathjax
 */
export const rehypeAnkiMathjax: Plugin<void[], Root> = () => {
  return (tree) => {
    visit(tree, "element", (node) => {
      const classes =
        node.properties && Array.isArray(node.properties.className)
          ? node.properties.className
          : [];

      if (classes.includes("math-inline")) {
        node.children = [{ type: "text", value: `\\(${toText(node)}\\)` }];
        return SKIP;
      }
      if (classes.includes("math-display")) {
        node.children = [{ type: "text", value: `\\[${toText(node)}\\]` }];
        return SKIP;
      }
    });
  };
};
