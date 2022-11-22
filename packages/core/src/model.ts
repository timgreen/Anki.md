import {
  FieldName,
  ModelName,
  ModelTemplates,
} from "@autoanki/anki-connect/dist/model";

export interface NoteModel {
  inOrderFields: FieldName[];
  css?: string;
  templates: ModelTemplates;
}

export interface IFrontmatterConfig {
  deckName?: string;
  models?: Record<ModelName, NoteModel>;
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
  noteId?: string;
  position: INotePosition;
  values: Record<string, string>;
  tags: string[];
  medias: Record<MediaName, MediaInfo>;
}

export interface INoteIdAndPosition {
  noteId?: string;
  position: { startLine: number };
}

export const BASIC_MODEL: INoteType = {
  modelName: "Basic",
  inOrderFields: ["Front", "Back"],
};
