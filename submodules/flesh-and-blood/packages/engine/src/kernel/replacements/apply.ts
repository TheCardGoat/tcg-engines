import type { FabZone } from "@tcg/flesh-and-blood-types";
import { basePropertiesOf } from "../../cards.ts";
import { fabPlayerId } from "../../game/identity.ts";
import type { ProposedEvent } from "../../rules/events.ts";
import type { FabReplacementCandidate } from "../../rules/process.ts";
import {
  createSyntheticFabObjectSnapshot,
  nextFabDestinationRef,
  snapshotObject,
  syntheticTokenBaseProperties,
} from "../../rules/snapshots.ts";
import { buildFabRulesView, matchesFabSnapshotFilter } from "../../rules/state-rules-view.ts";
import type { FabReplacementEffect, FabRulesSnapshot } from "../transaction-kernel.ts";
import {
  damageIncreaseIsRestricted,
  damageIsUnpreventable,
} from "../../rules/unpreventable-damage.ts";
import {
  isAdmissibleCanonicalAmount,
  resolveCanonicalAmount,
  resolveEnterArenaCounterCount,
} from "./amounts.ts";
import {
  supportedCanonicalReplacement,
  additionalSharpenExtra,
  preventionFollowUpCreateToken,
  isPreventionSourceBanish,
  clashOutcomeOptionalReclash,
  isClashTieWinClashReplacement,
  isClashFailToWinRevealingThisReplacement,
  isClashSwapRevealReplacement,
  createExtraAmount,
  damageAmountBoostAmount,
  drawCountBoostExtra,
  isDrawToTokenReplacement,
  isAdditionalSharpenReplacement,
  isBanishFromSoulCost,
  isBloodDebtLoseLifeToTopDeckBanishReplacement,
  isCreateExtraReplacement,
  isDamageAmountBoostReplacement,
  isGoFishDoubleTriggerReplacement,
  isDeckTopToBottomReplacement,
  isDrawCountBoostReplacement,
  isOpponentDrawMinusOneDestroySelfReplacement,
  isOpponentDrawRedirectToControllerReplacement,
  isGraveyardToBanishReplacement,
  isGraveyardToDeckBottomReplacement,
  isNamedCounterRemovalCost,
  isOptionalDestroySelfCreateReplacement,
  isOptionalDestroySelfRerollReplacement,
  isRollPlusOneIgnoreLowestReplacement,
  isOptionalPayDestroyAdditionalSharpenReplacement,
  isOpponentGainLifeToLoseLifeCreateTokensReplacement,
  isGainLifeToLoseLifeReplacement,
  isEnterArenaTappedReplacement,
  isPitchResourceBoostReplacement,
  isPowerGainAmountReplacement,
  isWagerLossOptionalDiscardWinReplacement,
  optionalDestroyRerollSides,
  rollPlusOneIgnoreLowestExtraDice,
  optionalPayDestroyResourceCost,
  powerGainModification,
} from "./admission.ts";
import {
  canonicalZone,
  isGraveyardDestinationEvent,
  isHeroTarget,
  replacementApplies,
  replacementAppliesToNextFilter,
} from "./collect.ts";
import {
  persistedReplacementCostTargetIds,
  replacementCostCommitKey,
  shieldingRemainingAmount,
  snapshotPersistedCostTarget,
  validPersistedCostTargetId,
} from "./persist.ts";

/** Compile a serialized canonical candidate into the pure transaction-kernel operation. */
export interface FabReplacementDestinationAllocator {
  nextOffset: number;
}

export function kernelReplacementFor(
  candidate: FabReplacementCandidate,
  destinationAllocator: FabReplacementDestinationAllocator = { nextOffset: 0 },
): FabReplacementEffect {
  return {
    replacementId: candidate.replacementId,
    controllerId: candidate.controllerId,
    optional: candidate.optional,
    replacementKind: candidate.replacementKind,
    applicationScope: candidate.applicationScope,
    applies: (state, event) => replacementApplies(state, candidate, event),
    replace: (state, event) => {
      const result = applyReplacement(state, candidate, event, destinationAllocator.nextOffset);
      destinationAllocator.nextOffset +=
        result.subEvents?.filter(
          (subEvent) => "destinationRef" in subEvent.data && subEvent.data.destinationRef !== null,
        ).length ?? 0;
      return result;
    },
  };
}

function applyReplacement(
  state: FabRulesSnapshot,
  candidate: FabReplacementCandidate,
  event: ProposedEvent,
  destinationOffset: number,
): {
  readonly event: ProposedEvent | null;
  readonly subEvents?: readonly ProposedEvent[];
  readonly continuationEvents?: readonly ProposedEvent[];
} {
  const effect = candidate.effect;
  if (
    effect.type === "replacement" &&
    event.name === "draw" &&
    isDrawToTokenReplacement(effect) &&
    effect.modification.type === "create-token" &&
    typeof effect.modification.token === "string"
  ) {
    const playerId = event.data.playerId;
    const tokenSlug = effect.modification.token;
    const canonicalId = `token:${tokenSlug}`;
    const definition = state.cardDefinitions[canonicalId];
    const token = createSyntheticFabObjectSnapshot({
      ref: {
        instanceId: `${candidate.replacementId}:${event.data.object.instanceId}:${state.counters.event}:draw-token`,
        incarnation: state.counters.objectIncarnation + destinationOffset + 1,
      },
      canonicalId,
      objectKind: "created-token",
      baseSource: { kind: "registered" },
      ownerId:
        effect.modification.creator === "token-controller" ? playerId : candidate.controllerId,
      controllerId: playerId,
      zone: "unknown",
      zoneRef: { playerId: fabPlayerId(playerId), zone: "arena" },
      base: definition ? basePropertiesOf(definition) : syntheticTokenBaseProperties(tokenSlug),
    });
    return {
      event: null,
      subEvents: [
        {
          ...event,
          name: "create",
          source: candidate.source,
          controllerId: candidate.controllerId,
          cause: {
            kind: "effect",
            abilityId: candidate.replacementId,
            source: candidate.source,
            controllerId: candidate.controllerId,
          },
          affected: [token],
          data: { playerId, object: token },
        },
      ],
    };
  }
  if (
    effect.type === "replacement" &&
    event.name === "prevent" &&
    effect.replaces.name === "prevent" &&
    "damageType" in effect.replaces &&
    effect.replaces.damageType === "physical" &&
    effect.modification.type === "modify-numeric" &&
    effect.modification.property === "power" &&
    effect.modification.op === "subtract" &&
    typeof effect.modification.amount === "number"
  ) {
    const preventedAmount = Math.max(0, event.data.preventedAmount - effect.modification.amount);
    const restoredDamage = event.data.preventedAmount - preventedAmount;
    const updatedPrevent = { ...event, data: { ...event.data, preventedAmount } };
    if (restoredDamage === 0) return { event: updatedPrevent };
    return {
      event: updatedPrevent,
      continuationEvents: [
        {
          ...event,
          name: "deal-damage",
          data: { ...event.data, amount: restoredDamage },
        },
      ],
    };
  }
  if (
    effect.type === "replacement" &&
    event.name === "trigger" &&
    isGoFishDoubleTriggerReplacement(effect)
  ) {
    return { event, subEvents: [{ ...event }] };
  }
  if (
    effect.type === "replacement" &&
    event.name === "create" &&
    isCreateExtraReplacement(effect)
  ) {
    const extra = createExtraAmount(effect);
    // Minus N of this token type: cancel this one create (multi-event scope
    // applies once per token identity, so a batch of 3 becomes 2).
    if (extra < 0) return { event: null };
    if (extra === 0) return { event };
    const original = event.data.object;
    const subEvents: ProposedEvent[] = [];
    for (let i = 0; i < extra; i += 1) {
      const instanceId = `${original.instanceId}:extra-${i + 1}`;
      const incarnation = state.counters.objectIncarnation + i + 1;
      const object = createSyntheticFabObjectSnapshot({
        ref: { instanceId, incarnation },
        canonicalId: original.canonicalId ?? instanceId,
        objectKind: original.objectKind,
        baseSource: original.baseSource,
        ownerId: original.ownerId,
        controllerId: original.controllerId,
        zone: original.zone,
        zoneRef: original.zoneRef,
        base: original.base,
      });
      subEvents.push({
        ...event,
        affected: [object],
        data: { playerId: event.data.playerId, object },
      });
    }
    // Keep the original create; queue extras as sub-events (batch-scoped once).
    return { event, subEvents };
  }
  if (effect.type === "replacement" && effect.modification.type === "cancel-event") {
    return { event: null };
  }
  // CR 8.5.33 Ignore: the matched event is considered to never have happened.
  // Whole-event ignore removes it from the committed journal (8.5.33a: effects
  // conditional on the ignored result do not see it). Part-of-event (8.5.33b)
  // is deferred — events are atomic per discrete effect.
  if (effect.type === "replacement" && effect.modification.type === "ignore") {
    return { event: null };
  }
  if (
    effect.type === "replacement" &&
    (event.name === "continuous-effect-applied" || event.name === "continuous-effect-changed") &&
    effect.modification.type === "modify-numeric" &&
    effect.modification.property === "count" &&
    effect.modification.op !== "set-base" &&
    typeof effect.modification.amount === "number"
  ) {
    const application = event.data.application;
    if (application.contribution.kind !== "numeric" || application.contribution.value === null) {
      return { event };
    }
    const current = application.contribution.value;
    const amount = effect.modification.amount;
    const value = applyNumericReplacement(current, effect.modification.op, amount);
    const updatedApplication = {
      ...application,
      contribution: {
        ...application.contribution,
        value,
        delta:
          application.contribution.previousValue === null
            ? null
            : value - application.contribution.previousValue,
      },
    };
    if (event.name === "continuous-effect-applied") {
      return { event: { ...event, data: { application: updatedApplication } } };
    }
    return {
      event: {
        ...event,
        data: {
          previous: event.data.previous,
          application: updatedApplication,
        },
      },
    };
  }
  // Power-gain ±N (Flourish / Iron Will): rewrite continuous-effect-applied power totals.
  if (
    effect.type === "replacement" &&
    isPowerGainAmountReplacement(effect) &&
    event.name === "continuous-effect-applied"
  ) {
    const mod = powerGainModification(effect);
    if (!mod) return { event };
    const application = event.data.application;
    if (
      application.contribution.kind !== "numeric" ||
      application.contribution.property !== "power" ||
      application.contribution.value === null
    ) {
      return { event };
    }
    const prev = application.contribution.previousValue;
    if (prev !== null && application.contribution.value <= prev) return { event };
    const current = application.contribution.value;
    let value = applyNumericReplacement(current, mod.op, mod.amount);
    // Floor at previous total so "minus N" never reduces below the pre-gain power.
    if (prev !== null && value < prev) value = prev;
    if (value < 0) value = 0;
    const updatedApplication = {
      ...application,
      contribution: {
        ...application.contribution,
        value,
        delta: prev === null ? null : value - prev,
      },
    };
    return { event: { ...event, data: { application: updatedApplication } } };
  }
  if (
    effect.type === "prevention" &&
    event.name === "deal-damage" &&
    isAdmissibleCanonicalAmount(effect.amount)
  ) {
    const staticPreventionApplication = candidate.staticPreventionApplication;
    const persistedCost =
      candidate.persistedApplicationPolicy?.kind === "may-apply"
        ? candidate.persistedApplicationPolicy.cost
        : undefined;
    if (
      persistedCost &&
      persistedCost.kind !== "banish-source" &&
      !validPersistedCostTargetId(state, candidate)
    ) {
      return { event };
    }
    // Yoji: redirect damage onto redirectPlayerId first, then prevent fixed amount.
    const redirectedTarget =
      candidate.redirectPlayerId != null
        ? ({ kind: "hero" as const, playerId: candidate.redirectPlayerId } as const)
        : event.data.target;
    const damageEvent: ProposedEvent<"deal-damage"> =
      candidate.redirectPlayerId != null
        ? { ...event, data: { ...event.data, target: redirectedTarget } }
        : event;
    // CR 6.4.10: resolve the prevention amount via evaluateAmount — a literal
    // N, an event-amount (the damage event's own amount), or a live FabAmount
    // (Dissipation Shield's steam-counter count) all settle against the damage
    // event being prevented. An unresolvable amount falls back to the damage
    // event's own amount (legacy event-amount prevention semantics) and is
    // clamped non-negative so a pathological negative can never increase the
    // damage (`resultingDamage = amount − negative`), mirroring the boost
    // path's `extra <= 0` guard and resolvePreventionKeywordAmount's `> 0`.
    const resolvedPreventionAmount = resolveCanonicalAmount(
      state,
      candidate,
      effect.amount,
      damageEvent.data.amount,
    );
    let preventionAmount = Math.max(0, resolvedPreventionAmount ?? damageEvent.data.amount);
    // CR 6.4.10j: a shielding prevention applies as much of its REMAINING
    // budget as the event allows — the registered record's live numeric
    // `effect.amount` (already decremented by earlier events' consumption),
    // not the printed amount. Fixed preventions keep the resolved amount.
    const shieldingRemaining = shieldingRemainingAmount(state, candidate, effect);
    if (shieldingRemaining !== null) preventionAmount = shieldingRemaining;
    // CR 6.4.10h: prevention still applies to unpreventable damage, including
    // its costs and additional modifications, but it does not reduce the
    // damage or consume shielding capacity.
    const preventedAmount = damageIsUnpreventable(state, damageEvent)
      ? 0
      : Math.min(damageEvent.data.amount, preventionAmount);
    const resultingDamage = damageEvent.data.amount - preventedAmount;
    const preventEvent: ProposedEvent<"prevent"> = {
      ...damageEvent,
      name: "prevent",
      cause: {
        kind: "effect",
        abilityId: candidate.replacementId,
        source: candidate.source,
        controllerId: candidate.controllerId,
      },
      controllerId: candidate.controllerId,
      source: candidate.source,
      affected: isHeroTarget(damageEvent.data.target) ? [] : [damageEvent.data.target],
      data: { ...damageEvent.data, preventedAmount },
    };
    const subEvents: ProposedEvent[] = [preventEvent];
    // CR 8.3.15 / 8.3.20 / 8.3.37: spellvoid, ward, arcane-shelter destroy the
    // source as the cost of prevention.
    if (staticPreventionApplication?.cost === "destroy-source") {
      subEvents.push({
        ...event,
        name: "destroy",
        cause: {
          kind: "effect",
          abilityId: candidate.replacementId,
          source: candidate.source,
          controllerId: candidate.controllerId,
        },
        controllerId: candidate.controllerId,
        source: candidate.source,
        affected: [candidate.source],
        data: {
          object: candidate.source,
          destinationRef: nextFabDestinationRef(state, candidate.source, destinationOffset),
          from: candidate.source.zone as FabZone,
          to: "graveyard",
          reason: "destroy",
        },
      });
    }
    // CR 6.4.1a / 6.4.10h: effect-printed destroy-self additional modification
    // ("instead destroy Enchanting Melody and prevent 4 damage that source
    // would deal"). The destroy is a sub-event of the modified damage event
    // and fires whenever the prevention applies — deliberately NOT gated on
    // preventedAmount > 0, because 6.4.10h keeps additional modifications on
    // unpreventable damage (only the damage reduction is suppressed).
    if (
      effect.additionalModification?.type === "destroy" &&
      effect.additionalModification.target.selector === "self" &&
      effect.additionalModification.delay === undefined
    ) {
      subEvents.push({
        ...event,
        name: "destroy",
        cause: {
          kind: "effect",
          abilityId: candidate.replacementId,
          source: candidate.source,
          controllerId: candidate.controllerId,
        },
        controllerId: candidate.controllerId,
        source: candidate.source,
        affected: [candidate.source],
        data: {
          object: candidate.source,
          destinationRef: nextFabDestinationRef(state, candidate.source, destinationOffset),
          from: candidate.source.zone as FabZone,
          to: "graveyard",
          reason: "destroy",
        },
      });
    }
    // CR 8.3.8 Arcane Barrier / CR 8.3.19 Quell: pay N resources for prevention.
    if (staticPreventionApplication?.cost === "pay-resources") {
      const payAmount = typeof effect.amount === "number" && effect.amount > 0 ? effect.amount : 0;
      // CR 1.14.2d: cards bound through the replacement cost-payment decision
      // pitch first, generating the resource points this cost spends. Chi
      // cards are never bound here — their pitch generates chi, which this
      // resource-point cost cannot use.
      const paymentView = buildFabRulesView(state);
      for (const binding of candidate.persistedPitchedInstanceIds ?? []) {
        const evaluated = paymentView.object({
          instanceId: binding.instanceId,
          incarnation: binding.incarnation,
        });
        const generated = evaluated?.current.numeric.pitch ?? 0;
        if (generated <= 0) continue;
        const pitchedObject = snapshotObject(
          state,
          binding.instanceId,
          candidate.controllerId,
          "hand",
        );
        subEvents.push({
          ...damageEvent,
          name: "pitch",
          cause: {
            kind: "effect",
            abilityId: candidate.replacementId,
            source: candidate.source,
            controllerId: candidate.controllerId,
          },
          controllerId: candidate.controllerId,
          source: pitchedObject,
          affected: [pitchedObject],
          bindings: { pitchedCard: pitchedObject },
          data: {
            playerId: candidate.controllerId,
            object: pitchedObject,
            destinationRef: nextFabDestinationRef(state, pitchedObject, destinationOffset),
            resourcesGenerated: generated,
            chiGenerated: 0,
          },
        });
      }
      if (payAmount > 0) {
        subEvents.push({
          ...damageEvent,
          name: "pay-resources",
          cause: {
            kind: "effect",
            abilityId: candidate.replacementId,
            source: candidate.source,
            controllerId: candidate.controllerId,
          },
          controllerId: candidate.controllerId,
          source: candidate.source,
          affected: [],
          data: { playerId: candidate.controllerId, amount: payAmount },
        });
      }
      // Quell: mark equipment for end-phase destroy via status marker.
      if (
        staticPreventionApplication?.kind === "static-keyword" &&
        staticPreventionApplication.keyword === "quell" &&
        staticPreventionApplication.scheduleSourceDestroyAtEndPhase
      ) {
        subEvents.push({
          ...damageEvent,
          name: "set-status",
          cause: {
            kind: "effect",
            abilityId: candidate.replacementId,
            source: candidate.source,
            controllerId: candidate.controllerId,
          },
          controllerId: candidate.controllerId,
          source: candidate.source,
          affected: [candidate.source],
          data: { object: candidate.source, status: "quell-pending-destroy" },
        });
      }
    }
    // Cap of Quick Thinking: the player selected this exact Instant cost before
    // the candidate entered the replacement order; discard it, then draw.
    if (
      effect.type === "prevention" &&
      effect.optionalCost?.class === "effect" &&
      effect.optionalCost.type === "discard" &&
      effect.optionalCost.count === 1
    ) {
      const instantId = validPersistedCostTargetId(state, candidate);
      if (instantId) {
        const discarded = snapshotObject(state, instantId, candidate.controllerId, "hand");
        subEvents.push({
          ...damageEvent,
          name: "discard",
          cause: {
            kind: "effect",
            abilityId: candidate.replacementId,
            source: candidate.source,
            controllerId: candidate.controllerId,
          },
          controllerId: candidate.controllerId,
          source: candidate.source,
          affected: [discarded],
          bindings: { discardedCard: discarded },
          data: {
            playerId: candidate.controllerId,
            object: discarded,
            destinationRef: nextFabDestinationRef(state, discarded, destinationOffset),
            random: false,
          },
        });
        if (
          effect.additionalModification?.type === "draw" &&
          effect.additionalModification.count === 1
        ) {
          // Draw top of deck (last index) into hand.
          const deck = state.containers.zonesByPlayerId[candidate.controllerId]?.deck ?? [];
          const topId = deck[deck.length - 1];
          if (topId) {
            const drawn = snapshotObject(state, topId, candidate.controllerId, "deck");
            subEvents.push({
              ...damageEvent,
              name: "draw",
              cause: {
                kind: "effect",
                abilityId: candidate.replacementId,
                source: candidate.source,
                controllerId: candidate.controllerId,
              },
              controllerId: candidate.controllerId,
              source: candidate.source,
              affected: [drawn],
              data: {
                playerId: candidate.controllerId,
                object: drawn,
                destinationRef: nextFabDestinationRef(state, drawn, destinationOffset + 1),
              },
            });
          }
        }
      }
    }
    // Shroud of Darkness: optional banish-self as the cost of prevention.
    if (
      effect.type === "prevention" &&
      effect.optionalCost?.class === "effect" &&
      effect.optionalCost.type === "banish-self"
    ) {
      subEvents.push({
        ...damageEvent,
        name: "banish",
        cause: {
          kind: "effect",
          abilityId: candidate.replacementId,
          source: candidate.source,
          controllerId: candidate.controllerId,
        },
        controllerId: candidate.controllerId,
        source: candidate.source,
        affected: [candidate.source],
        data: {
          object: candidate.source,
          destinationRef: nextFabDestinationRef(state, candidate.source, destinationOffset),
          from: candidate.source.zone as FabZone,
          to: "banished",
          reason: "banish",
        },
      });
    }
    // mBrio Base Vizier / Hyper Driver steam: remove the explicitly selected
    // steam counter source as the cost of preventing 1 arcane.
    if (effect.type === "prevention" && isNamedCounterRemovalCost(effect.optionalCost)) {
      const steamCost = effect.optionalCost;
      const targetId = validPersistedCostTargetId(state, candidate);
      const object = targetId
        ? snapshotPersistedCostTarget(state, candidate.controllerId, targetId)
        : null;
      const target =
        object && persistedReplacementCostTargetIds(state, candidate).includes(targetId!)
          ? { object, amount: 1 }
          : null;
      if (target) {
        subEvents.push({
          ...damageEvent,
          name: "counter-removed",
          cause: {
            kind: "effect",
            abilityId: candidate.replacementId,
            source: candidate.source,
            controllerId: candidate.controllerId,
          },
          controllerId: candidate.controllerId,
          source: candidate.source,
          affected: [target.object],
          data: {
            object: target.object,
            counter: steamCost.counter.name,
            amount: target.amount,
          },
        });
      }
    }
    // Solray Plating: banish the explicitly selected soul card as the cost of
    // the accepted prevention.
    if (effect.type === "prevention" && isBanishFromSoulCost(effect.optionalCost)) {
      const soulId = validPersistedCostTargetId(state, candidate);
      if (soulId) {
        const banished = snapshotObject(state, soulId, candidate.controllerId, "soul");
        subEvents.push({
          ...damageEvent,
          name: "banish",
          cause: {
            kind: "effect",
            abilityId: candidate.replacementId,
            source: candidate.source,
            controllerId: candidate.controllerId,
          },
          controllerId: candidate.controllerId,
          source: candidate.source,
          affected: [banished],
          data: {
            object: banished,
            destinationRef: nextFabDestinationRef(state, banished, destinationOffset),
            from: "soul" as FabZone,
            to: "banished",
            reason: "banish",
          },
        });
      }
    }
    const sourceBanish = effect.additionalModification;
    if (
      preventedAmount > 0 &&
      sourceBanish &&
      isPreventionSourceBanish(sourceBanish) &&
      sourceBanish.target.selector === "binding"
    ) {
      const damageSource = damageEvent.data.source;
      const from = damageSource ? canonicalZone(damageSource.zone) : null;
      if (
        damageSource &&
        from &&
        (!sourceBanish.target.filter ||
          matchesFabSnapshotFilter(
            state,
            damageSource,
            sourceBanish.target.filter,
            undefined,
            candidate.controllerId,
          ))
      ) {
        subEvents.push({
          ...damageEvent,
          name: "banish",
          source: candidate.source,
          affected: [damageSource],
          cause: {
            kind: "effect",
            abilityId: candidate.replacementId,
            source: candidate.source,
            controllerId: candidate.controllerId,
          },
          data: {
            object: damageSource,
            destinationRef: nextFabDestinationRef(
              state,
              damageSource,
              destinationOffset + subEvents.length,
            ),
            from,
            to: "banished",
            reason: "banish",
            ...(sourceBanish.faceDown ? { faceDown: true } : {}),
          },
        });
      }
    }
    // "If you prevent damage this way, create a … token" (Constella Tiara,
    // Lightning Flow family). additionalModification fires only when
    // prevention actually reduced damage. Interlude gates Copper on the
    // recipient being another hero (target-exists hero/another-hero).
    const followUpToken =
      preventedAmount > 0 && effect.type === "prevention"
        ? preventionFollowUpCreateToken(effect, {
            controllerId: candidate.controllerId,
            recipientPlayerId: isHeroTarget(damageEvent.data.target)
              ? damageEvent.data.target.playerId
              : null,
          })
        : null;
    if (followUpToken) {
      const tokenSlug = followUpToken;
      const tokenCanonicalId = `token:${tokenSlug}`;
      const registeredDef = state.cardDefinitions[tokenCanonicalId];
      const tokenBase = registeredDef
        ? basePropertiesOf(registeredDef)
        : syntheticTokenBaseProperties(tokenSlug);
      const instanceId = `${candidate.replacementId}:then-token`;
      const tokenObject = createSyntheticFabObjectSnapshot({
        ref: {
          instanceId,
          incarnation: state.counters.objectIncarnation + 1,
        },
        canonicalId: tokenCanonicalId,
        objectKind: "created-token",
        baseSource: { kind: "registered" },
        ownerId: candidate.controllerId,
        controllerId: candidate.controllerId,
        zone: "unknown",
        zoneRef: { playerId: fabPlayerId(candidate.controllerId), zone: "arena" },
        base: tokenBase,
      });
      subEvents.push({
        ...damageEvent,
        name: "create",
        cause: {
          kind: "effect",
          abilityId: candidate.replacementId,
          source: candidate.source,
          controllerId: candidate.controllerId,
        },
        controllerId: candidate.controllerId,
        source: candidate.source,
        affected: [tokenObject],
        data: { playerId: candidate.controllerId, object: tokenObject },
      });
    }
    // Solray / quell-shaped "if you do, destroy this at the beginning of the
    // end phase" — mark source for end-turn cleanup (same path as CR 8.3.19
    // quell-pending-destroy). The paid "if you do" cost, not the resulting
    // prevented amount, controls this follow-up (CR 6.4.10h).
    if (
      candidate.persistedApplicationPolicy?.kind === "may-apply" &&
      candidate.persistedApplicationPolicy.followUps.some(
        (followUp) => followUp.kind === "destroy-source-at-end-phase",
      )
    ) {
      subEvents.push({
        ...damageEvent,
        name: "set-status",
        cause: {
          kind: "effect",
          abilityId: candidate.replacementId,
          source: candidate.source,
          controllerId: candidate.controllerId,
        },
        controllerId: candidate.controllerId,
        source: candidate.source,
        affected: [candidate.source],
        data: { object: candidate.source, status: "quell-pending-destroy" },
      });
    }
    return {
      event:
        resultingDamage > 0
          ? { ...damageEvent, data: { ...damageEvent.data, amount: resultingDamage } }
          : null,
      subEvents,
    };
  }
  // Swordmaster's Path: boost sharpen count by modification.times (additional).
  if (
    effect.type === "replacement" &&
    event.name === "sharpen" &&
    isAdditionalSharpenReplacement(effect)
  ) {
    const extra = additionalSharpenExtra(effect);
    if (extra <= 0) return { event };
    return {
      event: {
        ...event,
        data: { ...event.data, count: event.data.count + extra },
      },
    };
  }
  // Reverent Rerebrace: pay {r}, destroy this, sharpen an additional time.
  // Auto-accept when replacementApplies already gated affordability + seat.
  if (
    effect.type === "replacement" &&
    event.name === "sharpen" &&
    isOptionalPayDestroyAdditionalSharpenReplacement(effect)
  ) {
    const extra = additionalSharpenExtra(effect);
    const payAmount = optionalPayDestroyResourceCost(effect);
    const cause = {
      kind: "effect" as const,
      abilityId: candidate.replacementId,
      source: candidate.source,
      controllerId: candidate.controllerId,
    };
    const subEvents: ProposedEvent[] = [];
    if (payAmount > 0) {
      subEvents.push({
        ...event,
        name: "pay-resources",
        cause,
        controllerId: candidate.controllerId,
        source: candidate.source,
        affected: [],
        data: { playerId: candidate.controllerId, amount: payAmount },
      });
    }
    subEvents.push({
      ...event,
      name: "destroy",
      cause,
      controllerId: candidate.controllerId,
      source: candidate.source,
      affected: [candidate.source],
      data: {
        object: candidate.source,
        destinationRef: nextFabDestinationRef(state, candidate.source, destinationOffset),
        from: candidate.source.zone as FabZone,
        to: "graveyard",
        reason: "destroy",
      },
    });
    return {
      event: {
        ...event,
        data: { ...event.data, count: event.data.count + Math.max(0, extra) },
      },
      subEvents,
    };
  }
  // Smoldering Scales: cancel Frostbite (or other filtered) create under
  // controller; after acceptance, destroy the scales equipment instead.
  // Smoldering Steel: the same create replacement from graveyard, instead
  // banishing this (functionalZones: graveyard).
  if (
    effect.type === "replacement" &&
    event.name === "create" &&
    isOptionalDestroySelfCreateReplacement(effect)
  ) {
    const leaf =
      effect.modification.type === "optional" ? effect.modification.effect : effect.modification;
    const sourceZone = candidate.source.zone as string;
    if (leaf.type === "banish") {
      const inGraveyard = sourceZone === "graveyard";
      if (!inGraveyard) return { event };
      return {
        event: null,
        subEvents: [
          {
            ...event,
            name: "banish",
            cause: {
              kind: "effect",
              abilityId: candidate.replacementId,
              source: candidate.source,
              controllerId: candidate.controllerId,
            },
            controllerId: candidate.controllerId,
            source: candidate.source,
            affected: [candidate.source],
            data: {
              object: candidate.source,
              destinationRef: nextFabDestinationRef(state, candidate.source, destinationOffset),
              from: candidate.source.zone as FabZone,
              to: "banished",
              reason: "banish",
            },
          },
        ],
      };
    }
    // Source must still be equipped (while-in-arena).
    const arenaSeats = ["arena", "head", "chest", "arms", "legs", "weapon1", "weapon2"] as const;
    const stillSeated =
      arenaSeats.includes(sourceZone as (typeof arenaSeats)[number]) ||
      sourceZone === "equipment-head" ||
      sourceZone === "equipment-chest" ||
      sourceZone === "equipment-arms" ||
      sourceZone === "equipment-legs" ||
      sourceZone === "permanent" ||
      sourceZone === "weapon";
    if (!stillSeated) return { event };
    return {
      event: null,
      subEvents: [
        {
          ...event,
          name: "destroy",
          cause: {
            kind: "effect",
            abilityId: candidate.replacementId,
            source: candidate.source,
            controllerId: candidate.controllerId,
          },
          controllerId: candidate.controllerId,
          source: candidate.source,
          affected: [candidate.source],
          data: {
            object: candidate.source,
            destinationRef: nextFabDestinationRef(state, candidate.source, destinationOffset),
            from: candidate.source.zone as FabZone,
            to: "graveyard",
            reason: "destroy",
          },
        },
      ],
    };
  }
  // Vestige of Flagellation: cancel opponent gain-life; controller loses that
  // much life and creates that many Vigor (or other) tokens.
  if (
    effect.type === "replacement" &&
    event.name === "gain-life" &&
    isOpponentGainLifeToLoseLifeCreateTokensReplacement(effect)
  ) {
    const amount = event.data.amount;
    if (amount <= 0) return { event: null };
    const modification = effect.modification;
    if (modification.type !== "sequence") return { event };
    const createStep = modification.steps[1];
    const tokenSlug =
      createStep?.type === "create-token" && typeof createStep.token === "string"
        ? createStep.token
        : "vigor";
    const tokenCanonicalId = `token:${tokenSlug}`;
    const registeredDef = state.cardDefinitions[tokenCanonicalId];
    const tokenBase = registeredDef
      ? basePropertiesOf(registeredDef)
      : syntheticTokenBaseProperties(tokenSlug);
    const cause = {
      kind: "effect" as const,
      abilityId: candidate.replacementId,
      source: candidate.source,
      controllerId: candidate.controllerId,
    };
    const subEvents: ProposedEvent[] = [
      {
        ...event,
        name: "lose-life",
        cause,
        controllerId: candidate.controllerId,
        source: candidate.source,
        affected: [],
        data: {
          playerId: candidate.controllerId,
          amount,
          source: candidate.source.instanceId,
        },
      },
    ];
    for (let i = 0; i < amount; i += 1) {
      const instanceId = `${candidate.replacementId}:token-${i + 1}`;
      const tokenObject = createSyntheticFabObjectSnapshot({
        ref: {
          instanceId,
          incarnation: state.counters.objectIncarnation + i + 1,
        },
        canonicalId: tokenCanonicalId,
        objectKind: "created-token",
        baseSource: { kind: "registered" },
        ownerId: candidate.controllerId,
        controllerId: candidate.controllerId,
        zone: "unknown",
        zoneRef: { playerId: fabPlayerId(candidate.controllerId), zone: "arena" },
        base: tokenBase,
      });
      subEvents.push({
        ...event,
        name: "create",
        cause,
        controllerId: candidate.controllerId,
        source: candidate.source,
        affected: [tokenObject],
        data: { playerId: candidate.controllerId, object: tokenObject },
      });
    }
    return { event: null, subEvents };
  }
  // Poison the Well: replace the gaining hero's life gain with an equal life
  // loss. The replacement source becomes the cause while the original
  // playerId and amount remain the affected event parameters (CR 6.4.6).
  if (
    effect.type === "replacement" &&
    event.name === "gain-life" &&
    isGainLifeToLoseLifeReplacement(effect)
  ) {
    if (event.data.amount <= 0) return { event: null };
    return {
      event: {
        ...event,
        name: "lose-life",
        cause: {
          kind: "effect",
          abilityId: candidate.replacementId,
          source: candidate.source,
          controllerId: candidate.controllerId,
        },
        controllerId: candidate.controllerId,
        source: candidate.source,
        data: {
          playerId: event.data.playerId,
          amount: event.data.amount,
          source: candidate.source.instanceId,
        },
      },
    };
  }
  if (
    effect.type === "replacement" &&
    event.name === "pitch" &&
    isPitchResourceBoostReplacement(effect) &&
    effect.modification.type === "gain-resources" &&
    typeof effect.modification.amount === "number"
  ) {
    // Vestige: base pitch resources + N (printed "that many {r} plus 1").
    return {
      event: {
        ...event,
        data: {
          ...event.data,
          resourcesGenerated: event.data.resourcesGenerated + effect.modification.amount,
        },
      },
    };
  }
  if (
    effect.type === "replacement" &&
    event.name === "pitch" &&
    event.data.resourcesGenerated === 1 &&
    effect.modification.type === "sequence" &&
    effect.modification.steps[0]?.type === "destroy" &&
    effect.modification.steps[1]?.type === "gain-resources" &&
    typeof effect.modification.steps[1].amount === "number"
  ) {
    return {
      event: {
        ...event,
        data: {
          ...event.data,
          destinationRef: nextFabDestinationRef(state, event.data.object, destinationOffset + 1),
          resourcesGenerated: event.data.resourcesGenerated + effect.modification.steps[1].amount,
        },
      },
      subEvents: [
        {
          ...event,
          name: "destroy",
          cause: {
            kind: "effect",
            abilityId: candidate.replacementId,
            source: candidate.source,
            controllerId: candidate.controllerId,
          },
          controllerId: candidate.controllerId,
          source: candidate.source,
          affected: [candidate.source],
          data: {
            object: candidate.source,
            destinationRef: nextFabDestinationRef(state, candidate.source, destinationOffset),
            from: candidate.source.zone,
            to: "graveyard",
            reason: "destroy",
          },
        },
      ],
    };
  }
  if (
    effect.type === "replacement" &&
    event.name === "enter-arena" &&
    effect.modification.type === "add-counter"
  ) {
    const count = resolveEnterArenaCounterCount(state, candidate, effect.modification.count, event);
    if (count === null || count < 1) return { event };
    if (effect.modification.counter.kind === "named") {
      return {
        event,
        subEvents: [
          {
            ...event,
            name: "counter-added",
            affected: [event.data.object],
            data: {
              object: event.data.object,
              counter: effect.modification.counter.name,
              amount: count,
            },
          },
        ],
      };
    }
    if (effect.modification.counter.kind === "numeric") {
      return {
        event,
        subEvents: [
          {
            ...event,
            name: "numeric-counter-added",
            affected: [event.data.object],
            data: {
              object: event.data.object,
              property: effect.modification.counter.property,
              value: effect.modification.counter.value as number,
              count,
            },
          },
        ],
      };
    }
  }
  if (
    effect.type === "replacement" &&
    event.name === "enter-arena" &&
    isEnterArenaTappedReplacement(effect)
  ) {
    return {
      event: {
        ...event,
        data: { ...event.data, entersTapped: true },
      },
    };
  }
  // Destination rewrite: put on the bottom of the deck instead of the graveyard.
  if (
    effect.type === "replacement" &&
    isGraveyardToDeckBottomReplacement(effect) &&
    isGraveyardDestinationEvent(event) &&
    "object" in event.data
  ) {
    const object = event.data.object;
    const from =
      event.name === "discard" ? ("hand" as const) : (canonicalZone(object.zone) ?? "unknown");
    const { name: _name, ...base } = event;
    const rewritten: ProposedEvent<"move-zone"> = {
      ...base,
      name: "move-zone",
      data: {
        ...event.data,
        object,
        destinationRef:
          "destinationRef" in event.data && event.data.destinationRef
            ? event.data.destinationRef
            : nextFabDestinationRef(state, object, destinationOffset),
        from,
        to: "deck",
        position: "bottom",
        reason: "move",
      },
    };
    return { event: rewritten };
  }
  // Destination rewrite: put into banished instead of the graveyard.
  // Keep the primary event name (move-zone / destroy) so combat-close and
  // destroy follow-ups still reduce; only the destination zone changes.
  if (
    effect.type === "replacement" &&
    isGraveyardToBanishReplacement(effect) &&
    (event.name === "move-zone" || event.name === "destroy") &&
    "to" in event.data &&
    event.data.to === "graveyard" &&
    "object" in event.data
  ) {
    const object = event.data.object;
    return {
      event: {
        ...event,
        data: {
          ...event.data,
          object,
          destinationRef:
            event.data.destinationRef ?? nextFabDestinationRef(state, object, destinationOffset),
          to: "banished" as const,
          // Preserve destroy cause so observational destroy follow-ups still fire.
          reason:
            event.data.reason === "destroy" || event.name === "destroy"
              ? ("destroy" as const)
              : ("banish" as const),
        },
      },
    };
  }
  // Topsy Turvy: move-zone to deck top → bottom.
  if (
    effect.type === "replacement" &&
    isDeckTopToBottomReplacement(effect) &&
    event.name === "move-zone" &&
    "to" in event.data &&
    event.data.to === "deck" &&
    "position" in event.data &&
    event.data.position === "top" &&
    "object" in event.data
  ) {
    return {
      event: {
        ...event,
        data: {
          ...event.data,
          position: "bottom" as const,
        },
      },
    };
  }
  // DTD164 Blasmophet: cancel the blood-debt loss and banish the current top
  // card. The sub-event remains a normal banish, so other replacement and
  // triggered effects (including Blasmophet's face-down trigger) observe it.
  if (
    effect.type === "replacement" &&
    event.name === "lose-life" &&
    isBloodDebtLoseLifeToTopDeckBanishReplacement(effect)
  ) {
    const deck = state.containers.zonesByPlayerId[candidate.controllerId]?.deck ?? [];
    const topId = deck[deck.length - 1];
    if (!topId) return { event: null };
    const topCard = snapshotObject(state, topId, candidate.controllerId, "deck");
    return {
      event: null,
      subEvents: [
        {
          ...event,
          name: "banish",
          cause: {
            kind: "effect",
            abilityId: candidate.replacementId,
            source: candidate.source,
            controllerId: candidate.controllerId,
          },
          controllerId: candidate.controllerId,
          source: candidate.source,
          affected: [topCard],
          data: {
            object: topCard,
            destinationRef: nextFabDestinationRef(state, topCard, destinationOffset),
            from: "deck",
            to: "banished",
            reason: "banish",
          },
        },
      ],
    };
  }
  // Gambler's Gloves: accepted optional destroy-self + reroll. Count complete
  // rerolls; the reducer derives how many RNG faces each reroll consumes only
  // after every dice-count replacement has been applied.
  if (
    effect.type === "replacement" &&
    isOptionalDestroySelfRerollReplacement(effect) &&
    (event.name === "roll-request" || event.name === "roll")
  ) {
    const rerollSides = optionalDestroyRerollSides(effect);
    if (rerollSides === null) return { event };
    if (!("sides" in event.data) || event.data.sides !== rerollSides) return { event };
    const sourceZone = candidate.source.zone as string;
    const arenaSeats = ["arena", "head", "chest", "arms", "legs", "weapon1", "weapon2"] as const;
    const stillSeated =
      arenaSeats.includes(sourceZone as (typeof arenaSeats)[number]) ||
      sourceZone === "equipment-head" ||
      sourceZone === "equipment-chest" ||
      sourceZone === "equipment-arms" ||
      sourceZone === "equipment-legs" ||
      sourceZone === "permanent" ||
      sourceZone === "weapon";
    if (!stillSeated) return { event };
    const destroySub: ProposedEvent = {
      ...event,
      name: "destroy",
      cause: {
        kind: "effect",
        abilityId: candidate.replacementId,
        source: candidate.source,
        controllerId: candidate.controllerId,
      },
      controllerId: candidate.controllerId,
      source: candidate.source,
      affected: [candidate.source],
      data: {
        object: candidate.source,
        destinationRef: nextFabDestinationRef(state, candidate.source, destinationOffset),
        from: candidate.source.zone as FabZone,
        to: "graveyard",
        reason: "destroy",
      },
    };
    if (event.name === "roll-request") {
      const priorRerolls =
        "rerollCount" in event.data && typeof event.data.rerollCount === "number"
          ? event.data.rerollCount
          : 0;
      return {
        event: {
          ...event,
          data: {
            ...event.data,
            rerollCount: priorRerolls + 1,
          },
        },
        subEvents: [destroySub],
      };
    }
    // Follow-up roll already has a face: re-sample is not available here (RNG
    // advances only in roll-request reduce). Prefer matching roll-request.
    return { event, subEvents: [destroySub] };
  }
  // Ready to Roll: roll N+1 dice of the same sides and ignore the lowest.
  if (
    effect.type === "replacement" &&
    isRollPlusOneIgnoreLowestReplacement(effect) &&
    event.name === "roll-request"
  ) {
    if (
      event.controllerId !== candidate.controllerId &&
      event.data.playerId !== candidate.controllerId
    ) {
      return { event };
    }
    const extra = rollPlusOneIgnoreLowestExtraDice(effect);
    if (extra < 1) return { event };
    const prior =
      "extraDice" in event.data && typeof event.data.extraDice === "number"
        ? event.data.extraDice
        : 0;
    return {
      event: {
        ...event,
        data: {
          ...event.data,
          extraDice: prior + extra,
          ignore: "lowest",
        },
      },
    };
  }
  // Metacarpus Node / Crucible: deal that much arcane (or any typed damage) plus N.
  if (
    effect.type === "replacement" &&
    isDamageAmountBoostReplacement(effect) &&
    event.name === "deal-damage" &&
    "amount" in event.data
  ) {
    // CR 8.5.47: only arcane damage dealt by a source the amp controller
    // controls can consume and receive this one-shot replacement.
    if (event.controllerId !== candidate.controllerId) return { event };
    // CR 6.4.10: resolve the boost extra via evaluateAmount — a literal N
    // (Metacarpus Node) or a live FabAmount (Aether Flare's count of arcane
    // damage dealt this turn) both settle against the deal-damage event.
    const boostAmount = damageAmountBoostAmount(effect);
    if (boostAmount === null) return { event };
    const resolvedBoost = resolveCanonicalAmount(state, candidate, boostAmount, event.data.amount);
    // An unresolvable boost amount boosts NOTHING (0), mirroring the literal
    // `> 0` gate — never the event's own amount, which a positive-damage
    // fallback would turn into amount + eventAmount = 2× the damage.
    const extra = resolvedBoost ?? 0;
    if (extra <= 0) return { event };
    if (damageIncreaseIsRestricted(state, event)) return { event };
    if (
      "damageType" in effect.replaces &&
      effect.replaces.damageType &&
      event.data.damageType !== effect.replaces.damageType
    ) {
      return { event };
    }
    // Optional appliesTo / source filter on the damage source (next arcane card).
    if (effect.replaces.filter && event.source) {
      if (!matchesFabSnapshotFilter(state, event.source, effect.replaces.filter)) {
        return { event };
      }
    }
    const nextFilter = replacementAppliesToNextFilter(effect);
    if (nextFilter) {
      if (!event.source || !matchesFabSnapshotFilter(state, event.source, nextFilter)) {
        return { event };
      }
    }
    return {
      event: {
        ...event,
        data: {
          ...event.data,
          amount: event.data.amount + extra,
        },
      },
    };
  }
  // Myrkhellir Helm: keep the original draw; queue N extra draws from deck top.
  // Kernel commits subEvents before the original; each hand-bound draw must
  // use consecutive destinationRef incarnations (objectIncarnation+1 at reduce).
  if (
    effect.type === "replacement" &&
    isDrawCountBoostReplacement(effect) &&
    event.name === "draw" &&
    "playerId" in event.data &&
    "object" in event.data
  ) {
    const extra = drawCountBoostExtra(effect);
    if (extra <= 0) return { event };
    const playerId = event.data.playerId;
    const deckOwnerId = event.data.object.ownerId || playerId;
    const deck = state.containers.zonesByPlayerId[deckOwnerId]?.deck ?? [];
    const claimed = new Set<string>([event.data.object.instanceId]);
    const subEvents: ProposedEvent[] = [];
    for (let i = 0; i < extra; i += 1) {
      let pickId: string | undefined;
      for (let d = deck.length - 1; d >= 0; d -= 1) {
        const id = deck[d]!;
        if (claimed.has(id)) continue;
        pickId = id;
        break;
      }
      if (!pickId) break;
      claimed.add(pickId);
      const drawn = snapshotObject(state, pickId, deckOwnerId, "deck");
      // Sub-events commit first: resetOffset 0, 1, … so first extra is C+1.
      subEvents.push({
        ...event,
        affected: [drawn],
        data: {
          playerId,
          object: drawn,
          destinationRef: nextFabDestinationRef(state, drawn, destinationOffset + i),
        },
      });
    }
    if (subEvents.length === 0) return { event };
    // Original commits after extras — shift its incarnation past the extras.
    return {
      event: {
        ...event,
        data: {
          ...event.data,
          destinationRef: nextFabDestinationRef(
            state,
            event.data.object,
            destinationOffset + subEvents.length,
          ),
        },
      },
      subEvents,
    };
  }
  // Talisman of Tithes: cancel this one-card opponent draw and destroy self.
  if (
    effect.type === "replacement" &&
    isOpponentDrawMinusOneDestroySelfReplacement(effect) &&
    event.name === "draw"
  ) {
    return {
      event: null,
      subEvents: [
        {
          ...event,
          name: "destroy",
          cause: {
            kind: "effect",
            abilityId: candidate.replacementId,
            source: candidate.source,
            controllerId: candidate.controllerId,
          },
          controllerId: candidate.controllerId,
          source: candidate.source,
          affected: [candidate.source],
          data: {
            object: candidate.source,
            destinationRef: nextFabDestinationRef(state, candidate.source, destinationOffset),
            from: candidate.source.zone as FabZone,
            to: "graveyard",
            reason: "destroy",
          },
        },
      ],
    };
  }
  if (
    effect.type === "replacement" &&
    isOpponentDrawRedirectToControllerReplacement(effect) &&
    event.name === "draw" &&
    "object" in event.data
  ) {
    // SEA149 Not So Fast: cancel the opponent's Gold-token draw and queue one
    // draw for the replacement's controller off their own deck top.
    const controllerId = candidate.controllerId;
    const deck = state.containers.zonesByPlayerId[controllerId]?.deck ?? [];
    const pickId = deck[deck.length - 1];
    if (!pickId) return { event: null };
    const drawn = snapshotObject(state, pickId, controllerId, "deck");
    return {
      event: null,
      subEvents: [
        {
          ...event,
          controllerId,
          affected: [drawn],
          data: {
            ...event.data,
            playerId: controllerId,
            object: drawn,
            destinationRef: nextFabDestinationRef(state, drawn, destinationOffset),
          },
        },
      ],
    };
  }
  if (
    effect.type === "replacement" &&
    isClashSwapRevealReplacement(effect) &&
    event.name === "clash-outcome"
  ) {
    return { event };
  }
  // Outcome-stage re-clash: the optional decision, exact Gold payment, and
  // exact original reveal are all persisted before this consequence runs.
  if (
    effect.type === "replacement" &&
    isClashTieWinClashReplacement(effect) &&
    event.name === "clash-outcome" &&
    !event.data.winnerId
  ) {
    const chosenHeroId = candidate.persistedConsequenceTarget?.instanceId;
    const winnerId = chosenHeroId
      ? state.playerIds.find((playerId) =>
          state.containers.zonesByPlayerId[playerId]?.heroZone.includes(chosenHeroId),
        )
      : undefined;
    const firstPlayerId = event.data.firstPlayerId;
    const secondPlayerId = event.data.secondPlayerId;
    if (winnerId !== firstPlayerId && winnerId !== secondPlayerId) return { event };
    const loserId = winnerId === firstPlayerId ? secondPlayerId : firstPlayerId;
    return {
      event: {
        ...event,
        bindings: {
          ...event.bindings,
          winner: winnerId,
          loser: loserId,
          "clash-result": winnerId === firstPlayerId ? "won" : "lost",
        },
        data: { ...event.data, winnerId },
      },
    };
  }
  if (
    effect.type === "replacement" &&
    isClashFailToWinRevealingThisReplacement(effect) &&
    event.name === "clash-outcome" &&
    event.data.winnerId !== candidate.controllerId
  ) {
    const winnerId = candidate.controllerId;
    const firstPlayerId = event.data.firstPlayerId;
    const secondPlayerId = event.data.secondPlayerId;
    if (winnerId !== firstPlayerId && winnerId !== secondPlayerId) return { event };
    const loserId = winnerId === firstPlayerId ? secondPlayerId : firstPlayerId;
    const rewritten = {
      ...event,
      bindings: {
        ...event.bindings,
        winner: winnerId,
        loser: loserId,
        "clash-result": winnerId === firstPlayerId ? "won" : "lost",
      },
      data: { ...event.data, winnerId },
    };
    const boos =
      effect.modification.type === "sequence" &&
      effect.modification.steps.some((step) => step.type === "crowd-boos");
    return {
      event: rewritten,
      ...(boos
        ? {
            subEvents: [
              {
                ...event,
                name: "crowd-boos" as const,
                affected: [],
                data: { playerId: winnerId },
              },
            ],
          }
        : {}),
    };
  }
  if (
    effect.type === "replacement" &&
    clashOutcomeOptionalReclash(effect) &&
    event.name === "clash-outcome"
  ) {
    const key = replacementCostCommitKey(candidate, event);
    const receipt = key ? state.rulesProcess?.replacementCostCommitReceipts?.[key] : undefined;
    const selected = candidate.persistedConsequenceTarget;
    const original = selected
      ? event.data.revealed.find(
          (object) =>
            object.instanceId === selected.instanceId &&
            object.ref.incarnation === selected.incarnation,
        )
      : undefined;
    const consequenceKey =
      key && original
        ? `${key}:reveal:${original.instanceId}:${original.ref.incarnation}`
        : undefined;
    const consequenceReceipt = consequenceKey
      ? state.rulesProcess?.replacementConsequenceCommitReceipts?.[consequenceKey]
      : undefined;
    if (receipt?.status !== "committed" || consequenceReceipt?.status !== "committed" || !original)
      return { event };
    const ownerDeck = state.containers.zonesByPlayerId[original.ownerId]?.deck ?? [];
    if (
      !ownerDeck.includes(original.instanceId) ||
      state.objects[original.instanceId]?.incarnation !== original.ref.incarnation
    )
      return { event };
    const cause = {
      kind: "effect" as const,
      abilityId: candidate.replacementId,
      source: candidate.source,
      controllerId: candidate.controllerId,
    };
    return {
      event: null,
      subEvents: [
        {
          ...event,
          name: "reclash-request",
          cause,
          controllerId: candidate.controllerId,
          source: candidate.source,
          affected: [],
          bindings: { ...event.bindings, "reclash-final": true },
          data: {
            clashId: event.data.clashId,
            firstPlayerId: event.data.firstPlayerId,
            secondPlayerId: event.data.secondPlayerId,
            ...(event.data.deferredEffect ? { deferredEffect: event.data.deferredEffect } : {}),
          },
        },
      ],
    };
  }
  // Cheating Scoundrel: paying the declared discard cost reverses only this
  // exact immutable wager outcome. The wager-loss reducer later publishes the
  // new winner and creates the preserved prize exactly once.
  if (
    effect.type === "replacement" &&
    isWagerLossOptionalDiscardWinReplacement(effect) &&
    event.name === "wager-loss"
  ) {
    const key = replacementCostCommitKey(candidate, event);
    const receipt = key ? state.rulesProcess?.replacementCostCommitReceipts?.[key] : undefined;
    if (receipt?.status !== "committed" || event.data.loserId !== candidate.controllerId) {
      return { event };
    }
    return {
      event: {
        ...event,
        controllerId: event.data.winnerId,
        bindings: {
          ...event.bindings,
          winner: event.data.loserId,
          loser: event.data.winnerId,
        },
        data: {
          ...event.data,
          winnerId: event.data.loserId,
          loserId: event.data.winnerId,
        },
      },
    };
  }
  if (
    effect.type === "prevention" ||
    (effect.type === "replacement" && supportedCanonicalReplacement(effect))
  ) {
    return { event };
  }
  throw unhandledAdmittedReplacement(candidate, event);
}

/** Fail-closed: an admitted/collected replacement cannot apply as identity. */
export function unhandledAdmittedReplacement(
  candidate: FabReplacementCandidate,
  event: ProposedEvent,
): never {
  throw new Error(
    `Unhandled admitted FAB replacement ${candidate.replacementId} (${candidate.effect.type}) for event ${event.name}`,
  );
}

function applyNumericReplacement(
  value: number,
  operation: "add" | "subtract" | "set" | "multiply" | "divide",
  amount: number,
): number {
  switch (operation) {
    case "add":
      return value + amount;
    case "subtract":
      return value - amount;
    case "set":
      return amount;
    case "multiply":
      return value * amount;
    case "divide":
      if (amount === 0)
        throw new Error("FAB continuous application replacement cannot divide by zero.");
      return value / amount;
  }
}
