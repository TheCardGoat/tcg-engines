import type { FabCardFilter, FabStaticAbility, FabZone } from "@tcg/flesh-and-blood-types";
import { FAB_ZONE_KINDS, type FabMatchState, type FabZoneKind } from "../../state.ts";
import type { FabObjectSnapshot, ProposedEvent } from "../../rules/events.ts";
import type {
  FabCanonicalReplacementEffect,
  FabReplacementCandidate,
} from "../../rules/process.ts";
import { snapshotObject, snapshotPlayerId } from "../../rules/snapshots.ts";
import { buildFabRulesView, matchesFabSnapshotFilter } from "../../rules/state-rules-view.ts";
import type { FabRulesSnapshot } from "../transaction-kernel.ts";
import { matchesNumericComparison } from "../../rules/evaluation/compare.ts";
import { evaluateCanonicalCondition } from "../../rules/condition-evaluator.ts";
import { rewriteAppliesToNextFilter } from "../../rules/continuous/reconciler.ts";
import { resolvePreventionKeywordAmount } from "./amounts.ts";
import {
  type CanonicalPrevention,
  type CanonicalReplacement,
  clashOutcomeOptionalReclash,
  isClashTieWinClashReplacement,
  isClashFailToWinRevealingThisReplacement,
  isClashSwapRevealReplacement,
  isAdditionalSharpenReplacement,
  isBanishFromSoulCost,
  isCreateExtraReplacement,
  isDrawCountBoostReplacement,
  isOpponentDrawMinusOneDestroySelfReplacement,
  isOpponentDrawRedirectToControllerReplacement,
  isEnterArenaAddCounterReplacement,
  isGraveyardToBanishReplacement,
  isGraveyardToDeckBottomReplacement,
  isNamedCounterRemovalCost,
  type NamedCounterRemovalCost,
  isOncePerTurnReplacementLimit,
  isOptionalDestroySelfRerollReplacement,
  isRollPlusOneIgnoreLowestReplacement,
  rollPlusOneIgnoreLowestExtraDice,
  isOptionalPayDestroyAdditionalSharpenReplacement,
  isPitchResourceBoostReplacement,
  isPowerGainAmountReplacement,
  isWagerLossOptionalDiscardWinReplacement,
  optionalDestroyRerollSides,
  optionalPayDestroyResourceCost,
  supportedCanonicalReplacement,
} from "./admission.ts";
import { staticPreventionKeywordPolicy } from "./keywords.ts";
import {
  persistedReplacementApplicationPolicy,
  persistedReplacementCostTargetIds,
  replacementCostCommitKey,
} from "./persist.ts";

/** Snapshot serializable, currently applicable replacement sources at an event boundary. */
export function collectApplicableReplacementCandidates(
  state: FabRulesSnapshot,
  events: readonly ProposedEvent[],
): FabReplacementCandidate[] {
  return collectReplacementCandidates(state, events, true);
}

/**
 * Hand cards that can pitch toward a resource-point cost (CR 1.14.2d): a
 * rules-view evaluated pitch value above zero. Chi cards are excluded —
 * their pitch generates chi points, which the pay-resources cost of a
 * static-keyword prevention cannot spend.
 */
export function replacementPitchCandidates(
  state: FabRulesSnapshot,
  playerId: string,
  excludeInstanceIds: readonly string[] = [],
): { readonly instanceId: string; readonly value: number }[] {
  const view = buildFabRulesView(state);
  return (state.containers.zonesByPlayerId[playerId]?.hand ?? []).flatMap((instanceId) => {
    if (excludeInstanceIds.includes(instanceId)) return [];
    const record = state.objects[instanceId];
    const evaluated = record
      ? view.object({ instanceId: record.instanceId, incarnation: record.incarnation })
      : null;
    const value = evaluated?.current.numeric.pitch ?? 0;
    const chi = evaluated?.current.typeBox.subtypes.includes("Chi") ?? false;
    return value > 0 && !chi ? [{ instanceId, value }] : [];
  });
}

/**
 * Unpaid remainder of a resource-point asset cost (CR 1.14.2d): banked
 * resource points and every pitchable hand card count toward the payment,
 * including cards already bound as payment — they stay in hand until the
 * prevention application commits their pitch.
 */
export function payResourcesShortfall(
  state: FabRulesSnapshot,
  playerId: string,
  amount: number,
  bound: readonly { readonly instanceId: string; readonly incarnation: number }[] = [],
): number {
  const player = state.players[playerId];
  if (!player || amount <= 0) return 0;
  const view = buildFabRulesView(state);
  const boundValue = bound.reduce((total, binding) => {
    const evaluated = view.object({
      instanceId: binding.instanceId,
      incarnation: binding.incarnation,
    });
    const value = evaluated?.current.numeric.pitch ?? 0;
    const chi = evaluated?.current.typeBox.subtypes.includes("Chi") ?? false;
    return total + (chi ? 0 : Math.max(0, value));
  }, 0);
  const remaining = amount - player.resourcePoints - boundValue;
  if (remaining <= 0) return 0;
  const pitchable = replacementPitchCandidates(
    state,
    playerId,
    bound.map((binding) => binding.instanceId),
  );
  const coverable = pitchable.reduce((total, candidate) => total + candidate.value, 0);
  return Math.max(0, remaining - coverable);
}

/**
 * How much of a candidate's static-keyword pay-resources cost is still
 * uncovered by banked resource points and already-bound pitch cards. This —
 * not the coverage-aware {@link payResourcesShortfall} — drives the pitch
 * rounds: unbound hand cards may cover the cost, but only bound pitches
 * generate the resource points the application will spend.
 */
export function staticPreventionPayShortfall(
  state: FabRulesSnapshot,
  candidate: FabReplacementCandidate,
): number {
  if (
    candidate.staticPreventionApplication?.kind !== "static-keyword" ||
    candidate.staticPreventionApplication.cost !== "pay-resources" ||
    candidate.effect.type !== "prevention" ||
    typeof candidate.effect.amount !== "number"
  ) {
    return 0;
  }
  const player = state.players[candidate.controllerId];
  if (!player) return 0;
  const view = buildFabRulesView(state);
  const boundValue = (candidate.persistedPitchedInstanceIds ?? []).reduce((total, binding) => {
    const evaluated = view.object({
      instanceId: binding.instanceId,
      incarnation: binding.incarnation,
    });
    const value = evaluated?.current.numeric.pitch ?? 0;
    const chi = evaluated?.current.typeBox.subtypes.includes("Chi") ?? false;
    return total + (chi ? 0 : Math.max(0, value));
  }, 0);
  return Math.max(0, candidate.effect.amount - player.resourcePoints - boundValue);
}

/**
 * Candidate universe for commit-time CR 6.4.2a re-evaluation. Unlike the UI
 * boundary collector, this retains supported sources that are not active for
 * the original event but may become active after another replacement.
 */
export function collectPotentialReplacementCandidates(
  state: FabRulesSnapshot,
  events: readonly ProposedEvent[],
): FabReplacementCandidate[] {
  return collectReplacementCandidates(state, events, false);
}

function collectReplacementCandidates(
  state: FabRulesSnapshot,
  events: readonly ProposedEvent[],
  applicableOnly: boolean,
): FabReplacementCandidate[] {
  const candidates = [
    ...staticReplacementCandidates(state, events),
    ...state.replacementEffects
      .filter((replacement) => !replacementExpired(state, replacement.expiresAt))
      .flatMap((replacement): FabReplacementCandidate[] => {
        const tokenKeys = isCreateExtraReplacement(replacement.effect)
          ? distinctCreateTokenKeys(state, events, replacement.controllerId, replacement.effect)
          : [];
        const candidates = tokenKeys.length > 0 ? tokenKeys : [undefined];
        return candidates.map(
          (createTokenKey): FabReplacementCandidate => ({
            replacementId: replacement.replacementId,
            ...(createTokenKey
              ? {
                  replacementId: `${replacement.replacementId}:create:${createTokenKey}`,
                  originReplacementId: replacement.replacementId,
                  createTokenKey,
                }
              : {}),
            controllerId: replacement.controllerId,
            source: replacement.source,
            replacementKind:
              replacement.effect.type === "prevention"
                ? "prevention"
                : canonicalReplacementKind(replacement.effect.replacementKind),
            applicationScope: createTokenKey
              ? {
                  kind: "multi-event",
                  scopeId: `${events[0]?.processId ?? "unknown-process"}:create:${createTokenKey}`,
                }
              : isDrawCountBoostReplacement(replacement.effect)
                ? {
                    kind: "multi-event",
                    scopeId: `${events[0]?.processId ?? "unknown-process"}:draw`,
                  }
                : replacement.effect.type === "replacement" &&
                    replacement.effect.modification.type === "ignore"
                  ? { kind: "unlimited" }
                  : { kind: "original-event" },
            effect: replacement.effect,
            origin: "persisted",
            consumptionPolicy: replacement.consumptionPolicy,
            optional: replacement.applicationPolicy.kind === "may-apply",
            persistedApplicationPolicy: replacement.applicationPolicy,
            ...(state.rulesProcess?.replacementCostTargetBindings?.[
              `${state.rulesProcess.replacementCostBindingScope ?? "direct"}:${replacement.replacementId}`
            ]
              ? {
                  persistedCostTarget:
                    state.rulesProcess.replacementCostTargetBindings[
                      `${state.rulesProcess.replacementCostBindingScope ?? "direct"}:${replacement.replacementId}`
                    ],
                }
              : {}),
            ...(state.rulesProcess?.replacementConsequenceTargetBindings?.[
              `${state.rulesProcess.replacementCostBindingScope ?? "direct"}:${replacement.replacementId}`
            ]
              ? {
                  persistedConsequenceTarget:
                    state.rulesProcess.replacementConsequenceTargetBindings[
                      `${state.rulesProcess.replacementCostBindingScope ?? "direct"}:${replacement.replacementId}`
                    ],
                }
              : {}),
            ...(replacement.shieldedPlayerId
              ? { shieldedPlayerId: replacement.shieldedPlayerId }
              : {}),
            ...(replacement.shieldedFilter ? { shieldedFilter: replacement.shieldedFilter } : {}),
            ...(replacement.preventedSourceInstanceId
              ? { preventedSourceInstanceId: replacement.preventedSourceInstanceId }
              : {}),
            ...(replacement.redirectPlayerId
              ? { redirectPlayerId: replacement.redirectPlayerId }
              : {}),
          }),
        );
      }),
  ];
  const seen = new Set<string>();
  return candidates.filter((candidate) => {
    if (seen.has(candidate.replacementId)) return false;
    if (applicableOnly && !events.some((event) => replacementApplies(state, candidate, event)))
      return false;
    seen.add(candidate.replacementId);
    return true;
  });
}

export function createTokenKey(event: ProposedEvent<"create">): string {
  return event.data.object.canonicalId ?? (event.data.object.current.names.join(" // ") || "token");
}

/** Creation owner is the creator; player filters independently select recipients. */
function creationMatchesCreator(
  effect: CanonicalReplacement,
  creatorId: string,
  controllerId: string,
): boolean {
  if (effect.replaces.name !== "create") return false;
  switch (effect.replaces.creator) {
    case "any":
      return true;
    case "controller":
      return creatorId === controllerId;
  }
}

function distinctCreateTokenKeys(
  state: FabRulesSnapshot,
  events: readonly ProposedEvent[],
  controllerId: string,
  effect: FabCanonicalReplacementEffect,
): string[] {
  if (effect.type !== "replacement" || !isCreateExtraReplacement(effect)) return [];
  const keys = new Set<string>();
  for (const event of events) {
    // Wager prizes are created as reducer follow-ups after the wager-loss
    // outcome (the winner can still be replaced). Seed the per-token-type
    // candidates from the captured prize so those follow-up create events are
    // evaluated by "create that many plus N" replacements in this transaction.
    if (
      event.name === "wager-loss" &&
      creationMatchesCreator(effect, event.data.winnerId, controllerId) &&
      event.data.prize?.kind === "create-token"
    ) {
      for (const canonicalId of event.data.prize.canonicalIds) keys.add(canonicalId);
      continue;
    }
    if (
      event.name !== "create" ||
      !creationMatchesCreator(effect, event.data.object.ownerId, controllerId)
    )
      continue;
    if (
      effect.replaces.filter &&
      !matchesFabSnapshotFilter(state, event.data.object, effect.replaces.filter)
    ) {
      continue;
    }
    keys.add(createTokenKey(event));
  }
  return [...keys];
}

export function expiredReplacementEffectIds(state: FabRulesSnapshot): string[] {
  return state.replacementEffects
    .filter((replacement) => replacementExpired(state, replacement.expiresAt))
    .map((replacement) => replacement.replacementId);
}

export function affectedPlayerForReplacement(
  state: FabRulesSnapshot,
  event: ProposedEvent,
): string {
  if (event.name === "deal-damage" || event.name === "dealt-damage" || event.name === "prevent") {
    return isHeroTarget(event.data.target)
      ? event.data.target.playerId
      : snapshotPlayerId(event.data.target);
  }
  if ("playerId" in event.data && typeof event.data.playerId === "string")
    return event.data.playerId;
  if ("actorId" in event.data && typeof event.data.actorId === "string") return event.data.actorId;
  return event.controllerId && state.players[event.controllerId]
    ? event.controllerId
    : state.activePlayerId;
}

function staticReplacementCandidates(
  state: FabRulesSnapshot,
  events: readonly ProposedEvent[],
): FabReplacementCandidate[] {
  // Reserve every object's position so event-boundary overrides retain the
  // same candidate ordering. Detach only objects that can supply replacements;
  // ordinary deck cards need no recursively frozen snapshot at every event.
  const objects = new Map<string, FabObjectSnapshot | undefined>();
  const view = buildFabRulesView(state);
  for (const playerId of state.playerIds) {
    const player = state.players[playerId];
    if (!player) continue;
    for (const zone of FAB_ZONE_KINDS) {
      for (const instanceId of state.containers.zonesByPlayerId[playerId]![zone]) {
        const record = state.objects[instanceId];
        if (!record) throw new Error(`cannot snapshot missing FAB object ${instanceId}`);
        const evaluated = view.object({ instanceId, incarnation: record.incarnation });
        if (!evaluated) throw new Error(`cannot evaluate FAB object ${instanceId}`);
        // Keyword prevention sources are materialized by the damage-specific
        // loops below, in their already-reserved positions.
        const hasReplacement = evaluated.current.abilities.some(isStaticReplacementAbility);
        objects.set(
          instanceId,
          hasReplacement ? snapshotObject(state, instanceId, playerId, zone, view) : undefined,
        );
      }
    }
  }
  for (const object of events.flatMap((event) => event.affected))
    objects.set(object.instanceId, object);

  const candidates: FabReplacementCandidate[] = [];
  // CR 8.3.15 Spellvoid N / CR 8.3.37 Arcane Shelter N: destroy this permanent
  // to prevent N arcane. CR 8.3.8 Arcane Barrier N: pay N resources to prevent N
  // arcane (source stays). Scan equipment seats and arena (granted Spellvoid on
  // Runechants / auras — Amethyst Tiara). Spellvoid is optional: the affected
  // player chooses whether to destroy it for prevention (CR 8.3.15).
  for (const event of events) {
    if (event.name !== "deal-damage" || event.data.damageType !== "arcane") continue;
    const targetPlayerId = isHeroTarget(event.data.target) ? event.data.target.playerId : null;
    if (!targetPlayerId) continue;
    const player = state.players[targetPlayerId];
    if (!player) continue;
    for (const zone of ["arena", "head", "chest", "arms", "legs", "weapon1", "weapon2"] as const) {
      for (const instanceId of state.containers.zonesByPlayerId[targetPlayerId]![zone]) {
        const object =
          objects.get(instanceId) ?? snapshotObject(state, instanceId, targetPlayerId, zone, view);
        objects.set(instanceId, object);
        for (const keywordName of ["spellvoid", "arcane-shelter", "arcane-barrier"] as const) {
          const keyword = object.current.keywords.find((k) => k.name === keywordName);
          if (!keyword || !("value" in keyword)) continue;
          // Dynamic Spellvoid/Barrier X (count, etc.) must evaluate live — a
          // bare `typeof === "number"` check silently skipped FabAmount values
          // (PEN030 / ROS211 Spellvoid X family).
          const amount = resolvePreventionKeywordAmount(state, object, keyword.value);
          if (amount === null) continue;
          const policy = staticPreventionKeywordPolicy(keywordName);
          // A costed optional prevention is not offered when its fixed asset
          // cost cannot be paid. CR 1.14.2d: banked resource points and
          // pitchable hand cards both count toward the payment. Choosing it
          // remains an explicit player choice.
          const scope = state.rulesProcess?.replacementCostBindingScope ?? "direct";
          const boundPitch =
            state.rulesProcess?.replacementPitchBindings?.[`${scope}:${instanceId}:${keywordName}`];
          if (
            policy.application.cost === "pay-resources" &&
            payResourcesShortfall(state, targetPlayerId, amount, boundPitch ?? []) > 0
          ) {
            continue;
          }
          candidates.push({
            replacementId: `${instanceId}:${keywordName}`,
            controllerId: targetPlayerId,
            source: object,
            replacementKind: "prevention",
            applicationScope: { kind: "original-event" },
            effect: {
              type: "prevention",
              preventionKind: "fixed",
              amount,
              damageType: "arcane",
              shielded: { selector: "controller" },
              duration: "this-turn",
            } as FabCanonicalReplacementEffect,
            origin: "static",
            consumptionPolicy: { kind: "never" },
            optional: policy.optional,
            staticPreventionApplication: policy.application,
            ...(boundPitch ? { persistedPitchedInstanceIds: boundPitch } : {}),
          });
        }
      }
    }
  }
  // CR 8.3.19 Quell N: pay N resources to prevent N damage (any type); mark
  // the quell source for end-phase destroy. It is offered when resources cover N.
  for (const event of events) {
    if (event.name !== "deal-damage" || event.data.amount <= 0) continue;
    const targetPlayerId = isHeroTarget(event.data.target) ? event.data.target.playerId : null;
    if (!targetPlayerId) continue;
    const player = state.players[targetPlayerId];
    if (!player) continue;
    for (const zone of ["head", "chest", "arms", "legs"] as const) {
      for (const instanceId of state.containers.zonesByPlayerId[targetPlayerId]![zone]) {
        const object =
          objects.get(instanceId) ?? snapshotObject(state, instanceId, targetPlayerId, zone, view);
        objects.set(instanceId, object);
        const quell = object.current.keywords.find((keyword) => keyword.name === "quell");
        if (!quell || !("value" in quell)) continue;
        const quellAmount = quell.value;
        if (typeof quellAmount !== "number" || quellAmount <= 0) continue;
        const policy = staticPreventionKeywordPolicy("quell");
        // CR 1.14.2d: banked resource points and pitchable hand cards both
        // count toward the payment.
        const scope = state.rulesProcess?.replacementCostBindingScope ?? "direct";
        const boundPitch =
          state.rulesProcess?.replacementPitchBindings?.[`${scope}:${instanceId}:quell`];
        if (payResourcesShortfall(state, targetPlayerId, quellAmount, boundPitch ?? []) > 0)
          continue;
        candidates.push({
          replacementId: `${instanceId}:quell`,
          controllerId: targetPlayerId,
          source: object,
          replacementKind: "prevention",
          applicationScope: { kind: "original-event" },
          effect: {
            type: "prevention",
            preventionKind: "fixed",
            amount: quellAmount,
            shielded: { selector: "controller" },
            duration: "this-turn",
          } as FabCanonicalReplacementEffect,
          origin: "static",
          consumptionPolicy: { kind: "never" },
          optional: policy.optional,
          staticPreventionApplication: policy.application,
          ...(boundPitch ? { persistedPitchedInstanceIds: boundPitch } : {}),
        });
      }
    }
  }
  // CR 8.3.20 Ward N: when you would be dealt damage, destroy this to prevent
  // N of that damage. Auto-apply the first eligible ward permanent. Scan arena
  // (auras/items) and equipment seats (Ward on Head/Chest/Arms/Legs — e.g.
  // Diadem of Dreamstate). Optional decline remains a later decision migration.
  for (const event of events) {
    if (event.name !== "deal-damage" || event.data.amount <= 0) continue;
    const targetPlayerId = isHeroTarget(event.data.target) ? event.data.target.playerId : null;
    if (!targetPlayerId) continue;
    const player = state.players[targetPlayerId];
    if (!player) continue;
    for (const zone of ["arena", "head", "chest", "arms", "legs"] as const) {
      for (const instanceId of state.containers.zonesByPlayerId[targetPlayerId]![zone]) {
        const object =
          objects.get(instanceId) ?? snapshotObject(state, instanceId, targetPlayerId, zone, view);
        objects.set(instanceId, object);
        const ward = object.current.keywords.find((keyword) => keyword.name === "ward");
        if (!ward || !("value" in ward)) continue;
        // Ward X is a live keyword amount just like Spellvoid X. Resolving it
        // here keeps mandatory Ward available on real cards whose printed
        // keyword uses an X placeholder plus a continuous grant.
        const wardAmount = resolvePreventionKeywordAmount(state, object, ward.value);
        if (wardAmount === null) continue;
        const policy = staticPreventionKeywordPolicy("ward");
        candidates.push({
          replacementId: `${instanceId}:ward`,
          controllerId: targetPlayerId,
          source: object,
          replacementKind: "prevention",
          applicationScope: { kind: "original-event" },
          effect: {
            type: "prevention",
            preventionKind: "fixed",
            amount: wardAmount,
            shielded: { selector: "controller" },
            duration: "this-turn",
          } as FabCanonicalReplacementEffect,
          origin: "static",
          consumptionPolicy: { kind: "never" },
          optional: policy.optional,
          staticPreventionApplication: policy.application,
        });
      }
    }
  }
  // UST Shadow Resist N: if you would be dealt damage by a Shadow hero, you
  // may destroy this to prevent N of that damage. Source is a Shadow hero
  // when that hero (or a weapon/ally/generic attack they control) deals it.
  for (const event of events) {
    if (event.name !== "deal-damage" || event.data.amount <= 0) continue;
    const targetPlayerId = isHeroTarget(event.data.target) ? event.data.target.playerId : null;
    if (!targetPlayerId) continue;
    if (!sourceControlledByShadowHero(state, event.data.source, view)) continue;
    const player = state.players[targetPlayerId];
    if (!player) continue;
    for (const zone of ["arena", "head", "chest", "arms", "legs"] as const) {
      for (const instanceId of state.containers.zonesByPlayerId[targetPlayerId]![zone]) {
        const object =
          objects.get(instanceId) ?? snapshotObject(state, instanceId, targetPlayerId, zone, view);
        objects.set(instanceId, object);
        const resist = object.current.keywords.find((keyword) => keyword.name === "shadow-resist");
        if (!resist || !("value" in resist)) continue;
        const resistAmount = resolvePreventionKeywordAmount(state, object, resist.value);
        if (resistAmount === null) continue;
        const policy = staticPreventionKeywordPolicy("shadow-resist");
        candidates.push({
          replacementId: `${instanceId}:shadow-resist`,
          controllerId: targetPlayerId,
          source: object,
          replacementKind: "prevention",
          applicationScope: { kind: "original-event" },
          effect: {
            type: "prevention",
            preventionKind: "fixed",
            amount: resistAmount,
            shielded: { selector: "controller" },
            duration: "this-turn",
          } as FabCanonicalReplacementEffect,
          origin: "static",
          consumptionPolicy: { kind: "never" },
          optional: policy.optional,
          staticPreventionApplication: policy.application,
        });
      }
    }
  }
  for (const object of objects.values()) {
    if (!object) continue;
    for (const ability of object.current.abilities) {
      if (!isStaticReplacementAbility(ability)) continue;
      const functionalZones = ability.functionalZones ?? [
        "permanent",
        "hero",
        "weapon",
        "equipment-head",
        "equipment-chest",
        "equipment-arms",
        "equipment-legs",
      ];
      const objectZone = canonicalZone(object.zone);
      const effect = ability.effect;
      if (!supportedCanonicalReplacement(effect)) continue;
      const controllerId = snapshotPlayerId(object);
      // Ability-level gates (Florian: 4+ Earth in banished) must hold live.
      if (
        ability.condition &&
        !evaluateCanonicalCondition(
          state,
          ability.condition,
          { controllerId, source: object },
          null,
        )
      ) {
        continue;
      }
      const selfReplacementAtBoundary =
        effect.type === "replacement" &&
        effect.replaces.subject === "self" &&
        events.some(
          (event) =>
            event.affected.some((affected) => affected.instanceId === object.instanceId) &&
            eventMatchesPattern(
              state,
              {
                replacementId: `${object.instanceId}:${ability.id}`,
                controllerId,
                source: object,
                replacementKind: canonicalReplacementKind(effect.replacementKind),
                applicationScope: { kind: "original-event" },
                effect,
                origin: "static",
                consumptionPolicy: { kind: "never" },
                optional: false,
              },
              effect,
              event,
            ),
        );
      // Defending equipment sits on the combat chain for the link (Arcanite
      // continuous family). Static preventions on that piece must remain
      // functional there (Soulbond Resolve: charge on defend → prevent on
      // the same combat damage).
      const defendingEquipmentOnChain =
        objectZone === "combat-chain" &&
        (object.current.typeBox.types as readonly string[]).includes("Equipment");
      if (
        (!objectZone || !functionalZones.includes(objectZone)) &&
        !selfReplacementAtBoundary &&
        !defendingEquipmentOnChain
      )
        continue;
      // Create-extra: one candidate per distinct token identity in this batch so
      // "plus 1 of each of those tokens" scales per type (batch-scoped once each).
      if (effect.type === "replacement" && isCreateExtraReplacement(effect)) {
        const createExtra = effect;
        const seenTokenKeys = new Set<string>();
        for (const event of events) {
          if (event.name !== "create") continue;
          if (!creationMatchesCreator(effect, event.data.object.ownerId, controllerId)) continue;
          if (
            createExtra.replaces.filter &&
            !matchesFabSnapshotFilter(state, event.data.object, createExtra.replaces.filter)
          ) {
            continue;
          }
          const tokenKey =
            event.data.object.canonicalId ??
            (event.data.object.current.names.join(" // ") || "token");
          if (seenTokenKeys.has(tokenKey)) continue;
          seenTokenKeys.add(tokenKey);
          candidates.push({
            replacementId: `${object.instanceId}:${ability.id}:${tokenKey}`,
            createTokenKey: tokenKey,
            controllerId,
            source: object,
            replacementKind: canonicalReplacementKind(createExtra.replacementKind),
            applicationScope: {
              kind: "multi-event",
              scopeId: `${events[0]?.processId ?? "unknown-process"}:create:${tokenKey}`,
            },
            effect: createExtra,
            origin: "static",
            consumptionPolicy: { kind: "never" },
            optional: false,
          });
        }
        continue;
      }
      const replacementId = `${object.instanceId}:${ability.id}`;
      // A static prevention can itself contain CR "may" wording and an
      // object-cost. Carry the canonical policy into the event boundary just
      // like a registered replacement; leaving this candidate mandatory made
      // the cost impossible to bind and suppressed its player decision.
      const persistedApplicationPolicy = persistedReplacementApplicationPolicy(effect);
      if (!persistedApplicationPolicy) continue;
      const replacementCostTarget =
        state.rulesProcess?.replacementCostTargetBindings?.[
          `${state.rulesProcess.replacementCostBindingScope ?? "direct"}:${replacementId}`
        ];
      const replacementConsequenceTarget =
        state.rulesProcess?.replacementConsequenceTargetBindings?.[
          `${state.rulesProcess.replacementCostBindingScope ?? "direct"}:${replacementId}`
        ];
      // "The first time … each turn" (times:1 prevention, or replacement limit
      // 1/turn) — skip once applied this turn.
      const oncePerTurn =
        (effect.type === "prevention" && effect.times === 1) ||
        (effect.type === "replacement" &&
          (isOncePerTurnReplacementLimit(effect) ||
            (ability.limit?.per === "turn" && ability.limit.count === 1)));
      const selectedInCurrentProcess =
        state.rulesProcess?.selectedOptionalReplacementIds.includes(replacementId) === true ||
        Object.values(state.rulesProcess?.journalReplacementChoices ?? {}).some((replacementIds) =>
          replacementIds.includes(replacementId),
        );
      if (
        oncePerTurn &&
        !selectedInCurrentProcess &&
        (state.players[controllerId]?.history.turn.consumedStaticReplacementIds ?? []).includes(
          replacementId,
        )
      ) {
        continue;
      }
      candidates.push({
        replacementId,
        controllerId,
        source: object,
        replacementKind:
          effect.type === "prevention"
            ? "prevention"
            : canonicalReplacementKind(effect.replacementKind),
        applicationScope: isDrawCountBoostReplacement(effect)
          ? {
              kind: "multi-event",
              scopeId: `${events[0]?.processId ?? "unknown-process"}:draw`,
            }
          : effect.type === "replacement" && effect.modification.type === "ignore"
            ? { kind: "unlimited" }
            : { kind: "original-event" },
        effect,
        origin: "static",
        // Optional "first time" clauses exhaust the opportunity even when
        // declined; mandatory clauses exhaust only after application.
        consumptionPolicy: !oncePerTurn
          ? { kind: "never" }
          : persistedApplicationPolicy?.kind === "may-apply"
            ? { kind: "on-opportunity" }
            : { kind: "on-application" },
        optional: persistedApplicationPolicy?.kind === "may-apply",
        ...(persistedApplicationPolicy ? { persistedApplicationPolicy } : {}),
        ...(replacementCostTarget ? { persistedCostTarget: replacementCostTarget } : {}),
        ...(replacementConsequenceTarget
          ? { persistedConsequenceTarget: replacementConsequenceTarget }
          : {}),
      });
    }
  }
  return candidates;
}

export function isStaticReplacementAbility(
  ability: FabMatchState["cardDefinitions"][string]["base"]["abilities"][number],
): ability is FabStaticAbility & { readonly effect: CanonicalReplacement | CanonicalPrevention } {
  // Only always-on statics (continuous / while). Triggered abilities register
  // temporary replacements when they fire — including them here double-applies
  // (Gauntlets of Iron Will: defend registers + live scan on combat-chain).
  if (ability.kind !== "static") return false;
  if (ability.staticKind !== "continuous" && ability.staticKind !== "while") return false;
  return (
    !!ability.effect &&
    (ability.effect.type === "replacement" || ability.effect.type === "prevention")
  );
}

/** Extra dN faces Ready to Roll adds to the controller's next roll-request peek. */
export function staticRollPlusOneIgnoreLowestExtraDice(
  state: FabRulesSnapshot,
  playerId: string,
): number {
  let extra = 0;
  for (const replacement of state.replacementEffects) {
    if (replacementExpired(state, replacement.expiresAt)) continue;
    if (replacement.controllerId !== playerId) continue;
    if (!isRollPlusOneIgnoreLowestReplacement(replacement.effect)) continue;
    extra += rollPlusOneIgnoreLowestExtraDice(replacement.effect);
  }
  return extra;
}

/**
 * How many complete rerolls a roll-request should perform after persisted
 * optional replacement choices are accepted. A reroll consumes every die in
 * the modified roll, including dice added by another replacement.
 */
export function staticOptionalDestroyRerollCount(state: FabRulesSnapshot, sides: number): number {
  if (!Number.isInteger(sides) || sides < 2) return 0;
  for (const player of Object.values(state.players)) {
    if (!player) continue;
    for (const zone of ["arms", "head", "chest", "legs", "arena"] as const) {
      const ids = state.containers.zonesByPlayerId[player.playerId]![zone] ?? [];
      for (const instanceId of ids) {
        const object = snapshotObject(state, instanceId, player.playerId, zone);
        if (!object) continue;
        for (const ability of object.current.abilities) {
          if (!isStaticReplacementAbility(ability)) continue;
          if (!isOptionalDestroySelfRerollReplacement(ability.effect)) continue;
          const rerollSides = optionalDestroyRerollSides(ability.effect);
          if (rerollSides !== sides) continue;
          const replacementId = `${instanceId}:${ability.id}`;
          const selected = [
            ...(state.rulesProcess?.selectedOptionalReplacementIds ?? []),
            ...Object.values(state.rulesProcess?.journalReplacementChoices ?? {}).flat(),
          ];
          if (selected.includes(replacementId)) return 1;
        }
      }
    }
  }
  return 0;
}

/**
 * Printed "instead deals that much (arcane) damage plus N": replace a
 * deal-damage event by increasing its amount. Pattern name is DSL "damage"
 * (FabEventPattern); live events are "deal-damage".
 */
export function replacementAppliesToNextFilter(
  effect: CanonicalReplacement | CanonicalPrevention,
): FabCardFilter | null {
  if (effect.type !== "replacement" || !effect.appliesTo?.next) return null;
  return rewriteAppliesToNextFilter(effect.appliesTo.next);
}

export function replacementAppliesToNextSource(
  state: FabRulesSnapshot,
  effect: CanonicalReplacement,
  event: ProposedEvent,
): boolean {
  const nextFilter = replacementAppliesToNextFilter(effect);
  if (!nextFilter) return true;
  if (!event.source) return false;
  return matchesFabSnapshotFilter(state, event.source, nextFilter);
}

export function isGraveyardDestinationEvent(event: ProposedEvent): boolean {
  if (event.name === "discard") return true;
  return (
    (event.name === "move-zone" ||
      event.name === "destroy" ||
      event.name === "put-into-graveyard") &&
    "to" in event.data &&
    event.data.to === "graveyard"
  );
}

export function replacementApplies(
  state: FabRulesSnapshot,
  candidate: FabReplacementCandidate,
  event: ProposedEvent,
): boolean {
  const effect = candidate.effect;
  if (effect.type === "prevention") return preventionApplies(state, candidate, effect, event);
  // Sharpen additional-time / optional pay-destroy: only the controller's
  // sharpen events on a matching sword (subject filter via eventMatchesPattern).
  if (
    effect.type === "replacement" &&
    (isAdditionalSharpenReplacement(effect) ||
      isOptionalPayDestroyAdditionalSharpenReplacement(effect))
  ) {
    if (event.name !== "sharpen") return false;
    if (event.data.playerId !== candidate.controllerId) return false;
    if (!eventMatchesPattern(state, candidate, effect, event)) return false;
    if (isOptionalPayDestroyAdditionalSharpenReplacement(effect)) {
      const cost = optionalPayDestroyResourceCost(effect);
      const resources = state.players[candidate.controllerId]?.resourcePoints ?? 0;
      if (resources < cost) return false;
      // Source must still be seated (while-in-arena equipment).
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
      if (!stillSeated) return false;
    }
    return supportedCanonicalReplacement(effect);
  }
  // Draw-from-source boost before generic pattern matching: for draws,
  // `replaces.filter` qualifies event.source (Gold token), not the drawn card.
  if (isDrawCountBoostReplacement(effect)) {
    if (event.name !== "draw") return false;
    if (!("playerId" in event.data) || event.data.playerId !== candidate.controllerId) return false;
    const filter = effect.replaces.filter;
    if (!filter || !event.source) return false;
    if (!matchesFabSnapshotFilter(state, event.source, filter)) return false;
    return supportedCanonicalReplacement(effect);
  }
  // SEA149 Not So Fast: same source-qualified matching, but the draw belongs
  // to an opponent and is redirected to the replacement controller.
  if (isOpponentDrawRedirectToControllerReplacement(effect)) {
    if (event.name !== "draw") return false;
    if (!("playerId" in event.data) || event.data.playerId === candidate.controllerId) return false;
    const filter = effect.replaces.filter;
    if (!filter || !event.source) return false;
    if (!matchesFabSnapshotFilter(state, event.source, filter)) return false;
    return supportedCanonicalReplacement(effect);
  }
  if (isOpponentDrawMinusOneDestroySelfReplacement(effect)) {
    if (event.name !== "draw") return false;
    if (state.phase !== "action" || state.activePlayerId !== candidate.controllerId) return false;
    if (!eventMatchesPattern(state, candidate, effect, event)) return false;
    return supportedCanonicalReplacement(effect);
  }
  if (isClashSwapRevealReplacement(effect)) {
    if (event.name !== "clash-outcome") return false;
    if (event.data.firstPlayerId !== candidate.controllerId) return false;
    return supportedCanonicalReplacement(effect);
  }
  if (isClashTieWinClashReplacement(effect)) {
    if (event.name !== "clash-outcome") return false;
    if (event.data.winnerId) return false;
    return supportedCanonicalReplacement(effect);
  }
  if (isClashFailToWinRevealingThisReplacement(effect)) {
    if (event.name !== "clash-outcome") return false;
    if (event.data.winnerId === candidate.controllerId) return false;
    if (!eventMatchesPattern(state, candidate, effect, event)) return false;
    return supportedCanonicalReplacement(effect);
  }
  if (clashOutcomeOptionalReclash(effect)) {
    if (event.name !== "clash-outcome") return false;
    if (event.bindings["reclash-final"] === true) return false;
    if (event.data.winnerId === candidate.controllerId) return false;
    const receiptKey = replacementCostCommitKey(candidate, event);
    const receipt = receiptKey
      ? state.rulesProcess?.replacementCostCommitReceipts?.[receiptKey]
      : undefined;
    if (receipt) {
      return receipt.status === "committed" && supportedCanonicalReplacement(effect);
    }
    if (persistedReplacementCostTargetIds(state, candidate).length === 0) return false;
    return supportedCanonicalReplacement(effect);
  }
  if (isWagerLossOptionalDiscardWinReplacement(effect)) {
    if (event.name !== "wager-loss") return false;
    if (event.data.loserId !== candidate.controllerId) return false;
    const receiptKey = replacementCostCommitKey(candidate, event);
    const receipt = receiptKey
      ? state.rulesProcess?.replacementCostCommitReceipts?.[receiptKey]
      : undefined;
    if (receipt) {
      return receipt.status === "committed" && supportedCanonicalReplacement(effect);
    }
    if (persistedReplacementCostTargetIds(state, candidate).length === 0) return false;
    return supportedCanonicalReplacement(effect);
  }
  if (!eventMatchesPattern(state, candidate, effect, event)) return false;
  if (effect.type === "replacement" && !replacementAppliesToNextSource(state, effect, event)) {
    return false;
  }
  // Flourish / Iron Will: only positive power continuous applications (applied).
  if (isPowerGainAmountReplacement(effect)) {
    if (event.name !== "continuous-effect-applied") return false;
    const contribution = event.data.application.contribution;
    if (
      contribution.kind !== "numeric" ||
      contribution.property !== "power" ||
      contribution.value === null
    ) {
      return false;
    }
    const prev = contribution.previousValue;
    if (prev !== null && contribution.value <= prev) return false;
    return supportedCanonicalReplacement(effect);
  }
  if (effect.replaces.name === "pitch") {
    if (event.name !== "pitch") return false;
    if (event.data.playerId !== candidate.controllerId) return false;
    // Optional filter qualifies the pitched card (Light talent, color, …).
    if (
      effect.replaces.filter &&
      !matchesFabSnapshotFilter(state, event.data.object, effect.replaces.filter)
    ) {
      return false;
    }
    if (isPitchResourceBoostReplacement(effect)) {
      return event.data.resourcesGenerated > 0 && supportedCanonicalReplacement(effect);
    }
    // Talisman of Recompense: only when you would gain exactly one {r}.
    return event.data.resourcesGenerated === 1 && supportedCanonicalReplacement(effect);
  }
  if (isGraveyardToBanishReplacement(effect) || isGraveyardToDeckBottomReplacement(effect)) {
    // "equipment you control" / self: only rewrite objects under the ability controller
    // (or the ability source itself for self-subject patterns).
    if (!("object" in event.data)) return false;
    if (!isGraveyardDestinationEvent(event)) return false;
    if (effect.replaces.subject === "self") {
      return event.data.object.instanceId === candidate.source.instanceId;
    }
    return snapshotPlayerId(event.data.object) === candidate.controllerId;
  }
  if (isCreateExtraReplacement(effect)) {
    if (event.name !== "create") return false;
    // "If you would create…" refers to the creator, not the token recipient.
    if (!creationMatchesCreator(effect, event.data.object.ownerId, candidate.controllerId))
      return false;
    if (!eventMatchesPattern(state, candidate, effect, event)) return false;
    // Per-token-type candidates only match their token key.
    if (candidate.createTokenKey !== createTokenKey(event)) return false;
    return true;
  }
  // Filtered enter-arena counter grants: only for permanents you control.
  // subject:"self" is already gated in eventMatchesPattern; subject filters
  // (Puffer Jacket) must not boost the opponent's Hyper Drivers.
  if (
    effect.type === "replacement" &&
    isEnterArenaAddCounterReplacement(effect) &&
    typeof effect.replaces.subject === "object" &&
    effect.replaces.subject !== null
  ) {
    if (event.name !== "enter-arena" || !("object" in event.data)) return false;
    if (snapshotPlayerId(event.data.object) !== candidate.controllerId) return false;
  }
  return supportedCanonicalReplacement(effect);
}

export function preventionApplies(
  state: FabRulesSnapshot,
  candidate: FabReplacementCandidate,
  effect: CanonicalPrevention,
  event: ProposedEvent,
): boolean {
  if (event.name !== "deal-damage" || event.data.amount <= 0) return false;
  // CR 6.4.10j: a shielding prevention is eligible only while its persisted
  // record still holds budget — the consume-replacement-effects reducer
  // removes the record once the budget reaches zero (the effect ceases to
  // exist), so this gate also stops a spent shield from re-applying to a
  // later event. Shielding requires the registered (persisted) path, which
  // locks the numeric budget on the record; static-origin shielding
  // candidates have no record and stay inert.
  if (effect.preventionKind === "shielding") {
    const persistedId =
      candidate.origin === "persisted"
        ? (candidate.originReplacementId ?? candidate.replacementId)
        : null;
    const persistedEffect = persistedId
      ? state.replacementEffects.find((entry) => entry.replacementId === persistedId)?.effect
      : undefined;
    const remaining = persistedEffect?.type === "prevention" ? persistedEffect.amount : undefined;
    // Registration resolves a shielding budget to a literal number; a missing
    // record (static-origin candidate) or non-numeric amount is ineligible.
    if (typeof remaining !== "number" || remaining <= 0) return false;
  }
  // CR 6.4.10h: damage that cannot be prevented remains eligible for a
  // prevention effect. The effect's reduction becomes zero at application
  // time, while its costs and other modifications still occur.
  if (effect.damageType && effect.damageType !== event.data.damageType) return false;
  // Default shield: controller. Yoji binds shieldedPlayerId to another hero.
  // Class shields (Sawbones) match any controller-owned living object that
  // satisfies the persisted filter — hero or Pirate ally.
  if (effect.recipientScope === "any") {
    // The printed effect constrains the damage source, not its recipient.
  } else if (candidate.shieldedFilter) {
    if (!classShieldMatches(state, candidate, event.data.target)) return false;
  } else {
    const protectedPlayerId = candidate.shieldedPlayerId ?? candidate.controllerId;
    if (isHeroTarget(event.data.target)) {
      if (event.data.target.playerId !== protectedPlayerId) return false;
    } else if (event.data.target.instanceId !== candidate.source.instanceId) {
      // Object targets still match the prevention source (equipment ward etc.).
      return false;
    }
  }
  if (
    effect.sourceFilter &&
    (!event.data.source || !matchesFabSnapshotFilter(state, event.data.source, effect.sourceFilter))
  ) {
    return false;
  }
  if (
    effect.source?.selector === "self" &&
    event.data.source?.instanceId !== candidate.source.instanceId
  )
    return false;
  if (
    candidate.preventedSourceInstanceId !== undefined &&
    event.data.source?.instanceId !== candidate.preventedSourceInstanceId
  )
    return false;
  // Cap of Quick Thinking: "damage by a source an opponent controls".
  if (effect.source?.selector === "opponent") {
    const damageSource = event.data.source;
    if (!damageSource) return false;
    const sourceController = damageSource.controllerId ?? damageSource.ownerId ?? null;
    if (!sourceController || sourceController === candidate.controllerId) return false;
  }
  // Optional discard Instant: only offer prevention when a legal Instant is in hand.
  if (
    effect.optionalCost?.class === "effect" &&
    effect.optionalCost.type === "discard" &&
    effect.optionalCost.count === 1
  ) {
    const hand = state.containers.zonesByPlayerId[candidate.controllerId]?.hand ?? [];
    const filter = effect.optionalCost.filter;
    const hasInstant = hand.some((instanceId) => {
      const object = snapshotObject(state, instanceId, candidate.controllerId, "hand");
      if (!filter) return true;
      return matchesFabSnapshotFilter(state, object, filter);
    });
    if (!hasInstant) return false;
  }
  // Optional banish-self: only while the source still sits in an arena seat
  // (equipment slot / permanent / weapon). Once banished it cannot re-fire.
  if (effect.optionalCost?.class === "effect" && effect.optionalCost.type === "banish-self") {
    const arenaSeats = ["arena", "head", "chest", "arms", "legs", "weapon1", "weapon2"] as const;
    const sourceZone = candidate.source.zone as string;
    const stillInArena =
      arenaSeats.includes(sourceZone as (typeof arenaSeats)[number]) ||
      sourceZone === "equipment-head" ||
      sourceZone === "equipment-chest" ||
      sourceZone === "equipment-arms" ||
      sourceZone === "equipment-legs" ||
      sourceZone === "permanent" ||
      sourceZone === "weapon";
    if (!stillInArena) return false;
    const player = state.players[candidate.controllerId];
    if (!player) return false;
    const instanceId = candidate.source.instanceId;
    const present = arenaSeats.some((zone) =>
      state.containers.zonesByPlayerId[candidate.controllerId]![zone]?.includes(instanceId),
    );
    if (!present) return false;
  }
  // Optional remove steam from Hyper Driver (or filtered permanent): only when
  // a matching controller permanent has enough steam counters.
  if (isNamedCounterRemovalCost(effect.optionalCost)) {
    if (
      !findOptionalNamedCounterRemovalTarget(state, candidate.controllerId, effect.optionalCost)
    ) {
      return false;
    }
  }
  // Optional banish from soul: only when the controller has a soul card.
  if (isBanishFromSoulCost(effect.optionalCost)) {
    const soul = state.containers.zonesByPlayerId[candidate.controllerId]?.soul ?? [];
    if (
      soul.length < (typeof effect.optionalCost.count === "number" ? effect.optionalCost.count : 1)
    )
      return false;
  }
  return (
    !effect.incomingDamage || matchesNumericComparison(event.data.amount, effect.incomingDamage)
  );
}

/** Locate a controller permanent matching optionalCost.filter with enough named counters. */
export function findOptionalNamedCounterRemovalTarget(
  state: FabRulesSnapshot,
  controllerId: string,
  cost: NamedCounterRemovalCost,
): { readonly object: FabObjectSnapshot; readonly amount: number } | null {
  const amount =
    typeof cost.count === "number" && cost.count > 0
      ? cost.count
      : cost.count === undefined
        ? 1
        : 0;
  if (amount <= 0) return null;
  const counterName = cost.counter.name;
  const player = state.players[controllerId];
  if (!player) return null;
  for (const zone of ["arena", "head", "chest", "arms", "legs"] as const) {
    for (const instanceId of state.containers.zonesByPlayerId[controllerId]![zone] ?? []) {
      const object = snapshotObject(state, instanceId, controllerId, zone);
      if (cost.filter && !matchesFabSnapshotFilter(state, object, cost.filter)) continue;
      const liveCount =
        state.objects[instanceId]?.counters.find(
          (counter) => counter.kind === "named" && counter.name === counterName,
        )?.count ?? 0;
      // Snapshot map form (counters.steam) as secondary read.
      const mapCount =
        object.counters && typeof object.counters[counterName] === "number"
          ? object.counters[counterName]!
          : 0;
      if (Math.max(liveCount, mapCount) >= amount) return { object, amount };
    }
  }
  return null;
}

export function eventMatchesPattern(
  state: FabRulesSnapshot,
  candidate: FabReplacementCandidate,
  effect: CanonicalReplacement,
  event: ProposedEvent,
): boolean {
  const pattern = effect.replaces;
  if (!eventNameMatchesPattern(pattern, event)) return false;
  if (
    pattern.name === "create" &&
    event.name === "create" &&
    !creationMatchesCreator(effect, event.data.object.ownerId, candidate.controllerId)
  )
    return false;
  if (pattern.subject === "self") {
    const selfId = candidate.source.instanceId;
    if (event.name === "clash-outcome" && "revealed" in event.data) {
      if (!event.data.revealed.some((object) => object.instanceId === selfId)) return false;
    } else if (!("object" in event.data) || event.data.object.instanceId !== selfId) {
      return false;
    }
  } else if (typeof pattern.subject === "object") {
    // Create replacements: "an action card effect would create…" qualifies the
    // creating source, not the minted token (Ripple Away). Other events still
    // match the moved/affected object.
    const subjectObject =
      event.name === "create" && event.source
        ? event.source
        : "object" in event.data
          ? event.data.object
          : null;
    if (!subjectObject || !matchesFabSnapshotFilter(state, subjectObject, pattern.subject))
      return false;
  }
  // FabEventPattern.filter qualifies the moved/affected object ("equipment").
  // Damage-family events carry the dealing object at data.source instead
  // (DamageEventData) — printed "an attack / a Lightning action card would
  // deal damage" qualifies that source, not a moved object.
  if (pattern.filter) {
    const isDamageFamily =
      event.name === "deal-damage" || event.name === "dealt-damage" || event.name === "prevent";
    const filterSubject = isDamageFamily
      ? "source" in event.data && event.data.source
        ? event.data.source
        : null
      : "object" in event.data
        ? event.data.object
        : null;
    if (
      !filterSubject ||
      !matchesFabSnapshotFilter(
        state,
        filterSubject,
        pattern.filter,
        undefined,
        candidate.controllerId,
      )
    )
      return false;
  }
  if (
    "from" in pattern &&
    pattern.from &&
    (!("from" in event.data) || event.data.from !== pattern.from)
  )
    return false;
  if (
    "excludeFrom" in pattern &&
    pattern.excludeFrom?.length &&
    "from" in event.data &&
    pattern.excludeFrom.includes(event.data.from as never)
  ) {
    return false;
  }
  if ("to" in pattern && pattern.to) {
    const eventToGraveyard = event.name === "discard" && pattern.to === "graveyard";
    if (!eventToGraveyard && (!("to" in event.data) || event.data.to !== pattern.to)) return false;
  }
  // Deck position (Topsy Turvy: only rewrite puts on top, not already-bottom).
  if ("position" in pattern && pattern.position) {
    if (!("position" in event.data) || event.data.position !== pattern.position) return false;
  }
  if (
    "damageType" in pattern &&
    pattern.damageType &&
    (!("damageType" in event.data) || event.data.damageType !== pattern.damageType)
  )
    return false;
  // Whose event: "an opponent would gain {h}" / controller events.
  if (pattern.player) {
    const eventPlayerId =
      "playerId" in event.data && typeof event.data.playerId === "string"
        ? event.data.playerId
        : "object" in event.data
          ? (event.data.object.controllerId ??
            event.data.object.zoneRef.playerId ??
            event.data.object.ownerId)
          : null;
    if (!eventPlayerId) return false;
    if (pattern.player === "opponent" || pattern.player === "another-hero") {
      if (eventPlayerId === candidate.controllerId) return false;
    } else if (pattern.player === "controller" || pattern.player === "self") {
      if (eventPlayerId !== candidate.controllerId) return false;
    }
  }
  if (pattern.source === "blood-debt") {
    if (event.cause.kind !== "rule" || event.cause.rule !== "blood-debt") return false;
  }
  if (pattern.source === "wager") {
    if (event.cause.kind !== "rule" || event.cause.rule !== "wager") return false;
  }
  return true;
}

/**
 * Match put-into-graveyard destination rewrites across the primary zone-event
 * family (move-zone, destroy) when the printed pattern names move-zone.
 */
export function eventNameMatchesPattern(
  pattern: CanonicalReplacement["replaces"],
  event: ProposedEvent,
): boolean {
  if (pattern.name === event.name) return true;
  if (pattern.name === "clash" && event.name === "clash-outcome") return true;
  // Catalog leftover: clash-lose is the observation of failing clash-outcome.
  if (pattern.name === "clash-lose" && event.name === "clash-outcome") return true;
  // DSL "damage" patterns match live deal-damage events (Metacarpus / Crucible).
  if (pattern.name === "damage" && event.name === "deal-damage") return true;
  // DSL "roll" matches roll-request (proposal) and committed roll (follow-up).
  if (pattern.name === "roll" && (event.name === "roll-request" || event.name === "roll")) {
    return true;
  }
  // DSL "gain" / "modify-power" — first continuous power application only
  // (Flourish / Iron Will). Do not also match continuous-effect-changed or the
  // same replacement double-subtracts in one reconcile batch.
  if (
    (pattern.name === "gain" || pattern.name === "modify-power") &&
    event.name === "continuous-effect-applied"
  ) {
    return true;
  }
  if (
    "to" in pattern &&
    pattern.to === "graveyard" &&
    (pattern.name === "move-zone" ||
      pattern.name === "put-into-graveyard" ||
      pattern.name === "destroy" ||
      pattern.name === "discard") &&
    isGraveyardDestinationEvent(event)
  ) {
    return true;
  }
  return false;
}

export function replacementExpired(
  state: FabRulesSnapshot,
  expiry: FabMatchState["replacementEffects"][number]["expiresAt"],
): boolean {
  switch (expiry.kind) {
    case "permanent":
      return false;
    case "turn":
      return state.turnNumber !== expiry.turnNumber;
    case "phase":
      return state.turnNumber !== expiry.turnNumber || state.phase !== expiry.phase;
    case "combat-chain":
      if (expiry.combatNumber < 0) return !state.combat?.open;
      return !state.combat?.open || state.combat.chainLinkNumber !== expiry.combatNumber;
    case "source":
      return !state.playerIds.some((playerId) =>
        ["arena", "head", "chest", "arms", "legs", "weapon1", "weapon2"].some((zone) =>
          state.containers.zonesByPlayerId[playerId]![zone as FabZoneKind].includes(
            expiry.instanceId,
          ),
        ),
      );
  }
}

export function canonicalReplacementKind(
  kind: CanonicalReplacement["replacementKind"],
): FabReplacementCandidate["replacementKind"] {
  return kind === "self" || kind === "identity" ? "self-or-identity" : kind;
}

export function canonicalZone(zone: ReturnType<typeof snapshotObject>["zone"]): FabZone | null {
  // Snapshots already expose catalog zones (hero, permanent, equipment-head, …).
  if (zone === "unknown" || zone === null) return null;
  // Defensive: raw engine zone strings that may appear on affected snapshots.
  if ((zone as string) === "arena") return "permanent";
  if ((zone as string) === "heroZone") return "hero";
  return zone as FabZone;
}

export function isHeroTarget(
  target: ProposedEvent<"deal-damage">["data"]["target"],
): target is { readonly kind: "hero"; readonly playerId: string } {
  return "kind" in target && target.kind === "hero";
}

function sourceControlledByShadowHero(
  state: FabRulesSnapshot,
  source: FabObjectSnapshot | null,
  view: ReturnType<typeof buildFabRulesView>,
): boolean {
  if (!source) return false;
  const controllerId = source.controllerId;
  if (!controllerId) return false;
  const heroId = state.players[controllerId]?.heroCardId;
  if (!heroId) return false;
  const hero = snapshotObject(state, heroId, controllerId, "heroZone", view);
  return hero.current.typeBox.supertypes.includes("Shadow");
}

export function classShieldMatches(
  state: FabRulesSnapshot,
  candidate: FabReplacementCandidate,
  target: ProposedEvent<"deal-damage">["data"]["target"],
): boolean {
  const filter = candidate.shieldedFilter;
  if (!filter) return false;
  if (isHeroTarget(target)) {
    if (target.playerId !== candidate.controllerId) return false;
    const heroId = state.containers.zonesByPlayerId[target.playerId]?.heroZone[0];
    if (!heroId) return false;
    try {
      const hero = snapshotObject(state, heroId, target.playerId, "heroZone");
      return matchesFabSnapshotFilter(state, hero, filter, undefined, candidate.controllerId);
    } catch {
      return false;
    }
  }
  const object = target;
  const controller = object.controllerId ?? object.ownerId;
  if (controller !== candidate.controllerId) return false;
  return matchesFabSnapshotFilter(state, object, filter, undefined, candidate.controllerId);
}
