import { invoke } from "@autoanki/anki-connect";
import { Args, Command } from "@oclif/core";

export default class LoadProfile extends Command {
  static description = "Selects the profile specified in request.";

  static strict = true;

  static args = {
    name: Args.string({ required: true, description: "Profile name" }),
  };

  static examples = ["<%= config.bin %> <%= command.id %> profile1"];

  public async run(): Promise<void> {
    const { args } = await this.parse(LoadProfile);

    await invoke({
      action: "loadProfile",
      version: 6,
      request: {
        name: args.name,
      },
    });
  }
}
