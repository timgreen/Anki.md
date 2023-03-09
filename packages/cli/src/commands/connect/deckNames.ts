import { invoke } from "@autoanki/anki-connect";
import { Command } from "@oclif/core";

export default class DeckNames extends Command {
  static description =
    "Gets the complete list of deck names for the current user.";

  static strict = true;

  static examples = ["<%= config.bin %> <%= command.id %>"];

  public async run(): Promise<void> {
    const deckNames = await invoke({
      action: "deckNames",
      version: 6,
      request: undefined,
    });
    this.log(deckNames.join("\n"));
  }
}
