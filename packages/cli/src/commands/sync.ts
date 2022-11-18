import { Command, Flags } from "@oclif/core";

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

    this.log(argv.join(","));
  }
}
