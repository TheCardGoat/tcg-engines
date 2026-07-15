import type {
  ExecutableMovePresentationCategoryId,
  LorcanaPlayerSide,
} from "@/features/simulator/model/contracts.js";

export const PRIORITY_NUDGE_DELAY_MS = 20_000;

const NON_ACTION_PRIORITY_CATEGORIES = new Set<ExecutableMovePresentationCategoryId>(["undo"]);

export interface PriorityNudgeEligibilityInput {
  viewerMode: "player" | "spectator";
  isPostGame: boolean;
  ownerSide: LorcanaPlayerSide | null;
  prioritySide: LorcanaPlayerSide | null;
  moveCategoryIds: readonly ExecutableMovePresentationCategoryId[];
  hasActiveSelection: boolean;
}

export interface PriorityWindowKeyInput {
  ownerSide: LorcanaPlayerSide | null;
  prioritySide: LorcanaPlayerSide | null;
  stateID?: string | number | null;
  turnNumber?: number | null;
  moveCategoryIds: readonly ExecutableMovePresentationCategoryId[];
}

export function isActionablePriorityCategory(
  categoryId: ExecutableMovePresentationCategoryId,
): boolean {
  return !NON_ACTION_PRIORITY_CATEGORIES.has(categoryId);
}

export function shouldArmPriorityNudge(input: PriorityNudgeEligibilityInput): boolean {
  if (input.viewerMode !== "player") return false;
  if (input.isPostGame) return false;
  if (!input.ownerSide) return false;
  if (input.prioritySide !== input.ownerSide) return false;

  return input.hasActiveSelection || input.moveCategoryIds.some(isActionablePriorityCategory);
}

/**
 * Builds a stable key for one local priority window so dismissing a nudge only
 * suppresses the exact priority state and move set the player already saw.
 */
export function createPriorityWindowKey(input: PriorityWindowKeyInput): string {
  const stateToken = input.stateID ?? input.turnNumber ?? "unknown";
  const categories = input.moveCategoryIds.join(",");
  return `${input.ownerSide ?? "none"}:${input.prioritySide ?? "none"}:${stateToken}:${categories}`;
}
