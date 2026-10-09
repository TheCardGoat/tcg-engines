import type { CardInstanceId } from "#core";
import type { RevealHandEffect } from "@tcg/lorcana-types";
import type { CardPlayedPayload } from "../../../types";
import type { ActionResolutionInput, PlayCardExecutionContext } from "./types";
import { resolveTargetPlayerIds } from "./player-target-resolver";
import { getEffectTargetSelectionInput } from "./selection-state";
import { markLastEffectPerformed } from "./event-snapshot-utils";

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
  resolutionInput.eventSnapshot ??= {};
  let revealedAnyCards = false;

  for (const playerId of targetPlayers) {
    const handCards = ctx.framework.zones.getCards({
      zone: "hand",
      playerId,
    }) as CardInstanceId[];

    if (handCards.length === 0) {
      continue;
    }

    const isPrivateLook = effect.visibility === "controller";
    ctx.framework.zones.reveal(handCards, isPrivateLook ? [cardPlayed.playerId] : "all");
    revealedAnyCards = true;
    if (!isPrivateLook) {
      for (const cardId of handCards) {
        ctx.cards.patchMeta(cardId, { revealed: true });
      }
    }
  }
  // A later sequence step may have no targets even though this reveal happened.
  markLastEffectPerformed(resolutionInput.eventSnapshot, revealedAnyCards);
}
