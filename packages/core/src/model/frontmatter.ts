import { ModelName } from "@autoanki/anki-connect/dist/model";
import { NoteModel } from "./model";

export interface IFrontmatterConfig {
  /**
   * The container deck for the notes in the file.
   *
   * - Default to "Default" if not specified.
   * - Use "::" to create nested decks. e.g. "a::b::c".
   */
  deckName?: string;
  /**
   * Define the custom NoteModel for the notes in the file.
   *
   * Override the following default NoteModels are not allowed:
   * - "Basic"
   * - "Basic (and reversed card)"
   * - "Basic (optional reversed card)"
   * - "Basic (type in the answer)"
   * - "Cloze"
   */
  models?: Record<ModelName, NoteModel>;
  /**
   * Global tags for the notes in the deck.
   */
  tags?: string[];
}
