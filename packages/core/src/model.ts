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
  typeName: string;
  fields: string[];
}

export interface INote extends INoteType {
  values: string[];
  tags: string[];
}

export const BASIC_NOTE_TYPE: INoteType = {
  typeName: "Basic",
  fields: ["Front", "Back"],
};

export function noteToRecord(note: INote): Record<string, string> {
  const record: Record<string, string> = {};
  note.fields.forEach((field, index) => (record[field] = note.values[index]));
  return record;
}
