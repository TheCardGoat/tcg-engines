import type {
  ExecutableMovePresentationCategoryId,
  LorcanaPlayerSide,
} from "@/features/simulator/model/contracts.js";

export const PRIORITY_NUDGE_DELAY_MS = 20_000;

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
  switch (categoryId) {
    case "activate-ability":
    case "challenge":
    case "ink-card":
    case "move-to-location":
    case "pass-turn":
    case "play-card":
    case "quest":
    case "quest-all":
    case "shift-card":
    case "sing-card":
      return true;
    case "alter-hand":
    case "choose-first-player":
    case "concede":
    case "keep-hand":
    case "undo":
    case "unknown":
      return false;
    default: {
      const unhandled: never = categoryId;
      return unhandled;
    }
  }
}

export function shouldArmPriorityNudge(input: PriorityNudgeEligibilityInput): boolean {
  if (input.viewerMode !== "player") return false;
  if (input.isPostGame) return false;
  if (!input.ownerSide) return false;
  if (input.prioritySide !== input.ownerSide) return false;
  if (input.hasActiveSelection) return false;

  return input.moveCategoryIds.some(isActionablePriorityCategory);
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
