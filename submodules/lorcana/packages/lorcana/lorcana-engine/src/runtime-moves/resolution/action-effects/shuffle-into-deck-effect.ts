import type { CardInstanceId, PlayerId } from "#core";
import type { ShuffleIntoDeckEffect } from "@tcg/lorcana-types";
import type { CardPlayedPayload } from "../../../types";
import { moveCardOutOfPlayWithStack } from "../../state/shift-stack";
import type { ActionResolutionInput, PlayCardExecutionContext } from "./types";
import { resolveTargetPlayerIds } from "./player-target-resolver";
import { resolveEffectTargets } from "../../../targeting/runtime";
import { isDiscardZoneKey, recordDiscardExitThisTurn } from "../../state/turn-metrics";
import { isCardInPlayZone } from "../../../operations/zones";
import { markLastEffectPerformed } from "./event-snapshot-utils";

export function isShuffleIntoDeckEffect(effect: unknown): effect is ShuffleIntoDeckEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "shuffle-into-deck"
  );
}

function moveCardIntoDeck(
  ctx: PlayCardExecutionContext,
  cardId: CardInstanceId,
  deckPlayerId: PlayerId,
): void {
  if (isCardInPlayZone(ctx, cardId)) {
    moveCardOutOfPlayWithStack(ctx, cardId, {
      zone: "deck",
      playerId: deckPlayerId,
    });
    return;
  }

  ctx.framework.zones.moveCard(cardId, {
    zone: "deck",
    playerId: deckPlayerId,
  });
}

export function resolveShuffleIntoDeckEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: ShuffleIntoDeckEffect,
  resolutionInput: ActionResolutionInput,
): void {
  if (typeof effect.target === "string") {
    const targetPlayerIds = resolveTargetPlayerIds(ctx, cardPlayed, effect.target);
    if (targetPlayerIds.length > 0) {
      for (const playerId of targetPlayerIds) {
        ctx.framework.zones.shuffle({
          zone: "deck",
          playerId,
        });
      }
      return;
    }
  }

  const targets =
    resolveEffectTargets(ctx, cardPlayed, effect.target, resolutionInput.targets) ?? [];

  const shuffledPlayerIds = new Set<PlayerId>();

  if (targets.length === 0) {
    const defaultDeckOwner = cardPlayed.playerId;
    ctx.framework.zones.shuffle({
      zone: "deck",
      playerId: defaultDeckOwner,
    });
    return;
  }

  for (const targetId of targets) {
    const sourceZoneKey = ctx.framework.zones.getCardZone(targetId);
    const ownerId = ctx.framework.zones.getCardOwner(targetId) as PlayerId | undefined;
    const deckPlayerId =
      effect.intoDeck === "controller" ? cardPlayed.playerId : (ownerId ?? cardPlayed.playerId);

    moveCardIntoDeck(ctx, targetId, deckPlayerId);
    if (isDiscardZoneKey(sourceZoneKey)) {
      recordDiscardExitThisTurn(ctx);
    }
    shuffledPlayerIds.add(deckPlayerId);
  }

  for (const playerId of shuffledPlayerIds) {
    ctx.framework.zones.shuffle({
      zone: "deck",
      playerId,
    });
  }

  if (
    resolutionInput.eventSnapshot &&
    targets.length > 0 &&
    !resolutionInput.eventSnapshot.chosenCardId
  ) {
    resolutionInput.eventSnapshot.chosenCardId = targets[0];
  }

  // Mark whether this step actually performed so a downstream `if-you-do`
  // conditional in the same sequence (e.g. Chernabog — Unnatural Force's
  // "If you do, that player may play a character from their discard for free")
  // sees the prior step's outcome. Without this the conditional reads
  // `lastEffectPerformed: undefined` and silently skips its `then` branch.
  markLastEffectPerformed(resolutionInput.eventSnapshot, targets.length > 0);
}
