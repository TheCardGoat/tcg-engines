import type { CardInstanceId } from "#core";
import type { RevealInkwellEffect } from "@tcg/lorcana-types";
import type { CardPlayedPayload } from "../../../types";
import type { ActionResolutionInput, PlayCardExecutionContext } from "./types";
import { createLorcanaGameLogEntry, createLorcanaLogMessage } from "../../../types";
import { resolveTargetPlayerIds } from "./player-target-resolver";
import { getEffectTargetSelectionInput } from "./selection-state";
import { markLastEffectPerformed } from "./event-snapshot-utils";

export function isRevealInkwellEffect(effect: unknown): effect is RevealInkwellEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "reveal-inkwell"
  );
}

export function resolveRevealInkwellEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: RevealInkwellEffect,
  resolutionInput: ActionResolutionInput,
): void {
  resolutionInput.eventSnapshot ??= {};
  markLastEffectPerformed(resolutionInput.eventSnapshot, false);
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
    const inkwellCards = ctx.framework.zones.getCards({
      zone: "inkwell",
      playerId,
    }) as CardInstanceId[];

    if (inkwellCards.length === 0) {
      continue;
    }

    // Private reveal: only the owner sees the card faces.
    ctx.framework.zones.reveal(inkwellCards, [playerId]);
    markLastEffectPerformed(resolutionInput.eventSnapshot, true);

    // Expose the revealed inkwell cards to downstream steps (e.g. a follow-up
    // put-in-hand with source "revealed").
    resolutionInput.eventSnapshot ??= {};
    resolutionInput.eventSnapshot.revealedCardIds = [
      ...(resolutionInput.eventSnapshot.revealedCardIds ?? []),
      ...inkwellCards,
    ];

    const visibility = {
      mode: "PUBLIC_WITH_OVERRIDES" as const,
      overrides: {
        [playerId]: createLorcanaLogMessage("lorcana.effect.lookAtInkwell.detail", {
          playerId,
          count: inkwellCards.length,
          cardIds: inkwellCards,
        }),
      },
    };
    ctx.framework.log({
      category: "rules",
      visibility,
      defaultMessage: createLorcanaLogMessage("lorcana.effect.lookAtInkwell", {
        playerId,
        count: inkwellCards.length,
      }),
      typedEntry: createLorcanaGameLogEntry(
        "lorcana.effect.lookAtInkwell",
        { playerId, count: inkwellCards.length },
        visibility,
        "rules",
      ),
    });
  }
}
