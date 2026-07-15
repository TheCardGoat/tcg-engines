import type { CardInstanceId, PlayerId } from "#core";
import type { MoveCardsFromUnderEffect } from "@tcg/lorcana-types";
import type { CardPlayedPayload } from "../../../types";
import type { LorcanaCardMeta } from "../../../types";
import type { ActionResolutionInput, PlayCardExecutionContext } from "./types";
import { emitTriggeredLorcanaEvent } from "../../effects/triggered-abilities";
import {
  recordCardPutIntoInkwellThisTurn,
  recordCardPutUnderThisTurn,
} from "../../state/turn-metrics";
import {
  normalizeSelectedTargets,
  resolveCardParentId,
  resolveEffectTargets,
} from "../../../targeting/runtime";

export function isMoveCardsFromUnderEffect(effect: unknown): effect is MoveCardsFromUnderEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "move-cards-from-under"
  );
}

function shuffleCards<T>(cards: T[]): T[] {
  const shuffled = [...cards];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const current = shuffled[index]!;
    shuffled[index] = shuffled[swapIndex]!;
    shuffled[swapIndex] = current;
  }
  return shuffled;
}

function removeUnderCardFromParent(
  ctx: PlayCardExecutionContext,
  parentId: CardInstanceId,
  childId: CardInstanceId,
): void {
  const parentMeta = (ctx.cards.require(parentId).meta ?? {}) as LorcanaCardMeta;
  const cardsUnder = Array.isArray(parentMeta.cardsUnder)
    ? parentMeta.cardsUnder.filter((cardId) => cardId !== childId)
    : [];

  ctx.cards.patchMeta(parentId, {
    cardsUnder: cardsUnder.length > 0 ? cardsUnder : undefined,
  });
}

function appendCardUnderTarget(
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

function moveUnderCard(
  ctx: PlayCardExecutionContext,
  cardId: CardInstanceId,
  destination: NonNullable<MoveCardsFromUnderEffect["destination"]>,
  underTargetId?: CardInstanceId,
  playerId?: PlayerId,
): void {
  const ownerId = (ctx.framework.zones.getCardOwner(cardId) as PlayerId | undefined) ?? undefined;
  if (!ownerId) {
    return;
  }

  switch (destination) {
    case "inkwell-facedown-exerted": {
      const sourceZoneKey = ctx.framework.zones.getCardZone(cardId);
      ctx.framework.zones.moveCard(cardId, {
        zone: "inkwell",
        playerId: ownerId,
      });
      recordCardPutIntoInkwellThisTurn(ctx, cardId);
      ctx.cards.patchMeta(cardId, {
        stackParentId: undefined,
        state: "exerted",
        publicFaceState: "faceDown",
      });
      emitTriggeredLorcanaEvent(
        ctx,
        "cardInked",
        {
          playerId: ownerId,
          cardId,
          from: sourceZoneKey ?? "unknown",
          to: `inkwell:${ownerId}`,
          exerted: true,
          private: false,
        },
        {
          event: "ink",
          playerId: ownerId,
          subjectCardId: cardId,
          fromZone: sourceZoneKey,
        },
      );
      return;
    }
    case "hand":
      ctx.framework.zones.moveCard(cardId, {
        zone: "hand",
        playerId: ownerId,
      });
      ctx.cards.patchMeta(cardId, {
        stackParentId: undefined,
        state: undefined,
        publicFaceState: undefined,
      });
      return;
    case "under-chosen":
      if (underTargetId) {
        ctx.framework.zones.moveCard(cardId, {
          zone: "limbo",
          playerId: ownerId,
        });
        appendCardUnderTarget(ctx, underTargetId, cardId);
        ctx.cards.patchMeta(cardId, {
          stackParentId: underTargetId,
          cardsUnder: undefined,
          state: undefined,
          damage: undefined,
          isDrying: undefined,
          publicFaceState: undefined,
          atLocationId: undefined,
          playedViaShift: undefined,
          playedCostType: undefined,
        });
        if (playerId) {
          recordCardPutUnderThisTurn(ctx, underTargetId, cardId);
          emitTriggeredLorcanaEvent(
            ctx,
            "putCardUnder",
            { playerId, cardId, targetId: underTargetId },
            {
              event: "put-card-under",
              playerId,
              subjectCardId: underTargetId,
              triggerSourceCardId: cardId,
            },
          );
        }
      }
      return;
    case "deck-bottom-random":
    default:
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
      ctx.cards.patchMeta(cardId, {
        stackParentId: undefined,
        state: undefined,
        publicFaceState: undefined,
      });
  }
}

function resolveSourceCardIds(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: MoveCardsFromUnderEffect,
  resolutionInput: ActionResolutionInput,
): CardInstanceId[] {
  if (effect.source === "selected") {
    return (
      normalizeSelectedTargets(resolutionInput.targets) ??
      resolveEffectTargets(ctx, cardPlayed, effect.target, resolutionInput.targets) ??
      []
    );
  }

  if (effect.source === "snapshot-cards-under") {
    const snapshotIds = resolutionInput.eventSnapshot?.cardsUnderIdsBeforeBanish;
    return Array.isArray(snapshotIds) ? ([...snapshotIds] as CardInstanceId[]) : [];
  }

  const parentIds =
    resolveEffectTargets(ctx, cardPlayed, effect.target, resolutionInput.targets) ?? [];
  return parentIds.flatMap((parentId) => {
    const parentMeta = ctx.cards.require(parentId).meta;
    return Array.isArray(parentMeta?.cardsUnder) ? [...parentMeta.cardsUnder] : [];
  });
}

export function resolveMoveCardsFromUnderEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: MoveCardsFromUnderEffect,
  resolutionInput: ActionResolutionInput,
): void {
  const destination = effect.destination ?? "deck-bottom-random";
  const sourceCardIds = resolveSourceCardIds(ctx, cardPlayed, effect, resolutionInput);
  const uniqueSourceCardIds = [...new Set(sourceCardIds)];
  const cardsToMove =
    destination === "deck-bottom-random" ? shuffleCards(uniqueSourceCardIds) : uniqueSourceCardIds;

  // For "under-chosen" destination, resolve the target from resolution input
  let underTargetId: CardInstanceId | undefined;
  if (destination === "under-chosen") {
    const targets = normalizeSelectedTargets(resolutionInput.targets);
    underTargetId = targets?.[0];
    if (!underTargetId) {
      // Try resolving from the underTarget definition
      const resolved = effect.underTarget
        ? resolveEffectTargets(ctx, cardPlayed, effect.underTarget, resolutionInput.targets)
        : undefined;
      underTargetId = resolved?.[0];
    }
    if (!underTargetId) {
      return;
    }
  }

  for (const cardId of cardsToMove) {
    if (destination === "under-chosen") {
      // Cards from snapshot are already in discard — no parent to remove from
      if (effect.source !== "snapshot-cards-under") {
        const parentId = resolveCardParentId(ctx, cardId);
        if (parentId) {
          removeUnderCardFromParent(ctx, parentId, cardId);
        }
      }
      moveUnderCard(ctx, cardId, destination, underTargetId, cardPlayed.playerId);
    } else {
      const parentId = resolveCardParentId(ctx, cardId);
      if (!parentId) {
        continue;
      }

      removeUnderCardFromParent(ctx, parentId, cardId);
      moveUnderCard(ctx, cardId, destination);
    }
  }
}
