import type { CountEffect, InkType } from "@tcg/lorcana-types";
import type { CardInstanceId } from "#core";
import type { CardPlayedPayload } from "../../../types";
import type { ActionResolutionInput, PlayCardExecutionContext } from "./types";
import { markLastEffectPerformed } from "./event-snapshot-utils";

type InkedCardLike = {
  inkType?: InkType[];
};

type CardTypeLike = {
  cardType?: string;
};

export function isCountEffect(effect: unknown): effect is CountEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "count"
  );
}

export function resolveCountEffect(
  ctx: PlayCardExecutionContext,
  _cardPlayed: CardPlayedPayload,
  effect: CountEffect,
  resolutionInput: ActionResolutionInput,
): void {
  if (!resolutionInput.eventSnapshot) {
    resolutionInput.eventSnapshot = {};
  }

  const multiplier =
    typeof (effect as { multiplier?: unknown }).multiplier === "number"
      ? ((effect as { multiplier?: number }).multiplier as number)
      : 1;

  if (effect.what === "distinct-revealed-ink-types") {
    const revealedCardIds =
      (resolutionInput.eventSnapshot.revealedCardIds as CardInstanceId[] | undefined) ?? [];
    const distinctInkTypes = new Set<InkType>();

    for (const cardId of revealedCardIds) {
      const definition = ctx.cards.getDefinition(cardId) as InkedCardLike | undefined;
      for (const inkType of definition?.inkType ?? []) {
        distinctInkTypes.add(inkType);
      }
    }

    resolutionInput.eventSnapshot.triggerAmount = distinctInkTypes.size * multiplier;
    markLastEffectPerformed(resolutionInput.eventSnapshot, distinctInkTypes.size > 0);
    return;
  }

  if (effect.what === "discarded-action-cards") {
    const discardedCardIds =
      (resolutionInput.eventSnapshot.discardedCardIds as CardInstanceId[] | undefined) ?? [];
    let actionCount = 0;

    for (const cardId of discardedCardIds) {
      const definition = ctx.cards.getDefinition(cardId) as CardTypeLike | undefined;
      if (definition?.cardType === "action") {
        actionCount += 1;
      }
    }

    resolutionInput.eventSnapshot.triggerAmount = actionCount * multiplier;
    markLastEffectPerformed(resolutionInput.eventSnapshot, actionCount > 0);
    return;
  }

  resolutionInput.eventSnapshot.triggerAmount = 0;
  markLastEffectPerformed(resolutionInput.eventSnapshot, false);
}
