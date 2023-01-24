import { Parser, updateNoteId } from "@anki.md/core";
import { Command, Args } from "@oclif/core";
import * as fs from "fs";
import * as path from "path";

export default class RmIds extends Command {
	static description = "Remove the note IDs.";

	static strict = false;

	static examples = [
		"<%= config.bin %> <%= command.id %> deckA.md",
		"<%= config.bin %> <%= command.id %> deckA.md deckB.md",
	];

	static args = {
		files: Args.file({ required: true, description: "Markdown files" }),
	};

	public async run(): Promise<void> {
		const { argv, flags } = await this.parse(RmIds);
		const parser = new Parser({});

		for (const input of (argv as string[])) {
			this.log(input);
			const content = String(fs.readFileSync(input));
			const deck = await parser.parse(content, path.dirname(input));
			deck.notes.forEach((n) => (n.noteId = undefined));
			const updatedContent = updateNoteId(content, deck.notes);
			if (content != updatedContent) {
				fs.writeFileSync(input, updatedContent);
			}
		}
	}
}
