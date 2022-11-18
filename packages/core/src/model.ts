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

export interface INote extends INoteType {
  values: string[];
  tags: string[];
}

export const BASIC_MODEL: INoteType = {
  modelName: "Basic",
  inOrderFields: ["Front", "Back"],
};

export function noteToRecord(note: INote): Record<string, string> {
  const record: Record<string, string> = {};
  note.inOrderFields.forEach(
    (field, index) => (record[field] = note.values[index]),
  );
  return record;
}
