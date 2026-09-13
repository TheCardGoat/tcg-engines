import { basePropertiesOf } from "../cards.ts";
import type { FabCardFilter, FabTurnHistoryEvent } from "@tcg/flesh-and-blood-types";
import type { FabPlayerId, FabZoneKind, FabZoneRef } from "../state.ts";
import { evaluateFabRules } from "./rules-evaluator.ts";
import type { FabObjectRef } from "./continuous/ir.ts";
import type { FabObjectSnapshot } from "./events.ts";
import type { FabRulesBaseObject, FabRulesFacts, FabRulesView } from "./rules-view.ts";
import type { FabRulesSnapshot } from "../kernel/transaction-kernel.ts";
import { historyTokenKindFromCanonicalId, type HistoryTokenKind } from "../kernel/history-facts.ts";
import { activeContinuousAtoms } from "./continuous/runtime.ts";
import { quoteFabAttackTargets, quoteFabDefense, quoteFabPlay } from "./legality-quotes.ts";
import { quoteFabActivation } from "../procedures/activate-ability/index.ts";
import { countControlledTokens } from "./selectors.ts";
import { profileFabOperation } from "../performance-observer.ts";
import { getFabRuntimeDerived } from "../runtime-derived.ts";

import { fabAllDefenders, fabCombatDidHit } from "../game/combat.ts";
import type { FabEffect } from "@tcg/flesh-and-blood-types";

interface CachedFabRulesViews {
  readonly eventCounter: number;
  readonly checkpointCounter: number;
  readonly accepted?: FabRulesView;
  readonly desired?: FabRulesView;
}

/** Ephemeral evaluation-session cache. It is never serialized with match state. */
const rulesViewsByState = new WeakMap<object, CachedFabRulesViews>();

export function invalidateFabRulesViews(state: object): void {
  rulesViewsByState.delete(state);
}

/** Build the deterministic base view used while persisted atom reconciliation is introduced. */
export function buildFabRulesView(state: FabRulesSnapshot): FabRulesView {
  return buildStateRulesView(state, "accepted", []);
}

/**
 * Effective seat intellect for draw-to-i and UI: base `player.intellect` plus
 * continuous `modify-numeric intellect` atoms applied to the seated hero
 * (Librarian +1{i}, etc.). Prefer the evaluated hero property when present.
 */
export function effectivePlayerIntellect(state: FabRulesSnapshot, playerId: string): number {
  const player = state.players[playerId];
  if (!player) return 0;
  const heroId = state.containers.zonesByPlayerId[playerId]!.heroZone[0];
  if (!heroId) return player.intellect;
  const record = state.objects[heroId];
  if (!record) return player.intellect;
  const evaluated = buildFabRulesView(state).object({
    instanceId: heroId,
    incarnation: record.incarnation,
  });
  const heroIntel = evaluated?.current.numeric.intellect;
  return typeof heroIntel === "number" ? heroIntel : player.intellect;
}

/** Add immutable objects that no longer exist in the live snapshot for LKI evaluation. */
export function buildFabRulesViewWithLki(
  state: FabRulesSnapshot,
  lkiObjects: readonly FabObjectSnapshot[],
): FabRulesView {
  return buildStateRulesView(state, "accepted", lkiObjects);
}

/** Evaluate current continuous effects to their desired applications while
 * retaining event-bound objects that have genuinely ceased to exist. Trigger
 * conditions use this view because CR 1.8 continuous effects update before a
 * just-committed named event is checked for triggers. */
export function buildFabRulesDesiredViewWithLki(
  state: FabRulesSnapshot,
  lkiObjects: readonly FabObjectSnapshot[],
): FabRulesView {
  return buildStateRulesView(state, "desired", lkiObjects);
}

/**
 * Match an immutable event-boundary object through the canonical evaluator.
 *
 * `abilityControllerId` is the ability/event controller evaluating the filter
 * (not the candidate object's controller). Filters like `hasStatus: "another"`
 * and `attack-action-card-you-control` compare the candidate against this id.
 * When omitted, falls back to the snapshot's controller (legacy trigger-only
 * paths where the event object is already known to be controlled by the actor).
 */
export function matchesFabSnapshotFilter(
  state: FabRulesSnapshot,
  snapshot: FabObjectSnapshot,
  filter: FabCardFilter,
  eventBindings?: import("./events.ts").FabEventBindings,
  abilityControllerId?: string,
  sourceRef?: FabObjectRef,
): boolean {
  // Inject LKI for bound objects so same-as-banished / same-as-revealed filters
  // can read the prior card after it has left its original zone.
  const bindingLki = eventBindings
    ? Object.values(eventBindings).flatMap((value) =>
        (Array.isArray(value) ? value : [value]).filter(isFabObjectSnapshotBinding),
      )
    : [];
  const view = buildFabRulesViewWithLki(state, [snapshot, ...bindingLki]);
  const object = view.object(snapshot.ref);
  const resolvedFilter = resolveDynamicCardFilter(state, filter, eventBindings, view);
  const context = {
    controllerId:
      abilityControllerId ?? snapshot.controllerId ?? snapshot.zoneRef.playerId ?? snapshot.ownerId,
    source: sourceRef ?? snapshot.ref,
    bindings: resolveFabEventBindings(eventBindings),
  };
  return object !== null && view.matchesFilter(object, resolvedFilter, context);
}

/**
 * Rewrite dynamic color tokens that depend on earlier resolution bindings.
 * Binding-relative type-box predicates are evaluated directly by the rules
 * evaluator and never materialize sentinel vocabulary values.
 */
function resolveDynamicCardFilter(
  state: FabRulesSnapshot,
  filter: FabCardFilter,
  eventBindings: import("./events.ts").FabEventBindings | undefined,
  view: FabRulesView,
): FabCardFilter {
  let resolved: FabCardFilter = filter;
  const needsColor =
    filter.color?.some((c) => c === "same-as-banished" || c === "same-as-revealed") ?? false;
  if (!needsColor) return filter;

  const boundSnapshot = (keys: readonly string[]): FabObjectSnapshot | null => {
    if (!eventBindings) return null;
    for (const key of keys) {
      const value = eventBindings[key];
      const first = (Array.isArray(value) ? value : [value]).find(isFabObjectSnapshotBinding);
      if (first) return first;
    }
    return null;
  };

  if (needsColor) {
    const source = filter.color!.includes("same-as-banished")
      ? boundSnapshot(["banished", "banished-this-way", "it"])
      : boundSnapshot(["it", "revealed", "revealed-this-way"]);
    const color = source?.current.color;
    if (!color) {
      // No bound source — nothing can match a dynamic same-as color.
      return { ...resolved, color: [] };
    }
    resolved = {
      ...resolved,
      color: filter.color!.map((c) =>
        c === "same-as-banished" || c === "same-as-revealed" ? color : c,
      ) as FabCardFilter["color"],
    };
  }

  void state;
  void view;
  return resolved;
}

/** Project flat event bindings into the evaluator's typed binding bags. */
export function resolveFabEventBindings(
  eventBindings: import("./events.ts").FabEventBindings | undefined,
): import("./continuous/ir.ts").FabResolvedBindings {
  const objects: Record<string, readonly import("./continuous/ir.ts").FabObjectRef[]> = {};
  const numbers: Record<string, number> = {};
  const strings: Record<string, string> = {};
  if (!eventBindings) return { objects, numbers, strings };
  for (const [key, value] of Object.entries(eventBindings)) {
    if (typeof value === "number") {
      numbers[key] = value;
    } else if (typeof value === "string") {
      strings[key] = value;
    } else if (typeof value === "boolean") {
      strings[key] = value ? "true" : "false";
    } else if (
      typeof value === "object" &&
      value !== null &&
      "kind" in value &&
      value.kind === "exact-attack" &&
      "object" in value &&
      isFabObjectSnapshotBinding(value.object)
    ) {
      objects[key] = [value.object.ref];
    } else {
      const values = Array.isArray(value) ? value : [value];
      const refs = values.flatMap((entry) =>
        isFabObjectSnapshotBinding(entry) ? [entry.ref] : [],
      );
      if (refs.length === values.length && refs.length > 0) objects[key] = refs;
    }
  }
  return { objects, numbers, strings };
}

function isFabObjectSnapshotBinding(value: unknown): value is FabObjectSnapshot {
  return (
    typeof value === "object" &&
    value !== null &&
    "ref" in value &&
    "current" in value &&
    "instanceId" in value &&
    typeof value.instanceId === "string" &&
    typeof value.ref === "object" &&
    value.ref !== null &&
    "instanceId" in value.ref &&
    "incarnation" in value.ref &&
    typeof value.ref.instanceId === "string" &&
    typeof value.ref.incarnation === "number"
  );
}

/** Candidate view used only by the reconciler to propose application changes. */
export function buildFabDesiredRulesView(state: FabRulesSnapshot): FabRulesView {
  return buildStateRulesView(state, "desired", []);
}

function buildStateRulesView(
  state: FabRulesSnapshot,
  applicationMode: "accepted" | "desired",
  lkiObjects: readonly FabObjectSnapshot[],
): FabRulesView {
  if (lkiObjects.length === 0) {
    const cached = rulesViewsByState.get(state as object);
    if (
      cached?.eventCounter === state.counters.event &&
      cached.checkpointCounter === state.counters.checkpoint
    ) {
      const view = applicationMode === "accepted" ? cached.accepted : cached.desired;
      if (view) return view;
    }
  }
  const view = profileFabOperation(
    lkiObjects.length > 0 ? "rules-view:lki" : `rules-view:${applicationMode}`,
    () => buildStateRulesViewUnprofiled(state, applicationMode, lkiObjects),
  );
  if (lkiObjects.length === 0) {
    const cached = rulesViewsByState.get(state as object);
    const sameGeneration =
      cached?.eventCounter === state.counters.event &&
      cached.checkpointCounter === state.counters.checkpoint;
    rulesViewsByState.set(state as object, {
      eventCounter: state.counters.event,
      checkpointCounter: state.counters.checkpoint,
      ...(sameGeneration ? cached : {}),
      [applicationMode]: view,
    });
  }
  return view;
}

function buildStateRulesViewUnprofiled(
  state: FabRulesSnapshot,
  applicationMode: "accepted" | "desired",
  lkiObjects: readonly FabObjectSnapshot[],
): FabRulesView {
  const objects: FabRulesBaseObject[] = [];
  // A transformed Base remains a physical card under the visible Evo. It is
  // deliberately not an independently addressable game object while carried
  // there, so it must not contribute continuous/static effects or require a
  // top-level zone membership.
  const soulHostIds = new Set<string>([
    ...state.playerIds.map((playerId) => `soul:${playerId}`),
    ...state.playerIds.flatMap(
      (playerId) => state.containers.zonesByPlayerId[playerId]?.heroZone ?? [],
    ),
  ]);
  const hostedCardsByHostId = Object.fromEntries(
    Object.entries(state.containers.subcardsByHostId).filter(
      ([hostId]) => !soulHostIds.has(hostId),
    ),
  );
  const underInstanceIds = new Set(Object.values(hostedCardsByHostId).flat());
  // Cards physically under a seated hero (Singularity / transformed-evo-is-hero)
  // are carried like soul: not independently addressable and not in a top-level
  // zone. Skip them here so zone membership does not throw after the transform
  // removes them from equipment/weapon.
  const heroHostedInstanceIds = new Set(
    Object.entries(state.containers.subcardsByHostId)
      .filter(([hostId]) =>
        state.playerIds.some(
          (playerId) =>
            state.containers.zonesByPlayerId[playerId]?.heroZone.includes(hostId) === true,
        ),
      )
      .flatMap(([, ids]) => ids),
  );
  for (const record of Object.values(state.objects).sort((a, b) =>
    a.instanceId.localeCompare(b.instanceId),
  )) {
    // Soul cards are also hosted under the hero but remain in the soul zone.
    // Only skip transform-carried objects that no longer occupy a top-level zone.
    if (heroHostedInstanceIds.has(record.instanceId) && !findObjectZone(state, record.instanceId))
      continue;
    const definition = state.cardDefinitions[record.canonicalId];
    const base =
      record.baseSource.kind === "frozen-copy"
        ? record.baseSource.copyable
        : definition
          ? basePropertiesOf(definition, record.cardPropertyState, record.activeFace)
          : null;
    if (!base)
      throw new Error(`FAB object ${record.instanceId} has no authoritative base properties`);
    const zone = underInstanceIds.has(record.instanceId)
      ? ({ playerId: null, zone: "under" } as const)
      : findObjectZone(state, record.instanceId);
    if (!zone)
      throw new Error(`FAB object ${record.instanceId} is not present in exactly one zone`);
    objects.push({
      ref: { instanceId: record.instanceId, incarnation: record.incarnation },
      canonicalId: record.canonicalId,
      ownerId: record.ownerId,
      controllerId: baseController(zone),
      zone,
      zoneIndex:
        zone.playerId === null
          ? -1
          : state.containers.zonesByPlayerId[zone.playerId]![zone.zone].indexOf(record.instanceId),
      visibility: record.visibility,
      base,
      counters: record.counters,
      markers: record.markers,
      declarationFacts: record.declarationFacts,
      history: record.history,
      lifeGained: record.lifeGained,
      lifeLost: record.lifeLost,
      underInstanceIds: hostedCardsByHostId[record.instanceId]?.length
        ? hostedCardsByHostId[record.instanceId]
        : undefined,
    });
  }
  const liveRefs = new Set(objects.map((object) => refKey(object.ref)));
  const liveInstanceZones = new Map(
    objects.map((object) => [object.ref.instanceId, object.zone.zone] as const),
  );
  const liveInstanceIncarnations = new Map(
    objects.map((object) => [object.ref.instanceId, object.ref.incarnation] as const),
  );
  const addedLkiRefs = new Set<string>();
  for (const snapshot of lkiObjects) {
    const key = refKey(snapshot.ref);
    if (liveRefs.has(key) || addedLkiRefs.has(key)) continue;
    const liveZone = liveInstanceZones.get(snapshot.ref.instanceId);
    const liveIncarnation = liveInstanceIncarnations.get(snapshot.ref.instanceId);
    // Same incarnation must not occupy two zones as a phantom LKI occupant.
    // A prior incarnation (banish/GY reset) is real this-way LKI and must stay
    // visible so "banished this way" conditions can still read type/subtype.
    if (
      liveZone !== undefined &&
      liveZone !== snapshot.zoneRef.zone &&
      liveIncarnation === snapshot.ref.incarnation
    )
      continue;
    addedLkiRefs.add(key);
    const priorIncarnationElsewhere =
      liveZone !== undefined &&
      liveZone !== snapshot.zoneRef.zone &&
      liveIncarnation !== snapshot.ref.incarnation;
    objects.push({
      ref: snapshot.ref,
      canonicalId: snapshot.canonicalId ?? snapshot.instanceId,
      ownerId: snapshot.ownerId,
      controllerId: snapshot.controllerId,
      // Prior-incarnation LKI is identity-only: do not occupy the old zone for
      // zone-count / scans (Vengeful Apparition leave-arena "no auras" check).
      zone: priorIncarnationElsewhere
        ? ({ playerId: null, zone: "under" } as const)
        : snapshot.zoneRef,
      zoneIndex: -1,
      visibility: snapshot.visibility,
      base: snapshot.base,
      copyable: snapshot.copyable,
      baseNumeric: snapshot.baseNumeric,
      current: snapshot.current,
      counters: snapshot.counterRecords,
      markers: snapshot.markers,
      history: snapshot.history,
      declarationFacts: snapshot.declarationFacts,
    });
  }
  const atoms = activeContinuousAtoms(state).map((entry) => ({
    ...entry,
    acceptedApplications: entry.acceptedApplications.filter(
      (application) =>
        application.subject.kind !== "object" || !addedLkiRefs.has(refKey(application.subject.ref)),
    ),
  }));
  let view: FabRulesView;
  view = evaluateFabRules({
    objects,
    atoms,
    facts: rulesFacts(state, objects),
    applicationMode,
    legality: {
      quotePlay: (request) => quoteFabPlay(state, request, view),
      quoteActivation: (request) => quoteFabActivation(state, request, view),
      quoteDefense: (request) => quoteFabDefense(state, request, view),
      quoteAttackTargets: (request) => quoteFabAttackTargets(state, request, view),
    },
  });
  return view;
}

function playerCurrentlyControlsToken(
  state: FabRulesSnapshot,
  playerId: string,
  kind: HistoryTokenKind,
): boolean {
  return (state.containers.zonesByPlayerId[playerId]?.arena ?? []).some((instanceId) => {
    const record = state.objects[instanceId];
    return record ? historyTokenKindFromCanonicalId(record.canonicalId) === kind : false;
  });
}

function refKey(ref: FabObjectRef): string {
  return `${ref.instanceId}#${ref.incarnation}`;
}

/**
 * Damage pending against each hero seat: the open chain link's attack damage
 * minus declared defense for hero-declared targets, plus static amounts of
 * unresolved deal-damage effects on the rules stack (arcane/generic pings —
 * Amulet of Intervention's "lethal damage on the stack"). Dynamic stack
 * amounts are excluded: a non-numeric pending amount must fail closed
 * (activation stays rejected), never wrong-accept.
 */
function pendingHeroDamage(
  state: FabRulesSnapshot,
  link: Exclude<FabRulesSnapshot["combat"], null>["activeLink"] | undefined,
  attackRecord: { readonly incarnation: number } | undefined,
  viewObjects: readonly FabRulesBaseObject[],
): Readonly<Record<string, number>> {
  const pending: Record<string, number> = {};
  const add = (playerId: string, amount: number) => {
    if (amount > 0) pending[playerId] = (pending[playerId] ?? 0) + amount;
  };
  const numericOf = (instanceId: string, property: "power" | "defense") =>
    viewObjects.find((object) => object.ref.instanceId === instanceId)?.base.numeric[property] ?? 0;
  if (link && attackRecord) {
    // Open link: pending attack damage minus declared defense, hero targets
    // only (an attack aimed at an ally threatens no hero). Base numerics —
    // the facts build precedes continuous evaluation.
    if (link.attackTargetRef.kind === "hero") {
      const defense = fabAllDefenders(link).reduce(
        (total, instanceId) => total + numericOf(instanceId, "defense"),
        0,
      );
      add(
        link.attackTargetRef.playerId,
        Math.max(0, numericOf(link.activeAttack.sourceObjectId, "power") - defense),
      );
    }
  }
  // Unresolved stack layers: static hero-targeted deal-damage amounts
  // (arcane/generic pings, Amulet of Intervention's "lethal damage on the
  // stack"). Dynamic amounts stay excluded — fail closed, never wrong-accept.
  for (const layer of state.rulesStack) {
    const effects: readonly FabEffect[] =
      layer.kind === "card"
        ? layer.resolutionPlan.steps.flatMap((step) => step.effects)
        : layer.kind === "activated" && layer.effect
          ? [layer.effect]
          : [];
    for (const effect of effects) {
      if (effect.type !== "deal-damage") continue;
      if (typeof effect.amount !== "number") continue;
      const target = effect.target;
      if (!target || (target.selector !== "controller" && target.selector !== "opponent")) {
        continue;
      }
      const seats =
        target.selector === "controller"
          ? [layer.controllerId]
          : state.playerIds.filter((playerId) => playerId !== layer.controllerId);
      for (const seat of seats) add(seat, effect.amount);
    }
  }
  return pending;
}

function rulesFacts(
  state: FabRulesSnapshot,
  viewObjects: readonly FabRulesBaseObject[],
): FabRulesFacts {
  const heroRefs: Record<string, FabObjectRef> = {};
  for (const playerId of state.playerIds) {
    const heroId = state.containers.zonesByPlayerId[playerId]?.heroZone[0];
    const hero = heroId ? state.objects[heroId] : undefined;
    if (hero) heroRefs[playerId] = { instanceId: hero.instanceId, incarnation: hero.incarnation };
  }
  const link = state.combat?.activeLink;
  const attackRecord = link ? state.objects[link.activeAttack.sourceObjectId] : undefined;
  const previousAttackId = state.combat?.closedLinks?.at(-1)?.activeAttack.sourceObjectId;
  const previousAttackRecord = previousAttackId ? state.objects[previousAttackId] : undefined;
  const attackTargetRecord =
    link?.attackTargetRef.kind === "object"
      ? state.objects[link.attackTargetRef.ref.instanceId]
      : undefined;
  const pendingDamageByPlayerId = pendingHeroDamage(state, link, attackRecord, viewObjects);
  return {
    moveLkiById: state.lkiArena,
    playerIds: state.playerIds,
    activePlayerId: state.activePlayerId,
    phase: state.phase ?? null,
    turnNumber: state.turnNumber,
    playerPlayedInstantThisChainLink: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.chainLink.playedInstant ?? false,
      ]),
    ),
    playerLife: Object.fromEntries(
      state.playerIds.map((playerId) => [playerId, state.players[playerId]?.life ?? 0]),
    ),
    pendingDamageByPlayerId,
    playerMarked: Object.fromEntries(
      state.playerIds.map((playerId) => [playerId, state.players[playerId]?.marked ?? false]),
    ),
    frozenObjectRefs: activeContinuousAtoms(state).flatMap(({ atom, latchedSubjects }) =>
      atom.kind === "rule" && atom.mode === "restrict" && atom.parameters.kind === "freeze"
        ? (latchedSubjects ?? [])
        : [],
    ),
    playerCardsDrawn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.cardsDrawn ?? 0,
      ]),
    ),
    playerPerformedThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        {
          transcend: state.players[playerId]?.history.turn.transcended ?? false,
          "create-fealty-token":
            state.players[playerId]?.history.turn.createdFealtyTokenThisTurn ?? false,
          "play-draconic-card":
            state.players[playerId]?.history.turn.playedDraconicCardThisTurn ?? false,
          "create-card": state.players[playerId]?.history.turn.createdCardThisTurn ?? false,
          "activate-cannon": state.players[playerId]?.history.turn.activatedCannonThisTurn ?? false,
          "activate-weapon": state.players[playerId]?.history.turn.activatedWeaponThisTurn ?? false,
          "phantasm-destroy-illusionist-attack-action":
            state.players[playerId]?.history.turn
              .phantasmDestroyedIllusionistAttackActionThisTurn ?? false,
          "play-or-activate":
            state.players[playerId]?.history.turn.playedOrActivatedThisTurn ?? false,
          "destroy-item": state.players[playerId]?.history.turn.destroyedItem ?? false,
          charge: state.players[playerId]?.history.turn.charged ?? false,
          boost: state.players[playerId]?.history.turn.boosted ?? false,
          crank: state.players[playerId]?.history.turn.cranked ?? false,
          cheered: state.players[playerId]?.history.turn.crowdCheered ?? false,
          booed: state.players[playerId]?.history.turn.crowdBooed ?? false,
          "intimidate-an-opponent":
            (state.players[playerId]?.history.turn.intimidatesThisTurn ?? 0) > 0,
          "beat-chest": state.players[playerId]?.history.turn.beatenChest ?? false,
          "play-or-create-aura": state.players[playerId]?.history.turn.playedOrCreatedAura ?? false,
          "put-card-into-soul":
            state.players[playerId]?.history.turn.cardPutIntoSoulThisTurn ?? false,
          "deal-damage": state.players[playerId]?.history.turn.dealtDamage ?? false,
          "be-dealt-damage": state.players[playerId]?.history.turn.beenDealtDamage ?? false,
          "banish-from-boost":
            state.players[playerId]?.history.turn.banishedFromBoostingThisTurn ?? false,
          "evo-banish-from-boost":
            state.players[playerId]?.history.turn.evoBanishedFromBoostingThisTurn ?? false,
          "control-toughness":
            (state.players[playerId]?.history.turn.controlledToughnessThisTurn ?? false) ||
            playerCurrentlyControlsToken(state, playerId, "toughness"),
          "control-seismic-surge":
            countControlledTokens(state, playerId, "token:seismic-surge") > 0 ||
            (state.players[playerId]?.history.turn.controlledSeismicSurge ?? false),
          "put-blue-card-into-graveyard":
            state.players[playerId]?.history.turn.bluePutIntoGraveyard ?? false,
          draw: (state.players[playerId]?.history.turn.cardsDrawn ?? 0) > 0,
          "play-non-attack-action":
            (state.players[playerId]?.history.turn.nonAttackActionsPlayed ?? 0) >= 1,
          "play-another-blue-card":
            (state.players[playerId]?.history.turn.blueCardsPlayed ?? 0) >= 2,
          "play-another-red-card": (state.players[playerId]?.history.turn.redCardsPlayed ?? 0) >= 2,
          "attack-with-weapon": (state.players[playerId]?.history.turn.weaponAttacks ?? 0) >= 1,
          "deal-arcane-damage":
            (state.players[playerId]?.history.turn.damageDealtByType?.arcane ?? 0) > 0,
          hit: (state.players[playerId]?.history.turn.hitOutcomes.length ?? 0) > 0,
          fuse: (state.players[playerId]?.history.turn.fusedSupertypesThisTurn ?? []).length > 0,
          "fuse-ice": (
            state.players[playerId]?.history.turn.fusedSupertypesThisTurn ?? []
          ).includes("Ice"),
          "fuse-lightning": (
            state.players[playerId]?.history.turn.fusedSupertypesThisTurn ?? []
          ).includes("Lightning"),
          "fuse-earth": (
            state.players[playerId]?.history.turn.fusedSupertypesThisTurn ?? []
          ).includes("Earth"),
          "roll-4-or-higher": (state.players[playerId]?.history.turn.highestDieRoll ?? 0) >= 4,
          "roll-5-or-higher": (state.players[playerId]?.history.turn.highestDieRoll ?? 0) >= 5,
          "roll-6": (state.players[playerId]?.history.turn.highestDieRoll ?? 0) >= 6,
          "pitch-power-6": state.players[playerId]?.history.turn.pitchedPower6 ?? false,
          "discard-power-6": state.players[playerId]?.history.turn.discardedPower6 ?? false,
          "banish-power-6": state.players[playerId]?.history.turn.banishedPower6 ?? false,
          "discard-power-6-for-cost":
            state.players[playerId]?.history.turn.discardedPower6AsAdditionalCost ?? false,
          "complete-contract": state.players[playerId]?.history.turn.completedAContract ?? false,
          usurp: state.players[playerId]?.history.turn.usurped ?? false,
          "create-crouching-tiger":
            state.players[playerId]?.history.turn.createdCrouchingTigerThisTurn ?? false,
          "attack-with-crouching-tiger":
            state.players[playerId]?.history.turn.attackedWithCrouchingTiger ?? false,
          "create-seismic-surge":
            state.players[playerId]?.history.turn.createdSeismicSurge ?? false,
          "create-or-activate-gate-to-iarathael":
            state.players[playerId]?.history.turn.createdOrActivatedGateToIArathael ?? false,
          "destroy-lightning-flow":
            state.players[playerId]?.history.turn.semanticObservations.some(
              (observation) =>
                observation.kind === "destroy" &&
                observation.canonicalId === "NzHWJJzD6JwJ88LmRTTGQ",
            ) ?? false,
          "destroy-aura": state.players[playerId]?.history.turn.destroyedAuraThisTurn ?? false,
          "create-or-steal-gold":
            state.players[playerId]?.history.turn.createdOrStolenGold ?? false,
          "banish-earth-card":
            state.players[playerId]?.history.turn.semanticObservations.some(
              (observation) =>
                observation.kind === "banish" && observation.supertypes.includes("Earth"),
            ) ?? false,
          "lose-life": state.players[playerId]?.history.turn.lostLife ?? false,
          "attack-or-defend-attack-action":
            state.players[playerId]?.history.turn.attackedOrDefendedWithAttackActionThisTurn ??
            false,
          "weapon-hit":
            state.players[playerId]?.history.turn.hitOutcomes.some(
              (outcome) => outcome.sourceWasWeapon,
            ) ?? false,
          "fragment-attack": state.players[playerId]?.history.turn.attackFragmented ?? false,
          "holo-aura-entered":
            state.players[playerId]?.history.turn.holoAuraEnteredThisTurn ?? false,
          "herald-into-soul":
            state.players[playerId]?.history.turn.heraldPutIntoSoulThisTurn ?? false,
          "yellow-into-soul":
            state.players[playerId]?.history.turn.yellowCardPutIntoSoulThisTurn ?? false,
          "physical-damage":
            (state.players[playerId]?.history.turn.damageDealtByType?.physical ?? 0) > 0 ||
            (state.players[playerId]?.history.turn.damageTakenByType?.physical ?? 0) > 0,
        } satisfies Record<FabTurnHistoryEvent, boolean>,
      ]),
    ),
    playerBlueCardsPlayed: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.blueCardsPlayed ?? 0,
      ]),
    ),
    playerRedCardsPlayed: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.redCardsPlayed ?? 0,
      ]),
    ),
    // Adversity limbs (Confront/Embrace/Overcome): which token names this
    // player destroyed this turn (Vigor / Might / Agility gates).
    playerDestroyedTokenNamesThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.destroyedTokenNames ?? [],
      ]),
    ),
    playerDestroyedAuraThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.destroyedAuraThisTurn ?? false,
      ]),
    ),
    playerWeaponHit: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.hitOutcomes.some(
          (outcome) => outcome.sourceWasWeapon,
        ) ?? false,
      ]),
    ),
    playerHit: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        (state.players[playerId]?.history.turn.hitOutcomes.length ?? 0) > 0,
      ]),
    ),
    sourceHitThisTurn: Object.fromEntries(
      state.playerIds.flatMap((playerId) =>
        (state.players[playerId]?.history.turn.hitOutcomes ?? []).map(
          (outcome) => [outcome.sourceObjectId, true] as const,
        ),
      ),
    ),
    playerAttackFragmented: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.attackFragmented ?? false,
      ]),
    ),
    playerHoloAuraEnteredThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.holoAuraEnteredThisTurn ?? false,
      ]),
    ),
    playerHeraldPutIntoSoulThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.heraldPutIntoSoulThisTurn ?? false,
      ]),
    ),
    playerCardPutIntoSoulThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.cardPutIntoSoulThisTurn ?? false,
      ]),
    ),
    playerYellowCardPutIntoSoulThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.yellowCardPutIntoSoulThisTurn ?? false,
      ]),
    ),
    playerWeaponAttacks: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.weaponAttacks ?? 0,
      ]),
    ),
    playerWeaponAttackInstanceIdsThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.weaponAttackInstanceIdsThisTurn ?? [],
      ]),
    ),
    playerWeaponAttackCountsByInstanceIdThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.weaponAttackCountsByInstanceIdThisTurn ?? {},
      ]),
    ),
    playerDealtDamageThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.dealtDamage ?? false,
      ]),
    ),
    playerSwordHitsThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.hitOutcomes.filter(
          (outcome) => outcome.sourceWasSword,
        ).length ?? 0,
      ]),
    ),
    playerWeaponHits: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.hitOutcomes.filter(
          (outcome) => outcome.sourceWasWeapon,
        ).length ?? 0,
      ]),
    ),
    playerLifeGainedThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.lifeGained ?? 0,
      ]),
    ),
    playerClashesWonThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.clashesWonThisTurn ?? 0,
      ]),
    ),
    playerDraconicChainLinks: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.combatChain.draconicChainLinks ?? 0,
      ]),
    ),
    playerPitchedPower6: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.pitchedPower6 ?? false,
      ]),
    ),
    // Volcanic Vice (PEN018): "If you've created a Seismic Surge this turn".
    // create-token records its controller as event.data.playerId and stores the
    // created token identity on event.data.object.
    playerCreatedSeismicSurgeThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.createdSeismicSurge ?? false,
      ]),
    ),
    // Tremorshield Sabatons (HNT247): "If you've controlled a Seismic Surge
    // token this turn, instead prevent the next 2." Broader than `created`:
    // a token seeded in arena at setup, equipped, played, or gained via
    // control-change also counts. Event shapes: create-token records the
    // token's controller on event.data.playerId; play/equip record the
    // acting player on event.data.actorId.
    playerControlledSeismicSurgeThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        countControlledTokens(state, playerId, "token:seismic-surge") > 0 ||
          (state.players[playerId]?.history.turn.controlledSeismicSurge ?? false),
      ]),
    ),
    // Gold Baited Hook / Loan Shark: a player has created or stolen Gold
    // when a Gold token is created for them or control moves to their arena.
    playerCreatedOrStolenGoldThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.createdOrStolenGold ?? false,
      ]),
    ),
    playerBanishedPower6: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.banishedPower6 ?? false,
      ]),
    ),
    playerCharged: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.charged ?? false,
      ]),
    ),
    playerBoosted: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.boosted ?? false,
      ]),
    ),
    playerBoostsThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.boostsThisTurn ?? 0,
      ]),
    ),
    playerBanishedFromBoostingThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.banishedFromBoostingThisTurn ?? false,
      ]),
    ),
    playerEvoBanishedFromBoostingThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.evoBanishedFromBoostingThisTurn ?? false,
      ]),
    ),
    playerIntimidatesThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.intimidatesThisTurn ?? 0,
      ]),
    ),
    playerIntimidatedAnOpponentThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        (state.players[playerId]?.history.turn.intimidatesThisTurn ?? 0) > 0,
      ]),
    ),
    playerAttackedOrDefendedWithAttackActionThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.attackedOrDefendedWithAttackActionThisTurn ?? false,
      ]),
    ),
    playerLastActionCardPlayedSupertypes: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.lastActionCardPlayedSupertypes ?? [],
      ]),
    ),
    playerActionCardPlaysThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.actionCardPlaysThisTurn ?? [],
      ]),
    ),
    playerControlledToughnessThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        (state.players[playerId]?.history.turn.controlledToughnessThisTurn ?? false) ||
          playerCurrentlyControlsToken(state, playerId, "toughness"),
      ]),
    ),
    playerControlledVigorThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        (state.players[playerId]?.history.turn.controlledVigorThisTurn ?? false) ||
          playerCurrentlyControlsToken(state, playerId, "vigor"),
      ]),
    ),
    playerCreatedCrouchingTigerThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.createdCrouchingTigerThisTurn ?? false,
      ]),
    ),
    playerControlledMightThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        (state.players[playerId]?.history.turn.controlledMightThisTurn ?? false) ||
          playerCurrentlyControlsToken(state, playerId, "might"),
      ]),
    ),
    playerDiscardedPower6AsAdditionalCost: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.discardedPower6AsAdditionalCost ?? false,
      ]),
    ),
    playerHighestPowerRevealedThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.highestPowerRevealedThisTurn ?? 0,
      ]),
    ),
    playerFusedSupertypesThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.fusedSupertypesThisTurn ?? [],
      ]),
    ),
    playerDiplomacyChoice: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.game.diplomacyChoice ?? null,
      ]),
    ),
    playerBoostsThisCombatChain: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.combatChain.boostsThisCombatChain ?? 0,
      ]),
    ),
    playerCardsBanishedFromSoulThisCombatChain: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.combatChain.cardsBanishedFromSoulThisCombatChain ?? 0,
      ]),
    ),
    playerDaggerHitsThisCombatChain: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.hitOutcomes.filter(
          (outcome) =>
            outcome.sourceWasDagger &&
            outcome.combatNumber !== null &&
            outcome.combatNumber === state.players[playerId]?.history.combatChain.combatNumber,
        ).length ?? 0,
      ]),
    ),
    playerCrowdCheered: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.crowdCheered ?? false,
      ]),
    ),
    playerCrowdBooed: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.crowdBooed ?? false,
      ]),
    ),
    playerBeatenChest: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.beatenChest ?? false,
      ]),
    ),
    playerCranked: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.cranked ?? false,
      ]),
    ),
    // DYN123 Pay Day gate: "If you've completed a contract this turn"
    // (CR 8.4.7 / 8.5.39a) — stamped by the complete-contract reducer onto the
    // per-player turn ledger, reset with the turn.
    playerCompletedAContractThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.completedAContract ?? false,
      ]),
    ),
    playerHighestDieRollThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.highestDieRoll ?? 0,
      ]),
    ),
    playerDestroyedLightningFlowThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.semanticObservations.some(
          (observation) =>
            observation.kind === "destroy" && observation.canonicalId === "NzHWJJzD6JwJ88LmRTTGQ",
        ) ?? false,
      ]),
    ),
    playerAttacksThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.attacksThisTurn ?? 0,
      ]),
    ),
    playerTimesAttackedThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.timesAttackedThisTurn ?? 0,
      ]),
    ),
    playerBanishedEarthCardThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.semanticObservations.some(
          (observation) =>
            observation.kind === "banish" && observation.supertypes.includes("Earth"),
        ) ?? false,
      ]),
    ),
    playerLostLifeThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.lostLife ?? false,
      ]),
    ),
    // viserai-usurper IAR106 a2: "if you've created or activated a Gate to
    // i'Arathael this turn". Create and activate record the fact via
    // historyTokenKindOf (token:gate-to-i-arathael or its catalog alias).
    playerCreatedOrActivatedGateToIArathaelThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.createdOrActivatedGateToIArathael ?? false,
      ]),
    ),
    // viserai-between-worlds / the-forsaken: count Runechants created this turn.
    playerRunechantsCreatedThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.runechantsCreated ?? 0,
      ]),
    ),
    // Gravy Bones: blue card put into this player's graveyard this turn.
    // Prefer event-derived facts over mutable turn flags so concurrent
    // 1v1-scope work on state.ts/initialize.ts stays untouched.
    playerBluePutIntoGraveyardThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.bluePutIntoGraveyard ?? false,
      ]),
    ),
    playerNonAttackActionPlayed: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.nonAttackActionsPlayed ?? 0,
      ]),
    ),
    playerAttackActionPlayed: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.attackActionsPlayed ?? 0,
      ]),
    ),
    playerPlayedCardNamesThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.playedCardNames ?? [],
      ]),
    ),
    playerDiscardedPower6: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.discardedPower6 ?? false,
      ]),
    ),
    playerPlayedFromBanishedThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.playedFromBanished ?? false,
      ]),
    ),
    playerWeaponInstancesGainedGoAgainThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => {
        return [playerId, state.players[playerId]?.history.turn.weaponInstancesGainedGoAgain ?? []];
      }),
    ),
    playerPlayedOrCreatedAuraThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.playedOrCreatedAura ?? false,
      ]),
    ),
    playerLastAttackNamesThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.lastAttackNames ?? [],
      ]),
    ),
    playerAttackedWithCrouchingTigerThisTurn: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.attackedWithCrouchingTiger ?? false,
      ]),
    ),
    playerLastAttackDidHit: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.combatChain.lastAttackDidHit ?? false,
      ]),
    ),
    lastClosedAttackDidHitByInstanceId: state.lastClosedCombat?.attackDidHitByInstanceId ?? {},
    lastClosedDefendedAttackPowersByInstanceId:
      state.lastClosedCombat?.defendedAttackPowersByInstanceId ?? {},
    playerCombatChainHits: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.hitOutcomes.filter(
          (outcome) =>
            outcome.combatNumber !== null &&
            outcome.combatNumber === state.players[playerId]?.history.combatChain.combatNumber,
        ).length ?? 0,
      ]),
    ),
    playerDamageDealt: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        {
          turn: state.players[playerId]?.history.turn.damageDealtByType ?? {
            arcane: 0,
            physical: 0,
            generic: 0,
          },
          chainLink: state.players[playerId]?.history.chainLink.damageDealtByType ?? {
            arcane: 0,
            physical: 0,
            generic: 0,
          },
        },
      ]),
    ),
    // Per-source realized damage, merged across players (instanceIds are unique).
    // "If this deals N damage" — Surge (CR 8.4.8).
    sourceDamageDealtThisTurn: state.playerIds.reduce<Record<string, number>>((acc, playerId) => {
      const map = state.players[playerId]?.history.turn.damageDealtBySource ?? {};
      for (const [id, amount] of Object.entries(map)) acc[id] = (acc[id] ?? 0) + amount;
      return acc;
    }, {}),
    sourceDamageDealtThisChainLink: state.playerIds.reduce<Record<string, number>>(
      (acc, playerId) => {
        const map = state.players[playerId]?.history.chainLink.damageDealtBySource ?? {};
        for (const [id, amount] of Object.entries(map)) acc[id] = (acc[id] ?? 0) + amount;
        return acc;
      },
      {},
    ),
    // Per-source hero-targeted share (Surge "...to a hero" CR 8.4.8).
    sourceDamageDealtToHeroThisTurn: state.playerIds.reduce<Record<string, number>>(
      (acc, playerId) => {
        const map = state.players[playerId]?.history.turn.damageDealtBySourceToHero ?? {};
        for (const [id, amount] of Object.entries(map)) acc[id] = (acc[id] ?? 0) + amount;
        return acc;
      },
      {},
    ),
    sourceDamageDealtToHeroThisChainLink: state.playerIds.reduce<Record<string, number>>(
      (acc, playerId) => {
        const map = state.players[playerId]?.history.chainLink.damageDealtBySourceToHero ?? {};
        for (const [id, amount] of Object.entries(map)) acc[id] = (acc[id] ?? 0) + amount;
        return acc;
      },
      {},
    ),
    playerDamageTakenBySource: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.damageTakenBySource ?? {},
      ]),
    ),
    playerBeenDealtDamage: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.beenDealtDamage ?? false,
      ]),
    ),
    playerDamageTaken: Object.fromEntries(
      state.playerIds.map((playerId) => [
        playerId,
        state.players[playerId]?.history.turn.damageTakenByType ?? {
          arcane: 0,
          physical: 0,
          generic: 0,
        },
      ]),
    ),
    heroRefs,
    combat: link
      ? {
          attack: attackRecord
            ? { instanceId: attackRecord.instanceId, incarnation: attackRecord.incarnation }
            : {
                instanceId: link.activeAttack.sourceObjectId,
                incarnation: 0,
              },
          attackSourceInstanceId: link.activeAttack.sourceObjectId,
          previousAttack: previousAttackRecord
            ? {
                instanceId: previousAttackRecord.instanceId,
                incarnation: previousAttackRecord.incarnation,
              }
            : null,
          attackingPlayerId: link.attackingPlayerId,
          defendingPlayerId: link.defendingPlayerId,
          heroTargetPlayerId:
            link.attackTargetRef.kind === "hero" ? link.attackTargetRef.playerId : null,
          attackTarget: attackTargetRecord
            ? {
                instanceId: attackTargetRecord.instanceId,
                incarnation: attackTargetRecord.incarnation,
              }
            : null,
          chainLinkNumber: state.combat?.chainLinkNumber ?? 1,
          closedLinkHits: (state.combat?.closedLinks ?? []).map((closedLink) =>
            fabCombatDidHit(closedLink),
          ),
          resolvedAttacks: (state.combat?.closedLinks ?? []).flatMap((closedLink) =>
            closedLink.resolvedAttackLki
              ? [
                  {
                    controllerId: closedLink.attackingPlayerId,
                    basePower: closedLink.resolvedAttackLki.basePower,
                    power: closedLink.resolvedAttackLki.power,
                  },
                ]
              : [],
          ),
          didHit: fabCombatDidHit(link),
          defending: fabAllDefenders(link).flatMap((instanceId) => {
            const record = state.objects[instanceId];
            return record
              ? [{ instanceId: record.instanceId, incarnation: record.incarnation }]
              : [];
          }),
          defendedFromHand: fabAllDefenders(link).some(
            (instanceId) => link.defendingOrigins[instanceId]?.kind === "hand",
          ),
          attackReactionPlayedOrActivated: link.attackReactionPlayedOrActivated ?? false,
          attackReactionCount: link.attackReactionCount ?? 0,
          playedCardOrActivatedAbilityThisReactionStep:
            link.attackingPlayerPlayedOrActivatedInReaction ?? false,
          wagers: link.wagers.map((wager) => ({ controllerId: wager.controllerId })),
        }
      : null,
    sourceBanishedColorsThisTurn: Object.fromEntries(
      state.playerIds.flatMap((playerId) =>
        Object.entries(state.players[playerId]?.history.turn.banishedColorsBySourceThisTurn ?? {}),
      ),
    ),
    lastClosedDefendingInstanceIds: state.lastClosedCombat
      ? fabAllDefenders(state.lastClosedCombat)
      : [],
    combatChainInstanceIds: state.playerIds.flatMap(
      (playerId) => state.containers.zonesByPlayerId[playerId]?.combatChain ?? [],
    ),
    // Only `leave-arena` (not enter-or-leave-arena companion) so token cease
    // does not double-count.
    leftArenaThisTurn: state.playerIds.flatMap(
      (playerId) => state.players[playerId]?.history.turn.leftArena ?? [],
    ),
  };
}

export function findObjectZone(
  state: {
    readonly playerIds: readonly FabPlayerId[];
    readonly containers: {
      readonly zonesByPlayerId: Readonly<
        Record<string, Readonly<Record<FabZoneKind, readonly string[]>>>
      >;
      readonly subcardsByHostId: Readonly<Record<string, readonly string[]>>;
    };
  },
  instanceId: string,
): FabZoneRef | null {
  return getFabRuntimeDerived(state).objectLocations.get(instanceId) ?? null;
}

function baseController(zone: FabZoneRef): string | null {
  return zoneControlsObject(zone.zone) ? zone.playerId : null;
}

function zoneControlsObject(zone: FabZoneKind): boolean {
  switch (zone) {
    case "arena":
    case "combatChain":
    case "stack":
    case "head":
    case "chest":
    case "arms":
    case "legs":
    case "weapon1":
    case "weapon2":
    case "heroZone":
      return true;
    case "deck":
    case "hand":
    case "graveyard":
    case "banished":
    case "arsenal":
    case "pitch":
    case "soul":
    case "inventory":
    case "under":
      return false;
  }
}
