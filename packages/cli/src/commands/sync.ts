import { ankiConnectSync, Parser, updateNoteId } from "@anki.md/core";
import { Command, Flags } from "@oclif/core";
import * as fs from "fs";
import * as path from "path";

export default class Sync extends Command {
  static description = "Sync to Anki Desktop via AnkiConnect.";

  static strict = false;

  static examples = [
    "<%= config.bin %> <%= command.id %> deckA.md",
    "<%= config.bin %> <%= command.id %> deckA.md deckB.md",
  ];

  static args = [
    { name: "file", required: true, description: "Markdown files" },
  ];

  static flags = {
    math: Flags.string({
      description:
        "render math equations as SVG or use Anki native mathjax support.",
      default: "native",
      options: ["native", "svg"],
      required: false,
    }),
    "update-model-templates": Flags.boolean({
      description: "update the card templates for the existing note models.",
    }),
  };

  public async run(): Promise<void> {
    const { argv, flags } = await this.parse(Sync);
    const parser = new Parser({
      useSvgMathjax: flags.math === "svg",
    });

    for (const input of argv) {
      this.log(input);
      const content = String(fs.readFileSync(input));
      const deck = await parser.parse(content, path.dirname(input));
      const noteIds = await ankiConnectSync(deck, {
        updateModelTemplates: flags["update-model-templates"],
      });

      // Save noteIds.
      noteIds.forEach((noteId, index) => {
        if (noteId) {
          deck.notes[index].noteId = noteId;
        }
      });
      const updatedContent = updateNoteId(content, deck.notes);
      if (content != updatedContent) {
        fs.writeFileSync(input, updatedContent);
      }
    }
  }
}
