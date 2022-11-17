export interface IDeck {
  deckName: string;
  notes: INote[];
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
