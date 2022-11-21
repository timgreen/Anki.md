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

export interface INote extends INoteType {
  noteId?: string;
  values: Record<string, string>;
  tags: string[];
  medias: Record<MediaName, MediaInfo>;
}

export const BASIC_MODEL: INoteType = {
  modelName: "Basic",
  inOrderFields: ["Front", "Back"],
};
