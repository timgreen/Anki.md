import { ModelName } from "@autoanki/anki-connect/dist/model";
import { NoteModel } from "./model";

export interface IFrontmatterConfig {
  deckName?: string;
  models?: Record<ModelName, NoteModel>;
  /**
   * Global tags for the notes in the deck.
   */
  tags?: string[];
}
