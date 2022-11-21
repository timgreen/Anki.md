import { ModelName, NewModel } from "@autoanki/anki-connect/dist/model";

export interface IFrontmatterConfig {
  deckName?: string;
  models?: Record<ModelName, Omit<NewModel, "modelName" | "isCloze">>;
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
