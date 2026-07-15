import type { PlayerId } from "#core";
import type { ReturnRandomFromInkwellEffect } from "@tcg/lorcana-types";
import type { CardPlayedPayload } from "../../../types";
import { markLastEffectPerformed } from "./event-snapshot-utils";
import type { ActionResolutionInput, PlayCardExecutionContext } from "./types";
import { resolveTargetPlayerIds } from "./player-target-resolver";

type ResolvedReturnRandomFromInkwellInput = {
  returnCount?: number;
};

export function isReturnRandomFromInkwellEffect(
  effect: unknown,
): effect is ReturnRandomFromInkwellEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "return-random-from-inkwell"
  );
}

function normalizeReturnCount(
  effect: ReturnRandomFromInkwellEffect,
  inkwellCount: number,
  resolvedInput?: ResolvedReturnRandomFromInkwellInput,
): number {
  if (typeof effect.leave === "number" && Number.isFinite(effect.leave)) {
    return Math.max(0, inkwellCount - Math.max(0, Math.floor(effect.leave)));
  }

  if (
    typeof resolvedInput?.returnCount === "number" &&
    Number.isFinite(resolvedInput.returnCount) &&
    resolvedInput.returnCount > 0
  ) {
    return Math.min(inkwellCount, Math.floor(resolvedInput.returnCount));
  }

  return 0;
}

export function resolveReturnRandomFromInkwellEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: ReturnRandomFromInkwellEffect,
  resolutionInput: ActionResolutionInput,
  resolvedInput?: ResolvedReturnRandomFromInkwellInput,
): void {
  const targetPlayerIds =
    effect.target === undefined
      ? [cardPlayed.playerId]
      : resolveTargetPlayerIds(ctx, cardPlayed, effect.target, resolutionInput.targets);

  let movedAnyCards = false;

  for (const targetPlayerId of targetPlayerIds) {
    const inkwellCards = ctx.framework.zones.getCards({
      zone: "inkwell",
      playerId: targetPlayerId,
    }) as string[];
    const returnCount = normalizeReturnCount(effect, inkwellCards.length, resolvedInput);
    if (returnCount <= 0) {
      continue;
    }

    const cardsToReturn = ctx.framework.random.shuffle([...inkwellCards]).slice(0, returnCount);
    for (const cardId of cardsToReturn) {
      ctx.framework.zones.moveCard(cardId, {
        zone: "hand",
        playerId: targetPlayerId as PlayerId,
      });
    }

    movedAnyCards = movedAnyCards || cardsToReturn.length > 0;
  }

  markLastEffectPerformed(resolutionInput.eventSnapshot, movedAnyCards);
}
