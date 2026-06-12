import type { ExecutableMoveEntry } from "@/features/simulator/model/contracts.js";

export type ConfirmableDirectMoveCategoryId = "pass-turn" | "undo" | "quest-all";
export type DirectMoveTriggerSource = "keyboard" | "pointer";

export interface PendingDirectMove {
  id: string;
  label: string;
  categoryId: ConfirmableDirectMoveCategoryId;
  source: DirectMoveTriggerSource;
  execute: () => void;
}

export interface ToggleDirectMoveResult {
  nextPendingDirectMove: PendingDirectMove | null;
  shouldExecuteImmediately: boolean;
}

export function isConfirmableDirectMoveCategoryId(
  categoryId: string,
): categoryId is ConfirmableDirectMoveCategoryId {
  return categoryId === "pass-turn" || categoryId === "undo" || categoryId === "quest-all";
}

export function togglePendingDirectMove(
  pendingDirectMove: PendingDirectMove | null,
  move: ExecutableMoveEntry,
  execute: () => void,
  source: DirectMoveTriggerSource,
): ToggleDirectMoveResult {
  if (!isConfirmableDirectMoveCategoryId(move.presentation.categoryId)) {
    return {
      nextPendingDirectMove: null,
      shouldExecuteImmediately: true,
    };
  }

  if (pendingDirectMove?.id === move.id) {
    return {
      nextPendingDirectMove: null,
      shouldExecuteImmediately: true,
    };
  }

  return {
    nextPendingDirectMove: {
      id: move.id,
      label: move.label,
      categoryId: move.presentation.categoryId,
      source,
      execute,
    },
    shouldExecuteImmediately: false,
  };
}

export function clearPendingDirectMoveIfUnavailable(
  pendingDirectMove: PendingDirectMove | null,
  availableCategoryIds: ReadonlySet<string>,
): PendingDirectMove | null {
  if (!pendingDirectMove) {
    return null;
  }

  return availableCategoryIds.has(pendingDirectMove.categoryId) ? pendingDirectMove : null;
}
