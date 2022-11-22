import { Root } from "hast";
import { Plugin } from "unified";
import { EXIT, visit } from "unist-util-visit";

const DEFAULT_HIGHLIGHT_CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/styles/github-dark.min.css";

/**
 * Add the required css for highlight if needed.
 *
 * Also see: https://github.com/wooorm/lowlight#css
 */
export const rehypeAddHighlightCss: Plugin<void[], Root> = () => {
  return (tree) => {
    var needCss = false;
    visit(tree, "element", (node) => {
      if (node.tagName !== "code") {
        return;
      }
      const classes =
        node.properties && Array.isArray(node.properties.className)
          ? node.properties.className
          : [];

      if (classes.includes("hljs")) {
        needCss = true;
        return EXIT;
      }
    });

    if (needCss) {
      tree.children.push({
        type: "element",
        tagName: "link",
        children: [],
        properties: {
          rel: "stylesheet",
          href: DEFAULT_HIGHLIGHT_CSS_URL,
        },
      });
    }
  };
};
