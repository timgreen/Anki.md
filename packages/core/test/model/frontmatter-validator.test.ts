import * as fs from "fs";
import YAML from "yaml";
import { validateFrontmatterConfig } from "../../src/model";
import { FrontmatterConfigError } from "../../src/model/frontmatter-validator";

describe("validateFrontmatterConfig", () => {
  const dataFile = "./test/fixtures/frontmatter-validator/data.yml";
  const data = YAML.parse(String(fs.readFileSync(dataFile)));

  data.forEach((test) => {
    it(test.n, () => {
      try {
        const valid = validateFrontmatterConfig(test.i);
        expect(valid).toEqual(test.o.valid);
      } catch (e) {
        expect((e as FrontmatterConfigError).errors).toEqual(test.o.errors);
      }
    });
  });
});
