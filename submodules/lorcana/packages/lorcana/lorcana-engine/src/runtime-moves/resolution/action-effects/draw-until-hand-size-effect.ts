import type { DrawUntilHandSizeEffect } from "@tcg/lorcana-types";
import type { CardInstanceId } from "#core";
import type { CardPlayedPayload } from "../../../types";
import { emitTriggeredLorcanaEvent } from "../../effects/triggered-abilities";
import { recordCardDrawnThisTurn } from "../../state/turn-metrics";
import { markLastEffectPerformed } from "./event-snapshot-utils";
import { resolveTargetPlayerIds } from "./player-target-resolver";
import type { ActionResolutionInput, PlayCardExecutionContext } from "./types";

export function isDrawUntilHandSizeEffect(effect: unknown): effect is DrawUntilHandSizeEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "draw-until-hand-size"
  );
}

export function resolveDrawUntilHandSizeEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: DrawUntilHandSizeEffect,
  resolutionInput: ActionResolutionInput,
): void {
  const targetPlayerIds = resolveTargetPlayerIds(
    ctx,
    cardPlayed,
    effect.target ?? "CONTROLLER",
    resolutionInput.targets,
  );
  const targetSize =
    typeof effect.size === "number" && Number.isFinite(effect.size) && effect.size >= 0
      ? Math.floor(effect.size)
      : 0;

  let drewCards = false;
  for (const playerId of targetPlayerIds) {
    const currentHandSize = ctx.framework.zones.getCards({ zone: "hand", playerId }).length;
    const drawAmount = Math.max(0, targetSize - currentHandSize);
    if (drawAmount <= 0) {
      continue;
    }

    const drawnCards = ctx.framework.zones.drawCards({
      from: { zone: "deck", playerId },
      to: { zone: "hand", playerId },
      count: drawAmount,
    });
    const drawnCardIds = Array.isArray(drawnCards) ? (drawnCards as CardInstanceId[]) : [];
    if (drawnCardIds.length === 0) {
      continue;
    }
    drewCards = true;

    drawnCardIds.forEach((cardId) => {
      recordCardDrawnThisTurn(ctx, playerId);
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
        },
      );
    });
  }

  if (drewCards) {
    markLastEffectPerformed(resolutionInput.eventSnapshot, true);
  }
}
