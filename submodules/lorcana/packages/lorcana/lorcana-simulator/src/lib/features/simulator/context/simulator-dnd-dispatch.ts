import type { LorcanaPlayerSide } from "@/features/simulator/model/contracts.js";

export type SupportedDropZone = "play" | "inkwell" | "hand";
export type DraggedCardKind =
  | "hand"
  | "hand-shift"
  | "hand-sing"
  | "play-quest"
  | "play-challenge"
  | "play-move-to-location";

export interface ZoneDropIntent {
  kind: "zone";
  playerSide: LorcanaPlayerSide;
  zoneId: SupportedDropZone;
}

export interface LoreDropIntent {
  kind: "lore";
  playerSide: LorcanaPlayerSide;
}

export interface PlayCardDropIntent {
  kind: "play-card";
  targetCardId: string;
  playerSide: LorcanaPlayerSide;
}

export interface LocationDropIntent {
  kind: "location";
  targetCardId: string;
  playerSide: LorcanaPlayerSide;
}

export interface OwnCharacterDropIntent {
  kind: "own-character";
  targetCardId: string;
  playerSide: LorcanaPlayerSide;
}

export type DropIntent =
  | ZoneDropIntent
  | LoreDropIntent
  | PlayCardDropIntent
  | LocationDropIntent
  | OwnCharacterDropIntent;

export interface DropActionGame {
  openPlayCardSelection: (cardId: string) => boolean;
  playCard: (cardId: string) => boolean;
  ink: (cardId: string) => boolean;
  shouldOpenPlayCardSelectionOnDrop: (cardId: string) => boolean;
  canDropHandCardIntoZone: (
    cardId: string,
    zoneId: Extract<SupportedDropZone, "play" | "inkwell">,
  ) => boolean;
  questCard: (cardId: string) => boolean;
  executeChallengeDrop: (targetCardId: string) => boolean;
  executeMoveToLocationDrop: (targetCardId: string) => boolean;
  executeShiftDrop: (targetCardId: string) => boolean;
  executeSingDrop: (targetCardId: string) => boolean;
}

const HAND_KINDS: DraggedCardKind[] = ["hand", "hand-shift", "hand-sing"];

export function dispatchDropIntent(args: {
  cardId: string;
  dropIntent: DropIntent | null;
  draggedCardKind: DraggedCardKind | null;
  ownerSide: LorcanaPlayerSide | null;
  game: DropActionGame;
}): boolean {
  const { cardId, dropIntent, draggedCardKind, ownerSide, game } = args;
  if (!dropIntent || !draggedCardKind || !ownerSide) {
    return false;
  }

  // Quest drop: play card dragged onto own lore badge
  if (
    dropIntent.kind === "lore" &&
    (draggedCardKind === "play-quest" || draggedCardKind === "play-challenge") &&
    dropIntent.playerSide === ownerSide
  ) {
    return game.questCard(cardId);
  }

  // Challenge drop: play card dragged onto opposing character
  if (dropIntent.kind === "play-card" && draggedCardKind === "play-challenge") {
    return game.executeChallengeDrop(dropIntent.targetCardId);
  }

  // Move-to-location drop: play card dragged onto own location card
  if (dropIntent.kind === "location" && draggedCardKind === "play-move-to-location") {
    return game.executeMoveToLocationDrop(dropIntent.targetCardId);
  }

  // Shift drop: hand card dragged onto own in-play character
  if (dropIntent.kind === "own-character" && draggedCardKind === "hand-shift") {
    return game.executeShiftDrop(dropIntent.targetCardId);
  }

  // Sing drop: song card dragged onto own singer character
  if (dropIntent.kind === "own-character" && draggedCardKind === "hand-sing") {
    return game.executeSingDrop(dropIntent.targetCardId);
  }

  // Hand card zone drops (hand, hand-shift, hand-sing all support zone drops as fallback)
  if (!HAND_KINDS.includes(draggedCardKind) || dropIntent.kind !== "zone") {
    return false;
  }

  if (dropIntent.playerSide !== ownerSide) {
    return false;
  }

  const { zoneId } = dropIntent;
  if (zoneId === "hand") {
    return false;
  }

  if (!game.canDropHandCardIntoZone(cardId, zoneId)) {
    return false;
  }

  if (zoneId === "play") {
    if (game.shouldOpenPlayCardSelectionOnDrop(cardId)) {
      return game.openPlayCardSelection(cardId);
    }

    return game.playCard(cardId);
  }

  return game.ink(cardId);
}
