import { m } from "$lib/i18n/messages.js";
import type {
  ExecutableMoveEntry,
  ExecutableMovePresentationCategoryId,
} from "@/features/simulator/model/contracts.js";

export const ORDERED_MOVE_CATEGORIES: readonly ExecutableMovePresentationCategoryId[] = [
  "choose-first-player",
  "ink-card",
  "play-card",
  "shift-card",
  "sing-card",
  "quest",
  "quest-all",
  "challenge",
  "activate-ability",
  "move-to-location",
  "pass-turn",
  "alter-hand",
  "undo",
  "concede",
] as const;

const MOVE_CATEGORY_PRIORITY = new Map<ExecutableMovePresentationCategoryId, number>(
  ORDERED_MOVE_CATEGORIES.map((categoryId, index) => [categoryId, index]),
);

const OTHER_CATEGORY_PRIORITY = ORDERED_MOVE_CATEGORIES.indexOf("pass-turn") - 0.5;

export function getMoveCategoryId(moveId: string): ExecutableMovePresentationCategoryId {
  switch (moveId) {
    case "activateAbility":
      return "activate-ability";
    case "chooseWhoGoesFirst":
      return "choose-first-player";
    case "putCardIntoInkwell":
      return "ink-card";
    case "challenge":
      return "challenge";
    case "alterHand":
      return "alter-hand";
    case "concede":
      return "concede";
    case "moveCharacterToLocation":
      return "move-to-location";
    case "undo":
      return "undo";
    case "passTurn":
      return "pass-turn";
    case "playCard":
      return "play-card";
    case "shiftCard":
      return "shift-card";
    case "singCard":
      return "sing-card";
    case "quest":
      return "quest";
    case "questWithAll":
      return "quest-all";
    default:
      return "unknown";
  }
}

export function getMoveCategoryLabel(moveId: string): string {
  switch (getMoveCategoryId(moveId)) {
    case "activate-ability":
      return m["sim.actions.label.activateAbility"]({});
    case "challenge":
      return m["sim.actions.label.challenge"]({});
    case "choose-first-player":
      return m["sim.actions.label.chooseFirstPlayer"]({});
    case "alter-hand":
      return m["sim.actions.label.alterHand"]({});
    case "concede":
      return m["sim.actions.label.concede"]({});
    case "ink-card":
      return m["sim.actions.label.inkCard"]({});
    case "move-to-location":
      return m["sim.actions.label.moveToLocation"]({});
    case "undo":
      return m["sim.actions.label.undo"]({});
    case "pass-turn":
      return m["sim.actions.label.passTurn"]({});
    case "play-card":
      return m["sim.actions.label.playCard"]({});
    case "shift-card":
      return m["sim.actions.label.shiftCard"]({});
    case "sing-card":
      return m["sim.actions.label.singCard"]({});
    case "quest":
      return m["sim.actions.label.quest"]({});
    case "quest-all":
      return m["sim.actions.label.questAll"]({});
    default:
      return moveId;
  }
}

export function getCategoryLabel(categoryId: ExecutableMovePresentationCategoryId): string {
  switch (categoryId) {
    case "activate-ability":
      return m["sim.actions.label.activateAbility"]({});
    case "challenge":
      return m["sim.actions.label.challenge"]({});
    case "choose-first-player":
      return m["sim.actions.label.chooseFirstPlayer"]({});
    case "alter-hand":
      return m["sim.actions.label.alterHand"]({});
    case "concede":
      return m["sim.actions.label.concede"]({});
    case "ink-card":
      return m["sim.actions.label.inkCard"]({});
    case "move-to-location":
      return m["sim.actions.label.moveToLocation"]({});
    case "undo":
      return m["sim.actions.label.undo"]({});
    case "pass-turn":
      return m["sim.actions.label.passTurn"]({});
    case "play-card":
      return m["sim.actions.label.playCard"]({});
    case "shift-card":
      return m["sim.actions.label.shiftCard"]({});
    case "sing-card":
      return m["sim.actions.label.singCard"]({});
    case "quest":
      return m["sim.actions.label.quest"]({});
    case "quest-all":
      return m["sim.actions.label.questAll"]({});
    default:
      return categoryId;
  }
}

export function sortMoveCategories<T extends { id: ExecutableMovePresentationCategoryId }>(
  groups: readonly T[],
): T[] {
  return groups
    .map((group, index) => ({ group, index }))
    .sort((left, right) => {
      const leftPriority = MOVE_CATEGORY_PRIORITY.get(left.group.id) ?? OTHER_CATEGORY_PRIORITY;
      const rightPriority = MOVE_CATEGORY_PRIORITY.get(right.group.id) ?? OTHER_CATEGORY_PRIORITY;

      if (leftPriority !== rightPriority) {
        return leftPriority - rightPriority;
      }

      return left.index - right.index;
    })
    .map(({ group }) => group);
}

function getMoveSourceId(move: ExecutableMoveEntry): string | null {
  switch (move.presentation.categoryId) {
    case "activate-ability":
    case "ink-card":
    case "play-card":
    case "shift-card":
    case "sing-card":
    case "quest": {
      const cardId = (move.params as { cardId?: unknown }).cardId;
      return typeof cardId === "string" ? cardId : null;
    }
    case "challenge": {
      const attackerId = (move.params as { attackerId?: unknown }).attackerId;
      return typeof attackerId === "string" ? attackerId : null;
    }
    case "move-to-location": {
      const characterId = (move.params as { characterId?: unknown }).characterId;
      return typeof characterId === "string" ? characterId : null;
    }
    default:
      return null;
  }
}

export function getMoveCategoryEntryCount(
  categoryId: ExecutableMovePresentationCategoryId,
  moves: readonly ExecutableMoveEntry[],
): number {
  if (
    categoryId !== "activate-ability" &&
    categoryId !== "challenge" &&
    categoryId !== "move-to-location"
  ) {
    return moves.length;
  }

  const sourceIds = new Set<string>();
  for (const move of moves) {
    const sourceId = getMoveSourceId(move);
    if (sourceId) {
      sourceIds.add(sourceId);
    }
  }

  return sourceIds.size;
}

export function getMoveCategoryGroupCount(moves: readonly ExecutableMoveEntry[]): number {
  return new Set(moves.map((move) => move.presentation.categoryId)).size;
}
