/** Retained last-move undo checkpoints. The turn-start checkpoint is stored separately. */
export const UNDO_CHECKPOINT_LIMIT = 25;

export function capUndoCheckpoints<T>(checkpoints: T[]): T[] {
  if (checkpoints.length <= UNDO_CHECKPOINT_LIMIT) return checkpoints;
  return checkpoints.slice(-UNDO_CHECKPOINT_LIMIT);
}
