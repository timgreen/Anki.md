import { invoke } from "@autoanki/anki-connect";
import { Args, Command } from "@oclif/core";

export default class GetMediaFilesNames extends Command {
  static description =
    "Gets the names of media files matched the pattern. Returning all names by default.";

  static strict = true;
  static enableJsonFlag = true;

  static args = {
    pattern: Args.string({
      required: false,
      description: "Pattern",
      default: "",
    }),
  };

  static examples = [
    "<%= config.bin %> <%= command.id %> getMediaFilesNames",
    "<%= config.bin %> <%= command.id %> getMediaFilesNames pattern",
  ];

  public async run(): Promise<string[]> {
    const { args } = await this.parse(GetMediaFilesNames);

    const mediaFilesNames = await invoke({
      action: "getMediaFilesNames",
      version: 6,
      request: {
        pattern: args.pattern,
      },
    });
    this.log(mediaFilesNames.join("\n"));

    return mediaFilesNames;
  }
}
