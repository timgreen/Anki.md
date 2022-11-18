import { invoke, ModelTypes, NoteTypes } from "@autoanki/anki-connect";

import { IDeck, INoteType, noteToRecord } from "../model";

function toNewNotes(deck: IDeck): NoteTypes.NewNote[] {
  return deck.notes.map((n) => ({
    deckName: deck.deckName,
    modelName: n.typeName,
    fields: noteToRecord(n),
    tags: n.tags,
  }));
}

function createDefaultCardTemplateForNoteType(
  noteType: INoteType,
): ModelTypes.CardTemplate {
  return {
    Name: `${noteType.typeName} Card`,
    Front: `{{${noteType.fields[0]}}}`,
    Back: `{{FrontSide}}

<hr id=answer>

${noteType.fields
  .slice(1)
  .map((f) => `{{${f}}}`)
  .join("<br>")}`,
  };
}

export async function ankiConnectSync(
  deck: IDeck,
): Promise<Array<NoteTypes.NoteId | null>> {
  await invoke({
    action: "createDeck",
    version: 6,
    request: {
      deck: deck.deckName,
    },
  });

  const modelNames = await invoke({
    action: "modelNamesAndIds",
    version: 6,
    request: undefined,
  });

  await Promise.all(
    deck.notes.map((n) => {
      if (!modelNames[n.typeName]) {
        return invoke({
          action: "createModel",
          version: 6,
          request: {
            modelName: n.typeName,
            inOrderFields: n.fields,
            isCloze: false,
            cardTemplates: [createDefaultCardTemplateForNoteType(n)],
            css: "",
          },
        });
      }
    }),
  );

  return invoke({
    action: "addNotes",
    version: 6,
    request: {
      notes: toNewNotes(deck),
    },
  });
}
