import type { CardInstanceId, PlayerId, RuntimeCardWithDefinition } from "#core";
import { isClassification, type Classification } from "@tcg/lorcana-types";
import type { LorcanaCardDerived } from "../../../types/projected-board";
import { createLorcanaLogProjection, type LorcanaMoveDefinition } from "../../../types";

type LorcanaRuntimeCard = RuntimeCardWithDefinition & LorcanaCardDerived;
import {
  CHALLENGE_DEFENDER_TARGET_DSL,
  computeChallengeDamageResult,
  finalizeChallengeDamageAmount,
  getEligibleChallengeAttackers,
  getLegalChallengeDefendersForAttacker,
  validateChallengeAction,
} from "../../rules/challenge-rules";
import {
  recordChallengeByPlayerThisTurn,
  recordChallengedCharacterThisTurn,
} from "../../state/turn-metrics";
import { hasTemporaryAbility as hasTempAbility } from "../../effects/temporary-effects";
import { pruneTemporaryEffectsByDuration } from "../../effects/temporary-effects";
import { applyReplacementEffects } from "../../effects/replacement-effects";
import {
  emitTriggeredLorcanaEvent,
  finalizeResolutionBoundary,
  hasPendingBagItems,
  openWindow,
  snapshotTriggeredCandidatesForCard,
} from "../../effects/triggered-abilities";
import { projectLorcanaCardDerived } from "../../../projection/card-derived";
import { createProjectionState } from "../../../rules/derived-state";
import { getKeywordsBeforeBanish } from "../../shared/banish-snapshot";
import { hasStaticCardRestriction } from "../../rules/static-ability-utils";
import type { StaticEffectRegistry } from "../../../rules/static-effect-registry";
import { sweepLethalDamageInPlay } from "../../state/lethal-damage-sweep";
import { invalidateStaticEffects } from "../../rules/static-effects-invalidation";
import { getOrBuildMoveRegistry } from "../../rules/move-registry-cache";
import {
  applyChallengeDamage,
  applyStaticRestrictionBypass,
  exertCard,
  gainLore,
  hasAnyPendingEffects,
  isCardInPlayZone,
  snapshotAndBanishLethalCombatant,
  validateNoPendingEffects,
} from "../../../operations";

type ChallengeExecutionContext = Parameters<LorcanaMoveDefinition<"challenge">["execute"]>[0];
type ChallengeContinuationContext = Pick<ChallengeExecutionContext, "G" | "framework" | "cards">;
/**
 * Domain setter for `G.challengeState`. Every transition (declaration → damage
 * → post-damage → undefined) must bump the static-effect registry version
 * because static abilities gate on `in-challenge` / `challengeState.stage`.
 *
 * Routing all four challenge.ts callsites through this helper makes the
 * pairing impossible to forget.
 */
function setChallengeState(
  ctx: ChallengeContinuationContext | ChallengeExecutionContext,
  value: ChallengeExecutionContext["G"]["challengeState"],
): void {
  ctx.G.challengeState = value;
  invalidateStaticEffects(ctx);
}

function consumeTemporaryAbility(
  ctx: {
    cards: {
      require: (id: CardInstanceId) => { meta?: Record<string, unknown> };
      patchMeta: (id: CardInstanceId, patch: Record<string, unknown>) => void;
    };
  },
  cardId: CardInstanceId,
  ability: string,
): void {
  const card = ctx.cards.require(cardId);
  const currentMeta = card.meta ?? {};
  const temporaryAbilities: Record<string, unknown> = {
    ...(currentMeta.temporaryAbilities as Record<string, unknown> | undefined),
  };
  const temporaryAbilityStarts: Record<string, unknown> = {
    ...(currentMeta.temporaryAbilityStarts as Record<string, unknown> | undefined),
  };
  const temporaryAbilityPayloads: Record<string, unknown> = {
    ...(currentMeta.temporaryAbilityPayloads as Record<string, unknown> | undefined),
  };

  delete temporaryAbilities[ability];
  delete temporaryAbilityStarts[ability];
  delete temporaryAbilityPayloads[ability];

  ctx.cards.patchMeta(cardId, {
    temporaryAbilities: Object.keys(temporaryAbilities).length > 0 ? temporaryAbilities : undefined,
    temporaryAbilityStarts:
      Object.keys(temporaryAbilityStarts).length > 0 ? temporaryAbilityStarts : undefined,
    temporaryAbilityPayloads:
      Object.keys(temporaryAbilityPayloads).length > 0 ? temporaryAbilityPayloads : undefined,
  });
}

function pruneChallengeDurationEffects(ctx: ChallengeContinuationContext): void {
  const participantIds = [ctx.G.challengeState?.attacker, ctx.G.challengeState?.defender].filter(
    (id): id is CardInstanceId => typeof id === "string",
  );

  for (const cardId of participantIds) {
    const card = ctx.cards.require(cardId);
    const prunedMeta = pruneTemporaryEffectsByDuration(card.meta, "during-challenge");
    if (prunedMeta && prunedMeta !== card.meta) {
      ctx.cards.patchMeta(cardId, prunedMeta);
    }
  }
}

function getClassificationsBeforeBanish(
  ctx: ChallengeContinuationContext,
  cardId: CardInstanceId,
  actorPlayerId: PlayerId,
  registry: StaticEffectRegistry,
): Classification[] | undefined {
  const definition = ctx.cards.getDefinition(cardId);
  const ownerID = ctx.cards.require(cardId).ownerID as PlayerId | undefined;
  if (!definition || !ownerID) {
    return undefined;
  }

  const projected = projectLorcanaCardDerived({
    definition,
    meta: ctx.cards.require(cardId).meta ?? {},
    state: createProjectionState(ctx.framework.state, ctx.G),
    cardInstanceId: cardId,
    ownerID,
    controllerID:
      (ctx.framework.zones.getCardController(cardId) as PlayerId | undefined) ?? ownerID,
    zoneID: ctx.framework.zones.getCardZone(cardId),
    actorPlayerId,
    getDefinitionByInstanceId: (id) => ctx.cards.getDefinition(id),
    registry,
  });

  return Array.isArray(projected.classifications)
    ? projected.classifications.filter(isClassification)
    : undefined;
}

function resolveChallengeDamage(
  ctx: ChallengeContinuationContext,
  state: NonNullable<ChallengeContinuationContext["G"]["challengeState"]>,
): void {
  const { attacker: attackerId, defender: defenderId, attackerOwnerId, defenderOwnerId } = state;
  // `setChallengeState` bumps `staticEffectsVersion` whenever the challenge stage
  // changes, so the cache below always reflects the current `ctx.G.challengeState`.
  // The previous fresh-build workaround is no longer needed (Section 3).
  const registry = getOrBuildMoveRegistry(ctx);
  if (!isCardInPlayZone(ctx, attackerId) || !isCardInPlayZone(ctx, defenderId)) {
    return;
  }

  const damageResult = computeChallengeDamageResult(
    ctx as ChallengeExecutionContext,
    attackerId,
    defenderId,
  );

  const defenderMeta = ctx.cards.require(defenderId).meta ?? {};
  const attackerMeta = ctx.cards.require(attackerId).meta ?? {};
  const currentTurn = ctx.framework.state.status.turn ?? 1;
  const attackerHasGainTwoLoreOnBanish = hasTempAbility(
    attackerMeta,
    currentTurn,
    "gain-2-lore-on-banish-in-challenge",
  );
  const defenderHasGainTwoLoreOnBanish = hasTempAbility(
    defenderMeta,
    currentTurn,
    "gain-2-lore-on-banish-in-challenge",
  );
  const defenderEvent = applyReplacementEffects(ctx, {
    kind: "challenge-damage",
    eventId: `challenge-damage:${attackerId}:${defenderId}:defender`,
    sourceId: attackerId,
    controllerId: attackerOwnerId,
    attackerId,
    defenderId,
    targetId: defenderId,
    amount: damageResult.rawAttackerToDefenderDamage,
  });
  const attackerEvent = applyReplacementEffects(ctx, {
    kind: "challenge-damage",
    eventId: `challenge-damage:${attackerId}:${defenderId}:attacker`,
    sourceId: defenderId,
    controllerId: defenderOwnerId,
    attackerId,
    defenderId,
    targetId: attackerId,
    amount: damageResult.rawDefenderToAttackerDamage,
  });
  const finalDefenderTargetId = defenderEvent.targetId;
  const finalAttackerTargetId = attackerEvent.targetId;
  const finalDefenderTargetDef = ctx.cards.getDefinition(finalDefenderTargetId) as
    | typeof damageResult.defenderDefinition
    | typeof damageResult.attackerDefinition;
  const finalAttackerTargetDef = ctx.cards.getDefinition(finalAttackerTargetId) as
    | typeof damageResult.defenderDefinition
    | typeof damageResult.attackerDefinition;

  const attackerToDefenderDamage =
    finalDefenderTargetDef &&
    "cardType" in finalDefenderTargetDef &&
    (finalDefenderTargetDef.cardType === "character" ||
      finalDefenderTargetDef.cardType === "location")
      ? finalizeChallengeDamageAmount(
          ctx,
          finalDefenderTargetId,
          finalDefenderTargetDef,
          defenderEvent.amount,
          attackerId,
          registry,
        )
      : 0;
  const defenderToAttackerDamage =
    finalAttackerTargetDef &&
    "cardType" in finalAttackerTargetDef &&
    (finalAttackerTargetDef.cardType === "character" ||
      finalAttackerTargetDef.cardType === "location")
      ? finalizeChallengeDamageAmount(
          ctx,
          finalAttackerTargetId,
          finalAttackerTargetDef,
          attackerEvent.amount,
          defenderId,
          registry,
        )
      : 0;

  // Check for "cant-be-dealt-damage" static restriction on targets
  const defenderHasDamageRestriction = hasStaticCardRestriction({
    state: ctx.framework.state as Parameters<typeof hasStaticCardRestriction>[0]["state"],
    cardId: finalDefenderTargetId,
    restriction: "cant-be-dealt-damage",
    registry,
  });
  const attackerHasDamageRestriction = hasStaticCardRestriction({
    state: ctx.framework.state as Parameters<typeof hasStaticCardRestriction>[0]["state"],
    cardId: finalAttackerTargetId,
    restriction: "cant-be-dealt-damage",
    registry,
  });

  const effectiveAttackerToDefenderDamage = defenderHasDamageRestriction
    ? 0
    : attackerToDefenderDamage;
  const effectiveDefenderToAttackerDamage = attackerHasDamageRestriction
    ? 0
    : defenderToAttackerDamage;

  const { nextDamage: defenderNextDamage } = applyChallengeDamage(ctx, {
    targetId: finalDefenderTargetId,
    sourceId: attackerId,
    amount: effectiveAttackerToDefenderDamage,
    attackerId,
    defenderId,
    targetOwnerId: defenderOwnerId,
    sourceOwnerId: attackerOwnerId,
  });
  const { nextDamage: attackerNextDamage } = applyChallengeDamage(ctx, {
    targetId: finalAttackerTargetId,
    sourceId: defenderId,
    amount: effectiveDefenderToAttackerDamage,
    attackerId,
    defenderId,
    targetOwnerId: attackerOwnerId,
    sourceOwnerId: defenderOwnerId,
  });

  const finalDefenderWillpower = (ctx.cards.require(finalDefenderTargetId) as LorcanaRuntimeCard)
    .willpower;
  const finalAttackerWillpower = (ctx.cards.require(finalAttackerTargetId) as LorcanaRuntimeCard)
    .willpower;
  const defenderLethal = finalDefenderWillpower > 0 && defenderNextDamage >= finalDefenderWillpower;
  const attackerLethal = finalAttackerWillpower > 0 && attackerNextDamage >= finalAttackerWillpower;

  // Snapshot trigger candidates for banish-in-challenge events before any cards leave play.
  // In mutual kills, both cards are moved to discard before buffered events are processed,
  // so the snapshot preserves trigger candidates that would otherwise be lost.
  const attackerBanishInChallengeCandidates = defenderLethal
    ? snapshotTriggeredCandidatesForCard(ctx, attackerId)
    : undefined;
  const defenderBanishInChallengeCandidates = attackerLethal
    ? snapshotTriggeredCandidatesForCard(ctx, defenderId)
    : undefined;

  if (defenderLethal) {
    const snapshot = snapshotAndBanishLethalCombatant(ctx, {
      cardId: finalDefenderTargetId,
      actorPlayerId: attackerOwnerId,
      cardType: finalDefenderTargetDef?.cardType,
      getKeywords: getKeywordsBeforeBanish,
      getClassifications: (c, id, actor) => getClassificationsBeforeBanish(c, id, actor, registry),
    });
    emitTriggeredLorcanaEvent(
      ctx,
      "cardBanished",
      {
        cardId: finalDefenderTargetId,
        sourceId: attackerToDefenderDamage > 0 ? attackerId : null,
        snapshot: {
          cardsUnderCountBeforeBanish: snapshot.cardsUnderCountBeforeBanish,
          classificationsBeforeBanish: snapshot.classificationsBeforeBanish,
          damageDealt: attackerToDefenderDamage,
          keywordsBeforeBanish: snapshot.keywordsBeforeBanish,
          subjectAtLocationId: snapshot.subjectAtLocationId,
          strengthBeforeBanish: snapshot.strengthBeforeBanish,
        },
        reason: "lethal damage from challenge",
      },
      [
        ...(finalDefenderTargetId === defenderId
          ? [
              {
                event: "challenged-and-banished" as const,
                playerId: snapshot.ownerId,
                subjectCardId: finalDefenderTargetId,
                triggerSourceCardId: finalDefenderTargetId,
                attackerId,
                defenderId,
                happenedInChallenge: true,
                triggerCandidates: snapshot.triggerCandidates,
                eventSnapshot: {
                  classificationsBeforeBanish: snapshot.classificationsBeforeBanish,
                  cardsUnderCountBeforeBanish: snapshot.cardsUnderCountBeforeBanish,
                  cardsUnderIdsBeforeBanish: snapshot.cardsUnderIdsBeforeBanish,
                  keywordsBeforeBanish: snapshot.keywordsBeforeBanish,
                  strengthBeforeBanish: snapshot.strengthBeforeBanish,
                  subjectAtLocationId: snapshot.subjectAtLocationId,
                  charactersAtSourceLocationBeforeBanish:
                    snapshot.charactersAtSourceLocationBeforeBanish,
                },
              },
            ]
          : []),
        {
          event: "banish",
          playerId: snapshot.ownerId,
          subjectCardId: finalDefenderTargetId,
          triggerSourceCardId: finalDefenderTargetId,
          attackerId,
          defenderId,
          happenedInChallenge: true,
          triggerCandidates: [
            ...(snapshot.triggerCandidates ?? []),
            ...(attackerBanishInChallengeCandidates ?? []),
          ],
          eventSnapshot: {
            classificationsBeforeBanish: snapshot.classificationsBeforeBanish,
            cardsUnderCountBeforeBanish: snapshot.cardsUnderCountBeforeBanish,
            cardsUnderIdsBeforeBanish: snapshot.cardsUnderIdsBeforeBanish,
            keywordsBeforeBanish: snapshot.keywordsBeforeBanish,
            strengthBeforeBanish: snapshot.strengthBeforeBanish,
            subjectAtLocationId: snapshot.subjectAtLocationId,
            charactersAtSourceLocationBeforeBanish: snapshot.charactersAtSourceLocationBeforeBanish,
          },
        },
        ...(attackerToDefenderDamage > 0 && finalDefenderTargetDef?.cardType === "character"
          ? [
              {
                event: "banish-in-challenge" as const,
                playerId: attackerOwnerId,
                subjectCardId: attackerId,
                triggerSourceCardId: finalDefenderTargetId,
                attackerId,
                defenderId,
                happenedInChallenge: true,
                triggerCandidates: attackerBanishInChallengeCandidates,
              },
            ]
          : []),
      ],
    );

    if (
      attackerHasGainTwoLoreOnBanish &&
      attackerToDefenderDamage > 0 &&
      finalDefenderTargetDef?.cardType === "character"
    ) {
      gainLore(ctx, attackerOwnerId, 2);
    }
  }

  if (attackerLethal) {
    const snapshot = snapshotAndBanishLethalCombatant(ctx, {
      cardId: finalAttackerTargetId,
      actorPlayerId: defenderOwnerId,
      cardType: finalAttackerTargetDef?.cardType,
      getKeywords: getKeywordsBeforeBanish,
      getClassifications: (c, id, actor) => getClassificationsBeforeBanish(c, id, actor, registry),
    });
    emitTriggeredLorcanaEvent(
      ctx,
      "cardBanished",
      {
        cardId: finalAttackerTargetId,
        sourceId: defenderToAttackerDamage > 0 ? defenderId : null,
        snapshot: {
          cardsUnderCountBeforeBanish: snapshot.cardsUnderCountBeforeBanish,
          classificationsBeforeBanish: snapshot.classificationsBeforeBanish,
          damageDealt: defenderToAttackerDamage,
          keywordsBeforeBanish: snapshot.keywordsBeforeBanish,
          subjectAtLocationId: snapshot.subjectAtLocationId,
          strengthBeforeBanish: snapshot.strengthBeforeBanish,
        },
        reason: "lethal damage from challenge",
      },
      [
        {
          event: "banish",
          playerId: snapshot.ownerId,
          subjectCardId: finalAttackerTargetId,
          triggerSourceCardId: finalAttackerTargetId,
          attackerId,
          defenderId,
          happenedInChallenge: true,
          triggerCandidates: snapshot.triggerCandidates,
          eventSnapshot: {
            classificationsBeforeBanish: snapshot.classificationsBeforeBanish,
            cardsUnderCountBeforeBanish: snapshot.cardsUnderCountBeforeBanish,
            cardsUnderIdsBeforeBanish: snapshot.cardsUnderIdsBeforeBanish,
            keywordsBeforeBanish: snapshot.keywordsBeforeBanish,
            strengthBeforeBanish: snapshot.strengthBeforeBanish,
            subjectAtLocationId: snapshot.subjectAtLocationId,
            charactersAtSourceLocationBeforeBanish: snapshot.charactersAtSourceLocationBeforeBanish,
          },
        },
        ...(defenderToAttackerDamage > 0 && finalAttackerTargetDef?.cardType === "character"
          ? [
              {
                event: "banish-in-challenge" as const,
                playerId: defenderOwnerId,
                subjectCardId: defenderId,
                triggerSourceCardId: finalAttackerTargetId,
                attackerId,
                defenderId,
                happenedInChallenge: true,
                triggerCandidates: defenderBanishInChallengeCandidates,
              },
            ]
          : []),
      ],
    );

    if (
      defenderHasGainTwoLoreOnBanish &&
      defenderToAttackerDamage > 0 &&
      finalAttackerTargetDef?.cardType === "character"
    ) {
      gainLore(ctx, defenderOwnerId, 2);
    }
  }

  emitTriggeredLorcanaEvent(ctx, "challenged", {
    attackerId,
    defenderId,
    attackerDamage: defenderToAttackerDamage,
    defenderDamage: attackerToDefenderDamage,
  });

  // A banished character may have been a source of continuous static abilities
  // (e.g. +Willpower aura). Re-check all remaining cards for lethal damage.
  if (defenderLethal || attackerLethal) {
    const reasonCardId = defenderLethal ? defenderId : attackerId;
    sweepLethalDamageInPlay(
      {
        ...ctx,
        playerId: state.attackerOwnerId,
      },
      { reasonCardId },
    );
  }
}

export function continuePendingChallengeResolution(ctx: ChallengeContinuationContext): void {
  const challengeState = ctx.G.challengeState;
  if (!challengeState) {
    return;
  }

  if (challengeState.stage === "declaration") {
    // Static abilities gated on `in-challenge` / stage depend on G.challengeState,
    // so bump the static-effect registry cache key whenever the challenge state changes.
    const damageState = { ...challengeState, stage: "damage" as const };
    setChallengeState(ctx, damageState);
    resolveChallengeDamage(ctx, damageState);
    setChallengeState(ctx, { ...damageState, stage: "post-damage" });
    openWindow(ctx, { window: "after-challenge" });
    finalizeResolutionBoundary(ctx, { window: "after-challenge" });
    if (hasPendingBagItems(ctx) || ctx.framework.state.priority.pendingChoice) {
      return;
    }
  }

  if (
    ctx.G.challengeState?.stage === "post-damage" &&
    !hasPendingBagItems(ctx) &&
    !ctx.framework.state.priority.pendingChoice &&
    (ctx.G.pendingEffects?.length ?? 0) === 0
  ) {
    pruneChallengeDurationEffects(ctx);
    setChallengeState(ctx, undefined);
  }
}

/**
 * Challenge with a character
 */
export const challenge: LorcanaMoveDefinition<"challenge"> = {
  validate: (ctx) => {
    const pendingFailure = validateNoPendingEffects(ctx, { actionLabel: "challenge" });
    if (pendingFailure) {
      return pendingFailure;
    }

    return validateChallengeAction(ctx);
  },

  execute: (ctx) => {
    const { attackerId, defenderId } = ctx.args;
    const attackerOwnerId = (ctx.framework.state.currentPlayer ??
      ctx.playerId ??
      ctx.framework.state.priority.holder) as PlayerId | undefined;

    if (!attackerOwnerId) {
      throw new Error("Challenge execution requires an active player");
    }

    const defenderOwnerId = ctx.cards.require(defenderId).ownerID as PlayerId;
    recordChallengeByPlayerThisTurn(ctx, attackerOwnerId);
    recordChallengedCharacterThisTurn(ctx, defenderId);

    applyStaticRestrictionBypass(ctx, {
      cardId: attackerId,
      restriction: "cant-challenge",
      playerId: attackerOwnerId,
    });

    // CR 4.6.4.4 - exert the challenging character.
    exertCard(ctx, attackerId);

    const currentTurn = ctx.framework.state.status.turn ?? 1;
    const attackerMetaAfterExert = ctx.cards.require(attackerId).meta;
    const defenderDefinition = ctx.cards.getDefinition(defenderId) as
      | { cardType?: string }
      | undefined;
    if (
      defenderDefinition?.cardType === "character" &&
      hasTempAbility(attackerMetaAfterExert, currentTurn, "gain-lore-when-challenging")
    ) {
      gainLore(ctx, attackerOwnerId, 1);
      consumeTemporaryAbility(ctx, attackerId, "gain-lore-when-challenging");
    }

    // Static abilities gated on `in-challenge` depend on G.challengeState,
    // so bump the static-effect registry cache key now that a challenge has begun.
    setChallengeState(ctx, {
      attacker: attackerId,
      defender: defenderId,
      attackerOwnerId,
      defenderOwnerId,
      stage: "declaration",
    });
    ctx.framework.log(
      createLorcanaLogProjection(
        "lorcana.move.challenge",
        {
          playerId: attackerOwnerId,
          attackerId,
          defenderId,
        },
        { mode: "PUBLIC" },
        "action",
      ),
    );

    const attackerTriggerCandidatesDecl = snapshotTriggeredCandidatesForCard(ctx, attackerId);
    const defenderTriggerCandidatesDecl = snapshotTriggeredCandidatesForCard(ctx, defenderId);

    openWindow(ctx, {
      window: "challenge-declaration",
      events: [
        {
          event: "exert",
          playerId: attackerOwnerId,
          subjectCardId: attackerId,
          triggerCandidates: attackerTriggerCandidatesDecl,
        },
        {
          event: "challenge",
          playerId: attackerOwnerId,
          subjectCardId: attackerId,
          attackerId,
          defenderId,
          happenedInChallenge: true,
          triggerCandidates: attackerTriggerCandidatesDecl,
        },
        {
          event: "challenged",
          playerId: defenderOwnerId,
          subjectCardId: defenderId,
          attackerId,
          defenderId,
          happenedInChallenge: true,
          triggerCandidates: defenderTriggerCandidatesDecl,
        },
      ],
    });
    finalizeResolutionBoundary(ctx);
    if (hasPendingBagItems(ctx) || ctx.framework.state.priority.pendingChoice) {
      return;
    }

    continuePendingChallengeResolution(ctx);
  },

  available: (ctx) => {
    if (hasAnyPendingEffects(ctx)) {
      return false;
    }

    const eligibleAttackers = getEligibleChallengeAttackers(ctx);

    return eligibleAttackers.some(
      (attackerId) => getLegalChallengeDefendersForAttacker(ctx, attackerId).length > 0,
    );
  },
};
