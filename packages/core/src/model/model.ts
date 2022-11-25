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
   * At least one field name is required.
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
   * - True means yes and use default css.
   * - String means yes and use the given css (the string value is either a file path or a url).
   */
  highlight?: boolean | string;
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

export interface INoteIdAndPosition {
  noteId?: NoteTypes.NoteId;
  position: { startLine: number };
}

export const BASIC_MODEL: INoteType = {
  modelName: "Basic",
  inOrderFields: ["Front", "Back"],
};
