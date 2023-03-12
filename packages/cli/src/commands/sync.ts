import chalk from "chalk";
import {
  ankiConnectSync,
  Parser,
  updateNoteId,
  Reporter,
  model,
} from "@anki.md/core";
import { Args, Command, Flags } from "@oclif/core";
import * as fs from "fs";
import fetch from "node-fetch";
import * as path from "path";
import Spinnies from "spinnies";
import { isUri } from "valid-url";

export default class Sync extends Command {
  static description = "Sync to Anki Desktop via AnkiConnect.";

  static strict = false;

  static examples = [
    "<%= config.bin %> <%= command.id %> deckA.md",
    "<%= config.bin %> <%= command.id %> deckA.md deckB.md",
    "<%= config.bin %> <%= command.id %> deckA.md https://example.com/foo/deckB.md",
  ];

  static args = {
    markdowns: Args.file({ required: true, description: "Markdown files" }),
  };

  static flags = {
    math: Flags.string({
      description:
        "render math equations as SVG or use Anki native mathjax support.",
      default: "native",
      options: ["native", "svg"],
      required: false,
    }),
    "update-model-templates": Flags.boolean({
      description: "update the card templates for the existing note models.",
    }),
    "update-model-styling": Flags.boolean({
      description: "update the styling for the existing note models.",
    }),
    "save-note-ids": Flags.boolean({
      description:
        "save the note IDs in markdown after sync. \nIt will be used to update note instead insert on next sync",
      default: false,
      required: false,
      allowNo: true,
      aliases: ["save-note-id"],
    }),
    "overwrite-existing-medias": Flags.boolean({
      description:
        "Replace the existing medias with the same name during sync.",
      default: false,
      required: false,
    }),
  };

  public async run(): Promise<void> {
    const { argv, flags } = await this.parse(Sync);
    const parser = new Parser({
      useSvgMathjax: flags.math === "svg",
    });

    const spinnies = new Spinnies();
    var mediaCount = 0;
    var modelCount = 0;
    var notesUpdatedCount = 0;
    const reporter: Reporter = {
      startModelCreation: () => {
        spinnies.add("modelCreation", { text: "model:", indent: 2 });
      },
      endModelCreation: () => {
        spinnies.succeed("modelCreation", {
          text: `${chalk.reset("model:")} ${chalk.green(`+${modelCount}`)}`,
        });
        if (!modelCount) {
          spinnies.remove("modelCreation");
        }
      },
      createdModel: (modelName: string) => {
        modelCount++;
        spinnies.add(`model-${modelName}`, {
          text: chalk.reset(modelName),
          indent: 4,
          status: "succeed",
        });
        spinnies.update("modelCreation", {
          text: `model: ${chalk.green(`+${modelCount}}`)}`,
        });
      },
      updatedModelTemplates: (modelName: string) => {
        // TODO
      },
      updatedModelStyling: (modelName: string) => {
        // TODO
      },
      startStoreMedia: () => {
        spinnies.add("storeMedia", { text: "media:", indent: 2 });
        spinnies.add("media", { text: "", indent: 4 });
      },
      endStoreMedia: () => {
        spinnies.remove("media");
        spinnies.succeed("storeMedia", {
          text: `${chalk.reset("media: ")} ${chalk.green(`+${mediaCount}`)}`,
        });
        if (!mediaCount) {
          spinnies.remove("storeMedia");
        }
      },
      storingMedia: (mediaName: string, mediaInfo: model.MediaInfo) => {
        mediaCount++;
        spinnies.update("storeMedia", {
          text: `media: ${chalk.green(`+${mediaCount}`)}`,
        });
        spinnies.update("media", {
          text: `${mediaName} ${chalk.gray(
            `<= ${mediaInfo.absPath || mediaInfo.url}`,
          )}`,
        });
      },
      startNotes: () => {
        spinnies.add("notes", { text: "note:", indent: 2 });
        spinnies.add("noteUpdate", { text: "", indent: 4 });
      },
      endNotes: (newInserted: number) => {
        spinnies.remove("noteUpdate");
        spinnies.succeed("notes", {
          text: `${chalk.reset("notes:")} ${chalk.green(
            `+${newInserted}`,
          )} ${chalk.yellow(`~${notesUpdatedCount}`)}`,
        });
      },
      increaseUpdatedNote: (total: number) => {
        notesUpdatedCount++;
        spinnies.update("noteUpdate", {
          text: `updateing ${chalk.yellow(notesUpdatedCount)}/${total}`,
        });
      },
      insertingNotes: (total: number) => {
        spinnies.update("notes", {
          text: `note: ${chalk.yellow(`~${notesUpdatedCount}`)}`,
        });
        spinnies.update("noteUpdate", { text: `inserting ${total}` });
      },
    };

    for (const input of argv as string[]) {
      spinnies.add(input, {
        text: chalk.bold(input),
      });

      const isRemote = isUri(input);
      const content = isRemote
        ? await (await fetch(input)).text()
        : String(fs.readFileSync(input));
      const deck = await parser.parse(
        content,
        isRemote ? input : path.dirname(input),
      );
      const noteIds = await ankiConnectSync(
        deck,
        {
          updateModelTemplates: flags["update-model-templates"],
          updateModelStyling: flags["update-model-styling"],
          overwriteExistingMedias: flags["overwrite-existing-medias"],
        },
        reporter,
      );

      if (flags["save-note-ids"]) {
        if (isRemote) {
          // TODO: warning about skip save note ids for remote files.
        } else {
          // TODO: check if the source if readonly.
          noteIds.forEach((noteId, index) => {
            if (noteId) {
              deck.notes[index].noteId = noteId;
            }
          });
          const updatedContent = updateNoteId(content, deck.notes);
          if (content != updatedContent) {
            fs.writeFileSync(input, updatedContent);
          }
        }
      }

      spinnies.succeed(input, { text: chalk.reset(input) });
    }
  }
}
