import * as fs from "fs";
import YAML from "yaml";
import { validateFrontmatterConfig } from "../../src/model";

describe("validateFrontmatterConfig", () => {
  const dataFile = "./test/fixtures/frontmatter-validator/data.yml";
  const data = YAML.parse(String(fs.readFileSync(dataFile)));

  data.forEach((test) => {
    it(test.n, () => {
      const valid = validateFrontmatterConfig(test.i);
      expect(valid).toEqual(test.o.valid);
      if (!test.o.valid) {
        expect(validateFrontmatterConfig.errors).toEqual(test.o.errors);
      }
    });
  });
});
