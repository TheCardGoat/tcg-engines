import type { CardInstanceId } from "#core";
import type { RevealHandEffect } from "@tcg/lorcana-types";
import type { CardPlayedPayload } from "../../../types";
import type { ActionResolutionInput, PlayCardExecutionContext } from "./types";
import { resolveTargetPlayerIds } from "./player-target-resolver";
import { getEffectTargetSelectionInput } from "./selection-state";

export function isRevealHandEffect(effect: unknown): effect is RevealHandEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "reveal-hand"
  );
}

export function resolveRevealHandEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: RevealHandEffect,
  resolutionInput: ActionResolutionInput,
): void {
  const targetPlayers = resolveTargetPlayerIds(
    ctx,
    cardPlayed,
    effect.target,
    getEffectTargetSelectionInput(effect.target, resolutionInput),
  );
  if (targetPlayers.length === 0) {
    return;
  }

  for (const playerId of targetPlayers) {
    const handCards = ctx.framework.zones.getCards({
      zone: "hand",
      playerId,
    }) as CardInstanceId[];

    if (handCards.length === 0) {
      continue;
    }

    ctx.framework.zones.reveal(handCards, "all");
    for (const cardId of handCards) {
      ctx.cards.patchMeta(cardId, { revealed: true });
    }
  }
}
