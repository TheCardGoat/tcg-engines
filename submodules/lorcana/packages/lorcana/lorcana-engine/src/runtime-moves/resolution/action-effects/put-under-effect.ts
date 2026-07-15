import type { CardInstanceId, PlayerId } from "#core";
import type { PutUnderEffect } from "@tcg/lorcana-types";
import type { CardPlayedPayload } from "../../../types";
import type { LorcanaCardMeta } from "../../../types";
import type { ActionResolutionInput, PlayCardExecutionContext } from "./types";
import { resolveEffectTargets } from "../../../targeting/runtime";
import { markLastEffectPerformed } from "./event-snapshot-utils";
import { emitTriggeredLorcanaEvent } from "../../effects/triggered-abilities";
import { recordCardPutUnderThisTurn, recordDiscardExitThisTurn } from "../../state/turn-metrics";
import { getEffectTargetSelectionInput } from "./selection-state";

export function isPutUnderEffect(effect: unknown): effect is PutUnderEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "put-under"
  );
}

function removeUnderCardFromPreviousParent(
  ctx: PlayCardExecutionContext,
  cardId: CardInstanceId,
): void {
  const previousParentId = ctx.cards.require(cardId).meta?.stackParentId as
    | CardInstanceId
    | undefined;
  if (!previousParentId) {
    return;
  }

  const previousParentMeta = (ctx.cards.require(previousParentId).meta ?? {}) as LorcanaCardMeta;
  const previousCardsUnder = Array.isArray(previousParentMeta.cardsUnder)
    ? previousParentMeta.cardsUnder.filter((underCardId) => underCardId !== cardId)
    : [];

  ctx.cards.patchMeta(previousParentId, {
    cardsUnder: previousCardsUnder.length > 0 ? previousCardsUnder : undefined,
  });
}

function appendCardUnderParent(
  ctx: PlayCardExecutionContext,
  parentId: CardInstanceId,
  childId: CardInstanceId,
): void {
  const parentMeta = (ctx.cards.require(parentId).meta ?? {}) as LorcanaCardMeta;
  const cardsUnder = Array.isArray(parentMeta.cardsUnder) ? [...parentMeta.cardsUnder] : [];
  if (!cardsUnder.includes(childId)) {
    cardsUnder.push(childId);
  }

  ctx.cards.patchMeta(parentId, {
    cardsUnder,
  });
}

function moveTopDeckCardUnderTarget(
  ctx: PlayCardExecutionContext,
  ownerId: PlayerId,
  targetId: CardInstanceId,
  faceup?: boolean,
): CardInstanceId | undefined {
  const deckCards = ctx.framework.zones.getCards({
    zone: "deck",
    playerId: ownerId,
  }) as CardInstanceId[];
  const topDeckCardId = deckCards.at(-1);
  if (!topDeckCardId) {
    return undefined;
  }

  removeUnderCardFromPreviousParent(ctx, topDeckCardId);
  ctx.framework.zones.moveCard(topDeckCardId, {
    zone: "limbo",
    playerId: ownerId,
  });
  appendCardUnderParent(ctx, targetId, topDeckCardId);
  ctx.cards.patchMeta(topDeckCardId, {
    stackParentId: targetId,
    cardsUnder: undefined,
    state: undefined,
    damage: undefined,
    isDrying: undefined,
    publicFaceState: faceup ? "faceUp" : undefined,
    atLocationId: undefined,
    playedViaShift: undefined,
    playedCostType: undefined,
  });

  return topDeckCardId;
}

function moveDiscardCardUnderTarget(
  ctx: PlayCardExecutionContext,
  cardId: CardInstanceId,
  ownerId: PlayerId,
  targetId: CardInstanceId,
  faceup?: boolean,
): boolean {
  const discardCards = ctx.framework.zones.getCards({
    zone: "discard",
    playerId: ownerId,
  }) as CardInstanceId[];
  if (!discardCards.includes(cardId)) {
    return false;
  }

  removeUnderCardFromPreviousParent(ctx, cardId);
  ctx.framework.zones.moveCard(cardId, {
    zone: "limbo",
    playerId: ownerId,
  });
  appendCardUnderParent(ctx, targetId, cardId);
  ctx.cards.patchMeta(cardId, {
    stackParentId: targetId,
    cardsUnder: undefined,
    state: undefined,
    damage: undefined,
    isDrying: undefined,
    publicFaceState: faceup ? "faceUp" : undefined,
    atLocationId: undefined,
    playedViaShift: undefined,
    playedCostType: undefined,
  });

  return true;
}

function moveThisCardUnderTarget(
  ctx: PlayCardExecutionContext,
  cardId: CardInstanceId,
  targetId: CardInstanceId,
  faceup?: boolean,
): boolean {
  const currentZone = ctx.framework.zones.getCardZone(cardId);
  if (!currentZone?.startsWith("play")) {
    return false;
  }

  removeUnderCardFromPreviousParent(ctx, cardId);
  ctx.framework.zones.moveCard(cardId, {
    zone: "limbo",
    playerId: ctx.framework.zones.getCardOwner(cardId) as PlayerId,
  });
  appendCardUnderParent(ctx, targetId, cardId);
  ctx.cards.patchMeta(cardId, {
    stackParentId: targetId,
    cardsUnder: undefined,
    state: undefined,
    damage: undefined,
    isDrying: undefined,
    publicFaceState: faceup ? "faceUp" : undefined,
    atLocationId: undefined,
    playedViaShift: undefined,
    playedCostType: undefined,
  });

  return true;
}

export function resolvePutUnderEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: PutUnderEffect,
  resolutionInput: ActionResolutionInput,
): void {
  const selectionInput = getEffectTargetSelectionInput(effect.under, resolutionInput);

  const underTarget =
    effect.under === "self"
      ? [cardPlayed.cardId]
      : (resolveEffectTargets(
          ctx,
          cardPlayed,
          effect.under,
          selectionInput,
          resolutionInput.eventSnapshot,
        ) ?? []);

  // For top-of-deck: put one card under EACH target (sequential top-card grabs)
  if (effect.source === "top-of-deck" && underTarget.length > 1) {
    let anyMoved = false;
    for (const tid of underTarget) {
      const ownerId =
        (ctx.framework.zones.getCardOwner(tid) as PlayerId | undefined) ?? cardPlayed.playerId;
      if (!ownerId) continue;
      const topCardId = moveTopDeckCardUnderTarget(ctx, ownerId, tid, effect.faceup);
      if (!topCardId) continue;
      recordCardPutUnderThisTurn(ctx, tid, topCardId);
      emitTriggeredLorcanaEvent(
        ctx,
        "putCardUnder",
        { playerId: cardPlayed.playerId, cardId: topCardId, targetId: tid },
        {
          event: "put-card-under",
          playerId: cardPlayed.playerId,
          subjectCardId: tid,
          triggerSourceCardId: topCardId,
        },
      );
      anyMoved = true;
    }
    markLastEffectPerformed(resolutionInput.eventSnapshot, anyMoved);
    return;
  }

  const targetId = underTarget[0];
  if (!targetId) {
    markLastEffectPerformed(resolutionInput.eventSnapshot, false);
    return;
  }

  const ownerId =
    (ctx.framework.zones.getCardOwner(targetId) as PlayerId | undefined) ?? cardPlayed.playerId;
  if (!ownerId) {
    markLastEffectPerformed(resolutionInput.eventSnapshot, false);
    return;
  }

  let movedCardId: CardInstanceId | undefined;

  if (effect.source === "this-card") {
    const moved = moveThisCardUnderTarget(ctx, cardPlayed.cardId, targetId, effect.faceup);
    if (moved) {
      movedCardId = cardPlayed.cardId;
    }
  } else if (effect.source === "top-of-deck") {
    movedCardId = moveTopDeckCardUnderTarget(ctx, ownerId, targetId, effect.faceup);
  } else if (effect.source === "discard") {
    const selectedTargets = resolutionInput.targets;
    const selectedCardId = Array.isArray(selectedTargets)
      ? (selectedTargets[0] as CardInstanceId | undefined)
      : typeof selectedTargets === "string"
        ? (selectedTargets as CardInstanceId)
        : undefined;
    if (selectedCardId) {
      if (effect.cardType) {
        const definition = ctx.cards.getDefinition(selectedCardId) as
          | { cardType?: string }
          | undefined;
        if (definition?.cardType !== effect.cardType) {
          return;
        }
      }
      const moved = moveDiscardCardUnderTarget(
        ctx,
        selectedCardId,
        ownerId,
        targetId,
        effect.faceup,
      );
      if (moved) {
        movedCardId = selectedCardId;
        recordDiscardExitThisTurn(ctx);
      }
    }
  }

  if (movedCardId) {
    recordCardPutUnderThisTurn(ctx, targetId, movedCardId);

    emitTriggeredLorcanaEvent(
      ctx,
      "putCardUnder",
      { playerId: cardPlayed.playerId, cardId: movedCardId, targetId },
      {
        event: "put-card-under",
        playerId: cardPlayed.playerId,
        subjectCardId: targetId,
        triggerSourceCardId: movedCardId,
      },
    );
  }
  markLastEffectPerformed(resolutionInput.eventSnapshot, !!movedCardId);
}
