import type { CardInstanceId, PlayerId } from "#core";
import type { MillEffect } from "@tcg/lorcana-types/abilities";
import type { CardPlayedPayload } from "../../../types/index";
import type { DynamicAmountEventSnapshot } from "../../../types/domain-events";
import type { PlayCardExecutionContext } from "./types";
import { resolveCurrentTurnPlayerId } from "../../../targeting/runtime";
import { queueTriggeredEvent } from "../../effects/triggered-abilities";

type ResolvedMillEffectInput = {
  millAmount?: number;
  selectedPlayerIds?: PlayerId[];
  eventSnapshot?: DynamicAmountEventSnapshot;
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
    const cardsToMill = ctx.framework.zones
      .mill({ zone: "deck", playerId }, { zone: "discard", playerId }, millAmount)
      .filter((cardId): cardId is CardInstanceId => typeof cardId === "string");
    if (cardsToMill.length > 0) {
      // Milling is "putting cards into your discard from your deck" — expose a
      // discard trigger event per milled card with the deck origin. The shared
      // triggerBatchKey lets player-scoped "1 or more cards" triggers dedupe
      // to a single bag item per mill (see shouldDeduplicateDiscardBatch).
      const triggerBatchKey = `mill:${cardsToMill.join("|")}`;
      for (const cardId of cardsToMill) {
        queueTriggeredEvent(ctx, {
          event: "discard",
          playerId: playerId as PlayerId,
          subjectCardId: cardId,
          triggerSourceCardId: cardId,
          fromZone: "deck",
          eventSnapshot: {
            triggerBatchKey,
            triggerAmount: cardsToMill.length,
          },
        });
      }
    }
    if (cardsToMill.length > 0 && resolvedInput.eventSnapshot) {
      resolvedInput.eventSnapshot.discardedCardIds = [
        ...(resolvedInput.eventSnapshot.discardedCardIds ?? []),
        ...cardsToMill,
      ];
    }
  }
}
