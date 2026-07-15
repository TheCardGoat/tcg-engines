import type { Operations } from "../operations/index.ts";
import { defOf } from "../state/lookups.ts";
import type { CardInstanceId, PlayerId } from "../types/branded.ts";
import type { GameEvent } from "../types/game-events.ts";
import type { MatchState } from "../types/match-state.ts";
import { computeEffectiveCost, consumeCostModifierUse } from "./compute-effective-cost.ts";

export interface PlaySelectedCardArgs {
  state: MatchState;
  operations: Operations;
  playerId: PlayerId;
  cardId: CardInstanceId;
  free?: boolean;
  resolvedAttachToId?: string;
}

export interface PlaySelectedCardResult {
  eventsBeforePayment: number;
  cardPlayedEvent: Extract<GameEvent, { type: "cardPlayed" }>;
}

export function playSelectedCard({
  state,
  operations,
  playerId,
  cardId,
  free,
  resolvedAttachToId,
}: PlaySelectedCardArgs): PlaySelectedCardResult | null {
  const card = state.G.cardIndex[cardId as string];
  if (!card) return null;

  const def = defOf(card);
  const eventsBeforePayment = operations.event.getEmittedEvents().length;

  const cost = free ? 0 : computeEffectiveCost(state, cardId, playerId);
  if (!free) {
    operations.game.spendEddies(playerId, cost, "playCard");
    consumeCostModifierUse(state, cardId, playerId);
  }

  if (def.type === "gear" && resolvedAttachToId) {
    operations.zone.moveCard(cardId, "field", playerId);
    operations.card.attachGear(cardId, resolvedAttachToId as CardInstanceId);
  } else if (def.type === "program") {
    operations.zone.moveCard(cardId, "trash", playerId);
  } else {
    operations.zone.moveCard(cardId, "field", playerId);
    operations.card.moveAttachedGear(cardId, "field");
    if (def.type === "unit") {
      operations.card.setHasLag(cardId, true);
    }
  }

  const cardPlayedEvent = {
    type: "cardPlayed" as const,
    cardId,
    playerId,
    cost,
  };
  operations.event.emit(cardPlayedEvent);

  operations.event.emit({
    type: "actionLog",
    messageKey: "move.playCard",
    params: { cardName: def.displayName, cost },
    playerId,
  });

  return { eventsBeforePayment, cardPlayedEvent };
}
