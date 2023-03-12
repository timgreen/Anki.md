import { invoke } from "@autoanki/anki-connect";
import { Args, Command } from "@oclif/core";

export default class NotesInfo extends Command {
  static description =
    "Returns a list of objects containing for each note ID the note fields, tags, note type and the cards belonging to the note.";

  static strict = false;
  static enableJsonFlag = true;

  static args = {
    noteIds: Args.integer({
      required: true,
    }),
  };

  static examples = [
    "<%= config.bin %> <%= command.id %> notesInfo 123",
    "<%= config.bin %> <%= command.id %> notesInfo 123 456",
  ];

  public async run(): Promise<any> {
    const { argv } = await this.parse(NotesInfo);

    const result = await invoke({
      action: "notesInfo",
      version: 6,
      request: {
        notes: argv.map((i) => parseInt(i as string, 10)),
      },
    });
    this.log(JSON.stringify(result));

    return result;
  }
}
