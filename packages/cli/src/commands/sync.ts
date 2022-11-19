import { Command, Flags } from "@oclif/core";
import { ankiConnectSync, parse } from "@anki.md/core";
import * as fs from "fs";

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

  public async run(): Promise<void> {
    const { argv } = await this.parse(Sync);

    for (const input of argv) {
      this.log(input);
      const deck = await parse(String(fs.readFileSync(input)));
      await ankiConnectSync(deck);
    }
  }
}
