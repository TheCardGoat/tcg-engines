import type { CardInstanceId } from "../types/branded.ts";
import type { MatchState } from "../types/match-state.ts";
import type { DefeatedCardSnapshot } from "../types/game-events.ts";
import { getEffectivePower } from "../active-effects/index.ts";
import { defOf } from "./lookups.ts";

/** Capture the last valid facts before a defeat changes zone or attachment. */
export function captureDefeatedCardSnapshot(
  state: MatchState,
  cardId: CardInstanceId,
): DefeatedCardSnapshot {
  const card = state.G.cardIndex[cardId as string];
  if (!card) throw new Error(`Cannot snapshot missing defeated card: ${cardId as string}`);
  const definition = defOf(card);
  return {
    controllerId: card.controllerId,
    zone: card.zone,
    cardTypes:
      definition.type === "legend" && card.zone === "field"
        ? ["legend", "unit"]
        : [definition.type],
    color: definition.color,
    classifications: [...definition.classifications],
    keywords: [...definition.keywords],
    spent: card.meta.spent,
    faceDown: card.meta.faceDown,
    hasLag: card.meta.hasLag,
    playedThisTurn: card.meta.playedThisTurn,
    cost: definition.cost ?? 0,
    effectivePower: getEffectivePower(state, cardId as string),
    attachedGearIds: [...card.meta.attachedGearIds],
    attachedToId: card.meta.attachedToId,
  };
}
