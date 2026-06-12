import type {
  ExecutableMovePresentationCategoryId,
  MoveCategorySummary,
} from "@/features/simulator/model/contracts.js";

export type RevealedBottomControlId =
  | ExecutableMovePresentationCategoryId
  | "pass-turn"
  | "pending-effects";

export type RevealedBottomControlState = RevealedBottomControlId | null;

const bottomMoveCategoryOrder: readonly ExecutableMovePresentationCategoryId[] = [
  "play-card",
  "shift-card",
  "sing-card",
  "ink-card",
  "quest",
  "quest-all",
  "challenge",
  "activate-ability",
  "move-to-location",
  "alter-hand",
  "choose-first-player",
  "undo",
  "unknown",
];

const bottomMoveCategoryOrderIndex = new Map(
  bottomMoveCategoryOrder.map((categoryId, index) => [categoryId, index]),
);

export function sortBottomSeatMoveSummaries(
  summaries: readonly MoveCategorySummary[],
): MoveCategorySummary[] {
  return summaries
    .map((summary, index) => ({ summary, index }))
    .sort((left, right) => {
      const leftIndex =
        bottomMoveCategoryOrderIndex.get(left.summary.categoryId) ?? Number.MAX_SAFE_INTEGER;
      const rightIndex =
        bottomMoveCategoryOrderIndex.get(right.summary.categoryId) ?? Number.MAX_SAFE_INTEGER;

      if (leftIndex !== rightIndex) {
        return leftIndex - rightIndex;
      }

      return left.index - right.index;
    })
    .map(({ summary }) => summary);
}

export function revealBottomControl(
  current: RevealedBottomControlState,
  controlId: RevealedBottomControlId,
): RevealedBottomControlState {
  if (current === controlId) {
    return current;
  }

  return controlId;
}

export function isBottomControlRevealed(
  current: RevealedBottomControlState,
  controlId: RevealedBottomControlId,
): boolean {
  return current === controlId;
}
