import { invoke } from "@autoanki/anki-connect";
import { Command } from "@oclif/core";

export default class Sync extends Command {
  static description = "Synchronizes the local Anki collections with AnkiWeb.";

  static strict = true;

  static examples = ["<%= config.bin %> <%= command.id %>"];

  public async run(): Promise<void> {
    await invoke({
      action: "sync",
      version: 6,
      request: undefined,
    });
  }
}
