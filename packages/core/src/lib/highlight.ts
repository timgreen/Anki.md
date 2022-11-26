import { IFrontmatterConfig } from "../model";

const DEFAULT_HIGHLIGHT_LIGHT_CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/styles/github.min.css";
const DEFAULT_HIGHLIGHT_DARK_CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/styles/github-dark.min.css";
const START_CSS_INJECTION =
  "\n/* @Anki.md: CONTENT BELOW IS MANAGED BY @Anki.md, DO NOT EDIT. */\n";

export class HighlightHelper {
  public static injectCss(frontmatterConfig?: IFrontmatterConfig) {
    const models = frontmatterConfig?.models;
    if (models) {
      for (const modelName in models) {
        const model = models[modelName];
        if (model.highlight === "dark") {
          model.css =
            model.css +
            START_CSS_INJECTION +
            `@import url(${DEFAULT_HIGHLIGHT_DARK_CSS_URL})`;
        } else if (model.highlight === "light") {
          model.css =
            model.css +
            START_CSS_INJECTION +
            `@import url(${DEFAULT_HIGHLIGHT_LIGHT_CSS_URL})`;
        } else if (model.highlight) {
          // TODO: handle string file path.
          model.css =
            model.css + START_CSS_INJECTION + `@import url(${model.highlight})`;
        }
      }
    }
  }
}
