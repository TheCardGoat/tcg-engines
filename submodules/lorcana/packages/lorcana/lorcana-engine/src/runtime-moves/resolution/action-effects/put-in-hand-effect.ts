import type { CardInstanceId } from "#core";
import type { CardPlayedPayload } from "../../../types";
import { resolveTargetPlayerIds } from "./player-target-resolver";
import type { ActionResolutionInput, PlayCardExecutionContext } from "./types";
import { isDiscardZoneKey, recordDiscardExitThisTurn } from "../../state/turn-metrics";

export interface PutInHandEffectLike {
  type: "put-in-hand";
  source: "deck" | "discard" | "revealed";
  target?: Parameters<typeof resolveTargetPlayerIds>[2];
}

export function isPutInHandEffect(effect: unknown): effect is PutInHandEffectLike {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "put-in-hand"
  );
}

function normalizeSelectedTargets(targets: ActionResolutionInput["targets"]): CardInstanceId[] {
  if (!targets) {
    return [];
  }

  if (Array.isArray(targets)) {
    return [
      ...new Set(
        targets.filter((targetId): targetId is CardInstanceId => typeof targetId === "string"),
      ),
    ];
  }

  return typeof targets === "string" ? [targets as CardInstanceId] : [];
}

function resolveSourceCards(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: PutInHandEffectLike,
  resolutionInput: ActionResolutionInput,
): CardInstanceId[] {
  const selectedTargets = normalizeSelectedTargets(resolutionInput.targets);

  if (effect.source === "revealed") {
    const revealedCards =
      (resolutionInput.eventSnapshot?.revealedCardIds as CardInstanceId[] | undefined) ?? [];
    if (selectedTargets.length > 0) {
      const revealedSet = new Set(revealedCards);
      return selectedTargets.filter((cardId) => revealedSet.has(cardId));
    }
    return revealedCards;
  }

  const sourceZone = effect.source;
  const sourceCards = ctx.framework.zones.getCards({
    zone: sourceZone,
    playerId: cardPlayed.playerId,
  }) as CardInstanceId[];
  if (selectedTargets.length > 0) {
    const sourceSet = new Set(sourceCards);
    const selectedInSource = selectedTargets.filter((cardId) => sourceSet.has(cardId));
    if (selectedInSource.length > 0) {
      return selectedInSource;
    }
  }

  return sourceCards;
}

export function resolvePutInHandEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: PutInHandEffectLike,
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

  const sourceCards = resolveSourceCards(ctx, cardPlayed, effect, resolutionInput);
  if (sourceCards.length === 0) {
    return;
  }

  const chosenCardId = sourceCards[sourceCards.length - 1]!;
  const sourceZoneKey = ctx.framework.zones.getCardZone(chosenCardId);

  for (const targetPlayerId of targetPlayerIds) {
    ctx.framework.zones.moveCard(chosenCardId, {
      zone: "hand",
      playerId: targetPlayerId,
    });
  }
  if (isDiscardZoneKey(sourceZoneKey)) {
    recordDiscardExitThisTurn(ctx);
  }

  if (resolutionInput.eventSnapshot) {
    resolutionInput.eventSnapshot.chosenCardId = chosenCardId;
  }
}
