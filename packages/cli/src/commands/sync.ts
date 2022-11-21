import { Command, Flags } from "@oclif/core";
import { ankiConnectSync, Parser } from "@anki.md/core";
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
  };

  public async run(): Promise<void> {
    const { argv, flags } = await this.parse(Sync);
    const parser = new Parser({
      useSvgMathjax: flags.math === "svg",
    });

    for (const input of argv) {
      this.log(input);
      const deck = await parser.parse(
        String(fs.readFileSync(input)),
        path.dirname(input),
      );
      await ankiConnectSync(deck);
    }
  }
}
