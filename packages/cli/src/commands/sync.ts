import { ankiConnectSync, Parser, updateNoteId } from "@anki.md/core";
import { Command, Flags, Args } from "@oclif/core";
import * as fs from "fs";
import fetch from "node-fetch";
import * as path from "path";
import { isUri } from "valid-url";

export default class Sync extends Command {
  static description = "Sync to Anki Desktop via AnkiConnect.";

  static strict = false;

  static examples = [
    "<%= config.bin %> <%= command.id %> deckA.md",
    "<%= config.bin %> <%= command.id %> deckA.md deckB.md",
    "<%= config.bin %> <%= command.id %> deckA.md https://example.com/foo/deckB.md",
  ];

  static args = {
    markdowns: Args.file({ required: true, description: "Markdown files" }),
  };

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
    "update-model-styling": Flags.boolean({
      description: "update the styling for the existing note models.",
    }),
    "save-note-ids": Flags.boolean({
      description:
        "save the note IDs in markdown after sync. \nIt will be used to update note instead insert on next sync",
      default: true,
      required: false,
      allowNo: true,
      aliases: ["save-note-id"],
    }),
  };

  public async run(): Promise<void> {
    const { argv, flags } = await this.parse(Sync);
    const parser = new Parser({
      useSvgMathjax: flags.math === "svg",
    });

    for (const input of argv as string[]) {
      this.log(input);
      const isRemote = isUri(input);
      const content = isRemote
        ? await (await fetch(input)).text()
        : String(fs.readFileSync(input));
      const deck = await parser.parse(
        content,
        isRemote ? input : path.dirname(input),
      );
      const noteIds = await ankiConnectSync(deck, {
        updateModelTemplates: flags["update-model-templates"],
        updateModelStyling: flags["update-model-styling"],
      });

      if (flags["save-note-ids"]) {
        if (isRemote) {
          // TODO: warning about skip save note ids for remote files.
        } else {
          // TODO: check if the source if readonly.
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
  }
}
