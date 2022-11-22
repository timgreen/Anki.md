import * as fs from "fs";
import YAML from "yaml";
import { updateNoteId } from "../src/actions/note-id";

describe("NoteId fixtures", () => {
  const dir = "./test/fixtures/note-id";
  const files = fs.readdirSync(dir);
  files
    .filter((f) => f.endsWith(".yml"))
    .forEach((yml) => {
      it(yml, async () => {
        const updates = YAML.parse(String(fs.readFileSync(`${dir}/${yml}`)));
        const before = String(
          fs.readFileSync(`${dir}/${yml.replace(/\.yml$/, ".before.md")}`),
        );
        const after = String(
          fs.readFileSync(`${dir}/${yml.replace(/\.yml$/, ".after.md")}`),
        );
        expect(updateNoteId(before, updates)).toEqual(after);
      });
    });
});
