import type { FabBaseObjectProperties } from "@tcg/flesh-and-blood-types";
import type {
  FabContinuousApplication,
  FabContinuousAtom,
  FabObjectRef,
  FabRulesStage,
  FabRulesSubjectRef,
} from "./continuous/ir.ts";
import { continuousSubjectKey } from "./continuous/subject-key.ts";
import type {
  FabActiveContinuousAtom,
  FabEvaluatedObject,
  FabEvaluatedObjectProperties,
  FabEvaluatedRule,
  FabRulesBaseObject,
  FabRulesExplanation,
  FabRulesFacts,
  FabRulesLegality,
  FabRulesView,
} from "./rules-view.ts";
import { applyAtom } from "./evaluation/apply-atom.ts";
import { contextFor, createApplication, refKey } from "./evaluation/atom-support.ts";
import { amountDependencyRefs, evaluateAmount } from "./evaluation/evaluate-amount.ts";
import { evaluateCondition } from "./evaluation/evaluate-condition.ts";
import {
  FabRulesEvaluationError,
  FabRulesOrderingRequiredError,
  type FabRulesOrderingRequirement,
} from "./evaluation/errors.ts";
import {
  cloneBase,
  createMutableObject,
  isDefined,
  type MutableObject,
} from "./evaluation/helpers.ts";
import { matchesFilter } from "./evaluation/matches-filter.ts";
import { resolveTarget } from "./evaluation/resolve-target.ts";

export { FabRulesEvaluationError, FabRulesOrderingRequiredError, type FabRulesOrderingRequirement };

export interface EvaluateFabRulesInput {
  readonly objects: readonly FabRulesBaseObject[];
  readonly atoms: readonly FabActiveContinuousAtom[];
  readonly facts?: FabRulesFacts;
  /** State views use only replacement-accepted applications; reconciliation computes desired ones. */
  readonly applicationMode?: "desired" | "accepted";
  readonly legality?: FabRulesLegality;
}

export const EMPTY_RULES_FACTS: FabRulesFacts = {
  playerDamageTakenBySource: {},
  playerCreatedCrouchingTigerThisTurn: {},
  playerSwordHitsThisTurn: {},
  playerDealtDamageThisTurn: {},
  playerIds: [],
  activePlayerId: null,
  phase: null,
  turnNumber: 0,
  playerLife: {},
  pendingDamageByPlayerId: {},
  playerMarked: {},
  frozenObjectRefs: [],
  playerCardsDrawn: {},
  playerDestroyedLightningFlowThisTurn: {},
  playerAttacksThisTurn: {},
  playerTimesAttackedThisTurn: {},
  playerBanishedEarthCardThisTurn: {},
  playerPerformedThisTurn: {},
  playerBlueCardsPlayed: {},
  playerRedCardsPlayed: {},
  playerDestroyedTokenNamesThisTurn: {},
  playerDestroyedAuraThisTurn: {},
  playerWeaponHit: {},
  playerHit: {},
  sourceHitThisTurn: {},
  playerAttackFragmented: {},
  playerHoloAuraEnteredThisTurn: {},
  playerHeraldPutIntoSoulThisTurn: {},
  playerCardPutIntoSoulThisTurn: {},
  playerYellowCardPutIntoSoulThisTurn: {},
  playerWeaponAttacks: {},
  playerWeaponAttackInstanceIdsThisTurn: {},
  playerWeaponAttackCountsByInstanceIdThisTurn: {},
  playerWeaponHits: {},
  playerLifeGainedThisTurn: {},
  playerClashesWonThisTurn: {},
  playerIntimidatesThisTurn: {},
  playerDraconicChainLinks: {},
  playerPitchedPower6: {},
  playerCreatedSeismicSurgeThisTurn: {},
  playerControlledSeismicSurgeThisTurn: {},
  playerCreatedOrStolenGoldThisTurn: {},
  playerBanishedPower6: {},
  playerCharged: {},
  playerPlayedFromBanishedThisTurn: {},
  playerWeaponInstancesGainedGoAgainThisTurn: {},
  playerPlayedOrCreatedAuraThisTurn: {},
  playerBoosted: {},
  playerBoostsThisTurn: {},
  playerBanishedFromBoostingThisTurn: {},
  playerEvoBanishedFromBoostingThisTurn: {},
  playerIntimidatedAnOpponentThisTurn: {},
  playerAttackedOrDefendedWithAttackActionThisTurn: {},
  playerLastActionCardPlayedSupertypes: {},
  playerActionCardPlaysThisTurn: {},
  playerControlledToughnessThisTurn: {},
  playerControlledVigorThisTurn: {},
  playerControlledMightThisTurn: {},
  playerDiscardedPower6AsAdditionalCost: {},
  playerHighestPowerRevealedThisTurn: {},
  playerFusedSupertypesThisTurn: {},
  playerDiplomacyChoice: {},
  playerBoostsThisCombatChain: {},
  playerCardsBanishedFromSoulThisCombatChain: {},
  playerDaggerHitsThisCombatChain: {},
  playerCrowdCheered: {},
  playerCrowdBooed: {},
  playerBeatenChest: {},
  playerCranked: {},
  playerCompletedAContractThisTurn: {},
  playerHighestDieRollThisTurn: {},
  playerLostLifeThisTurn: {},
  playerCreatedOrActivatedGateToIArathaelThisTurn: {},
  playerRunechantsCreatedThisTurn: {},
  playerBluePutIntoGraveyardThisTurn: {},
  playerLastAttackDidHit: {},
  lastClosedAttackDidHitByInstanceId: {},
  lastClosedDefendedAttackPowersByInstanceId: {},
  playerCombatChainHits: {},
  playerDamageDealt: {},
  playerBeenDealtDamage: {},
  playerDamageTaken: {},
  sourceDamageDealtThisTurn: {},
  sourceDamageDealtThisChainLink: {},
  sourceDamageDealtToHeroThisTurn: {},
  sourceDamageDealtToHeroThisChainLink: {},
  playerNonAttackActionPlayed: {},
  playerAttackActionPlayed: {},
  playerPlayedCardNamesThisTurn: {},
  playerDiscardedPower6: {},
  playerLastAttackNamesThisTurn: {},
  playerAttackedWithCrouchingTigerThisTurn: {},
  heroRefs: {},
  combat: null,
  lastClosedDefendingInstanceIds: [],
  leftArenaThisTurn: [],
};

export function evaluateFabRules(input: EvaluateFabRulesInput): FabRulesView {
  const facts = input.facts ?? EMPTY_RULES_FACTS;
  const applicationMode = input.applicationMode ?? "desired";
  const objects = new Map<string, MutableObject>();
  for (const object of input.objects) {
    const key = refKey(object.ref);
    if (objects.has(key)) throw new FabRulesEvaluationError(`duplicate object ref ${key}`);
    objects.set(key, createMutableObject(object));
  }

  const ruleApplications: FabContinuousApplication[] = [];
  const rules = evaluateRuleAtoms(input.atoms, objects, ruleApplications, facts, applicationMode);
  const objectAtoms = input.atoms
    .filter((entry) => entry.atom.stage !== "rule" && entry.atom.kind !== "activation-cost")
    .sort(compareActiveAtoms);
  for (const stage of [1, 2, 3, 4, 5, 6, 7, 8] as const) {
    requireEqualTimestampOrdering(stage, objectAtoms, objects, facts);
    for (const entry of objectAtoms) {
      if (entry.atom.applicationStage !== stage) continue;
      if (
        entry.atom.condition &&
        !evaluateCondition(entry.atom.condition, contextFor(entry, facts), objects)
      )
        continue;
      const subjects =
        applicationMode === "accepted"
          ? acceptedObjectSubjects(entry, objects)
          : resolveSubjects(entry, objects, facts);
      for (const subject of subjects) {
        // In-effect conditional gates evaluate per resolved subject, so a
        // grant latched onto an attack sees the attack — not the granting
        // card — as the condition's subject.
        if (
          entry.atom.subjectCondition &&
          !evaluateCondition(
            entry.atom.subjectCondition,
            contextFor(entry, facts, subject.input.ref),
            objects,
          )
        )
          continue;
        applyAtom(entry, subject, objects, rules, facts, applicationMode);
      }
    }
    if (stage === 1) {
      for (const object of objects.values()) {
        if (object.input.current === undefined) object.copyable = baseFromMutable(object);
      }
    }
    if (stage === 7) initializeCurrentNumeric(objects);
    if (stage === 8) applyNumericCounters(objects);
  }

  return createRulesView(objects, rules, ruleApplications, facts, input.legality);
}

function requireEqualTimestampOrdering(
  stage: FabRulesStage,
  atoms: readonly FabActiveContinuousAtom[],
  objects: ReadonlyMap<string, MutableObject>,
  facts: FabRulesFacts,
): void {
  const atStage = atoms.filter((entry) => entry.atom.applicationStage === stage);
  const groups = new Map<
    string,
    { entry: FabActiveContinuousAtom; subjects: readonly MutableObject[] }[]
  >();
  for (const entry of atStage) {
    const subjects = resolveSubjects(entry, objects, facts);
    // Independent continuous applications (different numeric properties, or
    // different ability/keyword grants — Dromai go-again + Storm attack
    // ability on the same dragon) never require player ordering.
    const independenceKey = continuousIndependenceKey(entry.atom);
    const key = `${entry.timestamp.sequence}:${entry.timestamp.simultaneousGroupId ?? "none"}:${orderSubstage(entry.atom)}${independenceKey}`;
    const group = groups.get(key) ?? [];
    group.push({ entry, subjects });
    groups.set(key, group);
  }
  for (const group of groups.values()) {
    const subjectRefs = new Map<string, FabObjectRef>();
    for (const candidate of group) {
      for (const subject of candidate.subjects)
        subjectRefs.set(refKey(subject.input.ref), subject.input.ref);
    }
    for (const [key, ref] of subjectRefs) {
      const sharing = group
        .filter((candidate) =>
          candidate.subjects.some((subject) => refKey(subject.input.ref) === key),
        )
        .map((candidate) => candidate.entry);
      if (sharing.length < 2 || sharing.every((entry) => entry.simultaneousOrder !== null))
        continue;
      // Pure add/subtract on the same numeric property are commutative — order
      // cannot change the result. Require APNAP only when non-commutative ops
      // (set/multiply/divide) share a timestamp (Raw Meat Agility+Might both
      // +1{d}; Stand Ground Might+Vigor; Beckon Applause Agility+Vigor).
      if (sharing.every((entry) => isCommutativeNumericAtom(entry.atom))) continue;
      const first = sharing[0]!;
      throw new FabRulesOrderingRequiredError({
        subject: { kind: "object", ref },
        stage,
        substage: first.atom.substage,
        timestamp: first.timestamp,
        atomIds: sharing.map((entry) => entry.atom.atomId).sort(),
        effectIds: [...new Set(sharing.map((entry) => entry.effectId))].sort(),
      });
    }
  }
}

function evaluateRuleAtoms(
  atoms: readonly FabActiveContinuousAtom[],
  objects: ReadonlyMap<string, MutableObject>,
  applications: FabContinuousApplication[],
  facts: FabRulesFacts,
  applicationMode: "desired" | "accepted",
): FabEvaluatedRule[] {
  const rules: FabEvaluatedRule[] = [];
  for (const entry of atoms
    .filter((candidate) => candidate.atom.stage === "rule")
    .sort(compareActiveAtoms)) {
    if (entry.atom.stage !== "rule") continue;
    // CR 1.8: a continuous effect exists only while its condition is true.
    // Accepted mode latches *subjects* (which objects the atom applied to);
    // it must not keep a game-level rule live after the printed condition
    // has become false (Outed "if you are marked", New Horizon face-up
    // arsenal extra zone).
    if (
      entry.atom.condition &&
      !evaluateCondition(entry.atom.condition, contextFor(entry, facts), objects)
    )
      continue;
    const subjects =
      applicationMode === "accepted"
        ? acceptedObjectSubjects(entry, objects)
        : resolveSubjects(entry, objects, facts);
    // An empty latched subject set means the exact object/attack incarnation
    // has gone stale. It is not a game-level rule: omitting it preserves the
    // appliesTo.next boundary instead of leaking the rule onto later objects.
    if (entry.latchedSubjects !== undefined && subjects.length === 0) continue;
    if (entry.atom.target && subjects.length === 0) continue;
    const applicationSubjects: readonly FabRulesSubjectRef[] =
      applicationMode === "accepted"
        ? entry.acceptedApplications.length > 0
          ? entry.acceptedApplications.map((application) => application.subject)
          : // Game-level rule-modifications (no target) never latch an
            // acceptedApplication. C&C "Defense reaction cards can't be played
            // this chain link" is restrict-play; Stamp Authority is restrict-trigger.
            !entry.atom.target
            ? [{ kind: "game" as const }]
            : []
        : subjects.length > 0
          ? subjects.map((subject) => ({ kind: "object" as const, ref: subject.input.ref }))
          : [{ kind: "game" as const }];
    if (applicationSubjects.length === 0) continue;
    for (const subject of applicationSubjects) {
      const contribution = {
        kind: "rule",
        action: entry.atom.action,
        mode: entry.atom.mode,
      } as const;
      const accepted = entry.acceptedApplications.find(
        (application) =>
          continuousSubjectKey(application.subject) === continuousSubjectKey(subject),
      );
      applications.push(
        applicationMode === "accepted" && accepted
          ? accepted
          : createApplication(entry, subject, contribution),
      );
    }
    const [firstSubject, ...remainingSubjects] = subjects.map((subject) => subject.input.ref);
    const scope: FabEvaluatedRule["scope"] = firstSubject
      ? {
          kind: "objects",
          selection: entry.latchedSubjects !== undefined ? "latched" : "dynamic",
          subjects: [firstSubject, ...remainingSubjects],
        }
      : { kind: "game" };
    rules.push({
      action: entry.atom.action,
      mode: entry.atom.mode,
      parameters: entry.atom.parameters,
      filter: entry.atom.filter,
      limit:
        entry.atom.kind === "rule" && entry.atom.limit
          ? { count: resolveRuleLimitCount(entry, facts, objects) }
          : undefined,
      effectId: entry.effectId,
      atomId: entry.atom.atomId,
      scope,
      controllerId: entry.controllerId,
    });
  }
  return rules;
}

/** Resolve a rule atom's limit for the evaluated rule view. CR 8.4.11
 * dynamic counts ("X is the number of Evos you have equipped",
 * EVO059/CRU103) evaluate in the EFFECT CONTROLLER's seat — "you" printed on
 * the attacking card is the attacker, never the defender reading the rule
 * during the defend step. A resolved 0 simply yields no requirement. */
function resolveRuleLimitCount(
  entry: FabActiveContinuousAtom,
  facts: FabRulesFacts,
  objects: ReadonlyMap<string, MutableObject>,
): number {
  const atom = entry.atom;
  if (atom.kind !== "rule" || !atom.limit) {
    throw new FabRulesEvaluationError("resolveRuleLimitCount called on a limit-less atom");
  }
  const count = atom.limit.count;
  if (typeof count === "number") return count;
  const resolved = evaluateAmount(count, contextFor(entry, facts), objects);
  if (!Number.isFinite(resolved) || resolved < 0) {
    throw new FabRulesEvaluationError(
      `rule limit count evaluated to a non-natural number: ${resolved}`,
    );
  }
  return Math.floor(resolved);
}

function liveObjectForRef(
  objects: ReadonlyMap<string, MutableObject>,
  ref: FabObjectRef,
): MutableObject | undefined {
  return objects.get(refKey(ref));
}

function resolveSubjects(
  entry: FabActiveContinuousAtom,
  objects: ReadonlyMap<string, MutableObject>,
  facts: FabRulesFacts,
): readonly MutableObject[] {
  if (entry.latchedSubjects !== undefined)
    return entry.latchedSubjects.map((ref) => liveObjectForRef(objects, ref)).filter(isDefined);
  if (!entry.atom.target) return [];
  if (
    entry.atom.condition &&
    !evaluateCondition(entry.atom.condition, contextFor(entry, facts), objects)
  )
    return [];
  return resolveTarget(entry.atom.target, contextFor(entry, facts), objects);
}

function acceptedObjectSubjects(
  entry: FabActiveContinuousAtom,
  objects: ReadonlyMap<string, MutableObject>,
): readonly MutableObject[] {
  const subjects = new Map<string, MutableObject>();
  for (const application of entry.acceptedApplications) {
    if (application.subject.kind !== "object") continue;
    const object = liveObjectForRef(objects, application.subject.ref);
    if (object) subjects.set(refKey(object.input.ref), object);
  }
  return [...subjects.values()];
}

function initializeCurrentNumeric(objects: ReadonlyMap<string, MutableObject>): void {
  for (const object of objects.values()) {
    if (object.input.current === undefined) object.properties.numeric = { ...object.baseNumeric };
  }
}

function applyNumericCounters(objects: ReadonlyMap<string, MutableObject>): void {
  for (const object of objects.values()) {
    if (object.input.current !== undefined) continue;
    const discreteLifeDelta = (object.input.lifeGained ?? 0) - (object.input.lifeLost ?? 0);
    if (discreteLifeDelta !== 0 && object.properties.numeric.life !== undefined) {
      object.properties.numeric.life = Math.max(
        0,
        object.properties.numeric.life + discreteLifeDelta,
      );
      object.provenance.push({
        property: "life",
        operation: discreteLifeDelta > 0 ? "set" : "damage",
        effectId: null,
        atomId: null,
      });
    }
    for (const counter of object.input.counters) {
      if (counter.kind === "damage") {
        const currentLife = object.properties.numeric.life;
        if (currentLife !== undefined) {
          object.properties.numeric.life = currentLife - counter.count;
          object.provenance.push({
            property: "life",
            operation: "damage",
            effectId: null,
            atomId: null,
          });
        }
        continue;
      }
      if (counter.kind !== "numeric") continue;
      const current = object.properties.numeric[counter.property];
      if (current === undefined) continue;
      object.properties.numeric[counter.property] = current + counter.value * counter.count;
      object.provenance.push({
        property: counter.property,
        operation: "counter",
        effectId: null,
        atomId: null,
      });
    }
  }
}

function createRulesView(
  objects: ReadonlyMap<string, MutableObject>,
  evaluatedRules: readonly FabEvaluatedRule[],
  ruleApplications: readonly FabContinuousApplication[],
  facts: FabRulesFacts,
  legality?: FabRulesLegality,
): FabRulesView {
  const publicObjects = [...objects.values()].map(toEvaluatedObject);
  const byRef = new Map(publicObjects.map((object) => [refKey(object.ref), object]));
  return {
    object: (ref) => byRef.get(refKey(ref)) ?? null,
    objects: (query = {}) =>
      publicObjects.filter((object) => {
        if (query.controllerId && object.controllerId !== query.controllerId) return false;
        if (query.ownerId && object.ownerId !== query.ownerId) return false;
        if (query.zones && !query.zones.includes(object.zone.zone)) return false;
        if (!query.filter) return true;
        const mutable = objects.get(refKey(object.ref));
        if (!mutable) return false;
        return matchesFilter(
          mutable,
          query.filter,
          {
            controllerId: query.controllerId ?? object.controllerId ?? object.ownerId,
            source: null,
            bindings: { objects: {}, numbers: {}, strings: {} },
            facts,
          },
          objects,
        );
      }),
    functionalAbilities: (ref) => {
      const object = byRef.get(refKey(ref));
      if (!object) return [];
      const losesAbilities = evaluatedRules.some((rule) => {
        if (rule.action !== "lose-abilities" || rule.mode !== "restrict") return false;
        if (
          rule.scope.kind === "objects" &&
          rule.scope.subjects.some(
            (subject) =>
              subject.instanceId === object.ref.instanceId &&
              subject.incarnation === object.ref.incarnation,
          )
        ) {
          return true;
        }
        if (rule.scope.kind === "objects") return false;
        if (!rule.filter) return false;
        const mutable = objects.get(refKey(object.ref));
        if (!mutable) return false;
        return matchesFilter(
          mutable,
          rule.filter,
          {
            controllerId: rule.controllerId,
            source: null,
            subject: object.ref,
            bindings: { objects: {}, numbers: {}, strings: {} },
            facts,
          },
          objects,
        );
      });
      return losesAbilities ? [] : object.current.abilities;
    },
    matchesFilter: (object, filter, context) => {
      const mutable =
        objects.get(refKey(object.ref)) ??
        [...objects.values()].find(
          (candidate) => candidate.input.ref.instanceId === object.ref.instanceId,
        );
      if (!mutable) return false;
      const projected: MutableObject = {
        ...mutable,
        input: {
          ...mutable.input,
          base: object.base,
          baseNumeric: object.baseNumeric,
          current: object.current,
        },
        properties: cloneBase(object.current),
        baseNumeric: { ...object.baseNumeric },
      };
      return matchesFilter(projected, filter, { ...context, facts }, objects);
    },
    evaluateCondition: (condition, context) =>
      evaluateCondition(condition, { ...context, facts, rules: evaluatedRules }, objects),
    evaluateAmount: (amount, context) => ({
      value: evaluateAmount(amount, { ...context, facts }, objects),
      dependencies: amountDependencyRefs(amount, { ...context, facts }, objects),
    }),
    targetCandidates: (target, context) =>
      resolveTarget(target, { ...context, facts }, objects).map(toEvaluatedObject),
    rules: (action) =>
      action ? evaluatedRules.filter((rule) => rule.action === action) : evaluatedRules,
    applications: () => [
      ...ruleApplications,
      ...[...objects.values()].flatMap((object) => object.applications),
    ],
    quotePlay: (request) => requireLegality(legality).quotePlay(request),
    quoteActivation: (request) => requireLegality(legality).quoteActivation(request),
    quoteDefense: (request) => requireLegality(legality).quoteDefense(request),
    quoteAttackTargets: (request) => requireLegality(legality).quoteAttackTargets(request),
    combat: () => {
      const combat = facts.combat;
      if (!combat) return null;
      const attack = byRef.get(refKey(combat.attack));
      if (!attack) return null;
      const defenders = combat.defending.flatMap((ref) => {
        const defender =
          byRef.get(refKey(ref)) ??
          [...byRef.values()].find((candidate) => candidate.ref.instanceId === ref.instanceId);
        if (!defender) return [];
        const chainIds = facts.combatChainInstanceIds;
        if (chainIds && !chainIds.includes(ref.instanceId)) return [];
        return [defender];
      });
      // Phantasm is a real triggered destruction handled by the event kernel.
      // Do not project an event-free power-zero approximation while its layer
      // is still respondable on the stack.
      const phantasmDestroyed = false;
      // CR 8.3.23 piercing: +N power while an equipment card defends the attack.
      const defendedByEquipment = defenders.some((defender) =>
        defender.current.typeBox.types.includes("Equipment"),
      );
      const piercingBonus = defendedByEquipment
        ? attack.current.keywords
            .filter((keyword) => keyword.name === "piercing")
            .reduce(
              (total, keyword) =>
                total +
                ("value" in keyword && typeof keyword.value === "number" ? keyword.value : 0),
              0,
            )
        : 0;
      return {
        attack,
        attackPower: (attack.current.numeric.power ?? 0) + piercingBonus,
        phantasmDestroyed,
        defenders,
        defense: defenders.reduce(
          (total, defender) => total + (defender.current.numeric.defense ?? 0),
          0,
        ),
        attackingPlayerId: combat.attackingPlayerId,
        defendingPlayerId: combat.defendingPlayerId,
        attackTarget: combat.attackTarget ? (byRef.get(refKey(combat.attackTarget)) ?? null) : null,
        didHit: combat.didHit,
      };
    },
    explain: (ref): FabRulesExplanation | null => {
      const object = byRef.get(refKey(ref));
      return object
        ? {
            ref: object.ref,
            contributions: object.provenance,
            appliedEffectIds: object.appliedEffectIds,
          }
        : null;
    },
  };
}

function requireLegality(legality: FabRulesLegality | undefined): FabRulesLegality {
  if (!legality)
    throw new FabRulesEvaluationError("legality quotes require an authoritative match view");
  return legality;
}

function toEvaluatedObject(object: MutableObject): FabEvaluatedObject {
  const firstFaceId = object.properties.activeFaceIds[0];
  const firstTypeBox = object.properties.typeBoxes[0];
  if (!firstFaceId || !firstTypeBox) {
    throw new FabRulesEvaluationError("evaluated object must retain at least one active face");
  }
  const current: FabEvaluatedObjectProperties = {
    names: object.properties.names,
    activeFaceIds: [firstFaceId, ...object.properties.activeFaceIds.slice(1)],
    color: object.properties.color,
    typeBoxes: [firstTypeBox, ...object.properties.typeBoxes.slice(1)],
    typeBox: {
      metatypes: object.properties.metatypes,
      supertypes: object.properties.supertypes,
      types: object.properties.types,
      subtypes: object.properties.subtypes,
    },
    traits: object.properties.traits,
    textBoxIds: object.properties.textBoxIds,
    numeric: object.properties.numeric,
    keywords: object.properties.keywords,
    abilities: object.properties.abilities,
  };
  return {
    ref: object.input.ref,
    canonicalId: object.input.canonicalId,
    ownerId: object.input.ownerId,
    controllerId: object.controllerId,
    zone: object.input.zone,
    zoneIndex: object.input.zoneIndex,
    visibility: object.input.visibility,
    base: object.input.base,
    copyable: object.copyable ?? baseFromMutable(object),
    baseNumeric: object.baseNumeric,
    current,
    counters: object.input.counters,
    history: object.input.history,
    appliedEffectIds: [...object.effectIds],
    provenance: object.provenance,
  };
}

function baseFromMutable(object: MutableObject): FabBaseObjectProperties {
  const firstFaceId = object.properties.activeFaceIds[0];
  const firstTypeBox = object.properties.typeBoxes[0];
  if (!firstFaceId || !firstTypeBox) {
    throw new FabRulesEvaluationError("copyable object must retain at least one active face");
  }
  return {
    names: [...object.properties.names] as [string, ...string[]],
    activeFaceIds: [firstFaceId, ...object.properties.activeFaceIds.slice(1)],
    color: object.properties.color,
    typeBoxes: [firstTypeBox, ...object.properties.typeBoxes.slice(1)],
    typeBox: {
      metatypes: [...object.properties.metatypes],
      supertypes: [...object.properties.supertypes],
      types: [...object.properties.types],
      subtypes: [...object.properties.subtypes],
    },
    traits: [...object.properties.traits],
    textBoxIds: [...object.properties.textBoxIds],
    numeric: { ...object.properties.numeric },
    keywords: [...object.properties.keywords],
    abilities: [...object.properties.abilities],
  };
}

function compareActiveAtoms(a: FabActiveContinuousAtom, b: FabActiveContinuousAtom): number {
  const stage = orderStage(a.atom) - orderStage(b.atom);
  if (stage !== 0) return stage;
  const substage = orderSubstage(a.atom) - orderSubstage(b.atom);
  if (substage !== 0) return substage;
  const timestamp = a.timestamp.sequence - b.timestamp.sequence;
  if (timestamp !== 0) return timestamp;
  const simultaneous =
    (a.simultaneousOrder ?? Number.MAX_SAFE_INTEGER) -
    (b.simultaneousOrder ?? Number.MAX_SAFE_INTEGER);
  if (simultaneous !== 0) return simultaneous;
  return a.atom.atomId.localeCompare(b.atom.atomId);
}

function orderStage(atom: FabContinuousAtom): number {
  return atom.stage === "rule" ? 0 : (atom.applicationStage as FabRulesStage);
}

function orderSubstage(atom: FabContinuousAtom): number {
  if (atom.stage === "rule" || atom.substage === null) return 0;
  if (atom.substage === "independent") return 0;
  if (atom.substage === "dependent") return 8;
  return atom.substage;
}

/** True when two equal-timestamp applications of this atom commute. */
function isCommutativeNumericAtom(atom: FabContinuousAtom): boolean {
  return (
    (atom.kind === "numeric" || atom.kind === "base-numeric") &&
    (atom.operation === "add" || atom.operation === "subtract")
  );
}

/**
 * Partition continuous atoms that cannot interact even when they share a
 * subject and timestamp. Different numeric properties, and different
 * ability/keyword grants, apply independently (no APNAP ordering needed).
 */
function continuousIndependenceKey(atom: FabContinuousAtom): string {
  if (atom.kind === "numeric" || atom.kind === "base-numeric") return `:num:${atom.property}`;
  if (atom.kind === "ability") {
    const property = atom.property;
    if (property.kind === "keyword") {
      const name =
        typeof property.keyword === "string"
          ? property.keyword
          : "name" in property.keyword
            ? property.keyword.name
            : "keyword";
      return `:kw:${name}:${atom.operation}`;
    }
    if (property.kind === "ability") {
      return `:ab:${property.ability.id}:${atom.operation}`;
    }
    return `:abilities:${atom.operation}`;
  }
  if (atom.kind === "type" || atom.kind === "supertype" || atom.kind === "identity") {
    return `:${atom.kind}:${atom.operation}:${JSON.stringify(atom.property)}`;
  }
  return `:${atom.kind}`;
}
