import * as fs from "fs";
import { micromark } from "micromark";
import YAML from "yaml";

import { ankiSound, ankiSoundHtml } from "../../src/lib/remark-anki-sound";

describe("remark-anki-sound", () => {
  const dataFile = "./test/fixtures/remark-anki-sound/data.yml";
  const data = YAML.parse(String(fs.readFileSync(dataFile)));

  data.forEach((test) => {
    it(test.i, () => {
      const html = micromark(test.i, {
        extensions: [ankiSound()],
        htmlExtensions: [ankiSoundHtml()],
      });
      expect(html).toEqual(test.o);
    });
  });
});
