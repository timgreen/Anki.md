import {
  ApiOrigin,
  invoke,
  ModelTypes,
  NoteTypes,
} from "@autoanki/anki-connect";

import { IDeck, INote, INoteType, MediaInfo } from "../model";

function createDefaultCardTemplateForNoteType(
  noteType: INoteType,
): ModelTypes.CardTemplate {
  return {
    Name: `${noteType.modelName} Card`,
    Front: `{{${noteType.inOrderFields[0]}}}`,
    Back: `{{FrontSide}}

<hr id=answer>

${noteType.inOrderFields
  .slice(1)
  .map((f) => `{{${f}}}`)
  .join("<br>")}`,
  };
}

function arraysEqual(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }
  let sortedArr1 = arr1.slice().sort();
  let sortedArr2 = arr2.slice().sort();
  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false;
    }
  }
  return true;
}

function checkIsModified(
  existingNote: NoteTypes.NoteInfo | undefined,
  newNote: INote,
): boolean {
  if (!existingNote) {
    return true;
  }
  if (newNote.modelName !== existingNote.modelName) {
    return true;
  }
  if (!arraysEqual(existingNote.tags, newNote.tags)) {
    return true;
  }
  if (
    !arraysEqual(Object.keys(existingNote.fields), Object.keys(newNote.values))
  ) {
    return true;
  }
  for (const field of Object.keys(existingNote.fields)) {
    if (existingNote.fields[field].value !== newNote.values[field]) {
      return true;
    }
  }

  return false;
}

export interface SyncConfig {
  updateModelTemplates?: boolean;
  updateModelStyling?: boolean;
  overwriteExistingMedias?: boolean;
  origin?: ApiOrigin;
}

export interface Reporter {
  startModelCreation: () => void;
  endModelCreation: () => void;
  createdModel: (modelName: string) => void;
  updatedModelTemplates: (modelName: string) => void;
  updatedModelStyling: (modelName: string) => void;
  startStoreMedia: () => void;
  endStoreMedia: () => void;
  storingMedia: (mediaName: string, mediaInfo: MediaInfo) => void;
  startNotes: () => void;
  endNotes: (newInserted: number) => void;
  unmodifiedNotes: (count: number) => void;
  increaseUpdatedNote: (total: number) => void;
  insertingNotes: (total: number) => void;
}

export async function ankiConnectSync(
  deck: IDeck,
  config?: SyncConfig,
  reporter?: Reporter,
): Promise<Array<NoteTypes.NoteId | undefined>> {
  await invoke({
    action: "createDeck",
    version: 6,
    request: {
      deck: deck.deckName,
    },
    origin: config?.origin,
  });

  const existingModelNames = new Set<string>();
  for (const modelName in await invoke({
    action: "modelNamesAndIds",
    version: 6,
    request: undefined,
    origin: config?.origin,
  })) {
    existingModelNames.add(modelName);
  }

  reporter?.startModelCreation();
  // createModel defined in the frontmatter
  const models = deck.frontmatterConfig?.models || {};
  for (const modelName in models) {
    const model = models[modelName];
    if (!existingModelNames.has(modelName)) {
      await invoke({
        action: "createModel",
        version: 6,
        request: {
          modelName,
          inOrderFields: model.inOrderFields,
          css: model.css || "",
          isCloze: false,
          cardTemplates: Object.keys(model.templates).map((Name) => ({
            Name,
            ...model.templates[Name],
          })),
        },
        origin: config?.origin,
      });
      reporter?.createdModel(modelName);
      existingModelNames.add(modelName);
    } else {
      if (config?.updateModelTemplates) {
        await invoke({
          action: "updateModelTemplates",
          version: 6,
          request: {
            model: {
              name: modelName,
              templates: model.templates,
            },
          },
          origin: config?.origin,
        });
        reporter?.updatedModelTemplates(modelName);
      }
      if (config?.updateModelStyling && model.css) {
        await invoke({
          action: "updateModelStyling",
          version: 6,
          request: {
            model: {
              name: modelName,
              css: model.css,
            },
          },
          origin: config?.origin,
        });
        reporter?.updatedModelStyling(modelName);
      }
    }
  }

  // createModel for notes
  for (const note of deck.notes) {
    if (!existingModelNames.has(note.modelName)) {
      await invoke({
        action: "createModel",
        version: 6,
        request: {
          modelName: note.modelName,
          inOrderFields: note.inOrderFields,
          isCloze: false,
          cardTemplates: [createDefaultCardTemplateForNoteType(note)],
          css: "",
        },
        origin: config?.origin,
      });
      reporter?.createdModel(note.modelName);
      existingModelNames.add(note.modelName);
    }
  }
  reporter?.endModelCreation();

  // store medias
  reporter?.startStoreMedia();
  const skipMediaNames: Set<string> = new Set(
    config?.overwriteExistingMedias
      ? []
      : await invoke({
          action: "getMediaFilesNames",
          version: 6,
          request: { pattern: "*" },
          origin: config?.origin,
        }),
  );

  for (const note of deck.notes) {
    for (const mediaName in note.medias) {
      if (skipMediaNames.has(mediaName)) {
        continue;
      }
      const media = note.medias[mediaName];
      reporter?.storingMedia(mediaName, media);
      await invoke({
        action: "storeMediaFile",
        version: 6,
        request: {
          filename: mediaName,
          path: media.absPath,
          url: media.url,
        },
        origin: config?.origin,
      });
    }
  }
  reporter?.endStoreMedia();

  reporter?.startNotes();
  // fetch all the notes in the target deck
  const noteIdsInDeck = await invoke({
    action: "findNotes",
    version: 6,
    request: { query: `deck:"${deck.deckName}"` },
  });
  const notesInDeck = await invoke({
    action: "notesInfo",
    version: 6,
    request: {
      notes: noteIdsInDeck,
    },
  });
  // map the existing notes from model + first field to noteId.
  const noteIdMap = new Map<string, NoteTypes.NoteInfo>();
  for (const n of notesInDeck) {
    noteIdMap.set(
      `${n.modelName}|${
        Object.values(n.fields).find((f) => f.order === 0)!.value
      }`,
      n,
    );
  }
  // assign the existing noteIds.
  for (var n of deck.notes) {
    const key = `${n.modelName}|${n.values[n.inOrderFields[0]]}`;
    const existingNote = noteIdMap.get(key);
    const noteId = existingNote?.noteId;
    if (noteId) {
      n.noteId = noteId;
      n.modified = checkIsModified(existingNote, n);
    }
  }

  const unmodifiedNotes = deck.notes.filter(
    (note) => note.noteId && !note.modified,
  );
  reporter?.unmodifiedNotes(unmodifiedNotes.length);
  const notesToUpdate = deck.notes.filter(
    (note) => note.noteId && note.modified,
  );
  const notesToInsert = deck.notes.filter((note) => !note.noteId);

  for (const note of notesToUpdate) {
    await invoke({
      action: "updateNoteFields",
      version: 6,
      request: {
        note: {
          id: note.noteId!!,
          fields: note.values,
        },
      },
      origin: config?.origin,
    });
    reporter?.increaseUpdatedNote(notesToUpdate.length);
  }

  reporter?.insertingNotes(notesToInsert.length);
  const newNoteIds = await invoke({
    action: "addNotes",
    version: 6,
    request: {
      notes: notesToInsert.map((n) => ({
        deckName: deck.deckName,
        modelName: n.modelName,
        fields: n.values,
        tags: n.tags,
      })),
    },
    origin: config?.origin,
  });
  newNoteIds.forEach((newNoteId, index) => {
    if (newNoteId) {
      notesToInsert[index].noteId = newNoteId;
    }
  });
  reporter?.endNotes(newNoteIds.filter((id) => !!id).length);

  return deck.notes.map((n) => n.noteId);
}
