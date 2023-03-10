import { invoke } from "@autoanki/anki-connect";
import { Command } from "@oclif/core";

export default class GetProfiles extends Command {
  static description = "Retrieve the list of profiles.";

  static strict = true;
  static enableJsonFlag = true;

  static examples = ["<%= config.bin %> <%= command.id %>"];

  public async run(): Promise<string[]> {
    const profiles = await invoke({
      action: "getProfiles",
      version: 6,
      request: undefined,
    });
    this.log(profiles.join("\n"));

    return profiles;
  }
}
