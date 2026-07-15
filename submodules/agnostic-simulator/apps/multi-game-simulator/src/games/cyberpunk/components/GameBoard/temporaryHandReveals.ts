import { useMemo } from "react";

import { PLAYER_SIDE_TO_ID, useEngine, type Side } from "../../engine";

type RevealZone = "field" | "trash" | "hand";

interface TemporaryHandRevealEvent {
  type: "cardMoved" | "turnEnded" | "turnStarted";
  cardId?: unknown;
  fromZone?: unknown;
  toZone?: unknown;
  playerId: unknown;
}

interface TemporaryHandRevealEventEntry {
  events: ReadonlyArray<unknown>;
  moveLogs?: ReadonlyArray<unknown>;
}

const PUBLIC_REVEAL_SOURCES = new Set<RevealZone>(["field", "trash"]);
const HIDDEN_DISCARD_DESTINATIONS = new Set<RevealZone>(["trash"]);

export function useTemporaryRevealedHandCardIds(
  side: Side,
  handCardIds: ReadonlyArray<string>,
): Set<string> {
  const { rawEngineEvents } = useEngine();
  const ownerId = String(PLAYER_SIDE_TO_ID[side]);

  return useMemo(
    () => computeTemporaryRevealedHandCardIds(rawEngineEvents, ownerId, handCardIds),
    [handCardIds, ownerId, rawEngineEvents],
  );
}

export function computeTemporaryRevealedHandCardIds(
  entries: ReadonlyArray<TemporaryHandRevealEventEntry>,
  ownerId: string,
  currentHandCardIds: ReadonlyArray<string>,
): Set<string> {
  const revealed = new Set<string>();

  for (const entry of entries) {
    for (const event of entry.events) {
      applyTemporaryHandRevealEvent(revealed, event, ownerId);
    }

    if (!entry.events.some(isTemporaryHandRevealTurnBoundary)) {
      for (const log of entry.moveLogs ?? []) {
        applyTemporaryHandRevealEvent(revealed, log, ownerId);
      }
    }
  }

  const currentHand = new Set(currentHandCardIds);
  for (const cardId of revealed) {
    if (!currentHand.has(cardId)) {
      revealed.delete(cardId);
    }
  }

  return revealed;
}

function applyTemporaryHandRevealEvent(
  revealed: Set<string>,
  event: unknown,
  ownerId: string,
): void {
  if (!isTemporaryHandRevealEvent(event)) {
    return;
  }

  if (event.type === "turnStarted") {
    revealed.clear();
    return;
  }

  if (String(event.playerId) !== ownerId) {
    return;
  }

  if (event.type === "turnEnded") {
    revealed.clear();
    return;
  }

  const cardId = String(event.cardId);
  const fromZone = zoneValue(event.fromZone);
  const toZone = zoneValue(event.toZone);

  if (toZone === "hand" && fromZone && PUBLIC_REVEAL_SOURCES.has(fromZone)) {
    revealed.add(cardId);
    return;
  }

  if (fromZone === "hand" && toZone && HIDDEN_DISCARD_DESTINATIONS.has(toZone)) {
    if (!revealed.has(cardId)) {
      revealed.clear();
    } else {
      revealed.delete(cardId);
    }
  }
}

function isTemporaryHandRevealEvent(event: unknown): event is TemporaryHandRevealEvent {
  if (!event || typeof event !== "object") {
    return false;
  }
  const candidate = event as {
    type?: unknown;
    playerId?: unknown;
    cardId?: unknown;
    fromZone?: unknown;
    toZone?: unknown;
  };
  if (candidate.type === "turnEnded" || candidate.type === "turnStarted") {
    return candidate.playerId !== undefined;
  }
  return (
    candidate.type === "cardMoved" &&
    candidate.cardId !== undefined &&
    candidate.playerId !== undefined
  );
}

function isTemporaryHandRevealTurnBoundary(event: unknown): boolean {
  return isTemporaryHandRevealEvent(event) && event.type !== "cardMoved";
}

function zoneValue(value: unknown): RevealZone | null {
  return value === "field" || value === "trash" || value === "hand" ? value : null;
}
