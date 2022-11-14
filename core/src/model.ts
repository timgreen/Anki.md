export interface IDeck {
  name: string;
  notes: INote[];
  noteTypes: Set<INoteType>;
}

export interface INote {
  typeName: string;
  fields: string[];
  // field -> html string mapping
  values: string[];
}

export interface INoteType {
  typeName: string;
  fields: string[];
}

export const BASIC_NOTE_TYPE: INoteType = {
  typeName: "Basic",
  fields: ["Front", "Back"],
};
