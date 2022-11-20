import * as fs from "fs";
import YAML from "yaml";
import { parse } from "../src/parser";

describe("Parser fixtures", () => {
  const dir = "./test/fixtures";
  const files = fs.readdirSync(dir);
  files
    .filter((f) => f.endsWith(".md"))
    .forEach((mdInputFile) => {
      it(mdInputFile, async () => {
        const mdInput = String(fs.readFileSync(`${dir}/${mdInputFile}`));
        const json = YAML.parse(
          String(
            fs.readFileSync(`${dir}/${mdInputFile.replace(/\.md$/, ".yml")}`),
          ),
        );
        expect(await parse(mdInput, "/<test>")).toEqual(json);
      });
    });
});
