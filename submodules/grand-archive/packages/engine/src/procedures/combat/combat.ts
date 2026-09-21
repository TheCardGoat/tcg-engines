import { isGrandArchiveTargetCandidate } from "../activation/activation.ts";
import {
  grandArchiveAbilityIsFunctional,
  grandArchiveObjectFace,
} from "../../game/card-runtime.ts";
import {
  deriveGrandArchiveAttackPower,
  deriveGrandArchiveNumericProperty,
  grandArchiveObjectCurrentCharacteristics,
} from "../../rules/state/continuous.ts";
import type { GrandArchiveCommand } from "../../commands/commands.ts";
import { payGrandArchiveContextualCosts } from "../activation/costs.ts";
import type { GrandArchiveProposedEvent } from "../../kernel/events.ts";
import {
  evaluateGrandArchiveAmount,
  evaluateGrandArchiveCondition,
  grandArchiveCounterKey,
  resolveGrandArchivePlayers,
  resolveGrandArchiveSubjectObjects,
  GrandArchiveUnsupportedRuleError,
  withGrandArchiveDerivedVariables,
  type GrandArchiveEvaluationContext,
} from "../effects/evaluation.ts";
import { grandArchiveDecisionId } from "../../game/identity.ts";
import type { GrandArchiveObjectId, GrandArchivePlayerId } from "../../game/identity.ts";
import { grandArchiveCharacteristicsAreSiegeable } from "../../game/functional-subtypes.ts";
import {
  evaluateGrandArchiveActiveKeywordAmount,
  grandArchiveObjectActiveAbilities,
  grandArchiveObjectActiveKeywordInstances,
  grandArchiveObjectActiveKeywords,
} from "../../rules/abilities/intrinsic-keywords.ts";
import type { GrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type {
  GrandArchiveCardInstance,
  GrandArchiveCombatState,
  GrandArchiveMatchState,
  GrandArchivePendingCombatDamageEvent,
} from "../../game/model.ts";
import {
  grandArchiveOpportunityIsSuppressed,
  openGrandArchiveOpportunity,
} from "../game-flow/opportunity.ts";
import { grandArchiveObjectObeysController } from "../../game/obedience.ts";
import {
  collectGrandArchiveActionRules,
  collectGrandArchiveCostRules,
  collectGrandArchiveValueRules,
  type GrandArchiveAppliedRule,
} from "../../rules/state/rule-modifications.ts";

type DeclareAttackCommand = Extract<GrandArchiveCommand, { readonly move: "declare-attack" }>;

const COMPLEX_COMBAT_KEYWORDS = new Set<string>();

function keywords(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
  prospectiveAttackAttackerId?: GrandArchiveObjectId,
): readonly import("@tcg/grand-archive-types").GrandArchiveKeyword[] {
  return grandArchiveObjectActiveKeywords(
    program,
    state,
    object,
    prospectiveAttackAttackerId ? { prospectiveAttackAttackerId } : {},
  );
}

function keywordInstances(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
) {
  return grandArchiveObjectActiveKeywordInstances(program, state, object);
}

function keywordNames(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
  prospectiveAttackAttackerId?: GrandArchiveObjectId,
): readonly string[] {
  return keywords(program, state, object, prospectiveAttackAttackerId).map(
    (keyword) => keyword.name,
  );
}

function objectHasKeyword(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
  keyword: string,
  prospectiveAttackAttackerId?: GrandArchiveObjectId,
): boolean {
  return keywordNames(program, state, object, prospectiveAttackAttackerId).includes(keyword);
}

function attackParticipants(
  state: GrandArchiveMatchState,
  attacker: GrandArchiveCardInstance,
  intents: readonly GrandArchiveCardInstance[],
  weapons: readonly GrandArchiveCardInstance[],
): readonly GrandArchiveCardInstance[] {
  return [attacker, ...intents, ...weapons].filter(
    (object) => state.objects[object.id] !== undefined,
  );
}

function attackHasKeyword(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  participants: readonly GrandArchiveCardInstance[],
  keyword: string,
): boolean {
  return participants.some((object) => objectHasKeyword(program, state, object, keyword));
}

function attackHasTrueSight(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  participants: readonly GrandArchiveCardInstance[],
  attackerId: GrandArchiveObjectId,
): boolean {
  return participants.some((object) => {
    const types = grandArchiveObjectCurrentCharacteristics(program, state, object).types;
    return (
      types.some(
        (type) => type === "ALLY" || type === "CHAMPION" || type === "ATTACK" || type === "WEAPON",
      ) && objectHasKeyword(program, state, object, "true-sight", attackerId)
    );
  });
}

function attackerHasUnblockable(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  attacker: GrandArchiveCardInstance,
): boolean {
  const types = grandArchiveObjectCurrentCharacteristics(program, state, attacker).types;
  return (
    (types.includes("ALLY") || types.includes("CHAMPION")) &&
    objectHasKeyword(program, state, attacker, "unblockable")
  );
}

function legalSingleAttackTarget(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  attacker: GrandArchiveCardInstance,
  target: GrandArchiveCardInstance,
  participants: readonly GrandArchiveCardInstance[],
  enforceTaunt: boolean,
  alreadyDefendingIds: ReadonlySet<GrandArchiveObjectId> = new Set(),
): boolean {
  if (
    target.zone !== "field" ||
    target.controllerId === attacker.controllerId ||
    !isAttackable(program, state, target)
  ) {
    return false;
  }
  const trueSight = attackHasTrueSight(program, state, participants, attacker.id);
  if (
    isUnit(program, state, target) &&
    objectHasKeyword(program, state, target, "stealth") &&
    !trueSight
  )
    return false;
  if (!enforceTaunt || attackerHasUnblockable(program, state, attacker)) return true;
  const attackableTaunts = Object.values(state.objects).filter(
    (object) =>
      object.zone === "field" &&
      object.controllerId === target.controllerId &&
      !object.states.has("rested") &&
      isUnit(program, state, object) &&
      objectHasKeyword(program, state, object, "taunt") &&
      (!objectHasKeyword(program, state, object, "stealth") || trueSight),
  );
  return (
    attackableTaunts.length === 0 ||
    attackableTaunts.some((object) => object.id === target.id) ||
    attackableTaunts.every((object) => alreadyDefendingIds.has(object.id))
  );
}

function attackKeywordAmount(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  participants: readonly GrandArchiveCardInstance[],
  name: "multistrike",
): number {
  return participants.reduce(
    (total, object) =>
      total +
      keywordInstances(program, state, object).reduce((objectTotal, instance) => {
        const keyword = instance.keyword;
        if (keyword.name !== name) return objectTotal;
        return objectTotal + evaluateGrandArchiveActiveKeywordAmount(instance, keyword.value);
      }, 0),
    0,
  );
}

export function collectGrandArchiveInvalidCombatRoleEvents(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
): readonly GrandArchiveProposedEvent[] {
  const combat = state.combat;
  if (!combat) return [];
  const attacker = state.objects[combat.attackerId];
  if (!attacker) return [];
  const intents = combat.intentIds.flatMap((intentId) => {
    const intent = state.objects[intentId];
    return intent?.zone === "intent" ? [intent] : [];
  });
  const weapons = combat.weaponIds.flatMap((weaponId) => {
    const weapon = state.objects[weaponId];
    return weapon?.zone === "field" ? [weapon] : [];
  });
  const participants = attackParticipants(state, attacker, intents, weapons);
  const events: GrandArchiveProposedEvent[] = [];
  if (
    attacker.states.has("attacking") &&
    (attacker.zone !== "field" || attacker.controllerId !== combat.attackingPlayerId)
  ) {
    events.push({
      type: "object-state-changed",
      objectId: attacker.id,
      state: "attacking",
      value: false,
      cause: { kind: "rule", rule: "invalid-attacker-state-check" },
    });
  }
  for (const targetId of combat.targetIds) {
    const target = state.objects[targetId];
    if (
      target?.states.has("defending") &&
      (!combat.defendingPlayerIds.includes(target.controllerId) ||
        !legalSingleAttackTarget(program, state, attacker, target, participants, false))
    ) {
      events.push({
        type: "object-state-changed",
        objectId: target.id,
        state: "defending",
        value: false,
        cause: { kind: "rule", rule: "invalid-defender-state-check" },
      });
    }
  }
  for (const intentId of combat.intentIds) {
    const intent = state.objects[intentId];
    if (intent?.zone !== "intent") continue;
    const commandKeywords = activeCommandKeywords(program, state, intent);
    if (
      commandKeywords.length > 0 &&
      !attackerMatchesCommand(program, state, attacker, commandKeywords)
    ) {
      events.push({
        type: "object-moved",
        objectId: intent.id,
        from: "intent",
        to: "graveyard",
        cause: { kind: "rule", rule: "command-attacker-subtype-state-check" },
      });
    }
  }
  return events;
}

function rangedAttackBonus(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  attacker: GrandArchiveCardInstance,
): number {
  if (!attacker.states.has("distant")) return 0;
  const evaluation = {
    program,
    state,
    controllerId: attacker.controllerId,
    sourceId: attacker.id,
    abilityBearerId: attacker.id,
    bindings: {},
  };
  return keywordInstances(program, state, attacker).reduce(
    (total, instance) =>
      instance.keyword.name === "ranged"
        ? total +
          evaluateGrandArchiveActiveKeywordAmount(instance, instance.keyword.value, evaluation)
        : total,
    0,
  );
}

function commandedWillBonus(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  attacker: GrandArchiveCardInstance,
  intents: readonly GrandArchiveCardInstance[],
): number {
  if (!intents.some((intent) => activeCommandKeywords(program, state, intent).length > 0)) return 0;
  return keywordInstances(program, state, attacker).reduce((total, instance) => {
    const keyword = instance.keyword;
    if (keyword.name !== "commanded-will") return total;
    return total + evaluateGrandArchiveActiveKeywordAmount(instance, keyword.value);
  }, 0);
}

function assertSimpleCombatKeywords(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  participants: readonly GrandArchiveCardInstance[] = [],
): void {
  const objects = [
    ...Object.values(state.objects).filter((object) => object.zone === "field"),
    ...participants,
  ];
  for (const object of new Map(objects.map((candidate) => [candidate.id, candidate])).values()) {
    const keyword = keywordNames(program, state, object).find((name) =>
      COMPLEX_COMBAT_KEYWORDS.has(name),
    );
    if (keyword) throw new GrandArchiveUnsupportedRuleError(`combat keyword ${keyword}`);
  }
}

export function grandArchiveObjectPower(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
): number | undefined {
  return deriveGrandArchiveNumericProperty(object, "power", {
    program,
    state,
    controllerId: object.controllerId,
    sourceId: object.id,
    abilityBearerId: object.id,
    bindings: {},
  });
}

/**
 * Resolves the mutually exclusive stat a unit uses to assign its own combat damage.
 * Newer continuous rules override older ones; absent a rule, combat uses power.
 */
export function grandArchiveCombatDamageStat(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
): number | undefined {
  const evaluation: GrandArchiveEvaluationContext = {
    program,
    state,
    controllerId: object.controllerId,
    sourceId: object.id,
    abilityBearerId: object.id,
    candidateId: object.id,
    bindings: {},
  };
  const property = collectGrandArchiveValueRules({
    action: "assign-combat-damage",
    activationKind: "card",
    playerId: object.controllerId,
    candidateId: object.id,
    fromZone: object.zone,
    evaluation,
  }).at(-1)?.effect.valueProperty;
  return deriveGrandArchiveNumericProperty(object, property ?? "power", evaluation);
}

/** Steadfast applies only to allies (CR Keywords and Abilities — Steadfast 1). */
export function grandArchiveRetaliatorHasSteadfast(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
): boolean {
  return (
    grandArchiveObjectCurrentCharacteristics(program, state, object).types.includes("ALLY") &&
    objectHasKeyword(program, state, object, "steadfast")
  );
}

function isUnit(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
): boolean {
  const types = grandArchiveObjectCurrentCharacteristics(program, state, object).types;
  return types.includes("ALLY") || types.includes("CHAMPION");
}

function isAttackable(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
): boolean {
  const characteristics = grandArchiveObjectCurrentCharacteristics(program, state, object);
  return (
    isUnit(program, state, object) ||
    (characteristics.types.includes("DOMAIN") &&
      (grandArchiveCharacteristicsAreSiegeable(characteristics) ||
        objectHasKeyword(program, state, object, "siegeable")))
  );
}

function isWeapon(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
): boolean {
  return grandArchiveObjectCurrentCharacteristics(program, state, object).types.includes("WEAPON");
}

function attackerCanDeclareAttack(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  attacker: GrandArchiveCardInstance,
  weapons: readonly GrandArchiveCardInstance[],
  combinedAttackPower: number,
  options: { readonly resolvedAttack: boolean; readonly mayAttackAsAlly: boolean },
): boolean {
  if (options.resolvedAttack) return true;
  const types = grandArchiveObjectCurrentCharacteristics(program, state, attacker).types;
  const power = grandArchiveObjectPower(program, state, attacker);
  if (types.includes("ALLY") || options.mayAttackAsAlly) {
    if (power === undefined || power < 0) return false;
    return power > 0 || (power === 0 && weapons.length > 0 && combinedAttackPower > 0);
  }
  if (types.includes("CHAMPION")) {
    return (power ?? 0) > 0 || weapons.length > 0;
  }
  return false;
}

function weaponRequiresLoadedCard(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
): boolean {
  const subtypes = grandArchiveObjectCurrentCharacteristics(program, state, object).subtypes;
  return subtypes.includes("GUN") || subtypes.includes("BOW") || subtypes.includes("AETHERWING");
}

function weaponLoadedCards(
  state: GrandArchiveMatchState,
  weapon: GrandArchiveCardInstance,
): readonly GrandArchiveCardInstance[] {
  return Object.values(state.objects).filter(
    (object) => object.zone === "loaded" && object.hostId === weapon.id,
  );
}

type WeaponParticipationAction =
  | "use-weapon-for-attack"
  | "use-for-attack"
  | "use-with-attack-card";

function weaponParticipationRuleRequest(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  attacker: GrandArchiveCardInstance,
  weapon: GrandArchiveCardInstance,
  action: WeaponParticipationAction,
  intentId?: GrandArchiveObjectId,
) {
  const evaluation: GrandArchiveEvaluationContext = {
    program,
    state,
    controllerId: attacker.controllerId,
    sourceId: attacker.id,
    abilityBearerId: attacker.id,
    candidateId: weapon.id,
    prospectiveAttackAttackerId: attacker.id,
    bindings: {},
  };
  return {
    action,
    activationKind: "card" as const,
    playerId: attacker.controllerId,
    candidateId: weapon.id,
    actorObjectId: attacker.id,
    fromZone: weapon.zone,
    usingIds: [weapon.id],
    ...(intentId ? { againstIds: [intentId] } : {}),
    evaluation,
  };
}

interface GrandArchiveWeaponParticipation {
  readonly legal: boolean;
  readonly useWeaponRules: readonly GrandArchiveAppliedRule[];
}

function ruleExplicitlyPermitsAttacker(
  rule: GrandArchiveAppliedRule,
  attackerId: GrandArchiveObjectId,
): boolean {
  const subject = rule.effect.subject;
  return (
    rule.effect.mode === "allow" &&
    subject !== undefined &&
    subject.kind !== "player" &&
    resolveGrandArchiveSubjectObjects(subject, rule.evaluation).some(
      (object) => object.id === attackerId,
    )
  );
}

function rulePermitsUnloadedWeapon(rule: GrandArchiveAppliedRule): boolean {
  return rule.effect.mode === "allow" && rule.effect.subject?.kind === "player";
}

function grandArchiveWeaponParticipation(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  attacker: GrandArchiveCardInstance,
  weapon: GrandArchiveCardInstance,
  intent?: GrandArchiveCardInstance,
): GrandArchiveWeaponParticipation {
  const useWeaponRules = collectGrandArchiveActionRules(
    weaponParticipationRuleRequest(
      program,
      state,
      attacker,
      weapon,
      "use-weapon-for-attack",
      intent?.id,
    ),
  );
  const useForAttackRules = collectGrandArchiveActionRules(
    weaponParticipationRuleRequest(program, state, attacker, weapon, "use-for-attack", intent?.id),
  );
  const useWithAttackCardRules = intent
    ? collectGrandArchiveActionRules(
        weaponParticipationRuleRequest(
          program,
          state,
          attacker,
          weapon,
          "use-with-attack-card",
          intent.id,
        ),
      )
    : [];
  const forbidden = [...useWeaponRules, ...useForAttackRules, ...useWithAttackCardRules].some(
    (rule) => rule.effect.mode === "forbid",
  );
  const attackerIsChampion = grandArchiveObjectCurrentCharacteristics(
    program,
    state,
    attacker,
  ).types.includes("CHAMPION");
  const attackerCanUseWeapon =
    attackerIsChampion ||
    useWeaponRules.some((rule) => ruleExplicitlyPermitsAttacker(rule, attacker.id));
  const loadedRequirementSatisfied =
    !weaponRequiresLoadedCard(program, state, weapon) ||
    weaponLoadedCards(state, weapon).length > 0 ||
    useWeaponRules.some(rulePermitsUnloadedWeapon);
  const functionalSubtypeCompatibleWithIntent =
    !intent || !weaponRequiresLoadedCard(program, state, weapon);

  return {
    legal:
      !forbidden &&
      attackerCanUseWeapon &&
      loadedRequirementSatisfied &&
      functionalSubtypeCompatibleWithIntent,
    useWeaponRules,
  };
}

function weaponActionResultEvents(
  rules: readonly GrandArchiveAppliedRule[],
): readonly GrandArchiveProposedEvent[] {
  return rules.flatMap((rule): readonly GrandArchiveProposedEvent[] => {
    const effect = rule.effect.actionResult;
    if (!effect) return [];
    if (effect.kind !== "add-counter") {
      throw new GrandArchiveUnsupportedRuleError(`weapon action result ${effect.kind}`);
    }
    if (effect.counterScope === "temporary") {
      throw new GrandArchiveUnsupportedRuleError(
        "weapon add-counter action result with temporary scope",
      );
    }
    const amount = evaluateGrandArchiveAmount(effect.amount, rule.evaluation);
    if (amount <= 0) return [];
    return resolveGrandArchiveSubjectObjects(effect.subject, rule.evaluation).map((object) => ({
      type: "counter-changed" as const,
      objectId: object.id,
      counter: grandArchiveCounterKey(effect.counter),
      delta: amount,
      cause: { kind: "rule" as const, rule: "weapon-use-action-result" },
    }));
  });
}

export interface GrandArchiveResolvedAttackCandidates {
  readonly attackerCandidates: readonly GrandArchiveObjectId[];
  readonly targetCandidates: readonly GrandArchiveObjectId[];
  readonly weaponCandidates: readonly GrandArchiveObjectId[];
  readonly cleavePlayerCandidates: readonly GrandArchivePlayerId[];
}

export function grandArchiveEffectAttackCandidates(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  attackerId: GrandArchiveObjectId,
): GrandArchiveResolvedAttackCandidates {
  const attacker = state.objects[attackerId];
  if (!attacker) {
    return {
      attackerCandidates: [],
      targetCandidates: [],
      weaponCandidates: [],
      cleavePlayerCandidates: [],
    };
  }
  const playerId = attacker.controllerId;
  return {
    attackerCandidates: [attacker.id],
    targetCandidates: Object.values(state.objects)
      .filter(
        (object) =>
          object.zone === "field" &&
          object.controllerId !== playerId &&
          isAttackable(program, state, object),
      )
      .map((object) => object.id),
    weaponCandidates: Object.values(state.objects)
      .filter(
        (object) =>
          object.zone === "field" &&
          object.controllerId === playerId &&
          isWeapon(program, state, object) &&
          (object.counters.durability ?? 0) > 0 &&
          grandArchiveWeaponParticipation(program, state, attacker, object).legal,
      )
      .map((object) => object.id),
    cleavePlayerCandidates: state.turnOrder.filter(
      (candidate) => candidate !== playerId && state.players[candidate]?.lost === false,
    ),
  };
}

interface AttackTargetDelegation {
  readonly effect: import("@tcg/grand-archive-types").GrandArchiveAttackTargetDelegationEffect;
  readonly evaluation: GrandArchiveEvaluationContext;
}

function attackTargetDelegation(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  attacker: GrandArchiveCardInstance,
): AttackTargetDelegation | undefined {
  const face = grandArchiveObjectFace(program, attacker);
  const evaluation: GrandArchiveEvaluationContext = {
    program,
    state,
    controllerId: attacker.controllerId,
    sourceId: attacker.id,
    abilityBearerId: attacker.id,
    bindings: {},
  };
  const effects = grandArchiveObjectActiveAbilities(program, state, attacker).flatMap(
    (ability): readonly AttackTargetDelegation[] => {
      if (ability.kind !== "static" || ability.staticKind !== "effects") return [];
      const abilityEvaluation = withGrandArchiveDerivedVariables(ability.variables, evaluation);
      if (
        !grandArchiveAbilityIsFunctional(face, ability, attacker) ||
        ability.restrictions?.some(
          (restriction) =>
            restriction.kind === "static" &&
            !evaluateGrandArchiveCondition(restriction.condition, abilityEvaluation),
        ) ||
        (ability.condition && !evaluateGrandArchiveCondition(ability.condition, abilityEvaluation))
      ) {
        return [];
      }
      return ability.effects.flatMap((effect): readonly AttackTargetDelegation[] =>
        effect.kind === "attack-target-delegation" &&
        resolveGrandArchiveSubjectObjects(effect.attacker, abilityEvaluation).some(
          (candidate) => candidate.id === attacker.id,
        )
          ? [{ effect, evaluation: abilityEvaluation }]
          : [],
      );
    },
  );
  if (effects.length > 1) {
    throw new GrandArchiveUnsupportedRuleError("multiple attack target delegations");
  }
  return effects[0];
}

type CommandKeyword = Extract<
  import("@tcg/grand-archive-types").GrandArchiveKeyword,
  { readonly name: "command" }
>;

function activeCommandKeywords(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  intent: GrandArchiveCardInstance | undefined,
): readonly CommandKeyword[] {
  if (!intent) return [];
  return keywords(program, state, intent).filter(
    (keyword): keyword is CommandKeyword => keyword.name === "command",
  );
}

function attackerMatchesCommand(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  attacker: GrandArchiveCardInstance,
  commands: readonly CommandKeyword[],
): boolean {
  const characteristics = grandArchiveObjectCurrentCharacteristics(program, state, attacker);
  return (
    characteristics.types.includes("ALLY") &&
    commands.some((command) => characteristics.subtypes.includes(command.subtype.toUpperCase()))
  );
}

export function grandArchiveResolvedAttackCandidates(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  intentId: GrandArchiveObjectId,
  paidAttackerId: GrandArchiveObjectId | undefined,
): GrandArchiveResolvedAttackCandidates {
  const intent = state.objects[intentId];
  const commandKeywords = activeCommandKeywords(program, state, intent);
  const paidAttacker = paidAttackerId ? state.objects[paidAttackerId] : undefined;
  const attackTimingLegal =
    state.turn.playerId === playerId &&
    state.turn.phase === "main" &&
    !state.combat &&
    (state.players[playerId]?.hasTakenFirstTurn || state.turnOrder.at(-1) === playerId);
  return {
    attackerCandidates: attackTimingLegal
      ? paidAttacker &&
        paidAttacker.zone === "field" &&
        paidAttacker.controllerId === playerId &&
        grandArchiveObjectObeysController(program, state, paidAttacker) &&
        (commandKeywords.length > 0
          ? attackerMatchesCommand(program, state, paidAttacker, commandKeywords)
          : grandArchiveObjectCurrentCharacteristics(program, state, paidAttacker).types.includes(
              "CHAMPION",
            ))
        ? [paidAttacker.id]
        : []
      : [],
    targetCandidates: Object.values(state.objects)
      .filter(
        (object) =>
          object.zone === "field" &&
          object.controllerId !== playerId &&
          isAttackable(program, state, object),
      )
      .map((object) => object.id),
    weaponCandidates:
      commandKeywords.length > 0 || !paidAttacker
        ? []
        : Object.values(state.objects)
            .filter(
              (object) =>
                object.zone === "field" &&
                object.controllerId === playerId &&
                isWeapon(program, state, object) &&
                (object.counters.durability ?? 0) > 0 &&
                grandArchiveWeaponParticipation(program, state, paidAttacker, object, intent).legal,
            )
            .map((object) => object.id),
    cleavePlayerCandidates: state.turnOrder.filter(
      (candidate) => candidate !== playerId && state.players[candidate]?.lost === false,
    ),
  };
}

export function proposeGrandArchiveAttackDeclaration(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  command: DeclareAttackCommand,
  options: {
    readonly resolvedAttack?: true;
    readonly delegationResolved?: true;
    /** Explicit card text is resolving an attack declaration from the Effects Stack. */
    readonly effectGranted?: true;
    readonly effectStackItemId?: import("../../game/identity.ts").GrandArchiveStackItemId;
  } = {},
): readonly GrandArchiveProposedEvent[] {
  const effectGranted = options.effectGranted === true;
  if (
    (!options.resolvedAttack && !effectGranted && state.opportunity?.holderId !== playerId) ||
    state.turn.playerId !== playerId ||
    (!effectGranted && state.turn.phase !== "main") ||
    (!effectGranted && state.stack.length > 0) ||
    (!effectGranted && state.combat)
  ) {
    throw new Error("Attacks are slow actions in the turn player's empty-stack Main phase");
  }
  if (!state.players[playerId]?.hasTakenFirstTurn && state.turnOrder.at(-1) !== playerId) {
    throw new Error("Only the last player in the first turn cycle may attack on their first turn");
  }
  const attacker = state.objects[command.attackerId];
  const intent = command.attackCardId ? state.objects[command.attackCardId] : undefined;
  if (
    command.attackCardId &&
    (!intent ||
      intent.zone !== "intent" ||
      intent.controllerId !== playerId ||
      intent.hostId !== command.attackerId ||
      !grandArchiveObjectCurrentCharacteristics(program, state, intent).types.includes("ATTACK"))
  ) {
    throw new Error("Resolved Attack card is not in the selected attacker's intent");
  }
  const commandKeywords = activeCommandKeywords(program, state, intent);
  if (
    options.resolvedAttack &&
    attacker &&
    (commandKeywords.length > 0
      ? !attackerMatchesCommand(program, state, attacker, commandKeywords)
      : !grandArchiveObjectCurrentCharacteristics(program, state, attacker).types.includes(
          "CHAMPION",
        ))
  ) {
    throw new Error("Resolved Attack card has an illegal attacker");
  }
  const weaponIds = command.weaponIds ?? [];
  if (new Set(weaponIds).size !== weaponIds.length) {
    throw new Error("A weapon cannot be selected more than once");
  }
  if (commandKeywords.length > 0 && weaponIds.length > 0) {
    throw new Error("A Command attack cannot wield a champion weapon");
  }
  const weapons = weaponIds.map((weaponId) => {
    const weapon = state.objects[weaponId];
    if (
      !weapon ||
      weapon.zone !== "field" ||
      weapon.controllerId !== playerId ||
      !isWeapon(program, state, weapon) ||
      (weapon.counters.durability ?? 0) <= 0
    ) {
      throw new Error("Selected object cannot be wielded for this attack");
    }
    return weapon;
  });
  const loadedCards = weapons.flatMap((weapon) => weaponLoadedCards(state, weapon));
  const intents = [...(intent ? [intent] : []), ...loadedCards];
  const participants = attacker ? attackParticipants(state, attacker, intents, weapons) : [];
  assertSimpleCombatKeywords(program, state, participants);
  const hasCleave = attackHasKeyword(program, state, participants, "cleave");
  const additionalTargetLimit = attackKeywordAmount(program, state, participants, "multistrike");
  const combinedObjectPower =
    (attacker ? (grandArchiveObjectPower(program, state, attacker) ?? 0) : 0) +
    (attacker ? rangedAttackBonus(program, state, attacker) : 0) +
    (attacker ? commandedWillBonus(program, state, attacker, intents) : 0) +
    (intent ? (grandArchiveObjectPower(program, state, intent) ?? 0) : 0) +
    loadedCards.reduce(
      (total, loadedCard) => total + (grandArchiveObjectPower(program, state, loadedCard) ?? 0),
      0,
    ) +
    weapons.reduce(
      (total, weapon) => total + (grandArchiveObjectPower(program, state, weapon) ?? 0),
      0,
    );
  const combinedPower = attacker
    ? deriveGrandArchiveAttackPower(attacker, combinedObjectPower, {
        program,
        state,
        controllerId: playerId,
        sourceId: attacker.id,
        abilityBearerId: attacker.id,
        prospectiveAttackAttackerId: attacker.id,
        bindings: {},
      })
    : combinedObjectPower;
  const attackRuleEvaluation: GrandArchiveEvaluationContext | undefined = attacker
    ? {
        program,
        state,
        controllerId: playerId,
        sourceId: attacker.id,
        abilityBearerId: attacker.id,
        candidateId: attacker.id,
        prospectiveAttackAttackerId: attacker.id,
        bindings: {},
      }
    : undefined;
  const actionRules = (
    action: "attack" | "attack-as-ally" | "declare-target",
    againstIds?: readonly GrandArchiveObjectId[],
  ) =>
    attacker && attackRuleEvaluation
      ? collectGrandArchiveActionRules({
          action,
          activationKind: "card",
          playerId,
          candidateId: attacker.id,
          fromZone: attacker.zone,
          usingIds: weaponIds,
          ...(againstIds ? { againstIds } : {}),
          evaluation: attackRuleEvaluation,
        })
      : [];
  const ignoresTauntAgainst = (againstIds: readonly GrandArchiveObjectId[]) =>
    actionRules("declare-target", againstIds).some(
      (rule) => rule.effect.mode === "allow" && rule.effect.ignoredKeyword === "taunt",
    );
  const mayAttackAsAlly = actionRules("attack-as-ally").some(
    (rule) => rule.effect.mode === "allow",
  );
  const canDeclareAttack =
    attacker &&
    attackerCanDeclareAttack(program, state, attacker, weapons, combinedPower, {
      resolvedAttack: options.resolvedAttack === true,
      mayAttackAsAlly,
    });
  if (
    !attacker ||
    attacker.zone !== "field" ||
    attacker.controllerId !== playerId ||
    (!isUnit(program, state, attacker) && !mayAttackAsAlly) ||
    !grandArchiveObjectObeysController(program, state, attacker) ||
    (!options.resolvedAttack && !effectGranted && attacker.states.has("rested")) ||
    !canDeclareAttack
  ) {
    throw new Error("Selected object cannot declare an attack");
  }
  const weaponParticipations = weapons.map((weapon) =>
    grandArchiveWeaponParticipation(program, state, attacker, weapon, intent),
  );
  if (weaponParticipations.some((participation) => !participation.legal)) {
    throw new Error("Selected object cannot be wielded for this attack");
  }
  // Cleave replaces choosing a target defender with choosing a player (Attack Declaration,
  // General rule 1.1 and Declaring an Attack rule 2.3.1). A delegation that only changes who
  // chooses that target defender therefore has no selection left to delegate.
  const delegation =
    options.delegationResolved || hasCleave
      ? undefined
      : attackTargetDelegation(program, state, attacker);
  if (delegation) {
    if (new Set(command.targetIds).size !== command.targetIds.length) {
      throw new Error("An object cannot be selected as an attack target more than once");
    }
    if (command.cleavePlayerId) throw new Error("This attack does not have Cleave");
    if (command.targetIds.length > additionalTargetLimit) {
      throw new Error("Multistrike declares too many additional targets");
    }
    const chooserIds = resolveGrandArchivePlayers(
      delegation.effect.delegate.chooser,
      delegation.evaluation,
    );
    if (chooserIds.length !== 1 || chooserIds[0] !== playerId) {
      throw new GrandArchiveUnsupportedRuleError(
        "attack delegation requires the attack controller to choose an opponent",
      );
    }
    const eligibleOpponentIds = resolveGrandArchivePlayers(
      delegation.effect.delegate.players,
      delegation.evaluation,
    );
    const delegatedPlayerId = command.delegatePlayerId;
    if (!delegatedPlayerId || !eligibleOpponentIds.includes(delegatedPlayerId)) {
      throw new Error("Delegated attack requires an eligible opposing player");
    }
    const evaluation: GrandArchiveEvaluationContext = {
      ...delegation.evaluation,
      bindings: {
        ...delegation.evaluation.bindings,
        [delegation.effect.delegate.bindAs]: [delegatedPlayerId],
      },
    };
    const declaration: import("@tcg/grand-archive-types").GrandArchiveTargetDeclaration = {
      id: "delegated-defender",
      kind: "target",
      declared: "announcement",
      chooser: "controller",
      count: { kind: "exactly", amount: 1 },
      unique: true,
      candidates: delegation.effect.defenderCandidates,
    };
    const candidateIds = Object.values(state.objects)
      .filter(
        (candidate) =>
          !command.targetIds.includes(candidate.id) &&
          isGrandArchiveTargetCandidate(candidate.id, declaration, evaluation) &&
          legalSingleAttackTarget(
            program,
            state,
            attacker,
            candidate,
            participants,
            !ignoresTauntAgainst([candidate.id]),
            new Set(command.targetIds),
          ),
      )
      .map((candidate) => candidate.id);
    if (candidateIds.length === 0) {
      throw new Error("The chosen opponent controls no valid target defender");
    }
    return [
      {
        type: "decision-created",
        decision: {
          id: grandArchiveDecisionId(`decision-${state.nextDecisionOrdinal}`),
          kind: "choose-delegated-defender",
          playerId: delegatedPlayerId,
          attackingPlayerId: playerId,
          attackerId: attacker.id,
          candidateIds,
          additionalTargetIds: command.targetIds,
          ...(command.attackCardId ? { attackCardId: command.attackCardId } : {}),
          weaponIds,
          ...(command.reservePayment ? { reservePayment: command.reservePayment } : {}),
          ...(command.costSelections ? { costSelections: command.costSelections } : {}),
          ...(command.costPaymentOrders ? { costPaymentOrders: command.costPaymentOrders } : {}),
          ...(command.costOptionIndex !== undefined
            ? { costOptionIndex: command.costOptionIndex }
            : {}),
          ...(command.payOptionalCost !== undefined
            ? { payOptionalCost: command.payOptionalCost }
            : {}),
          resolvedAttack: options.resolvedAttack === true,
          stateVersion: state.stateVersion,
        },
        actorId: playerId,
        cause: { kind: "command", move: "declare-attack" },
      },
    ];
  }
  if (new Set(command.targetIds).size !== command.targetIds.length) {
    throw new Error("An object cannot be selected as an attack target more than once");
  }
  const targets: GrandArchiveCardInstance[] = [];
  if (hasCleave) {
    if (
      !command.cleavePlayerId ||
      command.cleavePlayerId === playerId ||
      state.players[command.cleavePlayerId]?.lost !== false
    ) {
      throw new Error("Cleave requires an active opposing player");
    }
    const cleaveTargets = Object.values(state.objects).filter(
      (object) =>
        object.zone === "field" &&
        object.controllerId === command.cleavePlayerId &&
        legalSingleAttackTarget(program, state, attacker, object, participants, false),
    );
    if (cleaveTargets.length === 0) {
      throw new Error("The chosen player controls no attackable objects for Cleave");
    }
    targets.push(...cleaveTargets);
    if (command.targetIds.length > additionalTargetLimit) {
      throw new Error("Multistrike declares too many additional targets");
    }
  } else {
    if (command.cleavePlayerId) throw new Error("This attack does not have Cleave");
    if (command.targetIds.length < 1 || command.targetIds.length > 1 + additionalTargetLimit) {
      throw new Error("Attack declares an illegal number of targets");
    }
  }
  for (const targetId of command.targetIds) {
    if (targets.some((target) => target.id === targetId)) {
      throw new Error("Multistrike target is already a defending object");
    }
    const target = state.objects[targetId];
    if (
      !target ||
      !legalSingleAttackTarget(
        program,
        state,
        attacker,
        target,
        participants,
        !ignoresTauntAgainst([target.id]),
        new Set(targets.map((candidate) => candidate.id)),
      )
    ) {
      throw new Error("Selected object is not a legal attack target");
    }
    targets.push(target);
  }
  const againstIds = targets.map((target) => target.id);
  const finalAttackRules = actionRules("attack", againstIds);
  if (finalAttackRules.some((rule) => rule.effect.mode === "forbid")) {
    throw new Error("A rule forbids the selected object or player from declaring an attack");
  }
  const attackCostRules = attackRuleEvaluation
    ? collectGrandArchiveCostRules({
        action: "attack",
        activationKind: "card",
        playerId,
        candidateId: attacker.id,
        fromZone: attacker.zone,
        usingIds: weaponIds,
        againstIds,
        evaluation: attackRuleEvaluation,
      })
    : [];
  const declareTargetCostRules = attackRuleEvaluation
    ? collectGrandArchiveCostRules({
        action: "declare-target",
        activationKind: "card",
        playerId,
        candidateId: attacker.id,
        fromZone: attacker.zone,
        usingIds: weaponIds,
        againstIds,
        evaluation: attackRuleEvaluation,
      })
    : [];
  const weaponCostRules = weapons.flatMap((weapon) =>
    collectGrandArchiveCostRules(
      weaponParticipationRuleRequest(
        program,
        state,
        attacker,
        weapon,
        "use-weapon-for-attack",
        intent?.id,
      ),
    ),
  );
  if (!attackRuleEvaluation) throw new Error("Attack rule evaluation requires an attacker");
  const attackPayment = payGrandArchiveContextualCosts(
    [...attackCostRules, ...declareTargetCostRules, ...weaponCostRules].map((rule) => {
      if (!rule.effect.cost) {
        throw new GrandArchiveUnsupportedRuleError(
          `${rule.effect.action} cost rule without a structured cost`,
        );
      }
      return { cost: rule.effect.cost, evaluation: rule.evaluation, payerId: playerId };
    }),
    command,
  );
  const combat: GrandArchiveCombatState = {
    attackerId: attacker.id,
    attackingPlayerId: playerId,
    defendingPlayerIds: [...new Set(targets.map((target) => target.controllerId))],
    targetIds: targets.map((target) => target.id),
    ...(hasCleave ? { cleavePlayerId: command.cleavePlayerId } : {}),
    retaliatorIds: [],
    retaliationOrderConfirmed: false,
    weaponIds,
    intentIds: intents.map((candidate) => candidate.id),
    step: "retaliation",
  };
  const declarationCause = options.effectStackItemId
    ? ({ kind: "stack-item", stackItemId: options.effectStackItemId } as const)
    : ({ kind: "command", move: "declare-attack" } as const);
  const declarationEvents: readonly GrandArchiveProposedEvent[] = [
    {
      type: "attack-declaration-attempted",
      attackerId: attacker.id,
      targetIds: againstIds,
      declared: true,
      actorId: playerId,
      cause: declarationCause,
    },
    ...attackPayment.events,
    ...weaponActionResultEvents(
      weaponParticipations.flatMap((participation) => participation.useWeaponRules),
    ),
    ...loadedCards.map(
      (loadedCard): GrandArchiveProposedEvent => ({
        type: "object-moved",
        objectId: loadedCard.id,
        from: "loaded",
        to: "intent",
        hostId: attacker.id,
        actorId: playerId,
        cause: { kind: "rule", rule: "loaded-card-enters-attack-intent" },
      }),
    ),
    ...(options.resolvedAttack || effectGranted
      ? []
      : [
          {
            type: "object-state-changed" as const,
            objectId: attacker.id,
            state: "rested" as const,
            value: true,
            actorId: playerId,
            cause: declarationCause,
          },
        ]),
    ...weapons.map(
      (weapon): GrandArchiveProposedEvent => ({
        type: "object-state-changed",
        objectId: weapon.id,
        state: "wielded",
        value: true,
        actorId: playerId,
        cause: declarationCause,
      }),
    ),
    {
      type: "object-state-changed",
      objectId: attacker.id,
      state: "attacking",
      value: true,
      actorId: playerId,
      cause: declarationCause,
    },
    ...targets.map(
      (target): GrandArchiveProposedEvent => ({
        type: "object-state-changed",
        objectId: target.id,
        state: "defending",
        value: true,
        actorId: playerId,
        cause: declarationCause,
      }),
    ),
    {
      type: "combat-started",
      combat,
      actorId: playerId,
      cause: declarationCause,
    },
    ...(effectGranted || grandArchiveOpportunityIsSuppressed(state)
      ? []
      : [
          {
            type: "opportunity-opened" as const,
            window: openGrandArchiveOpportunity(state, state.turn.playerId, "phase-begin"),
            cause: { kind: "rule" as const, rule: "retaliation-step-opportunity" },
          },
        ]),
  ];
  if ((state.players[playerId]?.phaseSkips.combat ?? 0) > 0) {
    return [
      {
        type: "phase-skip-consumed",
        playerId,
        phase: "combat",
        actorId: playerId,
        cause: { kind: "rule", rule: "consume-combat-phase-skip" },
      },
    ];
  }
  return declarationEvents;
}

export function grandArchiveRetaliationCandidates(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
): readonly GrandArchiveObjectId[] {
  const combat = state.combat;
  if (!combat) return [];
  const attackComponentIds = [combat.attackerId, ...combat.intentIds, ...combat.weaponIds];
  return Object.values(state.objects).flatMap((object): readonly GrandArchiveObjectId[] => {
    if (
      object.zone !== "field" ||
      object.controllerId === combat.attackingPlayerId ||
      (object.states.has("rested") &&
        !grandArchiveRetaliatorHasSteadfast(program, state, object)) ||
      !isUnit(program, state, object) ||
      (grandArchiveObjectPower(program, state, object) ?? 0) <= 0
    ) {
      return [];
    }
    const isDefender = combat.targetIds.includes(object.id) && object.states.has("defending");
    const hasAmbushPermission =
      !isDefender &&
      !object.states.has("rested") &&
      objectHasKeyword(program, state, object, "ambush");
    const evaluation: GrandArchiveEvaluationContext = {
      program,
      state,
      controllerId: object.controllerId,
      candidateId: object.id,
      bindings: { eventAttacker: [combat.attackerId] },
    };
    const rules = collectGrandArchiveActionRules({
      action: "retaliate",
      activationKind: "card",
      playerId: object.controllerId,
      candidateId: object.id,
      fromZone: "field",
      usingIds: combat.weaponIds,
      againstIds: attackComponentIds,
      evaluation,
    });
    const isAllowed =
      isDefender || hasAmbushPermission || rules.some((rule) => rule.effect.mode === "allow");
    const isForbidden = rules.some((rule) => rule.effect.mode === "forbid");
    return isAllowed && !isForbidden ? [object.id] : [];
  });
}

export function proposeGrandArchiveAttackRedirection(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  previousDefenderId: GrandArchiveObjectId,
  newDefenderId: GrandArchiveObjectId,
  options: {
    readonly requireNewDefenderObedience?: true;
    /** This redirect is the resolution of the Intercept triggered ability. */
    readonly asIntercept?: true;
  } = {},
): readonly GrandArchiveProposedEvent[] {
  const combat = state.combat;
  if (!combat || (combat.step !== "retaliation" && combat.step !== "damage")) {
    throw new Error("There is no attack that can be redirected");
  }
  if (combat.cleavePlayerId) throw new Error("Cleave attacks cannot be redirected");
  if (!combat.targetIds.includes(previousDefenderId) || combat.targetIds.includes(newDefenderId)) {
    throw new Error("Attack redirection does not identify distinct legal defenders");
  }
  const attacker = state.objects[combat.attackerId];
  const previousDefender = state.objects[previousDefenderId];
  const newDefender = state.objects[newDefenderId];
  if (
    !attacker ||
    !newDefender ||
    attacker.zone !== "field" ||
    !attacker.states.has("attacking") ||
    attacker.controllerId !== combat.attackingPlayerId
  ) {
    throw new Error("Attack redirection refers to an object that no longer exists");
  }
  const intents = combat.intentIds.flatMap((intentId) => {
    const intent = state.objects[intentId];
    return intent?.zone === "intent" ? [intent] : [];
  });
  const weapons = combat.weaponIds.flatMap((weaponId) => {
    const weapon = state.objects[weaponId];
    return weapon?.zone === "field" ? [weapon] : [];
  });
  const participants = attackParticipants(state, attacker, intents, weapons);
  const attackComponentIds = [attacker.id, ...combat.intentIds, ...combat.weaponIds];
  if (options.asIntercept) {
    if (attackerHasUnblockable(program, state, attacker)) {
      throw new Error("Unblockable attacks cannot be intercepted");
    }
    const evaluation: GrandArchiveEvaluationContext = {
      program,
      state,
      controllerId: newDefender.controllerId,
      sourceId: newDefender.id,
      abilityBearerId: newDefender.id,
      candidateId: newDefender.id,
      bindings: { eventAttacker: [attacker.id], eventRecipient: [previousDefenderId] },
    };
    const interceptRules = collectGrandArchiveActionRules({
      action: "intercept",
      activationKind: "ability",
      playerId: newDefender.controllerId,
      candidateId: newDefender.id,
      fromZone: newDefender.zone,
      againstIds: attackComponentIds,
      abilityIdentity: { keyword: "intercept" },
      evaluation,
    });
    const redirectRules = collectGrandArchiveActionRules({
      action: "redirect",
      activationKind: "ability",
      playerId: newDefender.controllerId,
      candidateId: newDefender.id,
      fromZone: newDefender.zone,
      againstIds: attackComponentIds,
      abilityIdentity: { keyword: "intercept" },
      evaluation,
    });
    if ([...interceptRules, ...redirectRules].some((rule) => rule.effect.mode === "forbid")) {
      throw new Error("This attack cannot be intercepted");
    }
  }
  const otherDefenders = new Set(
    combat.targetIds.filter((objectId) => objectId !== previousDefenderId),
  );
  if (
    !combat.defendingPlayerIds.includes(newDefender.controllerId) ||
    !legalSingleAttackTarget(
      program,
      state,
      attacker,
      newDefender,
      participants,
      // Taunt governs the initial declaration, not subsequent redirection.
      false,
      otherDefenders,
    ) ||
    (options.requireNewDefenderObedience &&
      !grandArchiveObjectObeysController(program, state, newDefender))
  ) {
    throw new Error("New defender is not a legal redirection target");
  }
  return [
    ...(previousDefender?.states.has("defending")
      ? [
          {
            type: "object-state-changed" as const,
            objectId: previousDefenderId,
            state: "defending" as const,
            value: false,
            cause: { kind: "rule" as const, rule: "attack-redirected" },
          },
        ]
      : []),
    {
      type: "object-state-changed",
      objectId: newDefender.id,
      state: "defending",
      value: true,
      cause: { kind: "rule", rule: "attack-redirected" },
    },
    ...(previousDefender?.states.has("intercepting")
      ? ([
          {
            type: "object-state-changed",
            objectId: previousDefenderId,
            state: "intercepting",
            value: false,
            cause: { kind: "rule", rule: "attack-redirected" },
          },
        ] satisfies readonly GrandArchiveProposedEvent[])
      : []),
    ...(options.asIntercept
      ? ([
          {
            type: "object-state-changed",
            objectId: newDefender.id,
            state: "intercepting",
            value: true,
            cause: { kind: "rule", rule: "intercept-redirect" },
          },
        ] satisfies readonly GrandArchiveProposedEvent[])
      : []),
    {
      type: "combat-defender-redirected",
      previousDefenderId,
      newDefenderId: newDefender.id,
      cause: { kind: "rule", rule: "attack-redirected" },
    },
  ];
}

export function proposeGrandArchiveRetaliationDecision(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
): readonly GrandArchiveProposedEvent[] {
  const combat = state.combat;
  if (!combat || combat.step !== "retaliation") throw new Error("Combat is not in retaliation");
  const candidates = grandArchiveRetaliationCandidates(program, state);
  if (candidates.length === 0) return proposeGrandArchiveDamageOpportunity(state);
  const controllerIds = state.turnOrder.filter((playerId) =>
    candidates.some((id) => state.objects[id]?.controllerId === playerId),
  );
  const controllerId = controllerIds[0];
  if (!controllerId) return proposeGrandArchiveDamageOpportunity(state);
  return [
    {
      type: "decision-created",
      decision: {
        id: grandArchiveDecisionId(`decision-${state.nextDecisionOrdinal}`),
        kind: "choose-retaliators",
        playerId: controllerId,
        candidates: candidates.filter((id) => state.objects[id]?.controllerId === controllerId),
        selectedRetaliatorIds: [],
        remainingControllerIds: controllerIds.slice(1),
        stateVersion: state.stateVersion,
      },
      cause: { kind: "rule", rule: "choose-retaliators" },
    },
  ];
}

export function proposeGrandArchiveDamageOpportunity(
  state: GrandArchiveMatchState,
  retaliatorIds: readonly GrandArchiveObjectId[] = [],
): readonly GrandArchiveProposedEvent[] {
  return [
    {
      type: "combat-step-changed",
      step: "damage",
      retaliatorIds,
      cause: { kind: "rule", rule: "retaliation-complete" },
    },
    ...(grandArchiveOpportunityIsSuppressed(state)
      ? []
      : [
          {
            type: "opportunity-opened" as const,
            window: openGrandArchiveOpportunity(state, state.turn.playerId, "phase-begin"),
            cause: { kind: "rule" as const, rule: "damage-step-opportunity" },
          },
        ]),
  ];
}

export function proposeGrandArchiveCombatDamage(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
): readonly GrandArchiveProposedEvent[] {
  const combat = state.combat;
  if (!combat || combat.step !== "damage") throw new Error("Combat is not in the damage step");
  const damageEvents: GrandArchivePendingCombatDamageEvent[] = [];
  const spentWeaponIds: GrandArchiveObjectId[] = [];
  const attacker = state.objects[combat.attackerId];
  const intents = combat.intentIds.flatMap((intentId) => {
    const intent = state.objects[intentId];
    return intent?.zone === "intent" ? [intent] : [];
  });
  const wieldedWeapons = combat.weaponIds.flatMap((weaponId) => {
    const weapon = state.objects[weaponId];
    return weapon?.zone === "field" && weapon.states.has("wielded") ? [weapon] : [];
  });
  if (
    attacker?.zone === "field" &&
    attacker.controllerId === combat.attackingPlayerId &&
    attacker.states.has("attacking")
  ) {
    const intentPower = intents.reduce(
      (total, intent) => total + (grandArchiveObjectPower(program, state, intent) ?? 0),
      0,
    );
    const weaponPower = wieldedWeapons.reduce(
      (total, weapon) => total + (grandArchiveObjectPower(program, state, weapon) ?? 0),
      0,
    );
    const participants = attackParticipants(state, attacker, intents, wieldedWeapons);
    const combinedObjectPower =
      (grandArchiveCombatDamageStat(program, state, attacker) ?? 0) +
      rangedAttackBonus(program, state, attacker) +
      commandedWillBonus(program, state, attacker, intents) +
      intentPower +
      weaponPower;
    const power = deriveGrandArchiveAttackPower(attacker, combinedObjectPower, {
      program,
      state,
      controllerId: combat.attackingPlayerId,
      sourceId: attacker.id,
      abilityBearerId: attacker.id,
      bindings: {},
    });
    let dealtToDefender = false;
    for (const targetId of combat.targetIds) {
      const target = state.objects[targetId];
      if (
        target?.zone === "field" &&
        target.states.has("defending") &&
        combat.defendingPlayerIds.includes(target.controllerId) &&
        legalSingleAttackTarget(program, state, attacker, target, participants, false)
      ) {
        dealtToDefender = true;
        damageEvents.push({
          recipientId: target.id,
          amount: Math.max(0, power),
          sourceId: attacker.id,
          combatParticipantIds: participants.map((participant) => participant.id),
          actorId: combat.attackingPlayerId,
          causeRule: "combat-damage",
        });
      }
    }
    if (dealtToDefender) {
      for (const weapon of wieldedWeapons) {
        spentWeaponIds.push(weapon.id);
      }
    }
  }
  for (const retaliatorId of combat.retaliatorIds) {
    const retaliator = state.objects[retaliatorId];
    if (retaliator?.zone !== "field" || !retaliator.states.has("retaliating")) continue;
    if (attacker?.zone !== "field") continue;
    const retortBonus = keywordInstances(program, state, retaliator).reduce((total, instance) => {
      const keyword = instance.keyword;
      if (keyword.name !== "retort") return total;
      return total + evaluateGrandArchiveActiveKeywordAmount(instance, keyword.value);
    }, 0);
    damageEvents.push({
      recipientId: attacker.id,
      amount: Math.max(
        0,
        (grandArchiveCombatDamageStat(program, state, retaliator) ?? 0) + retortBonus,
      ),
      sourceId: retaliator.id,
      combatParticipantIds: [retaliator.id],
      actorId: retaliator.controllerId,
      causeRule: "retaliation-combat-damage",
    });
  }
  return [
    ...damageEvents
      .filter((pending) => pending.amount > 0)
      .map((pending) => proposedDamageEvent(pending, pending.amount)),
    ...spentWeaponIds.map(
      (objectId): GrandArchiveProposedEvent => ({
        type: "counter-changed",
        objectId,
        counter: "durability",
        delta: -1,
        actorId: combat.attackingPlayerId,
        cause: { kind: "rule", rule: "wielded-weapon-durability" },
      }),
    ),
    {
      type: "combat-step-changed",
      step: "end",
      cause: { kind: "rule", rule: "combat-damage-complete" },
    },
  ];
}

function proposedDamageEvent(
  pending: GrandArchivePendingCombatDamageEvent,
  amount: number,
): GrandArchiveProposedEvent {
  return {
    type: "damage-marked",
    objectId: pending.recipientId,
    amount,
    sourceId: pending.sourceId,
    combatDamage: true,
    combatParticipantIds: pending.combatParticipantIds,
    actorId: pending.actorId,
    cause: { kind: "rule", rule: pending.causeRule },
  };
}

export function proposeGrandArchiveCombatCleanup(
  state: GrandArchiveMatchState,
  options: { readonly suppressOpportunity?: true } = {},
): readonly GrandArchiveProposedEvent[] {
  const combat = state.combat;
  if (!combat || combat.step !== "end") throw new Error("Combat is not ready for cleanup");
  const roleIds = new Set([
    combat.attackerId,
    ...combat.targetIds,
    ...combat.retaliatorIds,
    ...combat.weaponIds,
  ]);
  const events: GrandArchiveProposedEvent[] = [];
  for (const objectId of roleIds) {
    const object = state.objects[objectId];
    if (!object) continue;
    for (const role of [
      "attacking",
      "defending",
      "intercepting",
      "retaliating",
      "wielded",
    ] as const) {
      if (object.states.has(role)) {
        events.push({
          type: "object-state-changed",
          objectId,
          state: role,
          value: false,
          cause: { kind: "rule", rule: "combat-cleanup" },
        });
      }
    }
  }
  for (const intentId of combat.intentIds) {
    const intent = state.objects[intentId];
    if (intent?.zone === "intent") {
      events.push({
        type: "object-moved",
        objectId: intent.id,
        from: "intent",
        to: intent.states.has("ephemeral") ? "banishment" : "graveyard",
        cause: {
          kind: "rule",
          rule: intent.states.has("ephemeral")
            ? "ephemeral-combat-intent-cleanup"
            : "combat-intent-cleanup",
        },
      });
    }
  }
  events.push({
    type: "combat-ended",
    cause: { kind: "rule", rule: "combat-cleanup-complete" },
  });
  if (!options.suppressOpportunity && !grandArchiveOpportunityIsSuppressed(state)) {
    events.push({
      type: "opportunity-opened",
      window: openGrandArchiveOpportunity(state, state.turn.playerId, "phase-begin"),
      cause: { kind: "rule", rule: "return-to-main-after-combat" },
    });
  }
  return events;
}
