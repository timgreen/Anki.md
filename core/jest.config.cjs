// @blocksort
const esModules = [
  "bail",
  "ccount",
  "character-entities",
  "comma-separated-tokens",
  "decode-named-character-reference",
  "hast-util-.*",
  "html-void-elements",
  "is-plain-obj",
  "mdast-util-.*",
  "micromark.*",
  "property-information",
  "rehype-.*",
  "remark-.*",
  "space-separated-tokens",
  "stringify-entities",
  "trim-lines",
  "trough",
  "unified",
  "unist-.*",
  "vfile",
];

module.exports = {
  clearMocks: true,
  collectCoverageFrom: ["src/**/*.ts", "src/**/*.js"],
  coveragePathIgnorePatterns: ["/node_modules/", ".*\\.d\\.ts"],
  coverageThreshold: { global: { lines: 95 } },
  preset: "ts-jest/presets/js-with-babel",
  restoreMocks: true,
  testEnvironment: "node",
  transformIgnorePatterns: [`/node_modules/(?!${esModules.join("|")})`],
};
