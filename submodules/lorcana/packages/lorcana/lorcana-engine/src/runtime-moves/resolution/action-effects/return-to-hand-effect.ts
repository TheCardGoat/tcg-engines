import type { CardInstanceId, PlayerId } from "#core";
import type { ReturnToHandEffect } from "@tcg/lorcana-types";
import type { CardPlayedPayload } from "../../../types";
import {
  emitTriggeredLorcanaEvent,
  snapshotTriggeredCandidatesForCard,
} from "../../../triggered-abilities";
import { moveCardOutOfPlayWithStack } from "../../state/shift-stack";
import { isDiscardZoneKey, recordDiscardExitThisTurn } from "../../state/turn-metrics";
import { isPlayZoneKey } from "../../../operations/zones";
import type { ActionResolutionInput, PlayCardExecutionContext } from "./types";
import { markLastEffectPerformed } from "./event-snapshot-utils";
import { sweepLethalDamageInPlay } from "../../state/lethal-damage-sweep";
import { resolveEffectTargets } from "../../../targeting/runtime";
import { getEffectTargetSelectionInput } from "./selection-state";
import { effectLogger } from "./effect-logger";

export function isReturnToHandEffect(effect: unknown): effect is ReturnToHandEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "return-to-hand"
  );
}

function moveCardToOwnerHand(
  ctx: PlayCardExecutionContext,
  cardId: CardInstanceId,
  fallbackPlayerId: PlayerId,
): void {
  const ownerId =
    (ctx.framework.zones.getCardOwner(cardId) as PlayerId | undefined) ?? fallbackPlayerId;
  const zoneKey = ctx.framework.zones.getCardZone(cardId);

  void effectLogger.debug`[return-to-hand] moveCardToOwnerHand — cardId=${cardId} ownerId=${ownerId} zoneKey=${String(zoneKey)}`;

  if (isPlayZoneKey(zoneKey)) {
    const triggerCandidates = snapshotTriggeredCandidatesForCard(ctx, cardId);
    moveCardOutOfPlayWithStack(ctx, cardId, {
      zone: "hand",
      playerId: ownerId,
    });

    emitTriggeredLorcanaEvent(
      ctx,
      "cardReturnedToHand",
      { cardId, ownerId, fromZone: zoneKey },
      {
        event: "return-to-hand",
        playerId: ownerId,
        subjectCardId: cardId,
        fromZone: zoneKey,
        triggerCandidates,
      },
    );
    return;
  }

  if (typeof zoneKey === "string" && isDiscardZoneKey(zoneKey)) {
    recordDiscardExitThisTurn(ctx);
  }

  ctx.framework.zones.moveCard(cardId, {
    zone: "hand",
    playerId: ownerId,
  });
}

export function resolveReturnToHandEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: ReturnToHandEffect,
  resolutionInput: ActionResolutionInput,
): void {
  const selectionInput = getEffectTargetSelectionInput(effect.target, resolutionInput);
  void effectLogger.debug`[return-to-hand] resolveReturnToHandEffect — sourceCardId=${cardPlayed.cardId} target=${effect.target}`;

  const resolvedTargets =
    resolveEffectTargets(
      ctx,
      cardPlayed,
      effect.target,
      selectionInput,
      resolutionInput.eventSnapshot,
    ) ?? [];

  void effectLogger.debug`[return-to-hand] resolvedTargets=${resolvedTargets}`;

  for (const targetId of resolvedTargets) {
    moveCardToOwnerHand(ctx, targetId, cardPlayed.playerId);
  }

  if (resolutionInput.eventSnapshot && resolvedTargets.length > 0) {
    resolutionInput.eventSnapshot.chosenCardId = resolvedTargets[0];
  }

  markLastEffectPerformed(resolutionInput.eventSnapshot, resolvedTargets.length > 0);

  // A card returned to hand may have been a source of continuous static abilities
  // (e.g. +Willpower aura). Re-check remaining cards for lethal damage.
  if (resolvedTargets.length > 0) {
    sweepLethalDamageInPlay(ctx, { reasonCardId: cardPlayed.cardId });
  }
}
