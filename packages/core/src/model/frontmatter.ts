import { NoteModel } from "./model";

/**
 * The name of the note model.
 *
 * Override the following default NoteModels are not allowed:
 * - "Basic"
 * - "Basic (and reversed card)"
 * - "Basic (optional reversed card)"
 * - "Basic (type in the answer)"
 * - "Cloze"
 *
 * @pattern ^(?!(Basic|Basic \(and reversed card\)|Basic \(optional reversed card\)|Basic \(type in the answer\)|Cloze)$)\w.*
 */
type ModelName = string;

export interface IFrontmatterConfig {
  /**
   * The container deck for the notes in the file.
   *
   * @default "Default"
   *
   * @example
   *   "deckA"
   * @example
   *   "a::b::c"
   */
  deckName?: string;
  /**
   * Define the custom NoteModel for the notes in the file.
   */
  models?: Record<ModelName, NoteModel>;
  /**
   * Global tags for the notes in the deck.
   *
   * @example
   *   "global-tag-1"
   */
  tags?: string[];
}
