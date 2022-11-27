import * as fs from "fs";
import YAML from "yaml";
import { Parser } from "../src/parser";

describe("Parser fixtures", () => {
  const parser = new Parser({});

  const dir = "./test/fixtures/parser";
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
        expect(await parser.parse(mdInput, "/<test>")).toEqual(json);
      });
    });
});

describe("Remote url", () => {
  const parser = new Parser({});

  const dir = "./test/fixtures/parser";
  const files = fs.readdirSync(dir);
  files
    .filter((f) => f.endsWith(".md"))
    .forEach((mdInputFile) => {
      const ymlFile = mdInputFile.replace(/\.md$/, ".remote.yml");
      if (fs.existsSync(`${dir}/${ymlFile}`)) {
        it(mdInputFile, async () => {
          const mdInput = String(fs.readFileSync(`${dir}/${mdInputFile}`));
          const json = YAML.parse(String(fs.readFileSync(`${dir}/${ymlFile}`)));
          expect(
            await parser.parse(mdInput, "https://example.com/foo/"),
          ).toEqual(json);
        });
      }
    });
});
