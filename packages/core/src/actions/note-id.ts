import { INoteIdAndPosition } from "../model";

/**
 * Update the note ids inside the given markdown content.
 *
 * @param input input markdown content.
 * @param noteIds null, ensure no noteId for the given note. non-note, set/change the noteId for the given note to match.
 *
 * @return {string} updated markdown content.
 */
export function updateNoteId(
  input: string,
  noteIds: INoteIdAndPosition[],
): string {
  const lines = input.split("\n");
  for (const { noteId, position } of noteIds) {
    const line = lines[position.startLine - 1];
    const matches = line.match(/\s+\^([0-9]+)$/);
    if (noteId) {
      if (matches) {
        // remove the existing noteId
        lines[position.startLine - 1] = line.substring(0, matches.index);
        // add noteId
        lines[position.startLine - 1] = `${
          lines[position.startLine - 1]
        } ^${noteId}`;
      } else {
        // add noteId
        lines[position.startLine - 1] = `${line} ^${noteId}`;
      }
    } else {
      if (matches) {
        // remove the noteId
        lines[position.startLine - 1] = line.substring(0, matches.index);
      }
    }
  }
  return lines.join("\n");
}
