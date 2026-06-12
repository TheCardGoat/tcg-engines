import type { CardInstanceId, PlayerId } from "#core";
import type { PutOnBottomEffect } from "@tcg/lorcana-types";
import type { CardPlayedPayload } from "../../../types";
import { createLorcanaLogProjection } from "../../../types";
import { moveCardOutOfPlayWithStack } from "../../state/shift-stack";
import type { ActionResolutionInput, PlayCardExecutionContext } from "./types";
import { markLastEffectPerformed } from "./event-snapshot-utils";
import { normalizeSelectedTargets, resolveEffectTargets } from "../../../targeting/runtime";
import { getCurrentSelectionInput, getEffectTargetSelectionInput } from "./selection-state";
import { emitTriggeredLorcanaEvent } from "../../../triggered-abilities";
import { isDiscardZoneKey, recordDiscardExitThisTurn } from "../../state/turn-metrics";
import { isPlayZoneKey } from "../../../operations/zones";

export function isPutOnBottomEffect(effect: unknown): effect is PutOnBottomEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "put-on-bottom"
  );
}

function putCardOnBottomOfOwnerDeck(
  ctx: PlayCardExecutionContext,
  cardId: CardInstanceId,
  fallbackPlayerId: PlayerId,
): void {
  const ownerId =
    (ctx.framework.zones.getCardOwner(cardId) as PlayerId | undefined) ?? fallbackPlayerId;
  const zoneKey = ctx.framework.zones.getCardZone(cardId);
  const fromDiscard = typeof zoneKey === "string" && isDiscardZoneKey(zoneKey);

  if (isPlayZoneKey(zoneKey)) {
    moveCardOutOfPlayWithStack(
      ctx,
      cardId,
      {
        zone: "deck",
        playerId: ownerId,
      },
      {
        index: 0,
      },
    );
    emitTriggeredLorcanaEvent(
      ctx,
      "cardMoved",
      {
        cardId,
        fromZone: zoneKey,
        toZone: "deck-bottom",
        playerId: ownerId,
      },
      {
        event: "move",
        fromZone: zoneKey,
        toZone: "deck-bottom",
        playerId: ownerId,
        subjectCardId: cardId,
      },
    );
    return;
  }

  ctx.framework.zones.moveCard(
    cardId,
    {
      zone: "deck",
      playerId: ownerId,
    },
    {
      index: 0,
    },
  );
  emitTriggeredLorcanaEvent(
    ctx,
    "cardMoved",
    {
      cardId,
      fromZone: typeof zoneKey === "string" ? zoneKey : "unknown",
      toZone: "deck-bottom",
      playerId: ownerId,
    },
    {
      event: "move",
      fromZone: typeof zoneKey === "string" ? zoneKey : "unknown",
      toZone: "deck-bottom",
      playerId: ownerId,
      subjectCardId: cardId,
    },
  );

  if (fromDiscard) {
    recordDiscardExitThisTurn(ctx);
    emitTriggeredLorcanaEvent(
      ctx,
      "cardLeftDiscard",
      { cardId, ownerId, toZone: "deck" },
      {
        event: "leave-discard",
        playerId: ownerId,
        subjectCardId: cardId,
        fromZone: "discard",
        toZone: "deck",
      },
    );
  }
}

export function resolvePutOnBottomEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: PutOnBottomEffect,
  resolutionInput: ActionResolutionInput,
): void {
  const candidateTargets =
    resolveEffectTargets(
      ctx,
      cardPlayed,
      effect.target,
      getEffectTargetSelectionInput(effect.target, resolutionInput),
      resolutionInput.eventSnapshot,
    ) ?? [];
  const selectedTargets = normalizeSelectedTargets(getCurrentSelectionInput(resolutionInput)) ?? [];
  const resolvedTargets =
    effect.ordering === "player-choice" && selectedTargets.length === candidateTargets.length
      ? selectedTargets
      : candidateTargets;

  if (effect.ordering === "player-choice") {
    const targetsByOwner = new Map<PlayerId, CardInstanceId[]>();
    for (const targetId of resolvedTargets) {
      const ownerId =
        (ctx.framework.zones.getCardOwner(targetId) as PlayerId | undefined) ?? cardPlayed.playerId;
      const existing = targetsByOwner.get(ownerId) ?? [];
      existing.push(targetId);
      targetsByOwner.set(ownerId, existing);
    }

    for (const [ownerId, ownerTargets] of targetsByOwner.entries()) {
      for (const targetId of [...ownerTargets].reverse()) {
        putCardOnBottomOfOwnerDeck(ctx, targetId, ownerId);
      }
    }
  } else {
    for (const targetId of resolvedTargets) {
      putCardOnBottomOfOwnerDeck(ctx, targetId, cardPlayed.playerId);
    }
  }

  markLastEffectPerformed(resolutionInput.eventSnapshot, resolvedTargets.length > 0);

  // Track how many cards were moved for downstream effects (e.g., "gain 1 lore for each")
  if (resolutionInput.eventSnapshot) {
    resolutionInput.eventSnapshot.lastEffectTargetCount = resolvedTargets.length;
    if (resolvedTargets.length > 0) {
      resolutionInput.eventSnapshot.triggerAmount = resolvedTargets.length;
    }
  }

  // Log when a previously-revealed card is automatically put on the bottom (non-interactive path,
  // e.g. Daisy Duck's BIG PRIZE else branch for non-character reveals).
  const revealedCardIds = resolutionInput.eventSnapshot?.revealedCardIds;
  if (revealedCardIds && revealedCardIds.length > 0) {
    for (const targetId of resolvedTargets) {
      if (revealedCardIds.includes(targetId)) {
        const targetPlayerId =
          (ctx.framework.zones.getCardOwner(targetId) as PlayerId | undefined) ??
          cardPlayed.playerId;
        ctx.framework.log(
          createLorcanaLogProjection(
            "lorcana.effect.resolve.revealTopCard.autoBottom",
            {
              playerId: cardPlayed.playerId,
              targetPlayerId,
              revealedCardId: targetId,
            },
            { mode: "PUBLIC" },
            "action",
          ),
        );
      }
    }
  }
}
