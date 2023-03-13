import { NoteTypes } from "@autoanki/anki-connect";
import { FieldName, ModelTemplates } from "@autoanki/anki-connect/dist/model";
import { IFrontmatterConfig } from "./frontmatter";

/**
 * Represents a note model.
 */
export interface NoteModel {
  /**
   * Ordered field names.
   *
   * @minItems 1
   */
  inOrderFields: FieldName[];
  /**
   * Note model styling.
   */
  css?: string;
  /**
   * Card templates for the note model.
   */
  templates: ModelTemplates;
  /**
   * Whether enable the code syntax highlight or not.
   *
   * - null or "" means don't enable code syntax highlighting.
   * - "dark" means use the default dark css.
   * - other string value will be treated as file path or url pointing to a css.
   *
   * @example
   *   "dark"
   * @example
   *   "light"
   * @example
   *   "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/styles/github-dark.min.css"
   */
  highlight?: string;
}

export interface IDeck {
  deckName: string;
  notes: INote[];
  frontmatterConfig?: IFrontmatterConfig;
}

export interface INoteType {
  modelName: string;
  inOrderFields: string[];
}

export type MediaName = string;

export interface MediaInfo {
  url?: string;
  absPath?: string;
}

/**
 * Location of a note in a source file.
 */
export interface INotePosition {
  /**
   * Start from 1.
   */
  startLine: number;
  endLine: number;
}
export interface INote extends INoteType {
  noteId?: number;
  position: INotePosition;
  values: Record<string, string>;
  tags: string[];
  medias: Record<MediaName, MediaInfo>;
}

export const BASIC_MODEL: INoteType = {
  modelName: "Basic",
  inOrderFields: ["Front", "Back"],
};
