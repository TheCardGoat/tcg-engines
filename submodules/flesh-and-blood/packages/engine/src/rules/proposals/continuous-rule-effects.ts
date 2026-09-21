import type {
  FabAmount,
  FabBaseObjectProperties,
  FabCardFilter,
  FabComparison,
  FabCounter,
  FabEffect,
} from "@tcg/flesh-and-blood-types";
import type { FabObjectSnapshot, ProposedEvent } from "../events.ts";
import {
  isAdmissiblePreventionAdditionalCreateToken,
  persistedReplacementApplicationPolicy,
  supportedCanonicalReplacement,
} from "../../kernel/replacements/index.ts";
import { compileFabContinuousEffect } from "../continuous/compiler.ts";
import { createSyntheticFabObjectSnapshot } from "../snapshots.ts";
import {
  basePropertiesOf,
  fabCreatedObjectCanonicalId,
  fabCreatedObjectRuntimeCanonicalId,
} from "../../cards.ts";
import { initialFabActiveFaceForCreatedName } from "../../game/active-face.ts";
import type { FabCounterRecord, FabZoneKind } from "../../state.ts";
import type { FabRulesSnapshot } from "../../kernel/transaction-kernel.ts";
import { fabCanonicalCardId, fabObjectInstanceId, fabPlayerId } from "../../game/identity.ts";
import {
  type FabEffectProposalResult,
  type ProposalContext,
  baseEvent,
  canonicalEngineZone,
  continuousDurationSupported,
  continuousFutureApplicability,
  heroTargets,
  isExactAttackBinding,
  isObjectSnapshot,
  isUpToCountValue,
  objectTargets,
  nextFreeWeaponSlot,
  playersForFabPlayer,
  resolveContinuousExpiry,
  amountUsesFutureSubject,
  amountDependsOnLayerBindings,
  resolveLayerAmount,
  scanAtResolutionObjectPool,
  unsupported,
  liveReanchorBindings,
} from "./shared.ts";
import { isPreventionSourceBanish } from "../../kernel/replacements/admission.ts";
import { isFabPitchColor } from "./effects/choose-color.ts";
import type { FabContinuousInitialSubject } from "../continuous/ir.ts";
import {
  canonicalizeFutureApplicability,
  rewriteAppliesToNextFilter,
} from "../continuous/reconciler.ts";
import { createIsRestricted } from "../create-restrictions.ts";

import { weaponOccupantForDefinition, type FabWeaponOccupant } from "../weapons/weapon-area.ts";

type CreateTokenEffect = FabEffect & { type: "create-token" };

/**
 * `targetPath` is local to one printed resolution ability. Card layers resolve
 * same-face abilities in separate cursor steps, so include that cursor in
 * generated rule identities to prevent their independent effects colliding.
 */
function buildContinuousEffectId(
  processId: string,
  layer: ProposalContext["layer"],
  targetPath: string,
  suffix = "continuous",
): string {
  const resolutionStep = layer.kind === "card" ? `:step-${layer.resolutionPlan.cursor}` : "";
  return `${processId}:${layer.layerId}${resolutionStep}:${targetPath}:${suffix}`;
}

/** Parser-emitted "Ponder under you and X under each opponent" token ids. */
function splitCompoundCreateTokens(
  token: string | undefined,
): readonly { token: string; controller: "controller" | "opponent" }[] | null {
  if (!token) return null;
  const match = /^ponder-token-under-your-control-and-an?-(.+)$/.exec(token);
  if (!match?.[1]) return null;
  return [
    { token: "ponder", controller: "controller" },
    { token: match[1], controller: "opponent" },
  ];
}

function bindAttacksOfSources(
  state: FabRulesSnapshot,
  layer: ProposalContext["layer"],
  effect: FabEffect,
  future: ReturnType<typeof canonicalizeFutureApplicability>,
  effectTargets: ProposalContext["effectTargets"],
  effectPath: ProposalContext["effectPath"],
  targetPath: string,
) {
  if (!future || !effect.appliesTo?.attacksOf) return future;
  const attacksOf = effect.appliesTo.attacksOf;
  if (attacksOf !== true) {
    const bound = layer.bindings[attacksOf.binding];
    const candidates = Array.isArray(bound) ? bound : bound ? [bound] : [];
    const ids = candidates.flatMap((candidate) =>
      candidate && typeof candidate === "object" && "instanceId" in candidate
        ? [String(candidate.instanceId)]
        : [],
    );
    return ids.length === 0 ? undefined : { ...future, sourceInstanceIds: ids };
  }
  if (!("target" in effect) || !effect.target || typeof effect.target !== "object") {
    return undefined;
  }
  if (!("selector" in effect.target)) return undefined;
  const objects = objectTargets(state, layer, effect.target, targetPath, effectTargets, effectPath);
  if (!objects || objects.length === 0) return undefined;
  return { ...future, sourceInstanceIds: objects.map((object) => object.instanceId) };
}

/**
 * Resolve create-token.withCounters into object counter records the create
 * reducer applies on enter ("create a Spectral Shield with a +1{p} counter",
 * "create a Hyper Driver with 2 steam counters").
 */
function resolveCreateTokenCounters(
  state: FabRulesSnapshot,
  layer: ProposalContext["layer"],
  withCounters: CreateTokenEffect["withCounters"],
): FabCounterRecord[] | null {
  if (!withCounters) return [];
  const count =
    typeof withCounters.count === "number"
      ? withCounters.count
      : resolveLayerAmount(state, layer, withCounters.count);
  if (count === null || !Number.isFinite(count) || count <= 0) {
    return count === 0 ? [] : null;
  }
  const n = Math.floor(count);
  const counter: FabCounter = withCounters.counter;
  if (counter.kind === "named") {
    return [{ kind: "named", name: counter.name, count: n }];
  }
  if (counter.kind === "numeric") {
    if (typeof counter.value !== "number") return null;
    return [
      {
        kind: "numeric",
        property: counter.property,
        value: counter.value,
        count: n,
      },
    ];
  }
  return null;
}

/**
 * Resolve the engine zone a create-token leaf writes into.
 * - `amongExposed`: first empty (CR 3.0.1a exposed) seat among the listed
 *   equipment zones for `playerId`; null when none are empty.
 * - `to.zone`: fixed catalog destination (default arena).
 * `occupiedDelta` tracks seats claimed earlier in the same proposal so a
 * multi-count create does not stack multiple tokens into one exposed zone.
 */
function resolveCreateTokenDestination(
  state: FabRulesSnapshot,
  playerId: string,
  effect: CreateTokenEffect,
  occupiedDelta: Map<string, Set<string>>,
): FabZoneKind | null {
  if (effect.amongExposed && effect.amongExposed.length > 0) {
    const claimed = occupiedDelta.get(playerId) ?? new Set<string>();
    for (const catalogZone of effect.amongExposed) {
      const engineZone = canonicalEngineZone(catalogZone);
      if (!engineZone) continue;
      if (claimed.has(engineZone)) continue;
      const occupants = state.containers.zonesByPlayerId[playerId]![engineZone] ?? [];
      if (occupants.length === 0) {
        claimed.add(engineZone);
        occupiedDelta.set(playerId, claimed);
        return engineZone;
      }
    }
    return null;
  }
  return effect.to?.zone ? (canonicalEngineZone(effect.to.zone) ?? "arena") : "arena";
}

/** Continuous, rule-registration, delayed-trigger, replacement, and token-creation leaf effects. */
export function proposeContinuousRuleEffect(
  ctx: ProposalContext,
  effect: FabEffect,
): FabEffectProposalResult | null {
  const { state, layer, processId, effectTargets, effectPath, targetPath } = ctx;

  if (effect.type === "create-token") {
    // ELE163 family: "The next time an Ice or Elemental attack hits a hero
    // this turn, create N Frostbite under their control." Catalog encodes that
    // as create-token + appliesTo.next. Do not eager-create; register a
    // one-shot delayed hit trigger instead.
    if (effect.appliesTo) {
      const { appliesTo: _appliesTo, ...immediate } = effect;
      return proposeContinuousRuleEffect(ctx, {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "hit",
            actor: { kind: "any" },
            observes: {
              kind: "event-object",
              selector: "attack",
              relationship: { kind: "any" },
              filter: effect.appliesTo.next ?? {},
            },
            target: { kind: "hero" },
          },
        },
        policy: {
          kind: "windowed",
          duration: "this-turn",
          matching: "first",
        },
        resolution: {
          kind: "effect",
          effect: immediate,
        },
      });
    }
    const splitTokens = splitCompoundCreateTokens(effect.token);
    if (splitTokens) {
      const events: ProposedEvent[] = [];
      const eventGroups: (readonly ProposedEvent[])[] = [];
      for (const [index, part] of splitTokens.entries()) {
        const partResult = proposeContinuousRuleEffect(
          {
            ...ctx,
            effectPath: [...effectPath, index],
            targetPath: `${targetPath}:split-${index}`,
          },
          {
            type: "create-token",
            token: part.token,
            controller: part.controller,
            creator: effect.creator ?? "effect-controller",
          },
        );
        if (!partResult?.supported) {
          return partResult ?? unsupported(effect, "compound create-token failed");
        }
        events.push(...partResult.events);
        eventGroups.push(...(partResult.eventGroups ?? [partResult.events]));
      }
      return { supported: true, events, eventGroups };
    }
    let playerIds = playersForFabPlayer(
      state,
      layer.controllerId,
      effect.controller,
      layer.bindings,
    );
    if (effect.target) {
      const fromTarget = heroTargets(
        state,
        layer,
        effect.target,
        targetPath,
        effectTargets,
        effectPath,
      );
      if (fromTarget && fromTarget.length > 0) playerIds = fromTarget;
    }
    // After combat closes, prefer the binding / triggering event over live combat.
    if (effect.controller === "defending-hero") {
      const bound =
        typeof layer.bindings["defending-hero"] === "string"
          ? layer.bindings["defending-hero"]
          : null;
      const fromEvent =
        layer.kind === "triggered" && layer.triggeringEvent?.name === "chain-link-resolve"
          ? layer.triggeringEvent.data.defendingPlayerId
          : null;
      const resolved = bound ?? fromEvent;
      if (resolved) playerIds = [resolved];
    }
    if (!playerIds) return unsupported(effect, "token controller requires a binding or outcome");
    // Kassai Cintari Copper: count may be a dynamic amount (weapon-attacks-that-hit-this-turn).
    const resolvedCount =
      effect.count === undefined
        ? 1
        : typeof effect.count === "number"
          ? effect.count
          : resolveLayerAmount(state, layer, effect.count);
    if (resolvedCount === null) return unsupported(effect, "token count amount could not resolve");
    const count = Math.max(0, Math.floor(resolvedCount));
    if (count === 0) {
      return { supported: true, events: [] };
    }
    const copySource = effect.copySource
      ? objectTargets(state, layer, effect.copySource, targetPath, effectTargets, effectPath)
      : null;
    if (effect.copySource && (!copySource || copySource.length !== 1)) {
      return unsupported(effect, "create-token copy source is unresolved or not unique");
    }
    const copiedObject = copySource?.[0] ?? null;
    if (copiedObject && copiedObject.canonicalId === null) {
      return unsupported(effect, "create-token copy source has no canonical provenance");
    }
    // Named tokens derive from the immutable match program. Copy tokens freeze
    // the selected source's evaluated stage-1 projection and retain its exact
    // incarnation only as provenance; later source changes are irrelevant.
    const requestedCanonicalId = copiedObject
      ? copiedObject.canonicalId!
      : fabCreatedObjectCanonicalId(effect.token!);
    const registeredDef = state.cardDefinitions[requestedCanonicalId];
    if (!registeredDef) {
      return unsupported(
        effect,
        `created object ${requestedCanonicalId} is absent from match program`,
      );
    }
    // A named twin face (for example token:gold) is a lookup key only. Its
    // object identity is the registered physical DFC's canonical id. Ordinary
    // authored tokens retain their established token:* runtime identity.
    const tokenCanonicalId = fabCreatedObjectRuntimeCanonicalId(
      registeredDef,
      requestedCanonicalId,
    );
    const createdFace = copiedObject
      ? ({ kind: "single" } as const)
      : initialFabActiveFaceForCreatedName(registeredDef, effect.token!);
    const tokenBase: FabBaseObjectProperties = copiedObject
      ? copiedObject.copyable
      : basePropertiesOf(registeredDef, { kind: "whole-card" }, createdFace);
    const baseSource = copiedObject
      ? ({
          kind: "frozen-copy",
          copyable: tokenBase,
          source: {
            instanceId: fabObjectInstanceId(copiedObject.ref.instanceId),
            incarnation: copiedObject.ref.incarnation,
            canonicalId: fabCanonicalCardId(copiedObject.canonicalId!),
          },
          createdByEventId: `${processId}:${layer.layerId}:${targetPath}:create`,
        } as const)
      : ({ kind: "registered" } as const);
    const enterCounters = resolveCreateTokenCounters(state, layer, effect.withCounters);
    if (enterCounters === null) {
      return unsupported(effect, "create-token.withCounters amount or shape could not resolve");
    }
    let tokenIndex = 0;
    // Track per-controller fills within this proposal so multi-count creates
    // (and multi-player controllers) each take a distinct exposed seat.
    const occupiedDelta = new Map<string, Set<string>>();
    const tokenKey = `created-this-way:${effect.token ?? "copy"}`;
    const priorForToken =
      typeof layer.bindings[tokenKey] === "number"
        ? (layer.bindings[tokenKey] as number)
        : typeof layer.bindings[tokenKey] === "string"
          ? Number(layer.bindings[tokenKey]) || 0
          : 0;
    const priorTotal =
      typeof layer.bindings["created-this-way"] === "number"
        ? (layer.bindings["created-this-way"] as number)
        : typeof layer.bindings["created-this-way"] === "string"
          ? Number(layer.bindings["created-this-way"]) || 0
          : 0;
    const priorCreatedObjects = Array.isArray(layer.bindings["created-this-way-objects"])
      ? layer.bindings["created-this-way-objects"].filter(isObjectSnapshot)
      : [];
    let createdForToken = priorForToken;
    let createdTotal = priorTotal;
    const createdObjects = [...priorCreatedObjects];
    const events = playerIds.flatMap((playerId) => {
      const created: ProposedEvent[] = [];
      const weaponSeats = new Map<"weapon1" | "weapon2", FabWeaponOccupant>();
      for (let n = 0; n < count; n += 1) {
        const destZone = resolveCreateTokenDestination(state, playerId, effect, occupiedDelta);
        // amongExposed with no empty seat: CR 3.0.1a — create is a no-op.
        if (destZone === null) continue;
        const index = tokenIndex;
        // A committed continuation can rebase another create leaf onto this
        // target path. Include the allocation epoch so it cannot overwrite a
        // token created by an earlier journal from the same layer/process.
        const instanceId = `${processId}:${layer.layerId}:${targetPath}:token-${state.counters.objectIncarnation + index + 1}`;
        let object: FabObjectSnapshot = createSyntheticFabObjectSnapshot({
          ref: { instanceId, incarnation: state.counters.objectIncarnation + index + 1 },
          canonicalId: tokenCanonicalId,
          objectKind: "created-token",
          baseSource,
          ownerId: effect.creator === "token-controller" ? playerId : layer.controllerId,
          controllerId: playerId,
          zone: "unknown",
          zoneRef: { playerId: fabPlayerId(playerId), zone: destZone },
          base: tokenBase,
          activeFace: createdFace,
          // "enters with" counters ride on the create event (not a follow-up
          // add-counter), matching printed "create a … with N counters".
          counterRecords: enterCounters,
        });
        let equipmentSlot: "weapon1" | "weapon2" | undefined;
        if (effect.equipTo === "empty-weapon-zone") {
          const slot = nextFreeWeaponSlot(state, playerId, object, weaponSeats);
          if (!slot) continue;
          equipmentSlot = slot;
          object = { ...object, zoneRef: { playerId: fabPlayerId(playerId), zone: slot } };
        }
        if (createIsRestricted(state, layer.source, object)) continue;
        if (equipmentSlot)
          weaponSeats.set(
            equipmentSlot,
            weaponOccupantForDefinition(state.cardDefinitions[tokenCanonicalId]),
          );
        tokenIndex += 1;
        createdForToken += 1;
        createdTotal += 1;
        createdObjects.push(object);
        created.push({
          ...baseEvent(layer, processId),
          name: "create" as const,
          affected: [object],
          // Resolution-scoped create counts for "if you gain no X this way".
          bindings: {
            ...layer.bindings,
            "created-this-way": createdTotal,
            [tokenKey]: createdForToken,
            "created-this-way-objects": [...createdObjects],
            // A newly-created token is a real object, not just a count.  Keep
            // its snapshot in the resolution bindings so a following effect
            // can grant it a permission, modify it, or play it.  This is the
            // same object that the create reducer will install before the
            // next sequence step is proposed.
            ...(effect.outputBinding ? { [effect.outputBinding]: object } : {}),
          },
          data: { playerId, object },
        });
        if (equipmentSlot)
          created.push({
            ...baseEvent(layer, processId),
            name: "equip",
            affected: [object],
            data: {
              playerId,
              object,
              from: "permanent",
              to: "weapon",
              reason: "equip",
              equipmentSlot,
              destinationRef: null,
            },
          });
      }
      return created;
    });
    const occurrenceId = `occurrence-${processId}:${layer.layerId}:${targetPath}:create` as const;
    return {
      supported: true,
      events:
        events.length > 1
          ? events.map((event) => ({
              ...event,
              multiEvent: { occurrenceId, namedEvent: "create multiple objects" },
            }))
          : events,
    };
  }

  if (effect.type === "delayed-trigger") {
    const delayedTriggerId = `${processId}:${layer.layerId}:${targetPath}:delayed`;
    const duration = effect.policy.duration;
    const expiresAt =
      duration === "until-opponent-next-clash-resolves"
        ? ({
            kind: "player-next-clash" as const,
            playerId:
              state.playerIds.find((playerId) => playerId !== layer.controllerId) ??
              layer.controllerId,
            turnNumber: state.turnNumber,
          } as const)
        : duration === "until-end-of-action-phase"
          ? ({ kind: "phase" as const, turnNumber: state.turnNumber, phase: "action" } as const)
          : (() => {
              const resolved = resolveContinuousExpiry(state, layer.source, duration);
              if (!resolved) return null;
              switch (resolved.kind) {
                case "turn":
                case "combat-chain":
                case "player-turn-start":
                case "player-turn-end":
                case "player-action-phase-window":
                case "player-end-phase-window":
                case "source":
                  return resolved;
                case "permanent":
                  return null;
              }
            })();
    const policy = expiresAt
      ? ({
          kind: "windowed",
          expiresAt,
          matching: effect.policy.matching,
        } as const)
      : null;
    if (!policy) return unsupported(effect, `unsupported delayed-trigger duration ${duration}`);
    const resolution =
      effect.resolution.kind === "effect"
        ? effect.resolution
        : {
            kind: "modal" as const,
            ability: {
              modal: {
                choose: effect.resolution.choose,
                ...(effect.resolution.allowRepeat !== undefined
                  ? { allowRepeat: effect.resolution.allowRepeat }
                  : {}),
              },
              modes: effect.resolution.modes,
              ...(effect.resolution.effect ? { effect: effect.resolution.effect } : {}),
            },
          };
    return {
      supported: true,
      events: [
        {
          ...baseEvent(layer, processId),
          name: "register-delayed-trigger",
          affected: [layer.source],
          data: {
            delayedTriggerId,
            controllerId: layer.controllerId,
            source: layer.source,
            trigger: effect.trigger,
            resolution,
            policy,
            // A delayed effect's `it` is its source unless its triggering
            // layer supplied a more specific object. Follow live seats so a
            // prior sequence step (banish) that reset incarnation is visible
            // when the delayed clause later fires.
            bindings: liveReanchorBindings(state, {
              it: layer.source,
              ...layer.bindings,
              ...(layer.bindings.it ? { it: layer.bindings.it } : {}),
            }),
          },
        },
      ],
    };
  }

  if (effect.type === "replacement") {
    if (!supportedCanonicalReplacement(effect)) {
      return unsupported(effect, "replacement shape is not yet canonical");
    }
    const replacementId = `${processId}:${layer.layerId}:${targetPath}:replacement`;
    const applicationPolicy = persistedReplacementApplicationPolicy(effect);
    if (!applicationPolicy)
      return unsupported(effect, "replacement application policy is not yet canonical");
    // A generated this-turn replacement can watch a bound object ("if it would
    // be put into the graveyard…") rather than the ability source. subject:self
    // matching uses the registered source instance.
    const modificationTarget =
      "target" in effect.modification ? effect.modification.target : undefined;
    const watched =
      modificationTarget &&
      typeof modificationTarget === "object" &&
      "selector" in modificationTarget
        ? objectTargets(
            state,
            layer,
            modificationTarget,
            `${targetPath}:modification`,
            effectTargets,
            effectPath,
          )
        : null;
    const source = watched?.length === 1 ? watched[0]! : layer.source;
    return {
      supported: true,
      events: [
        {
          ...baseEvent(layer, processId),
          name: "register-replacement",
          affected: [source],
          data: {
            replacementId,
            controllerId: layer.controllerId,
            source,
            effect,
            applicationPolicy,
            consumptionPolicy:
              (effect.replaces.name === "create" && effect.replaces.occurrences === "every") ||
              effect.duration === "this-combat-chain"
                ? { kind: "never" }
                : applicationPolicy.kind === "may-apply"
                  ? { kind: "on-opportunity" }
                  : { kind: "on-application" },
          },
        },
      ],
    };
  }

  if (effect.type === "prevention") {
    // Missing shielded defaults to the controller (printed "prevent the next
    // N damage that would be dealt to [you/hero name]").
    // Yoji: shielded is on-stack another hero; redirectTo self retargets damage.
    // Cap of Quick Thinking: optionalCost discard Instant + additionalModification
    // draw, source opponent; multi-fire this turn (consumeOnUse false).
    // Shroud of Darkness: optionalCost banish-self + while-in-arena (one-shot via
    // self-banish; registered path still multi-fire until source leaves).
    const shieldedSelector = effect.shielded?.selector ?? "controller";
    const redirectSelector = effect.redirectTo?.selector;
    const onStackShield =
      effect.shielded?.selector === "object" &&
      "declared" in effect.shielded &&
      effect.shielded.declared === "on-stack";
    const classShield =
      effect.shielded?.selector === "object" &&
      "filter" in effect.shielded &&
      Boolean(effect.shielded.filter);
    const atResolutionObjectShield =
      effect.shielded?.selector === "object" &&
      "declared" in effect.shielded &&
      effect.shielded.declared === "at-resolution";
    const optionalDiscardInstant =
      effect.optionalCost?.class === "effect" &&
      effect.optionalCost.type === "discard" &&
      effect.optionalCost.count === 1 &&
      (effect.optionalCost.filter?.typeBox?.types?.includes("Instant") ?? false);
    const optionalBanishSelf =
      effect.optionalCost?.class === "effect" && effect.optionalCost.type === "banish-self";
    const optionalBanishSoul =
      effect.optionalCost?.class === "effect" &&
      effect.optionalCost.type === "banish" &&
      effect.optionalCost.from === "soul" &&
      (effect.optionalCost.count === undefined || effect.optionalCost.count === 1);
    const optionalRemoveSteam =
      effect.optionalCost?.class === "effect" &&
      effect.optionalCost.type === "remove-counters" &&
      effect.optionalCost.counter.kind === "named" &&
      effect.optionalCost.counter.name === "steam";
    const optionalCostSupported =
      optionalDiscardInstant || optionalBanishSelf || optionalBanishSoul || optionalRemoveSteam;
    const additionalDraw =
      effect.additionalModification?.type === "draw" && effect.additionalModification.count === 1;
    // CR 6.4.1a / 6.4.10h: destroy-self additional modification (Enchanting
    // Melody) is an admissible sub-event alongside the single-card draw — it
    // fires whenever the prevention applies, even on unpreventable damage.
    const additionalDestroySelf =
      effect.additionalModification?.type === "destroy" &&
      effect.additionalModification.target.selector === "self" &&
      (effect.additionalModification.delay === undefined ||
        effect.additionalModification.delay === "end-phase");
    const additionalCreateToken =
      effect.additionalModification !== undefined &&
      isAdmissiblePreventionAdditionalCreateToken(effect.additionalModification);
    const atResolutionSource =
      effect.source?.selector === "object" &&
      (effect.source.declared === "at-resolution" || effect.source.declared === "on-stack");
    const sourceOpponentOk = effect.source === undefined || effect.source.selector === "opponent";
    const preventsEventAmount =
      typeof effect.amount === "object" &&
      effect.amount !== null &&
      "type" in effect.amount &&
      effect.amount.type === "event-amount";
    // CR 6.4.10j: a prevention budget is fixed when generated. Shielding and
    // fixed preventions with a count/X amount (Dampen: "prevent the next X
    // arcane"; WTR010 Bone Head Barrier's roll-result X) lock that number here
    // so later application is numeric and the consume-replacement-effects
    // reducer can decrement it per point prevented (6.4.10a carryover,
    // cease at 0).
    const isShielding = effect.preventionKind === "shielding";
    let registeredAmount = effect.amount;
    if (typeof effect.amount !== "number" && !preventsEventAmount) {
      const resolved = effect.amount ? resolveLayerAmount(state, layer, effect.amount) : null;
      if (resolved === null || !Number.isFinite(resolved) || resolved < 0)
        return unsupported(effect, "prevention amount is unresolved");
      registeredAmount = resolved;
    }
    if (
      (effect.preventionKind !== "fixed" && !isShielding) ||
      (typeof registeredAmount !== "number" && !preventsEventAmount) ||
      (effect.optionalCost && !optionalCostSupported) ||
      (effect.additionalModification &&
        !additionalDraw &&
        !additionalDestroySelf &&
        !additionalCreateToken &&
        !isPreventionSourceBanish(effect.additionalModification)) ||
      (effect.times !== undefined &&
        (typeof effect.times !== "number" ||
          !Number.isSafeInteger(effect.times) ||
          effect.times < 1)) ||
      (shieldedSelector !== "controller" &&
        shieldedSelector !== "self" &&
        shieldedSelector !== "any-hero" &&
        !onStackShield &&
        !atResolutionObjectShield &&
        !classShield) ||
      (redirectSelector !== undefined &&
        redirectSelector !== "self" &&
        redirectSelector !== "controller") ||
      (!sourceOpponentOk && !atResolutionSource) ||
      ![
        "this-turn",
        "this-chain-link",
        "this-combat-chain",
        "until-start-of-own-next-turn",
        "while-in-arena",
        "permanent",
      ].includes(effect.duration)
    )
      return unsupported(effect, "prevention shape is not yet canonical");

    let shieldedPlayerId = layer.controllerId;
    const shieldedFilter =
      classShield && effect.shielded && "filter" in effect.shielded
        ? effect.shielded.filter
        : undefined;
    if (effect.shielded?.selector === "any-hero") {
      const chosen = heroTargets(
        state,
        layer,
        effect.shielded,
        targetPath,
        effectTargets,
        effectPath,
      );
      if (!chosen || chosen.length !== 1) {
        return unsupported(effect, "prevention shielded target unresolved");
      }
      shieldedPlayerId = chosen[0]!;
    } else if (!classShield && (onStackShield || atResolutionObjectShield) && effect.shielded) {
      const protectedHeroes = objectTargets(
        state,
        layer,
        effect.shielded,
        targetPath,
        effectTargets,
        effectPath,
      );
      if (!protectedHeroes || protectedHeroes.length === 0) {
        return unsupported(effect, "prevention shielded target unresolved");
      }
      const hero = protectedHeroes.find((object) => object.current.typeBox.types.includes("Hero"));
      shieldedPlayerId =
        hero?.controllerId ??
        hero?.ownerId ??
        protectedHeroes[0]!.controllerId ??
        protectedHeroes[0]!.ownerId ??
        layer.controllerId;
    }
    const redirectPlayerId =
      redirectSelector === "self" || redirectSelector === "controller"
        ? layer.controllerId
        : undefined;
    // On-stack / at-resolution damage sources are collected as
    // `${targetPath}:source` (see collectDeclaredTargets). The default
    // objectTargets key is `:target`, which on Oasis is the shielded hero
    // player-id and does not resolve as an object.
    const preventedSources =
      atResolutionSource && effect.source
        ? objectTargets(
            state,
            layer,
            effect.source,
            targetPath,
            effectTargets,
            effectPath,
            false,
            "source",
          )
        : null;
    if (atResolutionSource && (!preventedSources || preventedSources.length !== 1)) {
      return unsupported(effect, "prevention damage source is unresolved");
    }
    const replacementId = `${processId}:${layer.layerId}:${targetPath}:replacement`;
    const applicationPolicy = persistedReplacementApplicationPolicy(effect);
    if (!applicationPolicy)
      return unsupported(effect, "prevention cost/application policy is not yet canonical");
    // Optional-cost preventions are multi-fire for their duration window
    // ("if you would be dealt damage this turn, you may…").
    // Banish-self is also multi-fire in the register path; the source leaving
    // the arena ends eligibility via preventionApplies.
    // Steam-remove, soul-banish, and discard Instant are multi-fire while the
    // source remains eligible for its duration.
    const consumeOnUse =
      !optionalDiscardInstant && !optionalBanishSelf && !optionalBanishSoul && !optionalRemoveSteam;
    // Lock a resolved numeric budget onto the persisted prevention.
    const registeredEffect =
      registeredAmount !== effect.amount
        ? ({ ...effect, amount: registeredAmount } as typeof effect)
        : effect;
    return {
      supported: true,
      events: [
        {
          ...baseEvent(layer, processId),
          name: "register-replacement",
          affected: [layer.source],
          data: {
            replacementId,
            controllerId: layer.controllerId,
            source: layer.source,
            effect: registeredEffect,
            applicationPolicy,
            shieldedPlayerId,
            ...(shieldedFilter ? { shieldedFilter } : {}),
            ...(preventedSources?.[0]
              ? { preventedSourceInstanceId: preventedSources[0].instanceId }
              : {}),
            consumptionPolicy: !consumeOnUse
              ? { kind: "never" }
              : applicationPolicy.kind === "may-apply"
                ? { kind: "on-opportunity" }
                : { kind: "on-application" },
            ...(redirectPlayerId ? { redirectPlayerId } : {}),
          },
        },
      ],
    };
  }

  if (effect.type === "play-card") {
    if (!effect.duration) return unsupported(effect, "immediate nested play is not yet canonical");
    if (
      ![
        "this-turn",
        "until-end-of-own-next-turn",
        "until-start-of-own-next-turn",
        "this-chain-link",
        "this-combat-chain",
        "while-in-arena",
        "permanent",
        "during-own-next-action-phase",
      ].includes(effect.duration)
    )
      return unsupported(effect, "play permission duration is not yet canonical");
    if (!continuousDurationSupported(effect.duration))
      return unsupported(effect, "play permission duration is not canonical");
    const continuousEffectId = buildContinuousEffectId(
      processId,
      layer,
      targetPath,
      "play-permission",
    );
    const futureApplicability = continuousFutureApplicability(effect);
    if (futureApplicability === undefined)
      return unsupported(effect, "continuous future-object count is not a locked integer");
    // Direct grants resolve source subjects now. Next-object grants (appliesTo.next)
    // keep empty initial subjects and latch when a matching card is announced.
    let initialSubjects: FabContinuousInitialSubject[] = [];
    let affected: readonly FabObjectSnapshot[] = [layer.source];
    if (futureApplicability === null) {
      let objects = objectTargets(
        state,
        layer,
        effect.source,
        targetPath,
        effectTargets,
        effectPath,
      );
      // If-you-do banish producers stamp `banished-this-way`. Prefer that cohort
      // over a leftover `it` (the attacking source) so "you may play it this
      // turn" grants the banished card, not the resolved attack.
      if (effect.source.selector === "binding") {
        const banishedWay = layer.bindings["banished-this-way"];
        const banishedObjects = Array.isArray(banishedWay)
          ? banishedWay.filter(isObjectSnapshot)
          : isObjectSnapshot(banishedWay)
            ? [banishedWay]
            : [];
        if (banishedObjects.length > 0) objects = banishedObjects;
      }
      if (!objects) return unsupported(effect, "play permission source is unresolved");
      // CR 1.8.5e: an optional targeted effect is declined by declaring no
      // target. An empty declared set must therefore generate no permission.
      // Do not persist an empty-subject instance: the evaluator intentionally
      // uses that shape for future/dynamic applicability, which would widen a
      // declined exact-card permission to every card matching the filter.
      if (objects.length === 0) return { supported: true, events: [] };
      initialSubjects = objects.map((object) => {
        const live = state.objects[object.instanceId];
        return live ? { instanceId: live.instanceId, incarnation: live.incarnation } : object.ref;
      });
      affected = objects;
    }
    const compiled = compileFabContinuousEffect({ effectId: continuousEffectId, effect });
    if (!compiled.ok) return unsupported(effect, compiled.error.mechanic);
    const expiresAt = resolveContinuousExpiry(state, layer.source, effect.duration);
    if (!expiresAt) return unsupported(effect, "play permission expiry is not canonical");
    const playFutureApplicability = canonicalizeFutureApplicability(futureApplicability);
    if (playFutureApplicability === undefined)
      return unsupported(effect, "continuous future-object count is not a locked integer");
    return {
      supported: true,
      events: [
        {
          ...baseEvent(layer, processId),
          name: "continuous-effect-generated",
          affected,
          bindings: layer.bindings,
          data: {
            effectId: continuousEffectId,
            controllerId: layer.controllerId,
            source: layer.source,
            origin: { kind: "layer" },
            effectPath,
            simultaneousGroupId: null,
            atoms: compiled.atoms,
            duration: effect.duration,
            expiresAt,
            initialSubjects,
            futureApplicability: playFutureApplicability,
          },
        },
      ],
    };
  }

  if (
    effect.type === "grant-property" ||
    effect.type === "remove-property" ||
    effect.type === "can-be-attacked" ||
    effect.type === "rule-modification" ||
    effect.type === "copy" ||
    effect.type === "become" ||
    (effect.type === "gain-control" && effect.duration !== undefined) ||
    (effect.type === "give" && effect.duration !== undefined) ||
    (effect.type === "steal" && effect.duration !== undefined) ||
    (effect.type === "freeze" && effect.duration !== undefined) ||
    effect.type === "modify-numeric" ||
    effect.type === "modify-activation-cost"
  ) {
    if (!continuousDurationSupported(effect.duration))
      return unsupported(effect, "continuous duration is not yet canonical");
    // Mask of Many Faces / "gains that name": grant-property name value "chosen"
    // is a parser sentinel for the name-card binding from an earlier sequence
    // step. Lock the concrete name into the continuous atom so evaluation does
    // not leave the literal string "chosen" on the subject.
    let continuousEffect: FabEffect = effect;
    if (
      effect.type === "grant-property" &&
      effect.property.kind === "name" &&
      effect.property.value === "chosen"
    ) {
      const boundName =
        (typeof layer.bindings["named-card"] === "string" ? layer.bindings["named-card"] : null) ??
        (typeof layer.bindings.namedCard === "string" ? layer.bindings.namedCard : null) ??
        (typeof layer.bindings.chosen === "string" ? layer.bindings.chosen : null) ??
        (typeof layer.bindings["chosen-option"] === "string"
          ? layer.bindings["chosen-option"]
          : null) ??
        (typeof layer.bindings.chosenOption === "string" ? layer.bindings.chosenOption : null);
      if (!boundName) {
        return unsupported(
          effect,
          "grant name 'chosen' has no named-card or chosen-option binding",
        );
      }
      continuousEffect = {
        ...effect,
        property: { kind: "name" as const, value: boundName },
      };
    }
    if (
      effect.type === "grant-property" &&
      effect.property.kind === "color" &&
      effect.property.value === "chosen"
    ) {
      const boundColor =
        (typeof layer.bindings["chosen-color"] === "string"
          ? layer.bindings["chosen-color"]
          : null) ??
        (typeof layer.bindings.chosenColor === "string" ? layer.bindings.chosenColor : null);
      if (!boundColor || !isFabPitchColor(boundColor)) {
        return unsupported(effect, "grant color 'chosen' has no chosen-color binding");
      }
      continuousEffect = {
        ...effect,
        property: { kind: "color" as const, value: boundColor },
      };
    }
    if (effect.type === "rule-modification" && effect.filter?.name === "chosen") {
      const boundName =
        (typeof layer.bindings["named-card"] === "string" ? layer.bindings["named-card"] : null) ??
        (typeof layer.bindings.namedCard === "string" ? layer.bindings.namedCard : null);
      if (!boundName) {
        return unsupported(effect, "rule restriction name 'chosen' has no named-card binding");
      }
      continuousEffect = {
        ...effect,
        filter: { ...effect.filter, name: boundName },
      };
    }
    // CR 6.2.2b: crush-style restrict filters that read event-amount / this-way
    // must lock the number at generation. Next-turn play quote has no layer.
    if (continuousEffect.type === "rule-modification" && continuousEffect.filter) {
      const lockedFilter = lockCardFilterLayerBoundAmounts(continuousEffect.filter, (amount) =>
        resolveLayerAmount(state, layer, amount),
      );
      if (lockedFilter === null) {
        return unsupported(effect, "rule restriction filter amount could not resolve");
      }
      if (lockedFilter !== continuousEffect.filter) {
        continuousEffect = { ...continuousEffect, filter: lockedFilter };
      }
    }
    // Variable keyword values are bound on the resolving layer. Lock the
    // number into the continuous atom while that binding is still available;
    // later rules-view evaluation deliberately has no stack-layer context.
    if (
      continuousEffect.type === "grant-property" &&
      continuousEffect.property.kind === "keyword" &&
      "value" in continuousEffect.property.keyword &&
      typeof continuousEffect.property.keyword.value === "object"
    ) {
      const keyword = continuousEffect.property.keyword;
      const value = resolveLayerAmount(state, layer, keyword.value);
      if (value === null) return unsupported(effect, "keyword value amount could not resolve");
      continuousEffect = {
        ...continuousEffect,
        property: {
          kind: "keyword",
          keyword: { ...keyword, value },
        },
      };
    }
    // CR 6.2.2b: this-way / event-bound X locks when generated. appliesTo.next
    // is the future-object shape (Song of Sinew). "Attacks on this combat chain"
    // is an at-resolution scan + this-combat-chain duration — subjects stay
    // dynamic, but charged-this-way must lock. Live counts (cards-defending)
    // and Tear Limb (`subject-property` of the future card) stay unevaluated.
    if (
      continuousEffect.type === "modify-numeric" &&
      typeof continuousEffect.amount !== "number" &&
      !amountUsesFutureSubject(continuousEffect.amount) &&
      (continuousEffect.appliesTo || amountDependsOnLayerBindings(continuousEffect.amount))
    ) {
      const amount = resolveLayerAmount(state, layer, continuousEffect.amount);
      if (amount === null) return unsupported(effect, "future numeric amount could not resolve");
      continuousEffect = { ...continuousEffect, amount };
    }
    // Catalog status shorthand inside appliesTo.next ("boosted", "rune-gated",
    // "played-by-defending-hero") must land on the atom in its matchable
    // form — otherwise matchesFilter fails closed and the future latch never
    // binds (High Speed Impact class).
    if (
      continuousEffect.type !== "modify-activation-cost" &&
      "appliesTo" in continuousEffect &&
      continuousEffect.appliesTo &&
      typeof continuousEffect.appliesTo === "object" &&
      continuousEffect.appliesTo.next &&
      typeof continuousEffect.appliesTo.next === "object"
    ) {
      const previousNext = continuousEffect.appliesTo.next;
      const rewritten = rewriteAppliesToNextFilter(previousNext);
      if (rewritten !== previousNext) {
        continuousEffect = {
          ...continuousEffect,
          appliesTo: { ...continuousEffect.appliesTo, next: rewritten },
        };
      }
    }
    const compiled = compileFabContinuousEffect({
      effectId: buildContinuousEffectId(processId, layer, targetPath),
      effect: continuousEffect,
    });
    if (!compiled.ok) return unsupported(effect, compiled.error.mechanic);
    const futureApplicability = bindAttacksOfSources(
      state,
      layer,
      effect,
      canonicalizeFutureApplicability(continuousFutureApplicability(effect)),
      effectTargets,
      effectPath,
      targetPath,
    );
    if (futureApplicability === undefined)
      return unsupported(effect, "continuous future-object count is not a locked integer");
    const expiresAt = resolveContinuousExpiry(state, layer.source, effect.duration, {
      ownAnchorPlayerId:
        typeof layer.bindings["iteration-subject"] === "string"
          ? layer.bindings["iteration-subject"]
          : null,
    });
    if (!expiresAt) return unsupported(effect, "continuous expiry is not canonical");
    // Lock subjects for self / object targets so power/intellect buffs apply
    // immediately (Head Shot arsenal face-up, Evo transform intellect, etc.).
    // Future-object appliesTo effects keep empty subjects and attach later,
    // except unbounded `count: all` ("attack action cards you control this
    // turn"): also lock objects already under control (the open attack, current
    // defenders) as plain object refs so later latches survive that chain.
    // Prefer live incarnation over layer.source LKI — zone moves (arsenal load)
    // bump incarnation before the triggered continuous layer resolves.
    let initialSubjects: FabContinuousInitialSubject[] = [];
    const continuousSubject =
      "target" in effect && effect.target
        ? effect.target
        : effect.type === "rule-modification"
          ? effect.subject
          : null;
    const lockCurrentWithUnboundedFuture =
      futureApplicability !== null && futureApplicability.count === Number.POSITIVE_INFINITY;
    if (continuousSubject && (futureApplicability === null || lockCurrentWithUnboundedFuture)) {
      const target = continuousSubject;
      const selector =
        typeof target === "object" && target !== null && "selector" in target
          ? target.selector
          : null;
      if (selector === "self") {
        const live = state.objects[layer.source.instanceId];
        initialSubjects = live
          ? [{ instanceId: live.instanceId, incarnation: live.incarnation }]
          : [layer.source.ref];
      } else if (selector === "this-attack") {
        // CR 1.4.3e / Errata #9: an effect that applies to "the attack" locks
        // the exact attack-proxy (or attack-card incarnation), not the weapon
        // source. A later activation of the same weapon is a new attack.
        // Unbounded you-control-this-turn grants must not use an exact-attack
        // subject: that liveness dies with the current link and would drop the
        // remaining all-this-turn latch (Art of War).
        const active = state.combat?.activeLink?.activeAttack;
        const live = active ? state.objects[active.sourceObjectId] : undefined;
        if (active && live) {
          initialSubjects = lockCurrentWithUnboundedFuture
            ? [{ instanceId: live.instanceId, incarnation: live.incarnation }]
            : [
                active.kind === "proxy"
                  ? {
                      instanceId: live.instanceId,
                      incarnation: live.incarnation,
                      attack: { kind: "proxy" as const, proxyId: active.proxyId },
                    }
                  : {
                      instanceId: live.instanceId,
                      incarnation: live.incarnation,
                      attack: { kind: "card" as const },
                    },
              ];
        }
      } else if (selector === "controller") {
        const heroId = state.containers.zonesByPlayerId[layer.controllerId]?.heroZone[0];
        if (heroId) {
          const hero = state.objects[heroId];
          if (hero) {
            initialSubjects = [{ instanceId: heroId, incarnation: hero.incarnation }];
          }
        }
      } else if (
        // Hero-seat selectors (freeze attacking-hero, opponent, …) must latch
        // the hero object at resolution. Re-resolving attacking-hero each frame
        // fails after combat closes (facts.combat is null) and the continuous
        // freeze stops applying — PEN227 Crown of Frozen Thoughts.
        selector === "attacking-hero" ||
        selector === "defending-hero" ||
        selector === "attack-target" ||
        selector === "opponent" ||
        selector === "each-hero" ||
        selector === "each-other-hero" ||
        selector === "highest-life-hero" ||
        selector === "lowest-life-hero" ||
        selector === "any-hero" ||
        selector === "iteration-subject"
      ) {
        let playerIds = heroTargets(state, layer, target as never, targetPath) ?? [];
        if (
          playerIds.length === 0 &&
          continuousEffect.type === "rule-modification" &&
          continuousEffect.action === "lose-abilities"
        ) {
          playerIds = state.playerIds.filter((playerId) => playerId !== layer.controllerId);
        }
        if (playerIds.length > 0) {
          for (const playerId of playerIds) {
            const heroId = state.containers.zonesByPlayerId[playerId]?.heroZone[0];
            if (!heroId) continue;
            const hero = state.objects[heroId];
            if (hero) {
              initialSubjects.push({
                instanceId: heroId,
                incarnation: hero.incarnation,
              });
            }
          }
        }
      } else if ((selector === "object" || selector === "binding") && typeof target === "object") {
        // Binding targets (Azalea arrow dominate, "it gets …") resolve the same
        // way as object targets so continuous grants lock the bound subject.
        const exactAttackBinding =
          typeof target === "object" &&
          target !== null &&
          "selector" in target &&
          target.selector === "binding"
            ? layer.bindings[target.binding]
            : undefined;
        const starCount =
          selector === "object" &&
          "count" in target &&
          typeof target.count === "object" &&
          target.count !== null &&
          "type" in target.count &&
          (target.count.type === "all" || target.count.type === "any-number");
        // Quantifier-count "cards they own" / "all swords you control" stays dynamic
        // so later-created tokens still lose/can't-gain (Amnesia), unless this is
        // an unbounded future latch that also needs the objects already present
        // (Art of War defending AACs already on the chain).
        if (!starCount || lockCurrentWithUnboundedFuture) {
          const objects = objectTargets(
            state,
            layer,
            target as Extract<typeof target, { selector: "object" | "binding" }>,
            targetPath,
            effectTargets,
            effectPath,
          );
          // Unresolved object targets keep empty subjects (prior behavior) so
          // future-object / next-attack continuous effects still propose cleanly.
          if (objects) {
            // CR 1.8.5e: an up-to target answered with the empty set did not
            // generate an effect. Empty initial subjects are otherwise a
            // deliberate representation for dynamic/future applicability, so
            // do not persist this declined exact-target effect as game-wide.
            // Quantifier counts ("all") are not declinable choices: an empty
            // set at resolution means "none yet" and must stay dynamic
            // (Scramble Pulse equipment defending later on this chain).
            if (
              selector === "object" &&
              "declared" in target &&
              "count" in target &&
              isUpToCountValue(target.count) &&
              objects.length === 0
            )
              return { supported: true, events: [] };
            initialSubjects = isExactAttackBinding(exactAttackBinding)
              ? [exactAttackBinding.attack]
              : objects.map((object) => {
                  const live = state.objects[object.instanceId];
                  // A declared combat-chain target identifies this attack, not
                  // every later activation of its physical weapon (CR 1.4.3e).
                  const active = state.combat?.activeLink?.activeAttack;
                  if (
                    live &&
                    "selector" in target &&
                    target.selector === "object" &&
                    target.zones?.length === 1 &&
                    target.zones[0] === "combat-chain" &&
                    active?.sourceObjectId === live.instanceId &&
                    !lockCurrentWithUnboundedFuture
                  ) {
                    return {
                      instanceId: live.instanceId,
                      incarnation: live.incarnation,
                      attack:
                        active.kind === "proxy"
                          ? { kind: "proxy" as const, proxyId: active.proxyId }
                          : { kind: "card" as const },
                    };
                  }
                  return live
                    ? { instanceId: live.instanceId, incarnation: live.incarnation }
                    : object.ref;
                });
          }
        }
      }
    }
    // Shiyana / copy effects: lock the resolved copy source into event bindings
    // and rewrite atoms to read `{ selector: "binding", binding: "copy-source" }`
    // so evaluation does not re-scan at-resolution hero zones every frame.
    let atoms = compiled.atoms;
    let randomCopyConsumption: ProposedEvent | null = null;
    let eventBindings: Record<string, FabObjectSnapshot | readonly FabObjectSnapshot[]> = {};
    // A continuous effect is still a resolution step. When it selects an
    // object and names an output binding, publish that exact LKI just like a
    // move/choose step does. This lets a later sequence step grant a property
    // to the already-selected object instead of re-scanning a changing combat
    // chain (Take a Stab, Two Sides to the Blade, and the Draconic reactions).
    const outputBinding =
      "outputBinding" in effect && typeof effect.outputBinding === "string"
        ? effect.outputBinding
        : null;
    if (
      outputBinding &&
      "target" in effect &&
      effect.target &&
      typeof effect.target === "object" &&
      (effect.target.selector === "self" ||
        effect.target.selector === "binding" ||
        effect.target.selector === "object")
    ) {
      const selected = objectTargets(
        state,
        layer,
        effect.target,
        targetPath,
        effectTargets,
        effectPath,
      );
      if (selected && selected.length > 0) {
        eventBindings = {
          ...eventBindings,
          [outputBinding]: selected.length === 1 ? selected[0]! : selected,
        };
      }
    }
    if (effect.type === "become" && initialSubjects.length === 0) {
      const heroId = state.containers.zonesByPlayerId[layer.controllerId]?.heroZone[0];
      const hero = heroId ? state.objects[heroId] : undefined;
      if (hero && heroId) {
        initialSubjects = [{ instanceId: heroId, incarnation: hero.incarnation }];
      }
    }
    if (effect.type === "copy") {
      // Source was declared at-resolution under this effectPath (see
      // atResolutionDecisionTarget case "copy").
      const sourceObjects = objectTargets(
        state,
        layer,
        effect.source,
        targetPath,
        effectTargets,
        effectPath,
      );
      if (!sourceObjects || sourceObjects.length !== 1) {
        return unsupported(effect, "copy source is unresolved or not unique");
      }
      const copySource = sourceObjects[0]!;
      eventBindings = { "copy-source": copySource };
      atoms = compiled.atoms.map((atom) => {
        if (atom.kind === "copy" || atom.kind === "copy-abilities") {
          if (atom.kind === "copy") {
            return {
              ...atom,
              source: { selector: "binding" as const, binding: "copy-source" },
              frozenSource: copySource.copyable,
              sourceProvenance: copySource.ref,
            };
          }
          return {
            ...atom,
            source: { selector: "binding" as const, binding: "copy-source" },
          };
        }
        return atom;
      });
      if (
        effect.source.selector === "object" &&
        effect.source.declared === "at-resolution" &&
        effect.source.random === true
      ) {
        const pool = scanAtResolutionObjectPool(state, layer, effect.source);
        const result = pool?.findIndex(
          (candidate) => candidate.instanceId === copySource.instanceId,
        );
        if (!pool || pool.length === 0 || result === undefined || result < 0)
          return unsupported(effect, "random copy source is not in its canonical pool");
        randomCopyConsumption = {
          ...baseEvent(layer, processId),
          name: "consume-random-index",
          affected: [],
          data: { maxExclusive: pool.length, result },
        };
      }
    }
    if (effect.type === "become" && effect.source === "named-hero") {
      const named =
        (typeof layer.bindings["named-card"] === "string" ? layer.bindings["named-card"] : null) ??
        (typeof layer.bindings.namedCard === "string" ? layer.bindings.namedCard : null);
      if (!named) return unsupported(effect, "become named-hero has no named-card binding");
      const identity = state.publicCardIdentities.find((entry) =>
        entry.names.some((name) => name === named),
      );
      const definition = identity ? state.cardDefinitions[identity.canonicalId] : undefined;
      if (!definition) {
        return unsupported(effect, "become named-hero is not in the public catalog");
      }
      const frozenSource = definition.base ?? basePropertiesOf(definition);
      atoms = compiled.atoms.map((atom) =>
        atom.kind === "become" ? { ...atom, frozenSource } : atom,
      );
    }
    const continuousEvent: ProposedEvent = {
      ...baseEvent(layer, processId),
      name: "continuous-effect-generated",
      affected: [layer.source],
      bindings: { ...layer.bindings, ...eventBindings },
      data: {
        effectId: buildContinuousEffectId(processId, layer, targetPath),
        controllerId:
          effect.type === "rule-modification" &&
          typeof layer.bindings["iteration-subject"] === "string"
            ? layer.bindings["iteration-subject"]
            : layer.controllerId,
        source: layer.source,
        origin: { kind: "layer" },
        effectPath,
        simultaneousGroupId: null,
        atoms,
        duration: effect.duration,
        expiresAt,
        initialSubjects,
        futureApplicability,
        ...((effect.type === "copy" && effect.observation === "become") ||
        (effect.type === "become" && effect.source === "named-hero")
          ? { observeAsBecome: true }
          : {}),
      },
    };
    return {
      supported: true,
      // RNG advances first, copy instance commits second, then subscribers
      // observe Become against the reconciled hero properties.
      events: [...(randomCopyConsumption ? [randomCopyConsumption] : []), continuousEvent],
    };
  }

  return null;
}

/** Lock event-amount / this-way comparison values onto a restrict filter. */
function lockCardFilterLayerBoundAmounts(
  filter: FabCardFilter,
  resolve: (amount: FabAmount) => number | null,
): FabCardFilter | null {
  let next: FabCardFilter = filter;
  if (filter.numeric && filter.numeric.length > 0) {
    const numeric: NonNullable<FabCardFilter["numeric"]>[number][] = [];
    for (const entry of filter.numeric) {
      const comparison = lockComparisonLayerBoundValue(entry.comparison, resolve);
      if (comparison === null) return null;
      numeric.push(comparison === entry.comparison ? entry : { ...entry, comparison });
    }
    if (numeric.some((entry, index) => entry !== filter.numeric![index])) {
      next = { ...next, numeric };
    }
  }
  for (const key of ["power", "cost", "defense"] as const) {
    const comparison = filter[key];
    if (!comparison) continue;
    const locked = lockComparisonLayerBoundValue(comparison, resolve);
    if (locked === null) return null;
    if (locked !== comparison) next = { ...next, [key]: locked };
  }
  if (filter.and) {
    const and: FabCardFilter[] = [];
    for (const child of filter.and) {
      const locked = lockCardFilterLayerBoundAmounts(child, resolve);
      if (locked === null) return null;
      and.push(locked);
    }
    if (and.some((child, index) => child !== filter.and![index])) next = { ...next, and };
  }
  if (filter.or) {
    const or: FabCardFilter[] = [];
    for (const child of filter.or) {
      const locked = lockCardFilterLayerBoundAmounts(child, resolve);
      if (locked === null) return null;
      or.push(locked);
    }
    if (or.some((child, index) => child !== filter.or![index])) next = { ...next, or };
  }
  return next;
}

function lockComparisonLayerBoundValue(
  comparison: FabComparison,
  resolve: (amount: FabAmount) => number | null,
): FabComparison | null {
  if (typeof comparison.value === "number") return comparison;
  if (!amountDependsOnLayerBindings(comparison.value)) return comparison;
  const value = resolve(comparison.value);
  if (value === null) return null;
  return { ...comparison, value };
}
