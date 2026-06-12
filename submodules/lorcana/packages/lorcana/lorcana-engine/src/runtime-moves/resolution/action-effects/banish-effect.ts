import type { CardInstanceId, BaseCardDefinition } from "#core";
import { isClassification, type BanishEffect, type LorcanaCard } from "@tcg/lorcana-types";
import type { PlayerId } from "#core";
import { moveCardOutOfPlayWithStack, getCharacterIdsAtLocation } from "../../state/shift-stack";
import { type CardPlayedPayload } from "../../../types";
import type { DynamicAmountEventSnapshot } from "../../../types/domain-events";
import type { PlayCardExecutionContext } from "./types";
import { effectLogger } from "./effect-logger";
import { markLastEffectPerformed } from "./event-snapshot-utils";
import { recordBanishedCharacterThisTurn } from "../../state/turn-metrics";
import {
  emitTriggeredLorcanaEvent,
  snapshotTriggeredCandidatesForCard,
  snapshotBoardTriggerCandidates,
} from "../../effects/triggered-abilities";
import { createProjectionState, getEffectiveStrength } from "../../../rules/derived-state";
import { projectLorcanaCardDerived } from "../../../projection/card-derived";
import { getKeywordsBeforeBanish } from "../../shared/banish-snapshot";
import { getOrBuildMoveRegistry } from "../../rules/move-registry-cache";
import { sweepLethalDamageInPlay } from "../../state/lethal-damage-sweep";

type ResolvedBanishEffectInput = {
  eventSnapshot?: DynamicAmountEventSnapshot;
  targets: CardInstanceId[];
};

export function isBanishEffect(effect: unknown): effect is BanishEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "banish"
  );
}

export function resolveBanishEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  _effect: BanishEffect,
  resolvedInput: ResolvedBanishEffectInput,
): void {
  const derivedState = createProjectionState(ctx.framework.state, ctx.G);
  const registry = getOrBuildMoveRegistry(ctx);
  let banishedAny = false;
  let banishedCount = 0;

  // Snapshot all board-level trigger candidates BEFORE any cards are moved.
  // This ensures observer triggers (e.g. "whenever one of your other characters
  // is banished") are captured while the observers are still in play.
  const boardCandidatesSnapshot =
    resolvedInput.targets.length > 1 ? snapshotBoardTriggerCandidates(ctx) : undefined;

  for (const targetId of resolvedInput.targets) {
    const ownerId = ctx.framework.zones.getCardOwner(targetId) as PlayerId | undefined;
    if (!ownerId) {
      effectLogger.fatal(`Target card ${targetId} not found in card index`);
      continue;
    }

    const targetMeta = ctx.cards.require(targetId).meta ?? {};
    const cardsUnderCountBeforeBanish = Array.isArray(targetMeta.cardsUnder)
      ? targetMeta.cardsUnder.length
      : 0;
    const subjectAtLocationId = targetMeta.atLocationId as CardInstanceId | undefined;
    const targetDefinition = ctx.cards.getDefinition(targetId);
    const targetDefAsLorcana = targetDefinition as
      | (BaseCardDefinition & Partial<LorcanaCard>)
      | undefined;
    const targetCost =
      typeof targetDefAsLorcana?.cost === "number" && Number.isFinite(targetDefAsLorcana.cost)
        ? targetDefAsLorcana.cost
        : undefined;
    const projected = targetDefinition
      ? projectLorcanaCardDerived({
          definition: targetDefinition,
          meta: targetMeta,
          state: derivedState,
          cardInstanceId: targetId,
          ownerID: ownerId,
          controllerID: ((ctx.framework.zones.getCardController(targetId) as
            | PlayerId
            | undefined) ?? ownerId) as PlayerId,
          zoneID: ctx.framework.zones.getCardZone(targetId),
          actorPlayerId: cardPlayed.playerId,
          getDefinitionByInstanceId: (id) => ctx.cards.getDefinition(id),
          registry,
        })
      : undefined;
    const classificationsBeforeBanish = projected?.classifications?.filter(isClassification);
    const keywordsBeforeBanish = getKeywordsBeforeBanish(ctx, targetId, cardPlayed.playerId);
    const strengthBeforeBanish =
      targetDefAsLorcana?.cardType === "character"
        ? getEffectiveStrength(
            targetDefinition as any,
            derivedState,
            targetId,
            (id) => ctx.cards.getDefinition(id) as any,
            registry,
          )
        : undefined;

    resolvedInput.eventSnapshot ??= {};
    if (!resolvedInput.eventSnapshot.chosenCardId) {
      resolvedInput.eventSnapshot.chosenCardId = targetId;
    }
    if (
      resolvedInput.eventSnapshot.chosenCardCost === undefined &&
      typeof targetCost === "number"
    ) {
      resolvedInput.eventSnapshot.chosenCardCost = targetCost;
    }
    resolvedInput.eventSnapshot.cardsUnderCountBeforeBanish =
      (resolvedInput.eventSnapshot.cardsUnderCountBeforeBanish ?? 0) + cardsUnderCountBeforeBanish;
    if (typeof strengthBeforeBanish === "number" && Number.isFinite(strengthBeforeBanish)) {
      resolvedInput.eventSnapshot.strengthBeforeBanish =
        (resolvedInput.eventSnapshot.strengthBeforeBanish ?? 0) + strengthBeforeBanish;
    }
    if (Array.isArray(classificationsBeforeBanish) && classificationsBeforeBanish.length > 0) {
      resolvedInput.eventSnapshot.classificationsBeforeBanish = [...classificationsBeforeBanish];
    }
    if (Array.isArray(keywordsBeforeBanish) && keywordsBeforeBanish.length > 0) {
      resolvedInput.eventSnapshot.keywordsBeforeBanish = [...keywordsBeforeBanish];
    }

    const cardTriggerCandidates = snapshotTriggeredCandidatesForCard(ctx, targetId);
    const triggerCandidates = boardCandidatesSnapshot
      ? [...cardTriggerCandidates, ...boardCandidatesSnapshot]
      : cardTriggerCandidates;
    const charsAtLocation =
      targetDefAsLorcana?.cardType === "location"
        ? getCharacterIdsAtLocation(ctx, targetId)
        : undefined;
    moveCardOutOfPlayWithStack(ctx, targetId, {
      zone: "discard",
      playerId: ownerId,
    });
    emitTriggeredLorcanaEvent(
      ctx,
      "cardBanished",
      {
        cardId: targetId,
        sourceId: cardPlayed.cardId,
        snapshot: {
          cardsUnderCountBeforeBanish,
          classificationsBeforeBanish,
          keywordsBeforeBanish,
          strengthBeforeBanish,
          subjectAtLocationId,
        },
        reason: "banish effect",
      },
      {
        event: "banish",
        happenedInChallenge: Boolean(ctx.G.challengeState),
        playerId: ownerId,
        subjectCardId: targetId,
        triggerSourceCardId: targetId,
        triggerCandidates,
        eventSnapshot: {
          cardsUnderCountBeforeBanish,
          strengthBeforeBanish,
          classificationsBeforeBanish,
          keywordsBeforeBanish,
          subjectAtLocationId,
          charactersAtSourceLocationBeforeBanish: charsAtLocation,
        },
      },
    );
    recordBanishedCharacterThisTurn(ctx, targetId);
    banishedAny = true;
    banishedCount += 1;
  }

  if (resolvedInput.eventSnapshot) {
    resolvedInput.eventSnapshot.triggerAmount = banishedCount;
  }

  markLastEffectPerformed(resolvedInput.eventSnapshot, banishedAny);

  // A banished card may have been a source of continuous static abilities
  // (e.g. +Willpower aura). Re-check all remaining cards for lethal damage.
  if (banishedAny) {
    sweepLethalDamageInPlay(ctx, { reasonCardId: cardPlayed.cardId });
  }
}
