import { invoke } from "@autoanki/anki-connect";
import { Args, Command } from "@oclif/core";

export default class FindNotes extends Command {
  static description = "Returns an array of note IDs for a given query.";

  static strict = true;
  static enableJsonFlag = true;

  static args = {
    query: Args.string({
      required: true,
      description: "Query syntax: https://docs.ankiweb.net/searching.html.",
    }),
  };

  static examples = [
    "<%= config.bin %> <%= command.id %> findNotes deck:current",
    "<%= config.bin %> <%= command.id %> findNotes 'deck:\"a b\"'",
  ];

  public async run(): Promise<number[]> {
    const { args } = await this.parse(FindNotes);

    const noteIds = await invoke({
      action: "findNotes",
      version: 6,
      request: {
        query: args.query,
      },
    });
    this.log(noteIds.join("\n"));

    return noteIds;
  }
}
