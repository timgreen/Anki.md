import { invoke, ModelTypes, NoteTypes } from "@autoanki/anki-connect";

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
}

export async function ankiConnectSync(
  deck: IDeck,
  config?: SyncConfig,
): Promise<Array<NoteTypes.NoteId | null>> {
  await invoke({
    action: "createDeck",
    version: 6,
    request: {
      deck: deck.deckName,
    },
  });

  const existingModelNames = new Set<string>();
  for (const modelName in await invoke({
    action: "modelNamesAndIds",
    version: 6,
    request: undefined,
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
          ...model,
          isCloze: false,
          modelName: modelName,
        },
      });
      existingModelNames.add(modelName);
    } else {
      if (config?.updateModelTemplates) {
        const templates: ModelTypes.ModelTemplates = {};
        for (const t of model.cardTemplates) {
          templates[t.Name || "default"] = {
            Front: t.Front,
            Back: t.Back,
          };
        }

        await invoke({
          action: "updateModelTemplates",
          version: 6,
          request: {
            model: {
              name: modelName,
              templates,
            },
          },
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
      });
      existingModelNames.add(note.modelName);
    }
  }

  // store medias
  for (const note of deck.notes) {
    for (const mediaName in note.medias) {
      const media = note.medias[mediaName];
      await invoke({
        action: "storeMediaFile",
        version: 6,
        request: {
          filename: mediaName,
          path: media.absPath,
          url: media.url,
        },
      });
    }
  }

  return invoke({
    action: "addNotes",
    version: 6,
    request: {
      notes: deck.notes.map((n) => ({
        deckName: deck.deckName,
        modelName: n.modelName,
        fields: n.values,
        tags: n.tags,
      })),
    },
  });
}
