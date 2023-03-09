import {
  invoke,
  ModelTypes,
  NoteTypes,
  ApiOrigin,
} from "@autoanki/anki-connect";

import { IDeck, INoteType } from "../model";

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

export interface SyncConfig {
  updateModelTemplates?: boolean;
  updateModelStyling?: boolean;
  overwriteExistingMedias?: boolean;
  origin?: ApiOrigin;
}

export async function ankiConnectSync(
  deck: IDeck,
  config?: SyncConfig,
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
      existingModelNames.add(note.modelName);
    }
  }

  // store medias
  const skipMediaNames: Set<string> = new Set(
    config?.overwriteExistingMedias
      ? []
      : await invoke({
          action: "getMediaFilesNames",
          version: 6,
          request: { pattern: "" },
          origin: config?.origin,
        }),
  );

  for (const note of deck.notes) {
    for (const mediaName in note.medias) {
      if (skipMediaNames.has(mediaName)) {
        continue;
      }
      const media = note.medias[mediaName];
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

  const notesToUpdate = deck.notes.filter((note) => note.noteId);
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
  }

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

  return deck.notes.map((n) => n.noteId);
}
