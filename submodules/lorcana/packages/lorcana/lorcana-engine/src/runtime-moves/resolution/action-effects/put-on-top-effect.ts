import type { CardInstanceId, PlayerId } from "#core";
import type { PutOnTopEffect } from "@tcg/lorcana-types";
import type { CardPlayedPayload } from "../../../types";
import { moveCardOutOfPlayWithStack } from "../../state/shift-stack";
import { isCardInPlayZone } from "../../../operations/zones";
import type { ActionResolutionInput, PlayCardExecutionContext } from "./types";
import { markLastEffectPerformed } from "./event-snapshot-utils";
import { normalizeSelectedTargets, resolveEffectTargets } from "../../../targeting/runtime";
import { getCurrentSelectionInput, getEffectTargetSelectionInput } from "./selection-state";

export function isPutOnTopEffect(effect: unknown): effect is PutOnTopEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "put-on-top"
  );
}

function moveCardToTopOfOwnerDeck(
  ctx: PlayCardExecutionContext,
  cardId: CardInstanceId,
  fallbackPlayerId: PlayerId,
): void {
  const ownerId =
    (ctx.framework.zones.getCardOwner(cardId) as PlayerId | undefined) ?? fallbackPlayerId;
  if (isCardInPlayZone(ctx, cardId)) {
    moveCardOutOfPlayWithStack(ctx, cardId, {
      zone: "deck",
      playerId: ownerId,
    });
    return;
  }

  ctx.framework.zones.moveCard(cardId, {
    zone: "deck",
    playerId: ownerId,
  });
}

function resolveSourceCards(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: PutOnTopEffect,
  resolutionInput: ActionResolutionInput,
): CardInstanceId[] {
  // Newer `target` path mirrors PutOnBottomEffect: resolve via the standard
  // targeting runtime so `chosenBy`/`chooser` and explicit selectors work.
  if (effect.target) {
    const candidateTargets =
      resolveEffectTargets(
        ctx,
        cardPlayed,
        effect.target,
        getEffectTargetSelectionInput(effect.target, resolutionInput),
        resolutionInput.eventSnapshot,
      ) ?? [];
    const selectedForOrdering =
      normalizeSelectedTargets(getCurrentSelectionInput(resolutionInput)) ?? [];
    return effect.ordering === "player-choice" &&
      selectedForOrdering.length === candidateTargets.length
      ? selectedForOrdering
      : candidateTargets;
  }

  const selectedTargets = normalizeSelectedTargets(resolutionInput.targets) ?? [];

  if (effect.source === "revealed") {
    const revealedCards =
      (resolutionInput.eventSnapshot?.revealedCardIds as CardInstanceId[] | undefined) ?? [];
    if (selectedTargets.length === 0) {
      return revealedCards;
    }

    const revealedSet = new Set(revealedCards);
    return selectedTargets.filter((cardId) => revealedSet.has(cardId));
  }

  if (effect.source) {
    const resolvedTargets =
      resolveEffectTargets(ctx, cardPlayed, effect.source, resolutionInput.targets) ?? [];
    if (selectedTargets.length === 0) {
      return resolvedTargets;
    }

    const sourceSet = new Set(resolvedTargets);
    return selectedTargets.filter((cardId) => sourceSet.has(cardId));
  }

  return selectedTargets;
}

export function resolvePutOnTopEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: PutOnTopEffect,
  resolutionInput: ActionResolutionInput,
): void {
  const sourceCards = resolveSourceCards(ctx, cardPlayed, effect, resolutionInput);

  for (const cardId of sourceCards) {
    moveCardToTopOfOwnerDeck(ctx, cardId, cardPlayed.playerId);
  }

  markLastEffectPerformed(resolutionInput.eventSnapshot, sourceCards.length > 0);
}
