import type { DrawEffect } from "@tcg/lorcana-types";
import type { CardInstanceId, PlayerId } from "#core";
import type { CardPlayedPayload } from "../../../types/index";
import type { PlayCardExecutionContext } from "./types";
import type { ActionResolutionInput } from "./types";
import { resolveCurrentTurnPlayerId } from "../../../targeting/runtime";
import { emitTriggeredLorcanaEvent } from "../../effects/triggered-abilities";
import { recordCardDrawnThisTurn } from "../../state/turn-metrics";
import { markLastEffectPerformed } from "./event-snapshot-utils";

type ResolvedDrawEffectInput = {
  drawAmount?: number;
  selectedPlayerIds?: PlayerId[];
  selectedTargets?: CardInstanceId[];
};

export function isDrawEffect(effect: unknown): effect is DrawEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "draw"
  );
}

function resolveDrawTargetPlayerIds(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  target: DrawEffect["target"],
  selectedPlayerIds?: PlayerId[],
  selectedTargets?: CardInstanceId[],
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
    case "CARD_OWNER":
      return [
        ...new Set(
          (selectedTargets ?? [])
            .map((cardId) => ctx.framework.zones.getCardOwner(cardId))
            .filter((playerId): playerId is PlayerId => typeof playerId === "string"),
        ),
      ];
    case "CURRENT_TURN": {
      const currentTurnPlayerId = resolveCurrentTurnPlayerId(ctx);
      return currentTurnPlayerId ? [currentTurnPlayerId] : [];
    }
    default:
      return [];
  }
}

export function resolveDrawEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: DrawEffect,
  resolvedInput: ResolvedDrawEffectInput,
  eventSnapshot?: { lastEffectPerformed?: boolean; drawnCount?: number },
): void {
  const drawAmount =
    typeof resolvedInput.drawAmount === "number" &&
    Number.isFinite(resolvedInput.drawAmount) &&
    resolvedInput.drawAmount > 0
      ? resolvedInput.drawAmount
      : undefined;
  if (!drawAmount) {
    markLastEffectPerformed(eventSnapshot, false);
    return;
  }

  const targetPlayerIds = resolveDrawTargetPlayerIds(
    ctx,
    cardPlayed,
    effect.target,
    resolvedInput.selectedPlayerIds,
    resolvedInput.selectedTargets,
  );
  let totalDrawn = 0;
  for (const playerId of targetPlayerIds) {
    const drawnCards = ctx.framework.zones.drawCards({
      from: { zone: "deck", playerId },
      to: { zone: "hand", playerId },
      count: drawAmount,
    });
    const drawnCardIds = Array.isArray(drawnCards) ? (drawnCards as CardInstanceId[]) : [];
    totalDrawn += drawnCardIds.length;

    drawnCardIds.forEach((cardId) => {
      recordCardDrawnThisTurn(ctx, playerId);
      const drawCount =
        (ctx.G.turnMetadata?.cardsDrawnThisTurnByPlayer as Record<string, number> | undefined)?.[
          playerId
        ] ?? 1;
      emitTriggeredLorcanaEvent(
        ctx,
        "cardsDrawn",
        {
          playerId,
          amount: 1,
          cardIds: [cardId],
        },
        {
          event: "draw",
          playerId,
          subjectCardId: cardId,
          triggerSourceCardId: cardPlayed.cardId,
          eventSnapshot: { drawCountForPlayerThisTurn: drawCount },
        },
      );
    });
  }
  markLastEffectPerformed(eventSnapshot, totalDrawn > 0);
  if (eventSnapshot && totalDrawn > 0) {
    eventSnapshot.drawnCount = (eventSnapshot.drawnCount ?? 0) + totalDrawn;
  }
}
