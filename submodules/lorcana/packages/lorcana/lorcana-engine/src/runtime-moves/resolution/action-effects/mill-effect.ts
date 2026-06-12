import type { PlayerId } from "#core";
import type { MillEffect } from "@tcg/lorcana-types/abilities";
import type { CardPlayedPayload } from "../../../types/index";
import type { PlayCardExecutionContext } from "./types";
import { resolveCurrentTurnPlayerId } from "../../../targeting/runtime";

type ResolvedMillEffectInput = {
  millAmount?: number;
  selectedPlayerIds?: PlayerId[];
};

export function isMillEffect(effect: unknown): effect is MillEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "mill"
  );
}

function resolveMillTargetPlayerIds(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  target: MillEffect["target"],
  selectedPlayerIds?: PlayerId[],
): PlayerId[] {
  const normalizedTarget = target ?? "CONTROLLER";
  const opponents = ctx.framework.state.playerIds.filter(
    (playerId) => playerId !== cardPlayed.playerId,
  );

  switch (normalizedTarget) {
    case "CONTROLLER":
      return [cardPlayed.playerId];
    case "EACH_PLAYER":
    case "ALL_PLAYERS":
      return [...ctx.framework.state.playerIds];
    case "OPPONENT":
      return opponents.length > 0 ? [opponents[0]!] : [];
    case "OPPONENTS":
    case "EACH_OPPONENT":
      return opponents;
    case "CHOSEN_PLAYER": {
      const selected = [...new Set(selectedPlayerIds ?? [])];
      const validPlayers = new Set(ctx.framework.state.playerIds);
      return selected.filter((playerId) => validPlayers.has(playerId)).slice(0, 1);
    }
    case "CURRENT_TURN": {
      const currentTurnPlayerId = resolveCurrentTurnPlayerId(ctx);
      return currentTurnPlayerId ? [currentTurnPlayerId] : [];
    }
    default:
      return [];
  }
}

export function resolveMillEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: MillEffect,
  resolvedInput: ResolvedMillEffectInput,
): void {
  const millAmount =
    typeof resolvedInput.millAmount === "number" &&
    Number.isFinite(resolvedInput.millAmount) &&
    resolvedInput.millAmount > 0
      ? Math.floor(resolvedInput.millAmount)
      : undefined;
  if (!millAmount) {
    return;
  }

  const targetPlayerIds = resolveMillTargetPlayerIds(
    ctx,
    cardPlayed,
    effect.target,
    resolvedInput.selectedPlayerIds,
  );

  for (const playerId of targetPlayerIds) {
    const deckCards = ctx.framework.zones.getCards({
      zone: "deck",
      playerId,
    });
    const millCount = Math.min(deckCards.length, millAmount);
    const cardsToMill = deckCards.slice(-millCount).reverse();

    for (const cardId of cardsToMill) {
      ctx.framework.zones.moveCard(cardId, {
        zone: "discard",
        playerId,
      });
    }
  }
}
