import type { CardInstanceId } from "#core";
import type { RevealTopCardEffect } from "@tcg/lorcana-types";
import type { CardPlayedPayload } from "../../../types";
import { createLorcanaLogProjection } from "../../../types";
import { resolveTargetPlayerIds } from "./player-target-resolver";
import type { ActionResolutionInput, PlayCardExecutionContext } from "./types";

export function isRevealTopCardEffect(effect: unknown): effect is RevealTopCardEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "reveal-top-card"
  );
}

export function resolveRevealTopCardEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: RevealTopCardEffect,
  resolutionInput: ActionResolutionInput,
): void {
  const targetPlayerIds = resolveTargetPlayerIds(
    ctx,
    cardPlayed,
    effect.target,
    resolutionInput.targets,
  );
  const revealedCardIds: CardInstanceId[] = [];

  for (const targetPlayerId of targetPlayerIds) {
    const deckCards = ctx.framework.zones.getCards({
      zone: "deck",
      playerId: targetPlayerId,
    }) as CardInstanceId[];
    const topCard = deckCards.at(-1);
    if (!topCard) {
      continue;
    }

    revealedCardIds.push(topCard);
    ctx.framework.zones.reveal([topCard], "all");

    ctx.framework.log(
      createLorcanaLogProjection(
        "lorcana.effect.resolve.revealTopCard",
        {
          playerId: cardPlayed.playerId,
          targetPlayerId,
          revealedCardId: topCard,
        },
        { mode: "PUBLIC" },
        "action",
      ),
    );
  }

  if (!resolutionInput.eventSnapshot) {
    resolutionInput.eventSnapshot = {};
  }

  resolutionInput.eventSnapshot.revealedCardIds = revealedCardIds;
  if (!resolutionInput.eventSnapshot.chosenCardId && resolutionInput.targets) {
    resolutionInput.eventSnapshot.chosenCardId = Array.isArray(resolutionInput.targets)
      ? (resolutionInput.targets.find(
          (targetId): targetId is CardInstanceId => typeof targetId === "string",
        ) ?? undefined)
      : (resolutionInput.targets as CardInstanceId);
  }
}
