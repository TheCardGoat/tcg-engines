import type { CardInstanceId, PlayerId } from "#core";
import { type CardPlayedPayload } from "../../../types";
import type { DealDamageEffect } from "@tcg/lorcana-types";
import type { DynamicAmountEventSnapshot } from "../../../types/domain-events";
import { projectLorcanaCardDerived } from "../../../projection/card-derived";
import { createProjectionState } from "../../../rules/derived-state";
import { moveCardOutOfPlayWithStack, getCharacterIdsAtLocation } from "../../state/shift-stack";
import type { PlayCardExecutionContext } from "./types";
import { effectLogger } from "./effect-logger";
import { markLastEffectPerformed } from "./event-snapshot-utils";
import {
  recordBanishedCharacterThisTurn,
  recordDamagedCharacterThisTurn,
} from "../../state/turn-metrics";
import { hasStaticCardRestriction } from "../../rules/static-ability-utils";
import { getOrBuildMoveRegistry } from "../../rules/move-registry-cache";
import { getKeywordsBeforeBanish } from "../../shared/banish-snapshot";
import { runGameStateCheck } from "../../state/game-state-check";
import {
  emitTriggeredLorcanaEvent,
  snapshotTriggeredCandidatesForCard,
  snapshotBoardTriggerCandidates,
} from "../../effects/triggered-abilities";
import type { TriggeredEventCandidate } from "../../../types/runtime-state";

type ResolvedDealDamageEffectInput = {
  eventSnapshot?: DynamicAmountEventSnapshot;
  targets: CardInstanceId[];
  amountByTarget?: Record<CardInstanceId, number>;
};

export function isDealDamageEffect(effect: unknown): effect is DealDamageEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "deal-damage"
  );
}

function getResistValue(
  ctx: PlayCardExecutionContext,
  targetId: CardInstanceId,
  registry?: import("../../../rules/static-effect-registry").StaticEffectRegistry,
): number {
  const runtimeCard = ctx.cards.require(targetId);
  const definition = runtimeCard.definition as { cardType?: string } | undefined;
  const cardType = definition?.cardType;
  if (cardType !== "character" && cardType !== "location") {
    return 0;
  }

  const derived = projectLorcanaCardDerived({
    definition: runtimeCard.definition,
    meta: runtimeCard.meta,
    state: createProjectionState(ctx.framework.state, ctx.G),
    cardInstanceId: targetId,
    ownerID: runtimeCard.ownerID as import("#core").PlayerId | undefined,
    controllerID: runtimeCard.controllerID as import("#core").PlayerId | undefined,
    zoneID: runtimeCard.zoneID,
    getDefinitionByInstanceId: (cardId) => ctx.cards.getDefinition(cardId),
    registry,
  });

  return Math.max(0, derived.keywordValues?.resist ?? 0);
}

type ApplyDamageOptions = {
  applyResist: boolean;
  emitDealDamage: boolean;
  outcomeDamageType: "effect" | "put";
  checkDamageRestriction?: boolean;
  boardCandidatesSnapshot?: TriggeredEventCandidate[];
  registry?: import("../../../rules/static-effect-registry").StaticEffectRegistry;
};

function applyDamage(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  resolvedInput: ResolvedDealDamageEffectInput,
  options: ApplyDamageOptions,
): boolean {
  let changed = false;

  for (const targetId of resolvedInput.targets) {
    const resolvedAmount = resolvedInput.amountByTarget?.[targetId];
    const amount =
      typeof resolvedAmount === "number" && Number.isFinite(resolvedAmount)
        ? Math.max(0, resolvedAmount)
        : 0;

    if (amount <= 0) {
      effectLogger.warn(`Target ${targetId} has no damage to deal`);
      continue;
    }

    // Check for "cant-be-dealt-damage" static restriction (only for dealt damage, not put damage)
    if (options.checkDamageRestriction) {
      const hasDamageRestriction = hasStaticCardRestriction({
        state: ctx.framework.state as Parameters<typeof hasStaticCardRestriction>[0]["state"],
        cardId: targetId,
        restriction: "cant-be-dealt-damage",
        registry: options.registry!,
      });
      if (hasDamageRestriction) {
        continue;
      }
    }

    const meta = ctx.cards.require(targetId).meta ?? {};
    const currentDamage = Number(meta.damage ?? 0);
    const appliedDamage = options.applyResist
      ? Math.max(0, amount - getResistValue(ctx, targetId, options.registry))
      : amount;
    if (appliedDamage <= 0) {
      effectLogger.warn(`Target ${targetId} took no damage after reduction`);
      continue;
    }

    const nextDamage = currentDamage + appliedDamage;

    ctx.cards.patchMeta(targetId, {
      ...meta,
      damage: nextDamage,
    });
    recordDamagedCharacterThisTurn(ctx, targetId);
    changed = true;

    const triggeredEvents: Parameters<typeof emitTriggeredLorcanaEvent>[3] = [
      {
        event: "damage",
        subjectCardId: targetId,
        triggerSourceCardId: cardPlayed.cardId,
        playerId: ctx.framework.zones.getCardOwner(targetId) as PlayerId | undefined,
        eventSnapshot: {
          triggerAmount: appliedDamage,
          damageDealt: options.emitDealDamage ? appliedDamage : undefined,
        },
      },
    ];

    if (options.emitDealDamage) {
      triggeredEvents.push({
        event: "deal-damage",
        subjectCardId: targetId,
        triggerSourceCardId: cardPlayed.cardId,
        sourceCardType: cardPlayed.cardType,
        playerId: ctx.framework.zones.getCardOwner(targetId) as PlayerId | undefined,
        eventSnapshot: {
          triggerAmount: appliedDamage,
          damageDealt: appliedDamage,
        },
      });
    }

    // Emit "damage" so "whenever this character takes damage" abilities fire.
    // Only dealt damage emits "deal-damage"; putting counters is a distinct rule action.
    emitTriggeredLorcanaEvent(
      ctx,
      "damageDealt",
      {
        targetId,
        amount: appliedDamage,
        newDamage: nextDamage,
        sourceId: cardPlayed.cardId,
        damageType: options.outcomeDamageType,
      },
      triggeredEvents,
    );

    // Use projected (effective) willpower from the runtime card, which accounts for
    // static +/−{W} aura modifiers (§1.8.1.4). Fall back to the definition value
    // in contexts (e.g. unit-test mocks) where the runtime card is not projected.
    const runtimeCard = ctx.cards.require(targetId) as { willpower?: number; cardType?: string };
    const def = ctx.cards.getDefinition(targetId) as
      | { willpower?: number; cardType?: string }
      | undefined;
    const willpower = runtimeCard.willpower ?? def?.willpower;
    const cardType = runtimeCard.cardType ?? def?.cardType;
    if (
      typeof willpower === "number" &&
      willpower > 0 &&
      nextDamage >= willpower &&
      (cardType === "character" || cardType === "location")
    ) {
      const subjectAtLocationId = meta.atLocationId as CardInstanceId | undefined;
      const ownerId = ctx.framework.zones.getCardOwner(targetId) as PlayerId | undefined;
      const keywordsBeforeBanish = getKeywordsBeforeBanish(ctx, targetId, cardPlayed.playerId);

      if (!ownerId) {
        effectLogger.fatal(`Target card ${targetId} not found in card index`);
        continue;
      }

      const cardTriggerCandidates = snapshotTriggeredCandidatesForCard(ctx, targetId);
      const triggerCandidates = options.boardCandidatesSnapshot
        ? [...cardTriggerCandidates, ...options.boardCandidatesSnapshot]
        : cardTriggerCandidates;
      const charsAtLocation =
        runtimeCard.cardType === "location" ? getCharacterIdsAtLocation(ctx, targetId) : undefined;
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
            damageDealt: appliedDamage,
            keywordsBeforeBanish,
            subjectAtLocationId,
          },
          reason: "lethal damage",
        },
        {
          event: "banish",
          playerId: ownerId,
          subjectCardId: targetId,
          triggerSourceCardId: targetId,
          triggerCandidates,
          eventSnapshot: {
            keywordsBeforeBanish,
            subjectAtLocationId,
            charactersAtSourceLocationBeforeBanish: charsAtLocation,
          },
        },
      );
      recordBanishedCharacterThisTurn(ctx, targetId);
    }
  }

  return changed;
}

export function resolveDealDamageEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  _effect: DealDamageEffect,
  resolvedInput: ResolvedDealDamageEffectInput,
): void {
  // Snapshot board trigger candidates before dealing damage so observer triggers
  // (e.g. "whenever one of your other characters is banished") are captured
  // while the observers are still in play.
  const boardCandidatesSnapshot =
    resolvedInput.targets.length > 1 ? snapshotBoardTriggerCandidates(ctx) : undefined;
  const registry = getOrBuildMoveRegistry(ctx);
  const dealtAnyDamage = applyDamage(ctx, cardPlayed, resolvedInput, {
    applyResist: true,
    emitDealDamage: true,
    outcomeDamageType: "effect",
    checkDamageRestriction: true,
    boardCandidatesSnapshot,
    registry,
  });
  markLastEffectPerformed(resolvedInput.eventSnapshot, dealtAnyDamage);

  // Dealing lethal damage may banish a static buff source (e.g. +Willpower
  // aura), causing other characters to become lethal. Sweep to catch cascades.
  if (dealtAnyDamage) {
    runGameStateCheck(ctx, { reasonCardId: cardPlayed.cardId });
  }
}

export function resolvePutDamageLikeEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  resolvedInput: ResolvedDealDamageEffectInput,
): void {
  const boardCandidatesSnapshot =
    resolvedInput.targets.length > 1 ? snapshotBoardTriggerCandidates(ctx) : undefined;
  applyDamage(ctx, cardPlayed, resolvedInput, {
    applyResist: false,
    emitDealDamage: false,
    outcomeDamageType: "put",
    boardCandidatesSnapshot,
  });
}
