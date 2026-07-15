import type { CardInstanceId } from "#core";
import type { RevealUntilMatchEffect } from "@tcg/lorcana-types";
import type { CardPlayedPayload } from "../../../types";
import { markLastEffectPerformed } from "./event-snapshot-utils";
import { resolveTargetPlayerIds } from "./player-target-resolver";
import type { ActionResolutionInput, PlayCardExecutionContext } from "./types";

type CardDefinitionLike = {
  actionSubtype?: string;
  cardType?: string;
  classifications?: string[];
};

export function isRevealUntilMatchEffect(effect: unknown): effect is RevealUntilMatchEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "reveal-until-match"
  );
}

function matchesRevealFilter(
  ctx: PlayCardExecutionContext,
  cardId: CardInstanceId,
  effect: RevealUntilMatchEffect,
): boolean {
  const definition = ctx.cards.getDefinition(cardId) as CardDefinitionLike | undefined;
  if (!definition) {
    return false;
  }

  if (effect.cardType) {
    if (effect.cardType === "song") {
      if (definition.cardType !== "action" || definition.actionSubtype !== "song") {
        return false;
      }
    } else if (effect.cardType === "floodborn") {
      if (!(definition.classifications ?? []).includes("Floodborn")) {
        return false;
      }
    } else if (definition.cardType !== effect.cardType) {
      return false;
    }
  }

  if (
    effect.classification &&
    !(definition.classifications ?? []).includes(effect.classification)
  ) {
    return false;
  }

  return true;
}

export function resolveRevealUntilMatchEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: RevealUntilMatchEffect,
  resolutionInput: ActionResolutionInput,
): void {
  const targetPlayerIds = resolveTargetPlayerIds(
    ctx,
    cardPlayed,
    effect.target,
    resolutionInput.targets,
  );
  if (targetPlayerIds.length === 0) {
    return;
  }

  const revealedCardIds: CardInstanceId[] = [];
  let chosenCardId: CardInstanceId | undefined;

  for (const targetPlayerId of targetPlayerIds) {
    const deckCards = ctx.framework.zones.getCards({
      zone: "deck",
      playerId: targetPlayerId,
    }) as CardInstanceId[];

    let matchingCardId: CardInstanceId | undefined;

    for (let index = deckCards.length - 1; index >= 0; index -= 1) {
      const cardId = deckCards[index]!;
      revealedCardIds.push(cardId);
      ctx.framework.zones.reveal([cardId], "all");

      if (matchesRevealFilter(ctx, cardId, effect)) {
        matchingCardId = cardId;
        break;
      }
    }

    if (matchingCardId && effect.putInto === "hand") {
      ctx.framework.zones.moveCard(matchingCardId, {
        zone: "hand",
        playerId: targetPlayerId,
      });
      chosenCardId = matchingCardId;
    }

    if (effect.shuffle) {
      ctx.framework.zones.shuffle({
        zone: "deck",
        playerId: targetPlayerId,
      });
    }
  }

  resolutionInput.eventSnapshot ??= {};
  resolutionInput.eventSnapshot.revealedCardIds = revealedCardIds;
  if (chosenCardId) {
    resolutionInput.eventSnapshot.chosenCardId = chosenCardId;
  }
  markLastEffectPerformed(resolutionInput.eventSnapshot, revealedCardIds.length > 0);
}
