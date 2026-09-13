import {
  FAB_CLASS_SUPERTYPES,
  type FabActivatedAbility,
  type FabCardFilter,
  type FabEffect,
  type FabFutureApplicabilityEvent,
  type FabStaticAbility,
  type FabTarget,
  type FleshAndBloodAbility,
} from "@tcg/flesh-and-blood-types";
import type { FabObjectSnapshot, FabProcessId, ProposedEvent } from "../events.ts";
import type { FabFutureSubjectEvent } from "../process.ts";
import type {
  FabContinuousApplication,
  FabContinuousEffectInstance,
  FabContinuousInitialSubject,
  FabObjectRef,
  FabRulesSubjectRef,
  FabRulesTimestamp,
} from "./ir.ts";
import {
  activeContinuousAtoms,
  continuousEffectInstanceIsActive,
  futureApplicabilityIncludesEvent,
} from "./runtime.ts";
import { snapshotObject } from "../snapshots.ts";
import {
  buildFabDesiredRulesView,
  buildFabRulesView,
  buildFabRulesViewWithLki,
} from "../state-rules-view.ts";
import type { FabRulesSnapshot } from "../../kernel/transaction-kernel.ts";
import { compileFabContinuousEffect, compileFabStaticPropertyAbility } from "./compiler.ts";
import type { FabContinuousAtom } from "./ir.ts";
import { effectTreeWindowRuleModification } from "./window-rules.ts";
import { effectSemanticKind } from "../effect-semantics.ts";
import type { FabEvalContext, FabEvaluatedObject, FabRulesView } from "../rules-view.ts";
import { continuousSubjectKey, sameContinuousLatchSubject } from "./subject-key.ts";
import { engineZoneToCatalog } from "../zones.ts";

export function proposeContinuousReconciliationEvents(
  state: FabRulesSnapshot,
  processId: FabProcessId,
): readonly ProposedEvent[] {
  const sourceEvents = proposeStaticSourceEvents(state, processId);
  if (sourceEvents.length > 0) return sourceEvents;
  const futureObjectEvents = proposeFutureObjectEvents(state, processId);
  if (futureObjectEvents.length > 0) return futureObjectEvents;
  const desired = buildFabDesiredRulesView(state).applications();
  const cancelledApplicationKeys = new Set(
    state.rulesProcess?.processId === processId
      ? state.rulesProcess.cancelledContinuousApplicationKeys
      : [],
  );
  const events: ProposedEvent[] = [];
  let nextTimestamp = state.counters.timestamp;

  for (const instance of state.continuousEffectInstances) {
    if (!continuousEffectInstanceIsActive(state, instance)) {
      events.push({
        ...eventBase(instance, processId, []),
        name: "continuous-effect-ceased",
        data: { effectId: instance.effectId },
      });
      continue;
    }
    const desiredForEffect = desired.filter(
      (application) => application.effectId === instance.effectId,
    );
    for (const application of desiredForEffect) {
      const previous = instance.applications.find((candidate) =>
        sameApplicationKey(candidate, application),
      );
      if (!previous) {
        if (cancelledApplicationKeys.has(continuousApplicationFingerprintKey(application))) {
          continue;
        }
        nextTimestamp += 1;
        const timestamp = rulesTimestamp(nextTimestamp);
        const accepted: FabContinuousApplication = {
          ...application,
          firstAppliedAt: timestamp,
          lastChangedAt: timestamp,
        };
        events.push({
          ...eventBase(instance, processId, affected(state, accepted.subject)),
          name: "continuous-effect-applied",
          data: { application: accepted },
        });
      } else if (previous.fingerprint !== application.fingerprint) {
        if (cancelledApplicationKeys.has(continuousApplicationFingerprintKey(application))) {
          continue;
        }
        nextTimestamp += 1;
        const changed: FabContinuousApplication = {
          ...application,
          firstAppliedAt: previous.firstAppliedAt,
          lastChangedAt: rulesTimestamp(nextTimestamp),
        };
        events.push({
          ...eventBase(instance, processId, affected(state, changed.subject)),
          name: "continuous-effect-changed",
          data: { previous, application: changed },
        });
      }
    }
    for (const previous of instance.applications) {
      if (desiredForEffect.some((application) => sameApplicationKey(application, previous)))
        continue;
      events.push({
        ...eventBase(instance, processId, affected(state, previous.subject)),
        name: "continuous-effect-stopped-applying",
        data: {
          effectId: previous.effectId,
          atomId: previous.atomId,
          subject: previous.subject,
        },
      });
    }
    if (
      desiredForEffect.length === 0 &&
      instance.applications.length > 0 &&
      instance.atoms.some((atom) => atom.kind === "rule" && atom.parameters.kind === "play-card")
    ) {
      events.push({
        ...eventBase(instance, processId, []),
        name: "continuous-effect-ceased",
        data: { effectId: instance.effectId },
      });
    }
  }
  return events;
}

function proposeFutureObjectEvents(
  state: FabRulesSnapshot,
  processId: FabProcessId,
): readonly ProposedEvent[] {
  const view = buildFabRulesView(state);
  for (const instance of state.continuousEffectInstances) {
    const future = instance.futureApplicability;
    if (!future || future.remaining <= 0 || !continuousEffectInstanceIsActive(state, instance)) {
      continue;
    }
    const createdSequence = Number(instance.createdByEventId?.slice("event-".length) ?? 0);
    // Observe play announces (AAC "second attack" power — latches early enough
    // for damage) and combat attack declarations (weapon activations never
    // announce). Subject uniqueness prevents announce+attack on the same AAC
    // from consuming two ordinal slots.
    const candidate = (state.rulesProcess?.futureSubjectEvents ?? [])
      .filter(
        (event) =>
          futureLatchObservesEvent(view, future, event) &&
          // Default: only the effect controller's plays/activates (your next
          // sword, first hero ability, …). Opponent-tax filters
          // (hasStatus:"another" — Heart of Ice) also observe the opposing
          // actor when the subject is not controller-owned.
          (event.actorId === instance.controllerId ||
            future.observesOpponent ||
            futureApplicabilityObservesOpponent(future.filter)) &&
          Number(event.eventId.slice("event-".length)) > createdSequence,
      )
      .sort(
        (left, right) =>
          Number(left.eventId.slice("event-".length)) -
          Number(right.eventId.slice("event-".length)),
      )
      .find((event) => {
        const subject = futureObservationSubject(state, event, future);
        if (!subject) return false;
        if (future.observedSubjects.some((ref) => sameContinuousLatchSubject(ref, subject)))
          return false;
        // CR 1.8.10: "your next attack" is the next attack that comes under
        // control after the effect is generated. The generating source (Brand,
        // Teklo Trebuchet, Buckwild) is already under control and must not
        // consume the latch when its own attack event fires later.
        // Resolution grants skip their generating card (Brand / Blood). Static
        // "this card's attacks" binds sourceInstanceIds to that same weapon.
        if (
          subject.instanceId === instance.source.instanceId &&
          !future.sourceInstanceIds?.includes(subject.instanceId)
        )
          return false;
        if (
          future.sourceInstanceIds &&
          future.sourceInstanceIds.length > 0 &&
          !future.sourceInstanceIds.includes(physicalAttackSourceId(state, subject))
        )
          return false;
        // A destroy-self activation has already paid its cost when this
        // journal is reconciled. Its event snapshot still consumes "next".
        const eventView = view.object(subject)
          ? view
          : buildFabRulesViewWithLki(state, [event.event.data.object]);
        const object = eventView.object(subject);
        if (!object) return false;
        // The scan often observes the play announce before the chain link
        // opens (no combat facts yet). Carry the DECLARED attack target on
        // the context so hero-target markers key on declared identity (an
        // attack aimed at an ally is not an attack on the opposing hero)
        // instead of the 1v1 sole-opponent heuristic.
        const declaredTarget = readDeclaredAttackTarget(event.event);
        const baseBindings =
          instance.origin === "layer"
            ? instance.lockedBindings
            : { objects: {}, numbers: {}, strings: {} };
        return matchesAppliesToNextFilter(eventView, object, future.filter, {
          controllerId: instance.controllerId,
          source: instance.source.ref,
          bindings: declaredTarget
            ? {
                ...baseBindings,
                strings: {
                  ...baseBindings.strings,
                  "declared-attack-target": declaredTarget,
                },
              }
            : baseBindings,
        });
      });
    if (!candidate) continue;
    const subject = futureObservationSubject(state, candidate, future);
    if (!subject) continue;
    const qualifyingOrdinal = future.observedSubjects.length + 1;
    const latched = qualifyingOrdinal >= future.ordinal;
    return [
      {
        ...eventBase(instance, processId, affected(state, { kind: "object", ref: subject })),
        name: "continuous-effect-future-object-observed",
        data: { effectId: instance.effectId, subject, latched },
      },
    ];
  }
  return [];
}

function physicalAttackSourceId(
  state: FabRulesSnapshot,
  subject: FabContinuousInitialSubject,
): string {
  const byInstance = state.attackProxies[subject.instanceId];
  if (byInstance) return byInstance.sourceId;
  if ("attack" in subject && subject.attack.kind === "proxy") {
    const byProxy = state.attackProxies[subject.attack.proxyId];
    if (byProxy) return byProxy.sourceId;
  }
  return subject.instanceId;
}

function futureObservationSubject(
  state: FabRulesSnapshot,
  event: {
    readonly kind: "announce-card" | "attack" | "activate" | "defend" | "play";
    readonly object: FabObjectRef;
    readonly event?: FabFutureSubjectEvent["event"];
  },
  future: NonNullable<FabContinuousEffectInstance["futureApplicability"]>,
): FabContinuousInitialSubject | null {
  if (event.kind === "attack" || isAttackActivationEvent(event)) {
    const subject = observedAttackSubject(state, event.object);
    // Weapon activations are observed before the combat `attack` event opens
    // a proxy. "Next attack" latches wait for that attack occurrence so a
    // later extra swing of the same weapon is a new subject. Activation-cost
    // latches (events:["activate"]) observe the paid activate itself — quote
    // runs before the attack event, so ordinal-2 never counted the first swing.
    if (event.kind === "activate" && !("attack" in subject)) {
      return futureApplicabilityIncludesEvent(future.events, "activate") ? event.object : null;
    }
    return subject;
  }
  return event.object;
}

function observedAttackSubject(
  state: FabRulesSnapshot,
  object: FabObjectRef,
): FabContinuousInitialSubject {
  const active = state.combat?.activeLink?.activeAttack;
  if (!active || active.sourceObjectId !== object.instanceId) return object;
  if (active.kind === "proxy") {
    return {
      instanceId: object.instanceId,
      incarnation: object.incarnation,
      attack: { kind: "proxy", proxyId: active.proxyId },
    };
  }
  return {
    instanceId: object.instanceId,
    incarnation: object.incarnation,
    attack: { kind: "card" },
  };
}

/** Declared attack-target kind carried on play/attack events ("hero" when
 * the declaration names a hero, "object" for ally/spectra/permanent targets).
 * Null when the event carries no attack target. */
function readDeclaredAttackTarget(event: FabFutureSubjectEvent["event"]): "hero" | "object" | null {
  const data = event as { readonly attackTarget?: { readonly kind?: string } | null };
  const target = data.attackTarget;
  if (!target) return null;
  return target.kind === "hero" ? "hero" : "object";
}

/** True when future filter can match non-controller objects (opponent tax). */
export function futureApplicabilityObservesOpponent(
  filter: NonNullable<import("@tcg/flesh-and-blood-types").FabEffect["appliesTo"]>["next"],
): boolean {
  if (!filter || typeof filter !== "object") return false;
  const f = filter as {
    readonly hasStatus?: string;
    readonly and?: readonly unknown[];
    readonly or?: readonly unknown[];
  };
  if (
    f.hasStatus === "another" ||
    f.hasStatus === "opponent-controlled" ||
    f.hasStatus === "played-by-defending-hero" ||
    f.hasStatus === "targeting-you"
  )
    return true;
  if (f.and?.some((child) => futureApplicabilityObservesOpponent(child as typeof filter)))
    return true;
  if (f.or?.some((child) => futureApplicabilityObservesOpponent(child as typeof filter)))
    return true;
  return false;
}

/**
 * Shared appliesTo.next filter rewrite. Catalog cards encode "boosted",
 * "rune-gated", and "played-by-defending-hero" as `hasStatus`, but the
 * matcher only understands those via declaration-fact / zone / observer
 * shapes. Unknown statuses stay on the filter so matchesFilter fails closed.
 */
export function rewriteAppliesToNextFilter(filter: FabCardFilter): FabCardFilter {
  const status = filter.hasStatus;
  if (!status) return filter;
  if (status === "boosted") {
    const { hasStatus: _status, ...rest } = filter;
    return { ...rest, wasBoosted: true };
  }
  if (status === "rune-gated") {
    const { hasStatus: _status, ...rest } = filter;
    return {
      ...rest,
      hasKeyword: rest.hasKeyword ?? "rune-gate",
      playedFromZones: rest.playedFromZones ?? ["banished"],
    };
  }
  if (status === "played-by-defending-hero") {
    const { hasStatus: _status, ...rest } = filter;
    return rest;
  }
  return filter;
}

export type CanonicalFutureApplicability = {
  readonly filter: FabCardFilter;
  readonly events: readonly FabFutureApplicabilityEvent[] | null;
  readonly observesOpponent: boolean;
  readonly count: number;
  readonly ordinal: number;
  readonly resets: "turn" | null;
  readonly sourceInstanceIds: readonly string[] | null;
};

export function canonicalizeFutureApplicability(
  future: CanonicalFutureApplicability | null | undefined,
): CanonicalFutureApplicability | null | undefined {
  if (!future) return future;
  return {
    ...future,
    filter: rewriteAppliesToNextFilter(future.filter),
    observesOpponent: future.observesOpponent || futureApplicabilityObservesOpponent(future.filter),
  };
}

function matchesAppliesToNextFilter(
  view: FabRulesView,
  object: FabEvaluatedObject,
  filter: FabCardFilter,
  context: FabEvalContext,
): boolean {
  return view.matchesFilter(object, rewriteAppliesToNextFilter(filter), context);
}

type DesiredSourceEffect = {
  readonly controllerId: string;
  readonly source: FabObjectSnapshot;
  readonly abilityId: string;
  readonly atoms: readonly FabContinuousAtom[];
  readonly introducedAtStage: import("./ir.ts").FabRulesStage | null;
  readonly futureApplicability: StaticFutureApplicability;
  /** Statics reconcile-cease via desired membership; resolution-window
   * projections live until their printed-scope `expiresAt` (the static
   * cease pass skips the non-static origin). */
  readonly originKind: "static" | "resolution-window";
  readonly expiresAt?: import("./ir.ts").FabContinuousExpiry;
  readonly duration?: import("./ir.ts").FabContinuousEffectInstance["duration"];
  /** Chain-scoped CR 7 window projections carry their attacking card as an
   * exact-attack subject so liveness rides THIS attack being the active link
   * (runtime.ts exactAttackIsCurrent) — `chainLinkNumber` restarts at 1 for
   * every new combat chain, so a number-only expiry cannot tell chains apart
   * and would resurrect the rule on the next chain's first link. */
  readonly initialSubjects?: readonly import("./ir.ts").FabContinuousInitialSubject[];
};

function proposeStaticSourceEvents(
  state: FabRulesSnapshot,
  processId: FabProcessId,
): readonly ProposedEvent[] {
  const view = buildFabRulesView(state);
  const desired = new Map<string, DesiredSourceEffect>();
  for (const object of view.objects()) {
    const universalKeyword = object.current.keywords.find(
      (keyword) => keyword.name === "universal",
    );
    if (universalKeyword) {
      // CR 8.3.35 functions in every zone. Non-arena objects intentionally
      // have no controller, so "your hero" is anchored to the object's owner.
      const universalPlayerId = object.controllerId ?? object.ownerId;
      const heroId = state.containers.zonesByPlayerId[universalPlayerId]?.heroZone[0];
      const heroRecord = heroId ? state.objects[heroId] : undefined;
      const hero = heroRecord
        ? view.object({ instanceId: heroRecord.instanceId, incarnation: heroRecord.incarnation })
        : undefined;
      const heroClasses = hero
        ? FAB_CLASS_SUPERTYPES.filter((className) =>
            hero.current.typeBox.supertypes.includes(className),
          )
        : [];
      if (heroClasses.length > 0) {
        const abilityId = "intrinsic-universal";
        const classFingerprint = heroClasses.join("+");
        const effectId = `static:${object.ref.instanceId}#${object.ref.incarnation}:${abilityId}:${classFingerprint}`;
        const introducedAtStage = keywordIntroductionStage(
          state,
          view,
          object,
          universalKeyword.name,
        );
        desired.set(effectId, {
          controllerId: universalPlayerId,
          source: snapshotObject(
            state,
            object.ref.instanceId,
            universalPlayerId,
            object.zone.zone,
            view,
          ),
          abilityId,
          atoms: heroClasses.map((className, index) => ({
            atomId: `${effectId}:class-${index}`,
            target: { selector: "self" },
            condition: null,
            dependencyStages: [],
            applicationStage: 5,
            substage: "independent",
            kind: "supertype",
            stage: 5,
            property: { kind: "supertype", value: className },
            operation: "grant",
          })),
          introducedAtStage,
          originKind: "static",
          futureApplicability: null,
        });
      }
    }
    // CR 8.3.30c modular: "A card with modular does not have any of the
    // equipment subtypes until it is equipped to a zone. It has the subtype of
    // the zone it's equipped to." Mirrors intrinsic-universal above — a static
    // atom grants the subtype of the equipment zone the modular object
    // currently occupies, so the subtype is always live for the zone it is in.
    const modularKeyword = object.current.keywords.find((keyword) => keyword.name === "modular");
    if (modularKeyword) {
      const modularZoneSubtype: Record<string, string> = {
        head: "Head",
        chest: "Chest",
        arms: "Arms",
        legs: "Legs",
      };
      const grantedSubtype = modularZoneSubtype[object.zone.zone];
      if (grantedSubtype) {
        const modularPlayerId = object.controllerId ?? object.ownerId;
        const modularAbilityId = "intrinsic-modular";
        const modularEffectId = `static:${object.ref.instanceId}#${object.ref.incarnation}:${modularAbilityId}:${grantedSubtype}`;
        const modularIntroducedAtStage = keywordIntroductionStage(
          state,
          view,
          object,
          modularKeyword.name,
        );
        desired.set(modularEffectId, {
          controllerId: modularPlayerId,
          source: snapshotObject(
            state,
            object.ref.instanceId,
            modularPlayerId,
            object.zone.zone,
            view,
          ),
          abilityId: modularAbilityId,
          atoms: [
            {
              atomId: `${modularEffectId}:subtype`,
              target: { selector: "self" },
              condition: null,
              dependencyStages: [],
              applicationStage: 4,
              substage: "independent",
              kind: "type",
              stage: 4,
              property: { kind: "subtype", value: grantedSubtype },
              operation: "grant",
            },
          ],
          introducedAtStage: modularIntroducedAtStage,
          originKind: "static",
          futureApplicability: null,
        });
      }
    }
    for (const ability of view.functionalAbilities(object.ref)) {
      if (ability.kind !== "static") continue;
      if (!staticAbilityIsFunctional(ability, object)) continue;
      const functionsOutsideControlledZone =
        ability.functionalZones?.includes(engineZoneToCatalog(object.zone.zone) ?? "hand") ?? false;
      const materialHostId =
        ability.condition?.type === "source-is-subcard-of-host"
          ? Object.entries(state.containers.subcardsByHostId).find(([, children]) =>
              children.some((childId) => childId === object.ref.instanceId),
            )?.[0]
          : undefined;
      const materialHostRecord = materialHostId ? state.objects[materialHostId] : undefined;
      const materialHost = materialHostRecord
        ? view.object({
            instanceId: materialHostRecord.instanceId,
            incarnation: materialHostRecord.incarnation,
          })
        : undefined;
      const controllerId =
        object.controllerId ??
        materialHost?.controllerId ??
        (ability.staticKind === "property" ||
        staticDefinesIdentityAnywhere(ability) ||
        staticWhileTargetsSelf(ability) ||
        staticModifiesOwnCost(ability) ||
        (ability.staticKind === "play" && ability.playEffect?.role === "permission") ||
        functionsOutsideControlledZone
          ? object.ownerId
          : null);
      if (!controllerId) continue;
      const effectId = `static:${object.ref.instanceId}#${object.ref.incarnation}:${ability.id}`;
      const compiled = compileStaticAbility(effectId, ability);
      if (compiled === null) continue;
      // Skip unsupported continuous leaves rather than hard-failing the whole
      // reconciliation (catalog cards often carry legacy filter shapes that are
      // still playable without that continuous ability).
      if (!compiled.ok) continue;
      desired.set(effectId, {
        controllerId,
        source: snapshotObject(state, object.ref.instanceId, controllerId, object.zone.zone),
        abilityId: ability.id,
        atoms: compiled.atoms,
        introducedAtStage: abilityIntroductionStage(state, view, object, ability.id),
        originKind: "static",
        futureApplicability: bindStaticAttacksOfSource(
          object.ref.instanceId,
          extractStaticFutureApplicability(ability),
          ability,
        ),
      });
    }
    // CR 7 defend/activation window: a rule-modification (action
    // "defend"/"activate") printed on an attacking card must govern the very
    // next defend/reaction/activation window of that attack ("The defending
    // hero can't defend this with…" — EVO061-063 / EVO059 / CRU103 /
    // EVO204-206, "Defense reactions can't be played to Widowmaker's chain
    // link" — AZL015, "you may activate abilities of bows you control an
    // additional time this turn and as though they were an instant" —
    // ELE041-043). The resolution-kind effect used to compile into a
    // continuous rule only when the layer resolved — after the window. Project
    // it here while the Action+Attack sits on the stack/combat chain (the
    // layer-resolution path suppresses these — zone-moves/play-equip.ts), with
    // expiry per the printed scope: this chain link / this combat chain →
    // combat-chain expiry (dies at the first chainLinkNumber change, i.e. the
    // window of this very attack), this turn → turn expiry (the grant
    // outlives the attack).
    // A combat-chain-zone object projects only while it IS the active attack
    // of an open link (CR 7.3.1): the close reducer drops its window
    // instance before the card leaves the combatChain zone, and re-proposing
    // in that gap would both flap generate/cease forever and resurrect the
    // rule onto the next chain — `chainLinkNumber` restarts at 1 for every
    // new chain, so the regenerated combatNumber would match the new chain's
    // first link. Stack-zone projection is unaffected: announcement through
    // payment precedes any active link, and liveness keeps that projection
    // alive via attackAnnouncedOnStack (runtime.ts).
    // Reject ineligible recipients before grantedWindowRuleAbilities scans
    // every possible source. Doing that scan for every deck/hand object makes
    // reconciliation quadratic in the card pool even with no window grants.
    const projectsOwnAttackWindow =
      object.zone.zone === "stack" ||
      (object.zone.zone === "combatChain" &&
        state.combat?.open === true &&
        state.combat.activeLink?.activeAttack.kind === "card" &&
        state.combat.activeLink.activeAttack.sourceObjectId === object.ref.instanceId);
    if (
      !(
        projectsOwnAttackWindow &&
        object.current.typeBox.types.includes("Action") &&
        object.current.typeBox.subtypes.includes("Attack")
      )
    )
      continue;
    for (const ability of [
      ...view.functionalAbilities(object.ref),
      ...grantedWindowRuleAbilities(view, object),
    ]) {
      if (ability.kind !== "resolution") continue;
      const windowRule = effectTreeWindowRuleModification(ability.effect);
      if (!windowRule) continue;
      const effectId = `resolution-window:${object.ref.instanceId}#${object.ref.incarnation}:${ability.id}`;
      const compiled = compileFabContinuousEffect({
        effectId,
        effect: ability.effect,
        condition: ability.condition,
      });
      if (!compiled.ok) continue;
      const controllerId = object.controllerId ?? object.ownerId;
      // The printed condition must already hold when the attack enters its
      // defend/activation window (CR 7.3.1) — e.g. Snap Shot's grant is
      // fused-only ("If Snap Shot was fused, …"), so the unfused card must
      // not project the allow rule nor emit its CR 5.2.3 activation-limit
      // companion events.
      if (!resolutionWindowConditionHolds(view, compiled.atoms, object, controllerId)) continue;
      desired.set(effectId, {
        controllerId,
        source: snapshotObject(state, object.ref.instanceId, controllerId, object.zone.zone),
        abilityId: ability.id,
        atoms: compiled.atoms,
        introducedAtStage: null,
        originKind: "resolution-window",
        expiresAt: resolutionWindowExpiry(state, windowRule),
        duration: windowRule.duration ?? undefined,
        futureApplicability: null,
        // Chain-link / combat-chain scopes ride this very attack's window: the
        // printed "this can't be defended by…" governs only this attack's
        // Defend/Reaction Steps (CR 7.3.1/7.4.2), so liveness follows
        // activeLink.activeAttack and dies at link resolution — never leaking
        // onto a later link or a new chain. Defend rules ALWAYS latch the
        // attack subject, even with "this turn" duration: their printed text
        // ("it can't be defended by…", Crane Dance CRU057-059 combo) binds
        // this attack, not the whole turn. Only activation grants (ELE041-043
        // Snap Shot) intentionally keep empty subjects: the grant outlives
        // the attack card per its printed duration.
        ...(windowRule.duration !== "this-turn" || windowRule.action === "defend"
          ? {
              initialSubjects: [
                {
                  instanceId: object.ref.instanceId,
                  incarnation: object.ref.incarnation,
                  attack: { kind: "card" },
                },
              ] satisfies readonly import("./ir.ts").FabContinuousInitialSubject[],
            }
          : {}),
      });
    }
  }

  const events: ProposedEvent[] = [];
  for (const [effectId, entry] of desired) {
    if (state.continuousEffectInstances.some((instance) => instance.effectId === effectId))
      continue;
    events.push({
      name: "continuous-effect-generated",
      processId,
      cause: {
        kind: "rule",
        rule: "functional-static-ability",
        controllerId: entry.controllerId,
      },
      controllerId: entry.controllerId,
      source: entry.source,
      affected: [entry.source],
      bindings: {},
      data: {
        effectId,
        controllerId: entry.controllerId,
        source: entry.source,
        origin:
          entry.originKind === "resolution-window"
            ? { kind: "resolution-window", abilityId: entry.abilityId }
            : {
                kind: "static",
                abilityId: entry.abilityId,
                introducedAtStage: entry.introducedAtStage,
              },
        effectPath: ["ability", entry.abilityId],
        simultaneousGroupId: `static:${processId}:checkpoint-${state.counters.checkpoint}`,
        atoms: entry.atoms,
        duration: entry.duration ?? "while-functional",
        expiresAt: entry.expiresAt ?? { kind: "permanent" },
        initialSubjects: [...(entry.initialSubjects ?? [])],
        futureApplicability: entry.futureApplicability ?? null,
      },
    });
    // Snap Shot (ELE041-043) CR 5.2.3 companion grant: the allow/activate
    // window rule raises no limit on its own, so pair it (once, at
    // materialization) with an activation-limit modifier for each matching
    // weapon the controller holds.
    if (entry.originKind === "resolution-window") {
      events.push(
        ...resolutionWindowActivationLimitEvents(state, processId, view, effectId, entry),
      );
    }
  }
  for (const instance of state.continuousEffectInstances) {
    if (instance.origin !== "static" || desired.has(instance.effectId)) continue;
    events.push({
      ...eventBase(instance, processId, []),
      name: "continuous-effect-ceased",
      data: { effectId: instance.effectId },
    });
  }
  return events;
}

/** Expiry for a CR 7 window projection, from the printed scope: "this turn"
 * (ELE041-043 Snap Shot) lives to end of turn — the grant outlives the attack
 * card; chain-link / combat-chain scopes ride this very attack's link window
 * (the first chainLinkNumber change kills them). */
function resolutionWindowExpiry(
  state: FabRulesSnapshot,
  rule: Extract<FabEffect, { readonly type: "rule-modification" }>,
): import("./ir.ts").FabContinuousExpiry {
  if (rule.duration === "this-turn") {
    return { kind: "turn", turnNumber: state.turnNumber };
  }
  const current = state.combat?.chainLinkNumber ?? 0;
  return {
    kind: "combat-chain",
    combatNumber:
      state.combat?.open === true && state.combat.activeLink != null ? current : current + 1,
  };
}

/** Whether the compiled window-rule atom's printed condition already holds
 * at projection time (the ability-level condition compiled onto the atom —
 * e.g. ELE041-043 "If Snap Shot was fused"). Atoms compiled without a
 * condition always hold. */
function resolutionWindowConditionHolds(
  view: FabRulesView,
  atoms: readonly FabContinuousAtom[],
  source: FabEvaluatedObject,
  controllerId: string,
): boolean {
  for (const atom of atoms) {
    if (atom.kind !== "rule" || atom.parameters.kind !== "rule-modification") continue;
    if (atom.action !== "defend" && atom.action !== "activate") continue;
    if (!atom.condition) return true;
    return view.evaluateCondition(atom.condition, {
      controllerId,
      source: source.ref,
      subject: source.ref,
      bindings: { objects: {}, numbers: {}, strings: {} },
    });
  }
  return true;
}

/** Snap Shot (ELE041-043): "you may activate abilities of bows you control an
 * additional time this turn and as though they were an instant" — CR 5.2.3
 * activation-limit companion to the allow/activate window rule. The generic
 * modify-activation-limit proposal only collects ATTACK abilities, so weapon
 * "action" activations (Death Dealer ARC040-a1) must be granted by emitting
 * the modifier here — once per grant, at window materialization, for each
 * matching weapon the controller currently holds. The as-instant half is the
 * timing + action-point waiver in activate-ability quote/begin (CR 8.1.1d). */
function resolutionWindowActivationLimitEvents(
  state: FabRulesSnapshot,
  processId: FabProcessId,
  view: FabRulesView,
  effectId: string,
  entry: DesiredSourceEffect,
): ProposedEvent[] {
  const events: ProposedEvent[] = [];
  for (const atom of entry.atoms) {
    if (atom.kind !== "rule" || atom.parameters.kind !== "rule-modification") continue;
    if (atom.action !== "activate" || atom.mode !== "allow") continue;
    if (!atom.filter || atom.filter.hasStatus !== "activate-additional-as-instant") continue;
    const { hasStatus: _status, ...subjectFilter } = atom.filter;
    const zones = state.containers.zonesByPlayerId[entry.controllerId];
    if (!zones) return events;
    for (const zone of ["weapon1", "weapon2"] as const) {
      for (const instanceId of zones[zone]) {
        const record = state.objects[instanceId];
        if (!record) continue;
        const weapon = view.object({
          instanceId: record.instanceId,
          incarnation: record.incarnation,
        });
        if (!weapon) continue;
        if (
          !view.matchesFilter(weapon, subjectFilter, {
            controllerId: entry.controllerId,
            source: weapon.ref,
            bindings: { objects: {}, numbers: {}, strings: {} },
          })
        )
          continue;
        const abilityIds = view
          .functionalAbilities(weapon.ref)
          .filter((candidate): candidate is FabActivatedAbility => candidate.kind === "activated")
          .map((candidate) => candidate.id);
        if (abilityIds.length === 0) continue;
        const modifierId = `${effectId}:activation-limit:${instanceId}`;
        if (state.activationLimitModifiers.some((modifier) => modifier.modifierId === modifierId))
          continue;
        const weaponSnapshot = snapshotObject(state, instanceId, entry.controllerId, zone);
        events.push({
          name: "activation-limit-modifier-generated",
          processId,
          cause: {
            kind: "rule",
            rule: "resolution-window-activation-grant",
            controllerId: entry.controllerId,
          },
          controllerId: entry.controllerId,
          source: entry.source,
          affected: [weaponSnapshot],
          bindings: {},
          data: {
            object: weaponSnapshot,
            modifierId,
            attackAbilityIds: abilityIds,
            operation: "additional",
            count: 1,
            turnNumber: state.turnNumber,
          },
        });
      }
    }
  }
  return events;
}

function keywordIntroductionStage(
  state: FabRulesSnapshot,
  view: FabRulesView,
  object: FabEvaluatedObject,
  keywordName: string,
): import("./ir.ts").FabRulesStage | null {
  if (object.base.keywords.some((keyword) => keyword.name === keywordName)) return null;
  return stagedPropertyIntroduction(
    state,
    view,
    object,
    `keyword:${keywordName}`,
    `granted keyword ${keywordName}`,
  );
}

function abilityIntroductionStage(
  state: FabRulesSnapshot,
  view: FabRulesView,
  object: FabEvaluatedObject,
  abilityId: string,
): import("./ir.ts").FabRulesStage | null {
  if (object.base.abilities.some((ability) => ability.id === abilityId)) return null;
  return stagedPropertyIntroduction(
    state,
    view,
    object,
    `ability:${abilityId}`,
    `granted static ability ${abilityId}`,
    "abilities",
  );
}

function stagedPropertyIntroduction(
  state: FabRulesSnapshot,
  view: FabRulesView,
  object: FabEvaluatedObject,
  property: string,
  description: string,
  aggregateProperty?: string,
): import("./ir.ts").FabRulesStage {
  const contributions = view.explain(object.ref)?.contributions ?? [];
  const atoms = new Map(
    activeContinuousAtoms(state).map((entry) => [entry.atom.atomId, entry.atom] as const),
  );
  let introducedAt: import("./ir.ts").FabRulesStage | null = null;
  for (const contribution of contributions) {
    if (
      contribution.atomId === null ||
      (contribution.property !== property && contribution.property !== aggregateProperty) ||
      (contribution.operation !== "grant" && contribution.operation !== "copy")
    )
      continue;
    const stage = atoms.get(contribution.atomId)?.applicationStage;
    if (stage === undefined || stage === "rule") continue;
    if (introducedAt === null || stage < introducedAt) introducedAt = stage;
  }
  if (introducedAt === null) {
    throw new Error(`${description} has no staged provenance`);
  }
  return introducedAt;
}

/**
 * Widowmaker-style window rules granted onto an attacking card by another
 * source (Dreadbore: arrows you control have "DR can't be played from hand
 * this chain link"). Stage-6 ability grants land after this desired-build
 * reads `functionalAbilities`, so also project resolution window-rule
 * abilities that a live grant-property static currently targets onto `object`.
 */
function grantedWindowRuleAbilities(
  view: FabRulesView,
  object: FabEvaluatedObject,
): readonly FleshAndBloodAbility[] {
  const granted: FleshAndBloodAbility[] = [];
  for (const source of view.objects()) {
    if (source.ref.instanceId === object.ref.instanceId) continue;
    for (const ability of view.functionalAbilities(source.ref)) {
      if (ability.kind !== "static") continue;
      if (!staticAbilityIsFunctional(ability, source)) continue;
      const effect = ability.effect;
      if (
        !effect ||
        effect.type !== "grant-property" ||
        effect.property.kind !== "ability" ||
        effect.property.ability.kind !== "resolution"
      ) {
        continue;
      }
      if (!effectTreeWindowRuleModification(effect.property.ability.effect)) continue;
      const controllerId = source.controllerId ?? source.ownerId;
      if (!effect.target) continue;
      const candidates = view.targetCandidates(effect.target, {
        controllerId,
        source: source.ref,
        bindings: { objects: {}, numbers: {}, strings: {} },
      });
      if (
        !candidates.some(
          (candidate) =>
            candidate.ref.instanceId === object.ref.instanceId &&
            candidate.ref.incarnation === object.ref.incarnation,
        )
      ) {
        continue;
      }
      granted.push(effect.property.ability);
    }
  }
  return granted;
}

function compileStaticAbility(effectId: string, ability: FabStaticAbility) {
  if (ability.staticKind === "property") {
    return compileFabStaticPropertyAbility({ effectId, ability });
  }
  if (ability.staticKind === "play" && ability.playEffect?.role === "permission") {
    const playEffect = ability.playEffect;
    // Positioned deck/arsenal permissions resolve a single ordered subject
    // (Dash I/O top-of-deck). Unordered zone permissions (banished Evos) keep
    // star-count so every matching card is legal.
    const source: FabTarget = playEffect.filter
      ? {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: playEffect.fromZones ?? [],
          filter: playEffect.filter,
          ...(playEffect.position
            ? { position: playEffect.position, count: 1 as const }
            : { count: { type: "all" as const } }),
        }
      : { selector: "self" };
    const effect: FabEffect = {
      type: "play-card",
      source,
      fromZones: playEffect.fromZones,
      asType: playEffect.asType,
      ...(playEffect.costModification ? { costModification: playEffect.costModification } : {}),
    };
    return compileFabContinuousEffect({
      effectId,
      effect,
      condition: ability.condition,
    });
  }
  if ((ability.staticKind === "continuous" || ability.staticKind === "while") && ability.effect) {
    const semanticKind = effectSemanticKind(ability.effect);
    if (
      semanticKind !== "continuous-effect-producer" &&
      semanticKind !== "structural-interpreter-node"
    ) {
      return null;
    }
    return compileFabContinuousEffect({
      effectId,
      effect: ability.effect,
      condition: ability.condition,
    });
  }
  return null;
}

/** Property-static "while face-up in any zone" (Colors of Aria / Doubling Season). */
function staticDefinesIdentityAnywhere(ability: FabStaticAbility): boolean {
  return (
    (ability.staticKind === "while" || ability.staticKind === "continuous") &&
    ability.condition?.type === "has-status" &&
    ability.condition.status === "face-up-in-any-zone"
  );
}

/** Self-targeting while-static functions wherever the source is (CR 5.4.7). */
function staticWhileTargetsSelf(ability: FabStaticAbility): boolean {
  return ability.staticKind === "while" && effectTreeTargetsOnlySelf(ability.effect);
}

/** Play-time self cost modifiers function from playable zones (CR 5.4.4). */
function staticModifiesOwnCost(ability: FabStaticAbility): boolean {
  return (
    (ability.staticKind === "continuous" || ability.staticKind === "while") &&
    effectTreeModifiesOwnCost(ability.effect)
  );
}

function effectTreeTargetsOnlySelf(effect: FabEffect | undefined): boolean {
  if (!effect) return false;
  if (effect.type === "sequence") return effect.steps.every(effectTreeTargetsOnlySelf);
  if (effect.type === "conditional") {
    return (
      effectTreeTargetsOnlySelf(effect.then) &&
      (effect.else === undefined || effectTreeTargetsOnlySelf(effect.else))
    );
  }
  if (effect.type === "optional") return effectTreeTargetsOnlySelf(effect.effect);
  if (effect.type === "rule-modification") {
    const subject = effect.subject;
    return (
      typeof subject === "object" &&
      subject !== null &&
      "selector" in subject &&
      subject.selector === "self"
    );
  }
  if (!("target" in effect) || effect.target === undefined) return false;
  const target = effect.target;
  return (
    typeof target === "object" &&
    target !== null &&
    "selector" in target &&
    target.selector === "self"
  );
}

function effectTreeModifiesOwnCost(effect: FabEffect | undefined): boolean {
  if (!effect) return false;
  if (effect.type === "sequence") return effect.steps.some(effectTreeModifiesOwnCost);
  if (effect.type === "conditional") {
    return (
      effectTreeModifiesOwnCost(effect.then) ||
      (effect.else !== undefined && effectTreeModifiesOwnCost(effect.else))
    );
  }
  return (
    effect.type === "modify-numeric" &&
    effect.property === "cost" &&
    effect.target?.selector === "self"
  );
}

function staticAbilityIsFunctional(ability: FabStaticAbility, object: FabEvaluatedObject): boolean {
  if (ability.staticKind === "property") return true;
  if (staticDefinesIdentityAnywhere(ability)) return true;
  if (staticWhileTargetsSelf(ability)) return true;
  if (
    staticModifiesOwnCost(ability) &&
    ["hand", "arsenal", "stack", "banished", "combatChain"].includes(object.zone.zone)
  ) {
    return true;
  }

  // When the card model declares explicit functional zones, use them as the
  // single source of truth. This unifies the continuous reconciler with the
  // trigger-collection path (snapshots.ts isFunctionalInZone), so abilities
  // that declare functionalZones: ["arsenal"] work in both systems.
  if (ability.functionalZones && ability.functionalZones.length > 0) {
    const catalogZone = engineZoneToCatalog(object.zone.zone);
    return ability.functionalZones.includes(catalogZone);
  }

  const zone = object.zone.zone;
  if (zone === "under") {
    return (
      (ability.staticKind === "continuous" || ability.staticKind === "while") &&
      ability.condition?.type === "source-is-subcard-of-host"
    );
  }
  if (["arena", "head", "chest", "arms", "legs", "weapon1", "weapon2", "heroZone"].includes(zone)) {
    return true;
  }
  // Equipment defends from its equipment seat onto the combat chain. Continuous
  // defense/keyword grants (Arcanite Skullcap life-gated +1{d}/AB) must remain
  // functional while the piece is defending, or the printed bonus never applies
  // to combat damage.
  if (zone === "combatChain" && object.current.typeBox.types.includes("Equipment")) {
    return true;
  }
  // CR 1.7.4a / 7.0.5: a Defense Reaction's continuous self-static (fused +{d})
  // must stay functional while the card is defending, same as equipment.
  if (zone === "combatChain" && object.current.typeBox.types.includes("Defense Reaction")) {
    return true;
  }
  // Blocks defending on the chain keep while-defending statics (HVY Boast +X{d}).
  if (zone === "combatChain" && object.current.typeBox.types.includes("Block")) {
    return true;
  }
  // CR 7.2.2b: an ally attack uses a combat-chain proxy while the ally
  // remains an arena permanent. Its continuous statics therefore keep
  // functioning during its own attack (Restless Commander pumps itself).
  if (zone === "combatChain" && object.current.typeBox.subtypes.includes("Ally")) {
    return true;
  }
  // CR 5.4.4 self-referencing play permission: a card hosts its own
  // play-permission CE while it resides in a zone the permission targets
  // (e.g. banished). Narrowly gated to staticKind:"play" + role:"permission".
  // Timing/cost permissions without fromZones (as though an instant) apply
  // while the card is in hand — the default zone for playing the card.
  if (ability.staticKind === "play" && ability.playEffect?.role === "permission") {
    const fromZones = ability.playEffect.fromZones;
    if (fromZones?.some((fromZone) => fromZone === zone)) return true;
    if ((!fromZones || fromZones.length === 0) && zone === "hand") return true;
  }
  return (
    (zone === "stack" || zone === "combatChain") &&
    object.current.typeBox.types.includes("Action") &&
    object.current.typeBox.subtypes.includes("Attack")
  );
}

function eventBase(
  instance: FabContinuousEffectInstance,
  processId: FabProcessId,
  affectedObjects: readonly FabObjectSnapshot[],
) {
  return {
    processId,
    cause: {
      kind: "rule" as const,
      rule: "continuous-effect-reconciliation",
      controllerId: instance.controllerId,
    },
    controllerId: instance.controllerId,
    source: instance.source,
    affected: affectedObjects,
    bindings: {},
  };
}

function affected(
  state: FabRulesSnapshot,
  subject: FabRulesSubjectRef,
): readonly FabObjectSnapshot[] {
  if (subject.kind !== "object") return [];
  const evaluated = buildFabRulesView(state).object(subject.ref);
  if (!evaluated) return [];
  return [
    snapshotObject(
      state,
      subject.ref.instanceId,
      evaluated.controllerId ?? evaluated.ownerId,
      evaluated.zone.zone,
    ),
  ];
}

function sameApplicationKey(
  left: Pick<FabContinuousApplication, "effectId" | "atomId" | "subject">,
  right: Pick<FabContinuousApplication, "effectId" | "atomId" | "subject">,
): boolean {
  return (
    left.effectId === right.effectId &&
    left.atomId === right.atomId &&
    continuousSubjectKey(left.subject) === continuousSubjectKey(right.subject)
  );
}

export function continuousApplicationFingerprintKey(
  application: Pick<FabContinuousApplication, "effectId" | "atomId" | "subject" | "fingerprint">,
): string {
  return `${application.effectId}:${application.atomId}:${continuousSubjectKey(application.subject)}:${application.fingerprint}`;
}

function rulesTimestamp(sequence: number): FabRulesTimestamp {
  return { sequence, simultaneousGroupId: null };
}

/**
 * Future-applicability descriptor extracted from a static ability's
 * `appliesTo.next` — mirrors {@link continuousFutureApplicability} in
 * effect-event-proposals.ts but operates on the static-ability shape.
 * `null` = no appliesTo (effect applies directly);
 * `undefined` = appliesTo present but not canonical (unsupported).
 */
type StaticFutureApplicability =
  | {
      readonly filter: NonNullable<FabEffect["appliesTo"]>["next"];
      readonly events: readonly FabFutureApplicabilityEvent[] | null;
      readonly observesOpponent: boolean;
      readonly count: number;
      readonly ordinal: number;
      readonly resets: "turn" | null;
      readonly sourceInstanceIds: readonly string[] | null;
    }
  | null
  | undefined;

/**
 * Play-announce of an Attack-subtype card is the next attack for
 * `events:["attack"]` latches (Might / Agility), so on-stack resolution
 * (Flex Speed "if this has 6 or more {p}") sees the buff. Weapon activations
 * never announce and still latch on the combat `attack` event.
 */
function isAttackActivationEvent(event: {
  readonly kind: string;
  readonly event?: { readonly data?: unknown };
}): boolean {
  if (event.kind !== "activate") return false;
  const data = event.event?.data;
  if (!data || typeof data !== "object") return false;
  if ("attackTarget" in data && data.attackTarget) return true;
  if (!("ability" in data) || !data.ability || typeof data.ability !== "object") return false;
  return "abilityType" in data.ability && data.ability.abilityType === "attack";
}

/** Filters keyed on the declared attack target ("attacks a Light hero",
 * "targets Arakni", …). Their latch evaluation needs the declared target and
 * must not early-latch at the play announce. */
function latchFilterRequiresDeclaredHeroTarget(
  filter: NonNullable<import("@tcg/flesh-and-blood-types").FabEffect["appliesTo"]>["next"],
): boolean {
  if (!filter || typeof filter !== "object") return false;
  const f = filter as {
    readonly hasStatus?: string;
    readonly and?: readonly unknown[];
    readonly or?: readonly unknown[];
  };
  if (
    f.hasStatus === "attacks-a-light-hero" ||
    f.hasStatus === "attacking-shadow-hero" ||
    f.hasStatus === "attacking-a-royal-hero" ||
    f.hasStatus === "targets-arakni" ||
    f.hasStatus === "targets-a-guardian-hero" ||
    f.hasStatus === "targeting-you"
  )
    return true;
  if (f.and?.some((child) => latchFilterRequiresDeclaredHeroTarget(child as typeof filter)))
    return true;
  if (f.or?.some((child) => latchFilterRequiresDeclaredHeroTarget(child as typeof filter)))
    return true;
  return false;
}

function futureLatchObservesEvent(
  view: FabRulesView,
  future: NonNullable<import("./ir.ts").FabContinuousEffectInstance["futureApplicability"]>,
  event: {
    readonly kind: "announce-card" | "attack" | "activate" | "defend" | "play";
    readonly object: FabObjectRef;
    readonly event?: FabFutureSubjectEvent["event"];
  },
): boolean {
  const mapped = event.kind === "announce-card" ? "play" : event.kind;
  if (futureApplicabilityIncludesEvent(future.events, mapped)) return true;
  // Play-announce of an Attack-subtype card is the next attack for
  // `events:["attack"]` latches (Might / Agility), so on-stack resolution
  // (Flex Speed "if this has 6 or more {p}") sees the buff. Hero-target
  // markers are excluded: the announce precedes the attack-target
  // declaration, and early-latching there assumes the 1v1 opposing hero —
  // wrong whenever the attack is declared at an ally. They latch on the
  // combat `attack` event, which carries the declared target.
  if (
    event.kind === "announce-card" &&
    futureApplicabilityIncludesEvent(future.events, "attack") &&
    !latchFilterRequiresDeclaredHeroTarget(future.filter)
  ) {
    const object = view.object(event.object);
    if (object?.current.typeBox.subtypes.includes("Attack") === true) return true;
  }
  // Weapon attack activations never announce. Latch on the paid `activate`
  // (with an attack target / attack abilityType) so granted "when this
  // attacks" triggers are already on the sword before the combat `attack`
  // event is collected. Non-attack activations do not consume the latch.
  if (isAttackActivationEvent(event) && futureApplicabilityIncludesEvent(future.events, "attack")) {
    return true;
  }
  return false;
}

function bindStaticAttacksOfSource(
  sourceInstanceId: string,
  future: StaticFutureApplicability,
  ability: FabStaticAbility,
): StaticFutureApplicability {
  if (!future || !ability.effect?.appliesTo?.attacksOf) return future;
  return { ...future, sourceInstanceIds: [sourceInstanceId] };
}

function extractStaticFutureApplicability(ability: FabStaticAbility): StaticFutureApplicability {
  if (ability.staticKind !== "continuous" && ability.staticKind !== "while") return null;
  const effect = ability.effect;
  if (!effect || !effect.appliesTo) return null;
  const attacksOf = effect.appliesTo.attacksOf;
  const rawCount = effect.appliesTo.count ?? (attacksOf ? { type: "all" as const } : 1);
  const count =
    typeof rawCount === "number"
      ? rawCount
      : rawCount.type === "all" || rawCount.type === "any-number"
        ? Infinity
        : NaN;
  const ordinal = effect.appliesTo.ordinal ?? 1;
  const resets = effect.appliesTo.perTurn ? ("turn" as const) : null;
  const declaredEvents = effect.appliesTo.events
    ? [...new Set(effect.appliesTo.events)].sort()
    : null;
  if (
    effect.type === "modify-activation-cost" &&
    declaredEvents?.some((event) => event !== "activate")
  )
    return undefined;
  const defending =
    typeof effect.appliesTo.next === "object" &&
    effect.appliesTo.next !== null &&
    "defending" in effect.appliesTo.next &&
    effect.appliesTo.next.defending === true;
  const events =
    effect.type === "modify-activation-cost"
      ? (["activate"] as const)
      : (declaredEvents ??
        (attacksOf ? (["attack"] as const) : defending ? (["defend"] as const) : null));
  if (count !== Infinity && (!Number.isInteger(count) || count < 1)) return undefined;
  if (!Number.isInteger(ordinal) || ordinal < 1) return undefined;
  if (events?.length === 0) return undefined;
  const target = "target" in effect ? effect.target : null;
  const observesOpponent =
    typeof target === "object" &&
    target !== null &&
    "player" in target &&
    target.player === "opponent";
  return canonicalizeFutureApplicability({
    filter: effect.appliesTo.next,
    events,
    observesOpponent,
    count,
    ordinal,
    resets,
    sourceInstanceIds: null,
  });
}
