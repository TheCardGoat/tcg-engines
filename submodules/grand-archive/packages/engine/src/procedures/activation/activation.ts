import type {
  GrandArchiveAbilityCost,
  GrandArchiveCardResolution,
  GrandArchiveEffect,
  GrandArchiveExecutableAbility,
  GrandArchiveKeyword,
  GrandArchiveModeDeclaration,
  GrandArchiveModeEffect,
  GrandArchiveResolutionChoice,
  GrandArchiveSelectionCount,
  GrandArchiveTargetDeclaration,
  GrandArchiveVariableDeclaration,
} from "@tcg/grand-archive-types";
import {
  deriveGrandArchiveCharacteristics,
  deriveGrandArchiveNumericProperty,
  grandArchiveObjectCurrentCharacteristics,
  grandArchiveObjectTimestamp,
} from "../../rules/state/continuous.ts";
import {
  flattenGrandArchiveAbilities,
  grandArchiveAbilityExecutionObject,
  grandArchiveAbilityIsFunctional,
  grandArchiveCardIsObject,
  grandArchiveEffectPerformsAsSpell,
  grandArchiveObjectFace,
} from "../../game/card-runtime.ts";
import type { GrandArchiveCommand } from "../../commands/commands.ts";
import {
  assertGrandArchiveReservePaymentDistinct,
  payGrandArchiveAbilityCost,
  payGrandArchiveReserveCost,
} from "./costs.ts";
import type { GrandArchiveEventMeta, GrandArchiveProposedEvent } from "../../kernel/events.ts";
import { grandArchivePlayerEnabledElements } from "../../game/elements.ts";
import {
  deriveGrandArchivePlayerProperty,
  evaluateGrandArchiveAmount,
  evaluateGrandArchiveCondition,
  grandArchiveDefinitionMatchesCardFilter,
  matchesGrandArchiveCardFilter,
  resolveGrandArchivePlayers,
  resolveGrandArchiveSubjectObjects,
  GrandArchiveUnsupportedRuleError,
  type GrandArchiveEvaluationContext,
  type GrandArchiveExecutionBinding,
} from "../effects/evaluation.ts";
import { grandArchiveStackItemId } from "../../game/identity.ts";
import type {
  GrandArchiveObjectId,
  GrandArchivePlayerId,
  GrandArchiveTargetId,
} from "../../game/identity.ts";
import {
  evaluateGrandArchiveActiveKeywordAmount,
  grandArchiveObjectActiveAbilities,
  grandArchiveObjectActiveKeywordInstances,
  grandArchiveObjectActiveKeywords,
  grandArchiveObjectHasActiveKeyword,
  grandArchivePlayerControlsActiveKeyword,
  type GrandArchiveActiveKeywordInstance,
} from "../../rules/abilities/intrinsic-keywords.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { grandArchiveLinkTargetDeclaration } from "../../game/link.ts";
import type { GrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type {
  GrandArchiveActivationPaymentRecord,
  GrandArchiveCardInstance,
  GrandArchiveDeclaredTarget,
  GrandArchiveMatchState,
  GrandArchiveStackItem,
} from "../../game/model.ts";
import { grandArchiveObjectObeysController } from "../../game/obedience.ts";
import {
  grandArchiveOpportunityIsSuppressed,
  openGrandArchiveOpportunity,
} from "../game-flow/opportunity.ts";
import {
  captureGrandArchiveCardResolutionAbilities,
  composeGrandArchiveCardResolution,
} from "./play-restrictions.ts";
import { grandArchivePlayerHasState } from "../../rules/state/player-continuous.ts";
import { applyGrandArchivePaymentContributions } from "./payment-contributions.ts";
import { shuffleGrandArchiveObjects } from "../../game/random.ts";
import {
  collectGrandArchiveActionRules,
  collectGrandArchiveCostRules,
  collectGrandArchivePaymentContributionRules,
  combineGrandArchiveCosts,
  grandArchiveRuleModificationAppliesToRequest,
  grandArchiveRemainingPlayerActionAllowance,
  type GrandArchiveAppliedRule,
  type GrandArchiveRuleRequest,
} from "../../rules/state/rule-modifications.ts";
import { grandArchivePlayerZoneObjectIds } from "../../game/zone-ownership.ts";

type ActivateCardCommand = Extract<GrandArchiveCommand, { readonly move: "activate-card" }>;
type ActivateAbilityCommand = Extract<GrandArchiveCommand, { readonly move: "activate-ability" }>;
type MaterializeCommand = Extract<GrandArchiveCommand, { readonly move: "materialize" }>;
type BestowBoonCommand = Extract<GrandArchiveCommand, { readonly move: "bestow-boon" }>;
type AlternativeActivationKeyword = Extract<
  GrandArchiveKeyword,
  { readonly name: "ephemerate" | "starcalling" }
>;
type BrewKeyword = Extract<GrandArchiveKeyword, { readonly name: "brew" }>;
type KindleKeyword = GrandArchiveKeyword & {
  readonly name: "kindle";
  readonly value: import("@tcg/grand-archive-types").GrandArchiveAmount;
};

type CapturedCardResolutionAbility = Readonly<{
  ability: GrandArchiveCardResolution;
  enabled: boolean;
}>;

function capturedRestrictionStateChanged(
  before: readonly CapturedCardResolutionAbility[],
  after: readonly CapturedCardResolutionAbility[],
): boolean {
  return (
    before.length !== after.length ||
    before.some(
      (entry, index) =>
        entry.ability.id !== after[index]?.ability.id || entry.enabled !== after[index]?.enabled,
    )
  );
}

function sameAnnouncementDeclaration(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function cardResolutionActivationCostRules(
  resolution: GrandArchiveCardResolution | undefined,
  card: GrandArchiveCardInstance,
  request: GrandArchiveRuleRequest,
  evaluation: GrandArchiveEvaluationContext,
): readonly GrandArchiveAppliedRule[] {
  if (!resolution) return [];
  return (resolution.activationRules ?? []).flatMap(
    (effect, index): readonly GrandArchiveAppliedRule[] => {
      if (effect.action !== "activate") {
        throw new GrandArchiveUnsupportedRuleError(
          `card-resolution activation rule for ${effect.action}`,
        );
      }
      if (
        effect.mode !== "modify-cost" &&
        effect.mode !== "replace-cost" &&
        effect.mode !== "add-cost"
      ) {
        throw new GrandArchiveUnsupportedRuleError(
          `card-resolution activation rule mode ${effect.mode}`,
        );
      }
      const sourceEvaluation: GrandArchiveEvaluationContext = {
        ...evaluation,
        controllerId: request.playerId,
        sourceId: card.id,
        abilityBearerId: card.id,
        candidateId: card.id,
      };
      if (!grandArchiveRuleModificationAppliesToRequest(effect, request, sourceEvaluation)) {
        return [];
      }
      return [
        {
          id: `card-resolution:${card.id}:${resolution.id}:${index}`,
          effect,
          evaluation: sourceEvaluation,
          timestamp: grandArchiveObjectTimestamp(card, sourceEvaluation),
          order: index,
        },
      ];
    },
  );
}
type ImbueKeyword = Extract<GrandArchiveKeyword, { readonly name: "imbue" }>;
type ImbueKeywordInstance = GrandArchiveActiveKeywordInstance & {
  readonly keyword: ImbueKeyword;
};
type ActivatedAbilityCostModifier = NonNullable<
  Extract<GrandArchiveExecutableAbility, { readonly kind: "activated" }>["costModifiers"]
>[number];

function activatedAbilityLimitUsageKey(
  state: GrandArchiveMatchState,
  source: GrandArchiveCardInstance,
  ability: Extract<GrandArchiveExecutableAbility, { readonly kind: "activated" }>,
): string | undefined {
  if (!ability.limit) return undefined;
  const abilityKey = `object:${source.id}:${source.incarnation}:ability:${ability.id}`;
  switch (ability.limit.per) {
    case "source-instance":
      return `${abilityKey}:source-instance`;
    case "turn":
      return `${abilityKey}:turn:${state.turn.number}`;
    case "game":
      return `${abilityKey}:game`;
    default:
      return assertNever(ability.limit.per);
  }
}

function assertActivatedAbilityLimitAvailable(
  state: GrandArchiveMatchState,
  source: GrandArchiveCardInstance,
  ability: Extract<GrandArchiveExecutableAbility, { readonly kind: "activated" }>,
): string | undefined {
  if (!ability.limit) return undefined;
  if (ability.limit.whoseTurn === "controller" && state.turn.playerId !== source.controllerId) {
    throw new Error("Activated ability is limited to its controller's turn");
  }
  const usageKey = activatedAbilityLimitUsageKey(state, source, ability);
  const used = state.eventHistory.filter(
    (event) =>
      event.type === "stack-item-added" &&
      event.cause?.kind === "command" &&
      event.cause.move === "activate-ability" &&
      event.item.kind === "activated-ability" &&
      event.item.activationLimitUsageKey === usageKey,
  ).length;
  if (used >= ability.limit.count) {
    throw new Error("Activated ability usage limit has been reached");
  }
  return usageKey;
}

function activationPaymentRecords(
  events: readonly GrandArchiveProposedEvent[],
): readonly GrandArchiveActivationPaymentRecord[] {
  const records = events.flatMap((event): readonly GrandArchiveActivationPaymentRecord[] => {
    if (!("objectId" in event)) return [];
    return [
      {
        objectId: event.objectId,
        ...(event.type === "object-moved" ? { from: event.from, to: event.to } : {}),
      },
    ];
  });
  return records.filter(
    (record, index) =>
      records.findIndex(
        (candidate) =>
          candidate.objectId === record.objectId &&
          candidate.from === record.from &&
          candidate.to === record.to,
      ) === index,
  );
}

function assertIndependentPaymentSourcesDistinct(
  groups: readonly (readonly GrandArchiveProposedEvent[])[],
): void {
  const used = new Set<GrandArchiveObjectId>();
  for (const group of groups) {
    const groupIds = new Set(activationPaymentRecords(group).map((record) => record.objectId));
    for (const objectId of groupIds) {
      if (used.has(objectId)) {
        throw new Error(`Object ${objectId} cannot pay more than one independent cost source`);
      }
      used.add(objectId);
    }
  }
}

function isAlternativeActivationKeyword(
  keyword: GrandArchiveKeyword,
): keyword is AlternativeActivationKeyword {
  return keyword.name === "ephemerate" || keyword.name === "starcalling";
}

export interface GrandArchiveCardActivationContext {
  readonly starcalling?: {
    readonly cardIds: readonly GrandArchiveObjectId[];
    readonly grantedKeyword?: GrandArchiveKeyword;
  };
  readonly effect?: {
    readonly payCosts?: boolean;
    readonly ignoreElementRequirements?: boolean;
    readonly speed?: "fast" | "slow";
    readonly costModifiers?: readonly {
      readonly operation: "add" | "subtract" | "set";
      readonly amount: import("@tcg/grand-archive-types").GrandArchiveAmount;
    }[];
  };
}

export interface GrandArchiveActivationProposal {
  readonly events: readonly GrandArchiveProposedEvent[];
  readonly stackItem: GrandArchiveStackItem;
}

export interface GrandArchiveMaterializationContext {
  readonly kind: "effect";
  /** Whether the effect's materializer pays the card's costs. Defaults to true. */
  readonly payCosts?: boolean;
  readonly ignoreElementRequirements?: boolean;
  readonly costModifiers?: readonly {
    readonly operation: "add" | "subtract" | "set";
    readonly amount: import("@tcg/grand-archive-types").GrandArchiveAmount;
  }[];
}

function effectiveAlternativeActivationCost(
  keyword: AlternativeActivationKeyword,
  evaluation: GrandArchiveEvaluationContext,
): GrandArchiveAbilityCost {
  const modifiers = (keyword.costModifiers ?? []).filter(
    (modifier) =>
      !modifier.condition || evaluateGrandArchiveCondition(modifier.condition, evaluation),
  );
  if (modifiers.length === 0) return keyword.cost;
  if (keyword.cost.kind !== "pay-reserve") {
    throw new GrandArchiveUnsupportedRuleError(`${keyword.name} modifiers on a non-reserve cost`);
  }
  const setModifiers = modifiers.filter((modifier) => modifier.operation === "set");
  if (setModifiers.length > 1) {
    throw new GrandArchiveUnsupportedRuleError(`multiple ${keyword.name} cost-setting modifiers`);
  }
  const base =
    setModifiers.length === 1
      ? evaluateGrandArchiveAmount(setModifiers[0]!.amount, evaluation)
      : evaluateGrandArchiveAmount(keyword.cost.amount, evaluation);
  const additive = modifiers.reduce((total, modifier) => {
    if (modifier.operation === "set") return total;
    const amount = evaluateGrandArchiveAmount(modifier.amount, evaluation);
    return total + (modifier.operation === "add" ? amount : -amount);
  }, 0);
  return { kind: "pay-reserve", amount: Math.max(0, base + additive) };
}

function effectGrantedNumericCostModification(
  modifiers:
    | NonNullable<GrandArchiveCardActivationContext["effect"]>["costModifiers"]
    | GrandArchiveMaterializationContext["costModifiers"],
  evaluation: GrandArchiveEvaluationContext,
): { readonly setTo?: number; readonly adjustment: number } {
  const active = modifiers ?? [];
  const setters = active.filter((modifier) => modifier.operation === "set");
  if (setters.length > 1) {
    throw new GrandArchiveUnsupportedRuleError(
      "multiple effect-granted activation cost-setting modifiers",
    );
  }
  const setTo = setters[0] ? evaluateGrandArchiveAmount(setters[0].amount, evaluation) : undefined;
  const adjustment = active.reduce((total, modifier) => {
    if (modifier.operation === "set") return total;
    const value = evaluateGrandArchiveAmount(modifier.amount, evaluation);
    return total + (modifier.operation === "add" ? value : -value);
  }, 0);
  return {
    ...(setTo !== undefined ? { setTo } : {}),
    adjustment,
  };
}

function effectiveActivatedAbilityCost(
  cost: GrandArchiveAbilityCost,
  modifiers: readonly ActivatedAbilityCostModifier[] | undefined,
  evaluation: GrandArchiveEvaluationContext,
  rules: readonly GrandArchiveAppliedRule[] = [],
): GrandArchiveAbilityCost {
  const active = (modifiers ?? []).filter(
    (modifier) =>
      !modifier.condition || evaluateGrandArchiveCondition(modifier.condition, evaluation),
  );
  const ruleModifiers = rules.filter(
    (rule) =>
      rule.effect.mode === "modify-cost" &&
      (!rule.effect.costKind || rule.effect.costKind === "reserve") &&
      (!rule.effect.costComponent || rule.effect.costComponent === "activation"),
  );
  if (active.length === 0 && ruleModifiers.length === 0) return cost;
  const setters = [
    ...active
      .filter((modifier) => modifier.operation === "set")
      .map((modifier) => ({ amount: modifier.amount, evaluation })),
    ...ruleModifiers.flatMap((rule) =>
      rule.effect.costOperation === "set" && rule.effect.amount !== undefined
        ? [{ amount: rule.effect.amount, evaluation: rule.evaluation }]
        : [],
    ),
  ];
  let reserveComponents = 0;
  const modify = (current: GrandArchiveAbilityCost): GrandArchiveAbilityCost => {
    switch (current.kind) {
      case "pay-reserve": {
        reserveComponents += 1;
        const printed = evaluateGrandArchiveAmount(current.amount, evaluation);
        const setter = setters.at(-1);
        const starting = setter
          ? evaluateGrandArchiveAmount(setter.amount, setter.evaluation)
          : printed;
        const printedAdjustment = active.reduce((total, modifier) => {
          if (modifier.operation === "set") return total;
          const amount = evaluateGrandArchiveAmount(modifier.amount, evaluation);
          return total + (modifier.operation === "add" ? amount : -amount);
        }, 0);
        const ruleAdjustment = ruleModifiers.reduce((total, rule) => {
          const effect = rule.effect;
          if (effect.costOperation === "set") return total;
          if (!effect.costOperation || effect.amount === undefined) {
            throw new GrandArchiveUnsupportedRuleError(
              "incomplete activated-ability cost modifier",
            );
          }
          const amount = evaluateGrandArchiveAmount(effect.amount, rule.evaluation);
          return total + (effect.costOperation === "add" ? amount : -amount);
        }, 0);
        return {
          ...current,
          amount: Math.max(0, starting + printedAdjustment + ruleAdjustment),
        };
      }
      case "all": {
        const [first, ...rest] = current.costs;
        return { kind: "all", costs: [modify(first), ...rest.map(modify)] };
      }
      case "one-of":
        throw new GrandArchiveUnsupportedRuleError(
          "activated-ability cost modifiers across alternative costs",
        );
      default:
        return current;
    }
  };
  const modified = modify(cost);
  if (reserveComponents !== 1) {
    throw new GrandArchiveUnsupportedRuleError(
      `activated-ability modifiers require one reserve cost, found ${reserveComponents}`,
    );
  }
  return modified;
}

function numericCostAfterRules(
  base: number,
  costKind: "memory" | "reserve",
  costComponent: "activation" | "materialization",
  rules: readonly GrandArchiveAppliedRule[],
  builtInAdjustment = 0,
): number {
  const modifiers = rules.filter(
    (rule) =>
      rule.effect.mode === "modify-cost" &&
      (!rule.effect.costKind || rule.effect.costKind === costKind) &&
      (!rule.effect.costComponent || rule.effect.costComponent === costComponent),
  );
  const setter = modifiers.filter((rule) => rule.effect.costOperation === "set").at(-1);
  const starting =
    setter?.effect.amount === undefined
      ? base
      : evaluateGrandArchiveAmount(setter.effect.amount, setter.evaluation);
  const adjustment = modifiers.reduce((total, rule) => {
    const effect = rule.effect;
    if (effect.costOperation === "set") return total;
    if (!effect.costOperation || effect.amount === undefined) {
      throw new GrandArchiveUnsupportedRuleError("incomplete numeric cost modifier");
    }
    const amount = evaluateGrandArchiveAmount(effect.amount, rule.evaluation);
    return total + (effect.costOperation === "add" ? amount : -amount);
  }, builtInAdjustment);
  return Math.max(0, starting + adjustment);
}

function replacementCostFromRules(
  base: GrandArchiveAbilityCost | undefined,
  mandatoryRules: readonly GrandArchiveAppliedRule[],
  optionalRules: readonly GrandArchiveAppliedRule[],
): GrandArchiveAbilityCost | undefined {
  const mandatory = mandatoryRules.flatMap((rule): readonly GrandArchiveAbilityCost[] => {
    if (rule.effect.mode !== "replace-cost") return [];
    if (!rule.effect.cost) {
      throw new GrandArchiveUnsupportedRuleError("replacement cost without a cost");
    }
    return [rule.effect.cost];
  });
  const optional = optionalRules.flatMap((rule): readonly GrandArchiveAbilityCost[] => {
    if (rule.effect.mode !== "replace-cost") return [];
    if (!rule.effect.cost) {
      throw new GrandArchiveUnsupportedRuleError("optional replacement cost without a cost");
    }
    return [rule.effect.cost];
  });
  const choices = mandatory.length > 0 ? mandatory : base ? [base, ...optional] : optional;
  const [first, second, ...rest] = choices;
  if (!first) return undefined;
  return second ? { kind: "one-of", costs: [first, second, ...rest] } : first;
}

function selectedReplacementRule(
  baseCostExists: boolean,
  mandatoryRules: readonly GrandArchiveAppliedRule[],
  optionalRules: readonly GrandArchiveAppliedRule[],
  costOptionIndex: number | undefined,
): GrandArchiveAppliedRule | undefined {
  const mandatory = mandatoryRules.filter((rule) => rule.effect.mode === "replace-cost");
  const optional = optionalRules.filter((rule) => rule.effect.mode === "replace-cost");
  const index = costOptionIndex ?? 0;
  if (mandatory.length > 0) return mandatory[index];
  return optional[baseCostExists ? index - 1 : index];
}

interface GrandArchiveCardActivationResult {
  readonly entryStateChanges: readonly {
    readonly state: import("@tcg/grand-archive-types").GrandArchiveObjectState;
    readonly value: boolean;
  }[];
  readonly afterResolutionEffects: readonly GrandArchiveEffect[];
}

function activationResultFromRules(
  rules: readonly GrandArchiveAppliedRule[],
): GrandArchiveCardActivationResult {
  return {
    entryStateChanges: rules.flatMap((rule) => {
      const entryState = rule.effect.activationResult?.entryState;
      return entryState ? [entryState] : [];
    }),
    afterResolutionEffects: rules.flatMap((rule) => {
      const afterResolution = rule.effect.activationResult?.afterResolution;
      return afterResolution ? [afterResolution] : [];
    }),
  };
}

function addedCostsFromRules(
  rules: readonly GrandArchiveAppliedRule[],
): readonly GrandArchiveAbilityCost[] {
  return rules.flatMap((rule): readonly GrandArchiveAbilityCost[] => {
    if (rule.effect.mode !== "add-cost") return [];
    if (!rule.effect.cost) {
      throw new GrandArchiveUnsupportedRuleError("additional cost rule without a cost");
    }
    return [rule.effect.cost];
  });
}

function assertActionRuleLegality(
  rules: readonly GrandArchiveAppliedRule[],
  actionLabel: string,
): void {
  if (rules.some((rule) => rule.effect.mode === "forbid")) {
    throw new Error(`${actionLabel} is forbidden by an active rule`);
  }
  for (const rule of rules) {
    if (rule.effect.mode !== "require") continue;
    const conditionSatisfied =
      !rule.effect.condition ||
      evaluateGrandArchiveCondition(rule.effect.condition, rule.evaluation);
    const destination = rule.evaluation.candidateId
      ? rule.evaluation.state.objects[rule.evaluation.candidateId]
      : undefined;
    const destinationSatisfied =
      !rule.effect.destinationFilter ||
      (destination !== undefined &&
        matchesGrandArchiveCardFilter(destination, rule.effect.destinationFilter, {
          ...rule.evaluation,
          candidateId: destination.id,
        }));
    if (!rule.effect.condition && !rule.effect.destinationFilter) {
      throw new GrandArchiveUnsupportedRuleError(
        `${actionLabel} requirement without an executable condition or destination filter`,
      );
    }
    if (!conditionSatisfied || !destinationSatisfied) {
      throw new Error(`${actionLabel} does not satisfy an active requirement`);
    }
  }
}

function assertPlayerCanPlayCard(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
): void {
  if (
    grandArchiveRemainingPlayerActionAllowance({
      action: "play",
      playerId,
      evaluation: { program, state, controllerId: playerId, bindings: {} },
    }) <= 0
  ) {
    throw new Error("Player has reached their card play limit for this turn");
  }
}

export function ruleGrantsPermissionToPlayer(
  rule: GrandArchiveAppliedRule,
  playerId: GrandArchivePlayerId,
): boolean {
  if (rule.effect.mode !== "allow") return false;
  return (
    rule.effect.actor !== undefined ||
    rule.effect.subject?.kind === "player" ||
    rule.evaluation.controllerId === playerId
  );
}

export function grandArchiveChampionLevelUpRequirements(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  candidate: GrandArchiveCardInstance,
  currentChampion: GrandArchiveCardInstance,
): { readonly nextBaseLevel: boolean; readonly lineageSatisfied: boolean } {
  const candidateFace = grandArchiveObjectFace(program, candidate);
  const currentFace = grandArchiveObjectFace(program, currentChampion);
  const restrictions = grandArchiveObjectActiveKeywords(program, state, candidate).filter(
    (keyword): keyword is Extract<GrandArchiveKeyword, { readonly name: "lineage" }> =>
      keyword.name === "lineage",
  );
  return {
    // Champion / Leveling Up 2: use printed levels, not level modifiers.
    // Lineage is an explicit restriction keyword, never an implicit name match.
    nextBaseLevel:
      currentFace.stats.level !== undefined &&
      candidateFace.stats.level === currentFace.stats.level + 1,
    lineageSatisfied: restrictions.every(
      (keyword) =>
        keyword.lineageName === currentFace.lineageName || keyword.lineageName === currentFace.name,
    ),
  };
}

export function grandArchiveLevelUpCandidates(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  champion: GrandArchiveCardInstance,
  evaluation: GrandArchiveEvaluationContext,
): readonly GrandArchiveCardInstance[] {
  if (champion.zone !== "field") return [];
  const playerId = champion.controllerId;
  if (
    !grandArchiveObjectCurrentCharacteristics(program, state, champion).types.includes("CHAMPION")
  ) {
    return [];
  }
  return state.zones[playerId]["material-deck"].flatMap((cardId) => {
    const card = state.objects[cardId];
    if (!card) return [];
    if (
      !grandArchiveObjectCurrentCharacteristics(program, state, card).types.includes("CHAMPION")
    ) {
      return [];
    }
    const levelEvaluation: GrandArchiveEvaluationContext = {
      ...evaluation,
      state,
      controllerId: playerId,
      sourceId: champion.id,
      abilityBearerId: champion.id,
      candidateId: card.id,
    };
    const levelUpRules = collectGrandArchiveActionRules({
      action: "level-up",
      activationKind: "card",
      playerId,
      candidateId: champion.id,
      destinationId: card.id,
      fromZone: champion.zone,
      evaluation: levelEvaluation,
    });
    try {
      assertActionRuleLegality(levelUpRules, "Champion level-up");
    } catch (error) {
      if (error instanceof GrandArchiveUnsupportedRuleError) throw error;
      return [];
    }
    const requirements = grandArchiveChampionLevelUpRequirements(program, state, card, champion);
    const hasPermission = levelUpRules.some((rule) => ruleGrantsPermissionToPlayer(rule, playerId));
    return requirements.lineageSatisfied && (requirements.nextBaseLevel || hasPermission)
      ? [card]
      : [];
  });
}

function normalizedBrewCharacteristic(value: string): string {
  return value.trim().toLocaleLowerCase("en-US");
}

function brewIngredientMatchesRequirement(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  objectId: GrandArchiveObjectId,
  requirement: BrewKeyword["requirements"][number],
): boolean {
  const object = state.objects[objectId];
  if (!object) return false;
  const characteristics = grandArchiveObjectCurrentCharacteristics(program, state, object);
  const expected = normalizedBrewCharacteristic(requirement.value);
  return requirement.kind === "name"
    ? characteristics.names.some((name) => normalizedBrewCharacteristic(name) === expected)
    : characteristics.subtypes.some(
        (subtype) => normalizedBrewCharacteristic(subtype) === expected,
      );
}

function brewRequirementsCanAssign(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  ingredientIds: readonly GrandArchiveObjectId[],
  slots: readonly BrewKeyword["requirements"][number][],
  slotIndex = 0,
  used = new Set<GrandArchiveObjectId>(),
): boolean {
  if (slotIndex === slots.length) return used.size === ingredientIds.length;
  const slot = slots[slotIndex]!;
  for (const ingredientId of ingredientIds) {
    if (
      used.has(ingredientId) ||
      !brewIngredientMatchesRequirement(program, state, ingredientId, slot)
    ) {
      continue;
    }
    used.add(ingredientId);
    if (brewRequirementsCanAssign(program, state, ingredientIds, slots, slotIndex + 1, used)) {
      return true;
    }
    used.delete(ingredientId);
  }
  return false;
}

function brewPaymentEvents(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  keyword: BrewKeyword,
  ingredientIds: readonly GrandArchiveObjectId[],
  evaluation: GrandArchiveEvaluationContext,
): readonly GrandArchiveProposedEvent[] {
  if (new Set(ingredientIds).size !== ingredientIds.length) {
    throw new Error("A Brew ingredient cannot be sacrificed more than once");
  }
  const slots = keyword.requirements.flatMap((requirement) => {
    const count = evaluateGrandArchiveAmount(requirement.count, evaluation);
    if (!Number.isInteger(count) || count < 0) {
      throw new Error("A Brew ingredient count must be a non-negative integer");
    }
    return Array.from({ length: count }, () => requirement);
  });
  if (ingredientIds.length !== slots.length) {
    throw new Error(`Brew requires exactly ${slots.length} ingredients`);
  }
  const ingredients = ingredientIds.map((objectId) => {
    const object = state.objects[objectId];
    if (!object || object.controllerId !== playerId || object.zone !== "field") {
      throw new Error("Brew ingredients must be controlled objects on the field");
    }
    if (grandArchiveObjectHasActiveKeyword(program, state, object, "immortality")) {
      throw new Error("An object with Immortality cannot be sacrificed to Brew");
    }
    return object;
  });
  const ingredientNames = ingredients.map((object) =>
    normalizedBrewCharacteristic(
      grandArchiveObjectCurrentCharacteristics(program, state, object).names[0]!,
    ),
  );
  if (
    keyword.nameConstraint === "same" &&
    ingredientNames.some((name) => name !== ingredientNames[0])
  ) {
    throw new Error("This Brew cost requires ingredients with the same name");
  }
  if (
    keyword.nameConstraint === "different" &&
    new Set(ingredientNames).size !== ingredientNames.length
  ) {
    throw new Error("This Brew cost requires ingredients with different names");
  }
  if (!brewRequirementsCanAssign(program, state, ingredientIds, slots)) {
    throw new Error("The selected objects do not satisfy the Brew ingredient list");
  }
  return ingredients.map((object) => {
    const characteristics = grandArchiveObjectCurrentCharacteristics(program, state, object);
    return {
      type: "object-moved" as const,
      objectId: object.id,
      from: "field" as const,
      to:
        characteristics.supertypes.includes("REGALIA") || characteristics.types.includes("CHAMPION")
          ? ("banishment" as const)
          : ("graveyard" as const),
      actorId: playerId,
      cause: { kind: "rule" as const, rule: "pay-brew-alternative-cost" },
    };
  });
}

export function grandArchiveTargetingContext(
  kind: NonNullable<GrandArchiveEvaluationContext["targeting"]>["kind"],
  sourceSubtypes: readonly string[],
  effects: readonly (GrandArchiveEffect | undefined)[],
  explicitlySpell = false,
): NonNullable<GrandArchiveEvaluationContext["targeting"]> {
  return {
    kind,
    sourceIsSpell:
      explicitlySpell ||
      sourceSubtypes.includes("SPELL") ||
      effects.some(grandArchiveEffectPerformsAsSpell),
  };
}

function isSlowTimingLegal(state: GrandArchiveMatchState, playerId: GrandArchivePlayerId): boolean {
  return (
    state.turn.playerId === playerId && state.turn.phase === "main" && state.stack.length === 0
  );
}

function selectionCountBounds(
  declaration: { readonly count: GrandArchiveSelectionCount },
  evaluation: GrandArchiveEvaluationContext,
): { readonly minimum: number; readonly maximum: number } {
  switch (declaration.count.kind) {
    case "exactly": {
      const amount = evaluateGrandArchiveAmount(declaration.count.amount, evaluation);
      return { minimum: amount, maximum: amount };
    }
    case "up-to":
      return {
        minimum: 0,
        maximum: evaluateGrandArchiveAmount(declaration.count.amount, evaluation),
      };
    case "at-least":
      return {
        minimum: evaluateGrandArchiveAmount(declaration.count.amount, evaluation),
        maximum: Number.POSITIVE_INFINITY,
      };
    case "between":
      return {
        minimum: evaluateGrandArchiveAmount(declaration.count.minimum, evaluation),
        maximum: evaluateGrandArchiveAmount(declaration.count.maximum, evaluation),
      };
    case "all":
    case "any-number":
      return { minimum: 0, maximum: Number.POSITIVE_INFINITY };
    case "conditional":
      return selectionCountBounds(
        {
          ...declaration,
          count: evaluateGrandArchiveCondition(declaration.count.condition, evaluation)
            ? declaration.count.then
            : declaration.count.else,
        },
        evaluation,
      );
    default:
      return assertNever(declaration.count);
  }
}

export { selectionCountBounds as grandArchiveSelectionCountBounds };

function selectionCountRequiresAll(
  declaration: { readonly count: GrandArchiveSelectionCount },
  evaluation: GrandArchiveEvaluationContext,
): boolean {
  if (declaration.count.kind === "all") return true;
  if (declaration.count.kind !== "conditional") return false;
  return selectionCountRequiresAll(
    {
      count: evaluateGrandArchiveCondition(declaration.count.condition, evaluation)
        ? declaration.count.then
        : declaration.count.else,
    },
    evaluation,
  );
}

function exactSelectionCount(
  declaration: { readonly count: GrandArchiveSelectionCount },
  evaluation: GrandArchiveEvaluationContext,
): number | undefined {
  if (declaration.count.kind === "exactly") {
    return evaluateGrandArchiveAmount(declaration.count.amount, evaluation);
  }
  if (declaration.count.kind !== "conditional") return undefined;
  return exactSelectionCount(
    {
      count: evaluateGrandArchiveCondition(declaration.count.condition, evaluation)
        ? declaration.count.then
        : declaration.count.else,
    },
    evaluation,
  );
}

export interface GrandArchiveAnnouncementModes {
  readonly choose: GrandArchiveSelectionCount;
  readonly allowRepeat?: boolean;
  readonly random?: boolean;
  readonly modes: readonly GrandArchiveModeEffect[];
  readonly tracking?: {
    readonly objectId: GrandArchiveObjectId;
    readonly key: string;
    readonly previouslyChosenIds: readonly string[];
  };
}

export interface GrandArchiveDeclaredModes {
  readonly ids: readonly string[];
  readonly modes: readonly GrandArchiveModeEffect[];
  readonly random?: GrandArchiveMatchState["random"];
  readonly tracking?: {
    readonly objectId: GrandArchiveObjectId;
    readonly key: string;
    readonly chosenIds: readonly string[];
  };
}

function grandArchiveModeTrackingObjectId(
  evaluation: GrandArchiveEvaluationContext,
): GrandArchiveObjectId | undefined {
  const sourceId = evaluation.abilityBearerId ?? evaluation.sourceId;
  const source = sourceId ? evaluation.state.objects[sourceId] : undefined;
  if (!source) return undefined;
  const face = grandArchiveObjectFace(evaluation.program, source);
  if (
    !face.typeLine.types.includes("CHAMPION") ||
    !source.activeDefinitionId ||
    source.activeDefinitionId === source.definitionId ||
    source.copy
  ) {
    return source.id;
  }
  const activeLineageCardId = [...evaluation.state.zones[source.ownerId]["inner-lineage"]]
    .reverse()
    .find((objectId) => {
      const card = evaluation.state.objects[objectId];
      return card?.hostId === source.id && card.definitionId === source.activeDefinitionId;
    });
  if (!activeLineageCardId) {
    throw new GrandArchiveUnsupportedRuleError("tracked champion ability without its lineage card");
  }
  return activeLineageCardId;
}

function grandArchiveModeTracking(
  effect: Extract<GrandArchiveEffect, { readonly kind: "select-modes" }>,
  evaluation: GrandArchiveEvaluationContext,
): GrandArchiveAnnouncementModes["tracking"] {
  if (!effect.trackChosenAs && !effect.excludePreviouslyChosen) return undefined;
  if (!effect.trackChosenAs) {
    throw new GrandArchiveUnsupportedRuleError(
      "mode exclusion requires a stable tracked-choice key",
    );
  }
  const objectId = grandArchiveModeTrackingObjectId(evaluation);
  if (!objectId) {
    throw new GrandArchiveUnsupportedRuleError("tracked mode choice without a source card");
  }
  const object = evaluation.state.objects[objectId];
  if (!object) throw new Error("Tracked mode source no longer exists");
  const tracked = evaluation.state.trackedCharacteristics[objectId];
  const previouslyChosenIds =
    tracked?.incarnation === object.incarnation ? (tracked.values[effect.trackChosenAs] ?? []) : [];
  return { objectId, key: effect.trackChosenAs, previouslyChosenIds };
}

function effectContainsAnnouncementModes(effect: GrandArchiveEffect | undefined): boolean {
  if (!effect) return false;
  switch (effect.kind) {
    case "select-modes":
      return true;
    case "sequence":
      return effect.effects.some(effectContainsAnnouncementModes);
    case "conditional":
      return (
        effectContainsAnnouncementModes(effect.then) || effectContainsAnnouncementModes(effect.else)
      );
    case "perform-as":
    case "bind-value":
    case "attempt":
      return effectContainsAnnouncementModes(effect.effect);
    case "unless-performed":
      return (
        effectContainsAnnouncementModes(effect.alternative) ||
        effectContainsAnnouncementModes(effect.otherwise)
      );
    default:
      return false;
  }
}

function effectAnnouncementModes(
  effect: GrandArchiveEffect,
  evaluation: GrandArchiveEvaluationContext,
): readonly GrandArchiveAnnouncementModes[] {
  switch (effect.kind) {
    case "select-modes":
      const tracking = grandArchiveModeTracking(effect, evaluation);
      return [
        {
          choose: effect.choose,
          ...(effect.allowRepeat ? { allowRepeat: true } : {}),
          ...(effect.random ? { random: true } : {}),
          modes: effect.excludePreviouslyChosen
            ? effect.modes.filter((mode) => !tracking?.previouslyChosenIds.includes(mode.id))
            : effect.modes,
          ...(tracking ? { tracking } : {}),
        },
      ];
    case "sequence":
      return effect.effects.flatMap((child) => effectAnnouncementModes(child, evaluation));
    case "conditional": {
      if (
        !effectContainsAnnouncementModes(effect.then) &&
        !effectContainsAnnouncementModes(effect.else)
      ) {
        return [];
      }
      const branch = evaluateGrandArchiveCondition(effect.condition, evaluation)
        ? effect.then
        : effect.else;
      return branch ? effectAnnouncementModes(branch, evaluation) : [];
    }
    case "perform-as":
    case "bind-value":
    case "attempt":
      return effectAnnouncementModes(effect.effect, evaluation);
    case "unless-performed":
      return [
        ...effectAnnouncementModes(effect.alternative, evaluation),
        ...effectAnnouncementModes(effect.otherwise, evaluation),
      ];
    default:
      return [];
  }
}

export function getGrandArchiveAnnouncementModes(
  declaration: GrandArchiveModeDeclaration | undefined,
  effect: GrandArchiveEffect | undefined,
  evaluation: GrandArchiveEvaluationContext,
): GrandArchiveAnnouncementModes | undefined {
  const explicit =
    declaration && declaration.declared !== "resolution"
      ? {
          choose: declaration.choose,
          ...(declaration.allowRepeat ? { allowRepeat: true as const } : {}),
          ...(declaration.random ? { random: true as const } : {}),
          modes: declaration.modes,
        }
      : undefined;
  const embedded = effect ? effectAnnouncementModes(effect, evaluation) : [];
  const declarations = [...(explicit ? [explicit] : []), ...embedded];
  if (declarations.length > 1) {
    throw new GrandArchiveUnsupportedRuleError("multiple announcement mode declarations");
  }
  return declarations[0];
}

export function declareGrandArchiveModes(
  declaration: GrandArchiveAnnouncementModes | undefined,
  submitted: readonly string[] | undefined,
  evaluation: GrandArchiveEvaluationContext,
): GrandArchiveDeclaredModes {
  if (!declaration) {
    if ((submitted?.length ?? 0) > 0) throw new Error("Activation declares no modes");
    return { ids: [], modes: [] };
  }
  const eligible = declaration.modes.filter(
    (mode) => !mode.condition || evaluateGrandArchiveCondition(mode.condition, evaluation),
  );
  const bounds = selectionCountBounds({ count: declaration.choose }, evaluation);
  let ids: readonly string[];
  let random: GrandArchiveMatchState["random"] | undefined;
  if (declaration.random) {
    if ((submitted?.length ?? 0) > 0) {
      throw new Error("Random modes cannot be selected by the player");
    }
    if (!Number.isFinite(bounds.maximum)) {
      throw new GrandArchiveUnsupportedRuleError("unbounded random mode selection");
    }
    const shuffled = shuffleGrandArchiveObjects(
      eligible.map((mode) => mode.id),
      evaluation.state.random,
    );
    ids = shuffled.value.slice(0, Math.min(eligible.length, bounds.maximum));
    random = shuffled.random;
  } else {
    ids = submitted ?? [];
  }
  if (!declaration.allowRepeat && new Set(ids).size !== ids.length) {
    throw new Error("A mode cannot be selected more than once");
  }
  const modes = ids.map((id) => {
    const mode = eligible.find((candidate) => candidate.id === id);
    if (!mode) throw new Error(`Mode is not available: ${id}`);
    return mode;
  });
  if (ids.length < bounds.minimum || ids.length > bounds.maximum) {
    throw new Error("Activation has an illegal number of selected modes");
  }
  const tracking = declaration.tracking
    ? {
        objectId: declaration.tracking.objectId,
        key: declaration.tracking.key,
        chosenIds: [...new Set([...declaration.tracking.previouslyChosenIds, ...ids])],
      }
    : undefined;
  return { ids, modes, ...(random ? { random } : {}), ...(tracking ? { tracking } : {}) };
}

export function grandArchiveAnnouncementModesHaveLegalSelection(
  declaration: GrandArchiveAnnouncementModes,
  evaluation: GrandArchiveEvaluationContext,
): boolean {
  const eligible = declaration.modes.filter(
    (mode) => !mode.condition || evaluateGrandArchiveCondition(mode.condition, evaluation),
  );
  const bounds = selectionCountBounds({ count: declaration.choose }, evaluation);
  if (bounds.minimum === 0) return true;
  return declaration.allowRepeat ? eligible.length > 0 : eligible.length >= bounds.minimum;
}

export function grandArchiveModeTrackingEvents(
  modes: GrandArchiveDeclaredModes,
  actorId: GrandArchivePlayerId,
  cause: NonNullable<GrandArchiveEventMeta["cause"]>,
): readonly GrandArchiveProposedEvent[] {
  if (!modes.tracking || modes.ids.length === 0) return [];
  return [
    {
      type: "object-characteristic-tracked",
      objectId: modes.tracking.objectId,
      key: modes.tracking.key,
      values: modes.tracking.chosenIds,
      actorId,
      cause,
    },
  ];
}

export function collectGrandArchiveModeTargets(
  base: readonly GrandArchiveTargetDeclaration[] | undefined,
  modes: readonly GrandArchiveModeEffect[],
): readonly GrandArchiveTargetDeclaration[] {
  const declarations = [...(base ?? []), ...modes.flatMap((mode) => mode.targets ?? [])];
  if (new Set(declarations.map((declaration) => declaration.id)).size !== declarations.length) {
    throw new Error("Selected modes contain duplicate target declaration ids");
  }
  return declarations;
}

function collectGrandArchiveCardTargets(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  card: import("../../game/model.ts").GrandArchiveCardInstance,
  base: readonly GrandArchiveTargetDeclaration[] | undefined,
  modes: readonly GrandArchiveModeEffect[],
): readonly GrandArchiveTargetDeclaration[] {
  const declarations = collectGrandArchiveModeTargets(base, modes);
  const link = grandArchiveLinkTargetDeclaration(program, state, card);
  if (!link) return declarations;
  if (declarations.some((declaration) => declaration.id === link.id)) {
    throw new Error(`Card target declaration collides with ${link.id}`);
  }
  return [...declarations, link];
}

export function validateGrandArchiveChosenVariables(
  base: readonly GrandArchiveVariableDeclaration[] | undefined,
  modes: readonly GrandArchiveModeEffect[],
  evaluation: GrandArchiveEvaluationContext,
): void {
  const declarations = [...(base ?? []), ...modes.flatMap((mode) => mode.variables ?? [])];
  for (const declaration of declarations) {
    if (declaration.kind !== "chosen") continue;
    const value = evaluation.variables?.[declaration.symbol];
    const minimum = evaluateGrandArchiveAmount(declaration.minimum, evaluation);
    const maximum = declaration.maximum
      ? evaluateGrandArchiveAmount(declaration.maximum, evaluation)
      : Number.POSITIVE_INFINITY;
    if (value === undefined || !Number.isSafeInteger(value) || value < minimum || value > maximum) {
      throw new Error(`Variable ${declaration.symbol} has not been legally declared`);
    }
  }
}

function grandArchiveStackItemMatchesClassification(
  item: GrandArchiveStackItem,
  classification: {
    readonly itemTypes?: readonly ("ability" | "card-activation" | "materialization")[];
    readonly abilityKinds?: readonly ("activated" | "triggered")[];
    readonly sourceFilter?: import("@tcg/grand-archive-types").GrandArchiveCardFilter;
  },
  evaluation: GrandArchiveEvaluationContext,
): boolean {
  const itemType =
    item.kind === "activated-ability" || item.kind === "triggered-ability"
      ? "ability"
      : item.kind === "materialization"
        ? "materialization"
        : item.kind === "card-activation"
          ? "card-activation"
          : undefined;
  if (!itemType || (classification.itemTypes && !classification.itemTypes.includes(itemType))) {
    return false;
  }
  if (classification.abilityKinds) {
    const abilityKind =
      item.kind === "activated-ability"
        ? "activated"
        : item.kind === "triggered-ability"
          ? "triggered"
          : undefined;
    if (!abilityKind || !classification.abilityKinds.includes(abilityKind)) return false;
  }
  if (classification.sourceFilter) {
    const source = item.sourceId ? evaluation.state.objects[item.sourceId] : undefined;
    if (
      !source ||
      !matchesGrandArchiveCardFilter(source, classification.sourceFilter, evaluation)
    ) {
      return false;
    }
  }
  return true;
}

function grandArchiveStackItemTargetsMatchingObject(
  item: GrandArchiveStackItem,
  declaration: Extract<
    GrandArchiveTargetDeclaration["candidates"],
    { readonly kind: "stack-item" }
  >["targeting"],
  evaluation: GrandArchiveEvaluationContext,
): boolean {
  if (!declaration) return true;
  const subjectIds = declaration.subject
    ? new Set(
        resolveGrandArchiveSubjectObjects(declaration.subject, evaluation).map(({ id }) => id),
      )
    : undefined;
  const playerIds = declaration.player
    ? resolveGrandArchivePlayers(declaration.player, evaluation)
    : undefined;
  return item.targets.some((target) =>
    target.targetIds.some((targetId) => {
      const object = Object.values(evaluation.state.objects).find(
        (candidate) => candidate.id === targetId,
      );
      if (!object) return false;
      if (subjectIds && !subjectIds.has(object.id)) return false;
      if (playerIds && !playerIds.includes(object.controllerId)) return false;
      return (
        !declaration.filter || matchesGrandArchiveCardFilter(object, declaration.filter, evaluation)
      );
    }),
  );
}

export function isGrandArchiveTargetCandidate(
  targetId: GrandArchiveTargetId,
  declaration: GrandArchiveTargetDeclaration,
  evaluation: GrandArchiveEvaluationContext,
): boolean {
  const candidates = declaration.candidates;
  if (candidates.kind === "union") {
    return candidates.sources.some((source) =>
      isGrandArchiveTargetCandidate(targetId, { ...declaration, candidates: source }, evaluation),
    );
  }
  if (candidates.kind === "stack-item") {
    const item = evaluation.state.stack.find((candidate) => candidate.id === targetId);
    if (!item) return false;
    const classificationMatches = candidates.anyOf
      ? candidates.anyOf.some((classification) =>
          grandArchiveStackItemMatchesClassification(item, classification, evaluation),
        )
      : grandArchiveStackItemMatchesClassification(item, candidates, evaluation);
    if (!classificationMatches) return false;
    if (candidates.controller) {
      const controllers = resolveGrandArchivePlayers(candidates.controller, evaluation);
      if (!controllers.includes(item.controllerId)) return false;
    }
    if (
      candidates.activationFrom &&
      (!(
        item.kind === "card-activation" ||
        item.kind === "materialization" ||
        item.kind === "bestowment"
      ) ||
        !candidates.activationFrom.includes(item.originZone))
    ) {
      return false;
    }
    return grandArchiveStackItemTargetsMatchingObject(item, candidates.targeting, evaluation);
  }
  if (candidates.kind === "player") {
    const player = Object.values(evaluation.state.players).find(
      (candidate) => candidate.id === targetId,
    );
    if (!player || player.lost) return false;
    const eligible = new Set(
      isRelativePlayerList(candidates.players)
        ? candidates.players.flatMap((candidate) =>
            resolveGrandArchivePlayers(candidate, evaluation),
          )
        : resolveGrandArchivePlayers(candidates.players, evaluation),
    );
    if (!eligible.has(player.id)) return false;
    if (
      evaluation.targeting?.sourceIsSpell &&
      grandArchivePlayerHasState(evaluation.program, evaluation.state, player.id, {
        named: "spellshroud",
      })
    ) {
      return false;
    }
    if (candidates.zoneCount) {
      const count = grandArchivePlayerZoneObjectIds(
        evaluation.state,
        player.id,
        candidates.zoneCount.zone,
      ).filter((objectId) => {
        const object = evaluation.state.objects[objectId];
        return (
          object !== undefined &&
          (!candidates.zoneCount?.filter ||
            matchesGrandArchiveCardFilter(object, candidates.zoneCount.filter, evaluation))
        );
      }).length;
      const expected = evaluateGrandArchiveAmount(candidates.zoneCount.value, evaluation);
      if (!compareChoiceNumber(count, candidates.zoneCount.operator, expected)) return false;
    }
    if (candidates.property) {
      const actual = deriveGrandArchivePlayerProperty(
        player.id,
        candidates.property.name,
        evaluation,
      );
      const expected = evaluateGrandArchiveAmount(candidates.property.value, evaluation);
      if (!compareChoiceNumber(actual, candidates.property.operator, expected)) return false;
    }
    return true;
  }
  if (candidates.kind === "card" || candidates.kind === "object") {
    const object = Object.values(evaluation.state.objects).find(
      (candidate) => candidate.id === targetId,
    );
    if (!object) return false;
    // Pantheon 5: face-down Boons are cards rather than objects, but neither
    // card nor object target declarations may select anything in Pantheon.
    if (object.zone === "pantheon") return false;
    if (
      object.zone === "field" &&
      evaluation.targeting &&
      (grandArchiveObjectHasActiveKeyword(
        evaluation.program,
        evaluation.state,
        object,
        "omnishroud",
      ) ||
        (evaluation.targeting.sourceIsSpell &&
          grandArchiveObjectHasActiveKeyword(
            evaluation.program,
            evaluation.state,
            object,
            "spellshroud",
          )))
    ) {
      return false;
    }
    if ("binding" in candidates) {
      if (object.zone === "field" || object.zone === "effects-stack") return false;
      const binding = evaluation.bindings[candidates.binding];
      if (!Array.isArray(binding) || !binding.includes(object.id)) return false;
      if (
        candidates.excluding?.some((excludedBinding) => {
          const excluded = evaluation.bindings[excludedBinding];
          return Array.isArray(excluded) && excluded.includes(object.id);
        })
      )
        return false;
    } else {
      if (candidates.kind === "object") {
        if (object.zone !== "field") return false;
      } else if (
        object.zone === "field" ||
        object.zone === "effects-stack" ||
        !candidates.zones.includes(object.zone)
      ) {
        return false;
      }
      if (candidates.host) {
        const hosts = resolveGrandArchiveSubjectObjects(candidates.host, evaluation);
        if (candidates.relationship === "banished-by") {
          if (
            object.zone !== "banishment" ||
            !object.banishedBySourceId ||
            !hosts.some((host) => host.id === object.banishedBySourceId)
          )
            return false;
        } else if (!object.hostId || !hosts.some((host) => host.id === object.hostId)) {
          return false;
        }
      } else if (candidates.relationship === "banished-by") {
        throw new GrandArchiveUnsupportedRuleError("banished-by candidates without a host");
      }
      if (candidates.player) {
        const players = resolveGrandArchivePlayers(candidates.player, evaluation);
        switch (candidates.relationship) {
          case "owned-by":
          case "zone-of":
            if (!players.includes(object.ownerId)) return false;
            break;
          case "lineage-of": {
            const host = object.hostId ? evaluation.state.objects[object.hostId] : undefined;
            if (object.zone !== "inner-lineage" || !host || !players.includes(host.controllerId))
              return false;
            break;
          }
          case "banished-by":
            if (!players.includes(object.ownerId)) return false;
            break;
          case "controlled-by":
          case undefined:
            if (!players.includes(object.controllerId)) return false;
            break;
          default:
            assertNever(candidates.relationship);
        }
      }
    }
    return (
      !candidates.filter || matchesGrandArchiveCardFilter(object, candidates.filter, evaluation)
    );
  }
  throw new GrandArchiveUnsupportedRuleError(`target candidates ${candidates.kind}`);
}

export function declareGrandArchiveTargets(
  declarations: readonly GrandArchiveTargetDeclaration[] | undefined,
  submitted: Readonly<Record<string, readonly GrandArchiveTargetId[]>> | undefined,
  evaluation: GrandArchiveEvaluationContext,
  options: {
    readonly allowResolutionShortfall?: true;
    readonly allowEmpty?: true;
  } = {},
): readonly GrandArchiveDeclaredTarget[] {
  if (!declarations || declarations.length === 0) {
    if (submitted && Object.keys(submitted).length > 0)
      throw new Error("Activation declares no targets");
    return [];
  }
  const declaredIds = new Set(declarations.map((declaration) => declaration.id));
  if (submitted && Object.keys(submitted).some((id) => !declaredIds.has(id))) {
    throw new Error("Activation includes an unknown target declaration");
  }
  const bindings: Record<string, readonly GrandArchiveTargetId[]> = {};
  const targets: GrandArchiveDeclaredTarget[] = [];
  const alreadyTargeted = new Set<GrandArchiveTargetId>();
  for (const declaration of declarations) {
    const targetIds = submitted?.[declaration.id] ?? [];
    if (
      !declaration.allowRepeated &&
      (new Set(targetIds).size !== targetIds.length ||
        targetIds.some((targetId) => alreadyTargeted.has(targetId)))
    ) {
      throw new Error("A target identity cannot be selected twice");
    }
    const contextualEvaluation = {
      ...evaluation,
      bindings: { ...evaluation.bindings, ...bindings },
    };
    let bounds = selectionCountBounds(declaration, contextualEvaluation);
    if (options.allowEmpty && targetIds.length === 0) {
      bounds = { minimum: 0, maximum: bounds.maximum };
    }
    if (options.allowResolutionShortfall) {
      const exact = exactSelectionCount(declaration, contextualEvaluation);
      if (exact !== undefined) {
        const available = potentialGrandArchiveTargetIds(contextualEvaluation.state).filter(
          (targetId) => isGrandArchiveTargetCandidate(targetId, declaration, contextualEvaluation),
        ).length;
        if (available < exact) bounds = { minimum: available, maximum: available };
      }
    }
    if (targetIds.length < bounds.minimum || targetIds.length > bounds.maximum) {
      throw new Error(`Target ${declaration.id} has an illegal selection count`);
    }
    if (
      targetIds.some(
        (targetId) => !isGrandArchiveTargetCandidate(targetId, declaration, contextualEvaluation),
      )
    ) {
      throw new Error(`Target ${declaration.id} contains an illegal object`);
    }
    if (selectionCountRequiresAll(declaration, contextualEvaluation)) {
      const eligible = potentialGrandArchiveTargetIds(contextualEvaluation.state).filter(
        (targetId) => isGrandArchiveTargetCandidate(targetId, declaration, contextualEvaluation),
      );
      const selected = new Set(targetIds);
      if (
        selected.size !== targetIds.length ||
        targetIds.length !== eligible.length ||
        eligible.some((targetId) => !selected.has(targetId))
      ) {
        throw new Error(`Target ${declaration.id} must include every eligible object`);
      }
    }
    validateGrandArchiveTargetGroupConstraints(declaration, targetIds, contextualEvaluation);
    bindings[declaration.id] = targetIds;
    targetIds.forEach((targetId) => alreadyTargeted.add(targetId));
    targets.push({
      binding: declaration.id,
      targetIds,
      targetObjectIncarnations: Object.fromEntries(
        targetIds.flatMap((targetId) => {
          const object = evaluation.state.objects[targetId as GrandArchiveObjectId];
          return object ? [[object.id, object.incarnation] as const] : [];
        }),
      ),
      required: bounds.minimum > 0,
    });
  }
  return targets;
}

export interface GrandArchiveTargetDeclarationResult {
  readonly targets: readonly GrandArchiveDeclaredTarget[];
  readonly random?: GrandArchiveMatchState["random"];
}

function potentialGrandArchiveTargetIds(
  state: GrandArchiveMatchState,
): readonly GrandArchiveTargetId[] {
  return [
    ...Object.values(state.objects).map((object) => object.id),
    ...Object.values(state.players).map((player) => player.id),
    ...state.stack.map((item) => item.id),
  ];
}

export function grandArchiveTargetDeclarationHasLegalSelection(
  declaration: GrandArchiveTargetDeclaration,
  evaluation: GrandArchiveEvaluationContext,
): boolean {
  const bounds = selectionCountBounds(declaration, evaluation);
  if (bounds.minimum === 0) return true;
  let eligible = 0;
  for (const targetId of potentialGrandArchiveTargetIds(evaluation.state)) {
    if (isGrandArchiveTargetCandidate(targetId, declaration, evaluation)) eligible += 1;
    if (eligible >= bounds.minimum) return true;
  }
  return false;
}

/**
 * Declares announcement targets while letting the engine, rather than a player,
 * choose targets explicitly marked as random. The returned random state must be
 * committed alongside the resulting stack item.
 */
export function declareGrandArchiveTargetsWithRandom(
  declarations: readonly GrandArchiveTargetDeclaration[] | undefined,
  submitted: Readonly<Record<string, readonly GrandArchiveTargetId[]>> | undefined,
  evaluation: GrandArchiveEvaluationContext,
): GrandArchiveTargetDeclarationResult {
  if (!declarations?.length) {
    return { targets: declareGrandArchiveTargets(declarations, submitted, evaluation) };
  }
  const declaredIds = new Set(declarations.map((declaration) => declaration.id));
  if (submitted && Object.keys(submitted).some((id) => !declaredIds.has(id))) {
    throw new Error("Activation includes an unknown target declaration");
  }

  const targets: GrandArchiveDeclaredTarget[] = [];
  const bindings: Record<string, readonly GrandArchiveTargetId[]> = {};
  let random = evaluation.state.random;
  let usedRandom = false;
  for (const declaration of declarations) {
    const contextualEvaluation: GrandArchiveEvaluationContext = {
      ...evaluation,
      state:
        random === evaluation.state.random ? evaluation.state : { ...evaluation.state, random },
      bindings: { ...evaluation.bindings, ...bindings },
    };
    let targetIds = submitted?.[declaration.id] ?? [];
    if (declaration.method === "random") {
      if (targetIds.length > 0) {
        throw new Error(`Random target ${declaration.id} cannot be selected by a player`);
      }
      const bounds = selectionCountBounds(declaration, contextualEvaluation);
      if (!Number.isFinite(bounds.maximum) || bounds.minimum !== bounds.maximum) {
        throw new GrandArchiveUnsupportedRuleError(
          "random target declaration requires an exact finite count",
        );
      }
      const eligible = potentialGrandArchiveTargetIds(evaluation.state).filter((targetId) =>
        isGrandArchiveTargetCandidate(targetId, declaration, contextualEvaluation),
      );
      if (eligible.length < bounds.minimum) {
        throw new Error(`Random target ${declaration.id} has too few eligible candidates`);
      }
      const shuffled = shuffleGrandArchiveObjects(eligible, random);
      random = shuffled.random;
      usedRandom = true;
      targetIds = shuffled.value.slice(0, bounds.minimum);
    }
    const [declared] = declareGrandArchiveTargets(
      [declaration],
      { [declaration.id]: targetIds },
      contextualEvaluation,
    );
    if (!declared) throw new Error(`Target ${declaration.id} was not declared`);
    targets.push(declared);
    bindings[declaration.id] = declared.targetIds;
  }
  return { targets, ...(usedRandom ? { random } : {}) };
}

export function declareGrandArchiveObjectChoice(
  selection: GrandArchiveResolutionChoice,
  submitted: readonly GrandArchiveObjectId[],
  evaluation: GrandArchiveEvaluationContext,
  options: { readonly mayFailToFind?: true } = {},
): readonly GrandArchiveObjectId[] {
  if (
    selection.candidates.kind !== "card" &&
    selection.candidates.kind !== "object" &&
    selection.candidates.kind !== "union"
  ) {
    throw new GrandArchiveUnsupportedRuleError(
      `resolution choice candidates ${selection.candidates.kind}`,
    );
  }
  const declaration: GrandArchiveTargetDeclaration = {
    ...selection,
    kind: "target",
    declared: "announcement",
  };
  declareGrandArchiveTargets([declaration], { [selection.id]: submitted }, evaluation, {
    allowResolutionShortfall: true,
    ...(options.mayFailToFind ? { allowEmpty: true } : {}),
  });
  const declared = submitted;
  const bounds = selectionCountBounds(selection, evaluation);
  const sources =
    selection.candidates.kind === "union"
      ? selection.candidates.sources
      : selection.candidates.kind === "card"
        ? [selection.candidates]
        : [];
  for (const source of sources) {
    if (!("fromTop" in source) && !("fromBottom" in source)) continue;
    if (!source.fromTop && !source.fromBottom) continue;
    const playerIds = source.player
      ? resolveGrandArchivePlayers(source.player, evaluation)
      : evaluation.state.turnOrder;
    const ordered = playerIds.flatMap((playerId) =>
      source.zones.flatMap((zone) => {
        const zoneIds = grandArchivePlayerZoneObjectIds(evaluation.state, playerId, zone);
        return source.fromBottom ? [...zoneIds].reverse() : zoneIds;
      }),
    );
    const maximum = Number.isFinite(bounds.maximum) ? bounds.maximum : ordered.length;
    const permitted = new Set(ordered.slice(0, maximum));
    const selectedFromSource = declared.filter((objectId) =>
      isGrandArchiveTargetCandidate(objectId, { ...declaration, candidates: source }, evaluation),
    );
    if (selectedFromSource.some((objectId) => !permitted.has(objectId))) {
      throw new Error("Ordered-zone choice must use cards from the indicated edge");
    }
  }
  return declared;
}

function orderedGrandArchiveResolutionCandidateIds(
  selection: GrandArchiveResolutionChoice,
  evaluation: GrandArchiveEvaluationContext,
): readonly GrandArchiveObjectId[] {
  const candidates = selection.candidates;
  const candidateSources =
    candidates.kind === "union"
      ? candidates.sources
      : candidates.kind === "card" || candidates.kind === "object"
        ? [candidates]
        : [];
  const ids: GrandArchiveObjectId[] = [];
  for (const source of candidateSources) {
    if ("binding" in source) {
      const binding = evaluation.bindings[source.binding];
      if (!Array.isArray(binding)) continue;
      for (const value of binding) {
        const object = Object.values(evaluation.state.objects).find(
          (candidate) => candidate.id === value,
        );
        if (object) ids.push(object.id);
      }
      continue;
    }
    const playerIds = source.player
      ? resolveGrandArchivePlayers(source.player, evaluation)
      : evaluation.state.turnOrder;
    for (const playerId of playerIds) {
      for (const zone of source.zones) {
        const zoneIds = grandArchivePlayerZoneObjectIds(evaluation.state, playerId, zone);
        ids.push(
          ...("fromBottom" in source && source.fromBottom ? [...zoneIds].reverse() : zoneIds),
        );
      }
    }
  }
  const declaration: GrandArchiveTargetDeclaration = {
    ...selection,
    kind: "target",
    declared: "announcement",
  };
  return [...new Set(ids)].filter((objectId) =>
    isGrandArchiveTargetCandidate(objectId, declaration, evaluation),
  );
}

function resolutionChoiceUsesOrderedEdge(selection: GrandArchiveResolutionChoice): boolean {
  const candidates = selection.candidates;
  const sources = candidates.kind === "union" ? candidates.sources : [candidates];
  return (
    sources.length > 0 &&
    sources.every((source) => {
      if (source.kind !== "card" || "binding" in source) return false;
      return source.fromTop === true || source.fromBottom === true;
    })
  );
}

/**
 * Returns the forced live object selection, or `undefined` when a player still
 * controls a membership choice. Ordering decisions are handled by callers.
 */
export function deterministicallyDeclareGrandArchiveResolutionChoice(
  selection: GrandArchiveResolutionChoice,
  evaluation: GrandArchiveEvaluationContext,
  options: { readonly mayFailToFind?: true } = {},
): readonly GrandArchiveObjectId[] | undefined {
  if (
    selection.candidates.kind !== "card" &&
    selection.candidates.kind !== "object" &&
    selection.candidates.kind !== "union"
  ) {
    return undefined;
  }
  const eligible = orderedGrandArchiveResolutionCandidateIds(selection, evaluation);
  if (selection.ordered && eligible.length > 1) return undefined;
  if (options.mayFailToFind && eligible.length > 0) return undefined;
  let selected: readonly GrandArchiveObjectId[] | undefined;
  if (eligible.length === 0) {
    selected = [];
  } else if (selectionCountRequiresAll(selection, evaluation)) {
    selected = eligible;
  } else {
    const exact = exactSelectionCount(selection, evaluation);
    if (
      exact !== undefined &&
      (eligible.length <= exact || resolutionChoiceUsesOrderedEdge(selection))
    ) {
      selected = eligible.slice(0, Math.min(eligible.length, exact));
    }
  }
  if (!selected) return undefined;
  return declareGrandArchiveObjectChoice(selection, selected, evaluation);
}

function compareChoiceNumber(
  left: number,
  operator: import("@tcg/grand-archive-types").GrandArchiveComparisonOperator,
  right: number,
): boolean {
  switch (operator) {
    case "eq":
      return left === right;
    case "neq":
      return left !== right;
    case "lt":
      return left < right;
    case "lte":
      return left <= right;
    case "gt":
      return left > right;
    case "gte":
      return left >= right;
    default:
      return assertNever(operator);
  }
}

function targetNumericProperty(
  object: GrandArchiveCardInstance,
  property: "reserve-cost" | "memory-cost" | "power" | "life" | "level",
  basis: "base" | "current",
  evaluation: GrandArchiveEvaluationContext,
): number | undefined {
  if (basis === "current") return deriveGrandArchiveNumericProperty(object, property, evaluation);
  const face = grandArchiveObjectFace(evaluation.program, object);
  if (property === "reserve-cost" || property === "memory-cost") {
    const kind = property === "reserve-cost" ? "reserve" : "memory";
    return face.cost.kind === kind && typeof face.cost.amount === "number"
      ? face.cost.amount
      : undefined;
  }
  return face.stats[property];
}

function targetCharacteristicValues(
  object: GrandArchiveCardInstance,
  characteristic: NonNullable<GrandArchiveTargetDeclaration["allShareCharacteristic"]>,
  evaluation: GrandArchiveEvaluationContext,
): readonly (string | number)[] {
  if (characteristic === "reserve-cost") {
    const value = deriveGrandArchiveNumericProperty(object, "reserve-cost", evaluation);
    return value === undefined ? [] : [value];
  }
  const characteristics = deriveGrandArchiveCharacteristics(object, evaluation);
  switch (characteristic) {
    case "name":
      return characteristics.names;
    case "type":
      return characteristics.types;
    case "subtype":
      return characteristics.subtypes;
    case "element":
      return characteristics.elements;
    case "class":
      return characteristics.classes;
    default:
      return assertNever(characteristic);
  }
}

function targetObject(
  targetId: GrandArchiveTargetId,
  evaluation: GrandArchiveEvaluationContext,
): GrandArchiveCardInstance | undefined {
  return Object.values(evaluation.state.objects).find((object) => object.id === targetId);
}

function validateGrandArchiveTargetGroupConstraints(
  declaration: GrandArchiveTargetDeclaration,
  targetIds: readonly GrandArchiveTargetId[],
  evaluation: GrandArchiveEvaluationContext,
): void {
  if (
    !declaration.singleZoneOwner &&
    !declaration.allShareCharacteristic &&
    !declaration.aggregateConstraint &&
    !declaration.extreme
  ) {
    return;
  }
  const objects = targetIds.map((targetId) => targetObject(targetId, evaluation));
  const selected = objects.flatMap((object) => (object ? [object] : []));
  if (selected.length !== objects.length) {
    throw new Error("A grouped target constraint requires object targets");
  }
  if (declaration.singleZoneOwner && new Set(selected.map((object) => object.ownerId)).size > 1) {
    throw new Error(`Target ${declaration.id} must use one zone owner`);
  }
  if (declaration.allShareCharacteristic && selected.length > 1) {
    let shared = new Set(
      targetCharacteristicValues(selected[0]!, declaration.allShareCharacteristic, evaluation),
    );
    for (const object of selected.slice(1)) {
      const values = new Set(
        targetCharacteristicValues(object, declaration.allShareCharacteristic, evaluation),
      );
      shared = new Set([...shared].filter((value) => values.has(value)));
    }
    if (shared.size === 0) {
      throw new Error(`Target ${declaration.id} must share ${declaration.allShareCharacteristic}`);
    }
  }
  if (declaration.aggregateConstraint) {
    const aggregate = declaration.aggregateConstraint;
    let total = 0;
    for (const object of selected) {
      const value = targetNumericProperty(object, aggregate.property, aggregate.basis, evaluation);
      if (value === undefined) {
        throw new Error(`Target ${declaration.id} lacks ${aggregate.property}`);
      }
      total += value;
    }
    const expected = evaluateGrandArchiveAmount(aggregate.value, evaluation);
    if (!compareChoiceNumber(total, aggregate.operator, expected)) {
      throw new Error(`Target ${declaration.id} fails its aggregate constraint`);
    }
  }
  if (declaration.extreme && selected.length > 0) {
    const extreme = declaration.extreme;
    const eligibleValues = potentialGrandArchiveTargetIds(evaluation.state).flatMap((targetId) => {
      if (!isGrandArchiveTargetCandidate(targetId, declaration, evaluation)) return [];
      const object = targetObject(targetId, evaluation);
      if (!object) return [];
      const value = targetNumericProperty(object, extreme.property, extreme.basis, evaluation);
      return value === undefined ? [] : [value];
    });
    const required =
      extreme.operation === "minimum" ? Math.min(...eligibleValues) : Math.max(...eligibleValues);
    if (
      selected.some(
        (object) =>
          targetNumericProperty(object, extreme.property, extreme.basis, evaluation) !== required,
      )
    ) {
      throw new Error(`Target ${declaration.id} does not have the required ${extreme.operation}`);
    }
  }
}

function submittedObjectIds(
  answer: unknown,
  evaluation: GrandArchiveEvaluationContext,
): readonly GrandArchiveObjectId[] | null {
  if (!Array.isArray(answer)) return null;
  const objects = Object.values(evaluation.state.objects);
  const objectIds: GrandArchiveObjectId[] = [];
  for (const value of answer) {
    if (typeof value !== "string") return null;
    const object = objects.find((candidate) => candidate.id === value);
    if (!object) return null;
    objectIds.push(object.id);
  }
  return objectIds;
}

function isRelativePlayerList(
  players:
    | readonly import("@tcg/grand-archive-types").GrandArchiveRelativePlayer[]
    | import("@tcg/grand-archive-types").GrandArchivePlayerSet,
): players is readonly import("@tcg/grand-archive-types").GrandArchiveRelativePlayer[] {
  return Array.isArray(players);
}

export function declareGrandArchiveResolutionChoice(
  selection: GrandArchiveResolutionChoice,
  answer: unknown,
  evaluation: GrandArchiveEvaluationContext,
  options: { readonly mayFailToFind?: true } = {},
): GrandArchiveExecutionBinding {
  const candidates = selection.candidates;
  if (candidates.kind === "card" || candidates.kind === "object" || candidates.kind === "union") {
    const objectIds = submittedObjectIds(answer, evaluation);
    if (!objectIds) throw new Error("Resolution choice requires an array of object ids");
    return declareGrandArchiveObjectChoice(selection, objectIds, evaluation, options);
  }
  if (candidates.kind === "number") {
    if (typeof answer !== "number" || !Number.isSafeInteger(answer)) {
      throw new Error("Number choice requires a safe integer");
    }
    const minimum = evaluateGrandArchiveAmount(candidates.minimum, evaluation);
    const maximum = candidates.maximum
      ? evaluateGrandArchiveAmount(candidates.maximum, evaluation)
      : Number.POSITIVE_INFINITY;
    if (answer < minimum || answer > maximum) throw new Error("Number choice is out of range");
    return answer;
  }
  if (candidates.kind === "option") {
    const submitted =
      typeof answer === "string"
        ? [answer]
        : Array.isArray(answer) && answer.every((value) => typeof value === "string")
          ? answer
          : undefined;
    if (!submitted || submitted.some((value) => !candidates.options.includes(value))) {
      throw new Error("Option choice is not available");
    }
    if (!selection.allowRepeated && new Set(submitted).size !== submitted.length) {
      throw new Error("An option cannot be selected twice");
    }
    const bounds = selectionCountBounds(selection, evaluation);
    if (submitted.length < bounds.minimum || submitted.length > bounds.maximum) {
      throw new Error("Option choice has an illegal selection count");
    }
    return typeof answer === "string" ? answer : submitted;
  }
  if (candidates.kind === "characteristic") {
    const submitted =
      typeof answer === "string"
        ? [answer]
        : Array.isArray(answer) && answer.every((value) => typeof value === "string")
          ? answer
          : undefined;
    if (!submitted) {
      throw new Error("Characteristic choice must be a string or an array of strings");
    }
    if (!selection.allowRepeated && new Set(submitted).size !== submitted.length) {
      throw new Error("A characteristic cannot be selected twice");
    }
    const bounds = selectionCountBounds(selection, evaluation);
    if (submitted.length < bounds.minimum || submitted.length > bounds.maximum) {
      throw new Error("Characteristic choice has an illegal selection count");
    }
    const available = new Set<string>();
    for (const [definitionId, card] of Object.entries(evaluation.program.cardsById)) {
      if (candidates.characteristic === "card-name" && card.definitionKind !== "card") {
        continue;
      }
      if (
        candidates.optionsFrom &&
        !grandArchiveDefinitionMatchesCardFilter(definitionId, candidates.optionsFrom, evaluation)
      ) {
        continue;
      }
      const faces =
        card.layout.kind === "single-faced"
          ? [card.layout.face]
          : [card.layout.defaultFace, card.layout.flipFace];
      for (const face of faces) {
        switch (candidates.characteristic) {
          case "card-name":
            available.add(face.name);
            break;
          case "type":
            face.typeLine.types.forEach((value) => available.add(value));
            break;
          case "class":
            face.typeLine.classes.forEach((value) => available.add(value));
            break;
          case "element":
            face.elements.forEach((value) => available.add(value));
            break;
          case "subtype":
            face.typeLine.subtypes.forEach((value) => available.add(value));
            break;
          default:
            assertNever(candidates.characteristic);
        }
      }
    }
    if (submitted.some((value) => !available.has(value))) {
      throw new Error("Characteristic choice is not available");
    }
    if (selectionCountRequiresAll(selection, evaluation)) {
      const selected = new Set(submitted);
      if (
        selected.size !== submitted.length ||
        submitted.length !== available.size ||
        [...available].some((value) => !selected.has(value))
      ) {
        throw new Error("Characteristic choice must include every available value");
      }
    }
    return bounds.minimum === 1 && bounds.maximum === 1 ? submitted[0]! : submitted;
  }
  if (candidates.kind === "catalog-card") {
    if (!Array.isArray(answer) || answer.some((value) => typeof value !== "string")) {
      throw new Error("Catalog card choice requires an array of card definition ids");
    }
    const submitted: readonly string[] = answer;
    if (!selection.allowRepeated && new Set(submitted).size !== submitted.length) {
      throw new Error("A catalog card cannot be selected twice");
    }
    const bounds = selectionCountBounds(selection, evaluation);
    if (submitted.length < bounds.minimum || submitted.length > bounds.maximum) {
      throw new Error("Catalog card choice has an illegal selection count");
    }
    for (const definitionId of submitted) {
      const definition = evaluation.program.cardsById[definitionId];
      if (!definition) {
        throw new Error("Catalog card choice contains an unknown definition");
      }
      if (definition.definitionKind !== "card") {
        throw new Error("Catalog card choice contains a non-card representation");
      }
      if (!grandArchiveDefinitionMatchesCardFilter(definitionId, candidates.filter, evaluation)) {
        throw new Error("Catalog card choice contains an ineligible definition");
      }
    }
    if (selectionCountRequiresAll(selection, evaluation)) {
      const eligible = Object.entries(evaluation.program.cardsById)
        .filter(([, definition]) => definition.definitionKind === "card")
        .map(([definitionId]) => definitionId)
        .filter((definitionId) =>
          grandArchiveDefinitionMatchesCardFilter(definitionId, candidates.filter, evaluation),
        );
      const selected = new Set(submitted);
      if (
        selected.size !== submitted.length ||
        submitted.length !== eligible.length ||
        eligible.some((definitionId) => !selected.has(definitionId))
      ) {
        throw new Error("Catalog card choice must include every eligible definition");
      }
    }
    return submitted;
  }
  if (candidates.kind === "stack-item") {
    if (!Array.isArray(answer)) {
      throw new Error("Stack-item choice requires an array of stack-item ids");
    }
    const submitted: GrandArchiveTargetId[] = [];
    for (const value of answer) {
      if (typeof value !== "string") {
        throw new Error("Stack-item choice contains a non-stack-item id");
      }
      const item = evaluation.state.stack.find((candidate) => candidate.id === value);
      if (!item) throw new Error("Stack-item choice contains an unknown stack item");
      submitted.push(item.id);
    }
    const declaration: GrandArchiveTargetDeclaration = {
      ...selection,
      kind: "target",
      declared: "announcement",
    };
    const [declared] = declareGrandArchiveTargets(
      [declaration],
      { [selection.id]: submitted },
      evaluation,
    );
    if (!declared) throw new Error(`Stack-item choice ${selection.id} was not declared`);
    return declared.targetIds;
  }
  if (candidates.kind === "player") {
    if (!Array.isArray(answer)) throw new Error("Player choice requires an array of player ids");
    const submitted: GrandArchivePlayerId[] = [];
    const players = Object.values(evaluation.state.players);
    for (const value of answer) {
      if (typeof value !== "string") throw new Error("Player choice contains a non-player id");
      const player = players.find((candidate) => candidate.id === value);
      if (!player) throw new Error("Player choice contains an unknown player");
      submitted.push(player.id);
    }
    if (!selection.allowRepeated && new Set(submitted).size !== submitted.length) {
      throw new Error("A player cannot be selected twice");
    }
    const eligible = new Set(
      isRelativePlayerList(candidates.players)
        ? candidates.players.flatMap((player) => resolveGrandArchivePlayers(player, evaluation))
        : resolveGrandArchivePlayers(candidates.players, evaluation),
    );
    for (const playerId of submitted) {
      if (!eligible.has(playerId)) throw new Error("Player choice contains an ineligible player");
      if (candidates.zoneCount) {
        const count = grandArchivePlayerZoneObjectIds(
          evaluation.state,
          playerId,
          candidates.zoneCount.zone,
        ).filter((objectId) => {
          const object = evaluation.state.objects[objectId];
          return (
            object !== undefined &&
            (!candidates.zoneCount?.filter ||
              matchesGrandArchiveCardFilter(object, candidates.zoneCount.filter, evaluation))
          );
        }).length;
        const value = evaluateGrandArchiveAmount(candidates.zoneCount.value, evaluation);
        if (!compareChoiceNumber(count, candidates.zoneCount.operator, value)) {
          throw new Error("Player choice fails its zone-count requirement");
        }
      }
      if (candidates.property) {
        const actual = deriveGrandArchivePlayerProperty(
          playerId,
          candidates.property.name,
          evaluation,
        );
        const value = evaluateGrandArchiveAmount(candidates.property.value, evaluation);
        if (!compareChoiceNumber(actual, candidates.property.operator, value)) {
          throw new Error("Player choice fails its property requirement");
        }
      }
    }
    const bounds = selectionCountBounds(selection, evaluation);
    if (submitted.length < bounds.minimum || submitted.length > bounds.maximum) {
      throw new Error("Player choice has an illegal selection count");
    }
    if (selectionCountRequiresAll(selection, evaluation)) {
      const selected = new Set(submitted);
      if (
        selected.size !== submitted.length ||
        submitted.length !== eligible.size ||
        [...eligible].some((playerId) => !selected.has(playerId))
      ) {
        throw new Error("Player choice must include every eligible player");
      }
    }
    return submitted;
  }
  return assertNever(candidates);
}

export function randomlyDeclareGrandArchiveResolutionChoice(
  selection: GrandArchiveResolutionChoice,
  evaluation: GrandArchiveEvaluationContext,
): {
  readonly binding: GrandArchiveExecutionBinding;
  readonly random: GrandArchiveMatchState["random"];
} {
  const candidates = selection.candidates;
  if (candidates.kind !== "card" && candidates.kind !== "object" && candidates.kind !== "union") {
    throw new GrandArchiveUnsupportedRuleError(
      `random resolution choice candidates ${candidates.kind}`,
    );
  }
  const declaration: GrandArchiveTargetDeclaration = {
    ...selection,
    kind: "target",
    declared: "announcement",
  };
  const eligible = Object.values(evaluation.state.objects)
    .filter((object) => isGrandArchiveTargetCandidate(object.id, declaration, evaluation))
    .map((object) => object.id);
  const bounds = selectionCountBounds(selection, evaluation);
  const exact = exactSelectionCount(selection, evaluation);
  if (eligible.length < bounds.minimum && exact === undefined) {
    throw new Error("Random choice has too few eligible candidates");
  }
  if (!Number.isFinite(bounds.maximum)) {
    throw new GrandArchiveUnsupportedRuleError("unbounded random resolution choice");
  }
  const shuffled = shuffleGrandArchiveObjects(eligible, evaluation.state.random);
  return {
    binding: shuffled.value.slice(
      0,
      exact === undefined
        ? Math.min(eligible.length, bounds.maximum)
        : Math.min(eligible.length, exact),
    ),
    random: shuffled.random,
  };
}

function baseEvaluation(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  sourceId: GrandArchiveObjectId,
  variables: Readonly<Partial<Record<"X" | "Y" | "Z", number>>> | undefined,
  championLevelModifier = 0,
): GrandArchiveEvaluationContext {
  return {
    program,
    state,
    controllerId: playerId,
    sourceId,
    abilityBearerId: sourceId,
    bindings: {},
    ...(variables ? { variables } : {}),
    ...(championLevelModifier > 0
      ? { championLevelModifier: { controllerId: playerId, amount: championLevelModifier } }
      : {}),
  };
}

function printedReservePayment(
  program: GrandArchiveMatchProgram,
  command: Pick<ActivateCardCommand | MaterializeCommand, "cardId" | "reservePayment">,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  amount: number,
): readonly GrandArchiveProposedEvent[] {
  return payGrandArchiveReserveCost(
    program,
    state,
    playerId,
    command.reservePayment ?? [],
    amount,
    0,
    command.cardId,
  ).events;
}

function printedMemoryPayment(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  amount: number,
  paymentEvaluation: GrandArchiveEvaluationContext,
  floatingMemoryCardIds: readonly GrandArchiveObjectId[] = [],
  random: GrandArchiveMatchState["random"] = state.random,
): readonly GrandArchiveProposedEvent[] {
  if (
    new Set(floatingMemoryCardIds).size !== floatingMemoryCardIds.length ||
    floatingMemoryCardIds.length > amount
  ) {
    throw new Error("Floating Memory payment must use distinct cards up to the memory cost");
  }
  for (const objectId of floatingMemoryCardIds) {
    const object = state.objects[objectId];
    if (!object || object.ownerId !== playerId || object.zone !== "graveyard") {
      throw new Error("Floating Memory payment cards must be in the payer's graveyard");
    }
    if (!grandArchiveObjectHasActiveKeyword(program, state, object, "floating-memory")) {
      throw new Error("Selected graveyard card does not have active Floating Memory");
    }
  }
  const candidate = paymentEvaluation.sourceId
    ? state.objects[paymentEvaluation.sourceId]
    : undefined;
  if (!candidate) throw new Error("Memory payment requires its activating card");
  const requirements = collectGrandArchiveActionRules({
    action: "pay-cost",
    activationKind: "card",
    playerId,
    candidateId: candidate.id,
    fromZone: candidate.zone,
    evaluation: paymentEvaluation,
  }).filter((rule) => rule.effect.mode === "require" && rule.effect.costKind === "memory");
  for (const rule of requirements) {
    const filter = rule.effect.paymentSourceFilter;
    if (!filter) continue;
    // A Floating Memory requirement restricts the payment method, not merely
    // the printed keyword on a randomly banished memory card.
    if (
      filter.kind === "has-keyword" &&
      filter.keyword === "floating-memory" &&
      floatingMemoryCardIds.length !== amount
    ) {
      throw new Error("This memory cost must be paid entirely using Floating Memory");
    }
    for (const id of floatingMemoryCardIds) {
      const object = state.objects[id];
      if (
        !object ||
        !matchesGrandArchiveCardFilter(object, filter, {
          ...rule.evaluation,
          candidateId: id,
        })
      )
        throw new Error("Memory payment source does not satisfy its required filter");
    }
  }
  const remainingAmount = amount - floatingMemoryCardIds.length;
  const memory = state.zones[playerId].memory;
  if (memory.length < remainingAmount) {
    throw new Error(`Memory payment requires ${remainingAmount} cards in memory`);
  }
  const shuffled = shuffleGrandArchiveObjects(memory, random);
  for (const rule of requirements) {
    const filter = rule.effect.paymentSourceFilter;
    if (!filter) continue;
    for (const id of shuffled.value.slice(0, remainingAmount)) {
      const object = state.objects[id];
      if (
        !object ||
        !matchesGrandArchiveCardFilter(object, filter, {
          ...rule.evaluation,
          candidateId: id,
        })
      )
        throw new Error("Memory payment source does not satisfy its required filter");
    }
  }
  return [
    ...floatingMemoryCardIds.map((objectId) => ({
      type: "object-moved" as const,
      objectId,
      from: "graveyard" as const,
      to: "banishment" as const,
      actorId: playerId,
      cause: { kind: "rule" as const, rule: "pay-floating-memory" },
    })),
    {
      type: "random-state-changed",
      random: shuffled.random,
      cause: { kind: "rule", rule: "random-memory-payment" },
    },
    ...shuffled.value.slice(0, remainingAmount).map((objectId) => ({
      type: "object-moved" as const,
      objectId,
      from: "memory" as const,
      to: "banishment" as const,
      actorId: playerId,
      cause: { kind: "rule" as const, rule: "pay-card-memory-cost" },
    })),
  ];
}

/** Floating Memory is paid first; other non-random contributions still precede random payment. */
function orderMemoryPaymentEvents(
  memoryEvents: readonly GrandArchiveProposedEvent[],
  floatingMemoryCount: number,
  contributionEvents: readonly GrandArchiveProposedEvent[],
): readonly GrandArchiveProposedEvent[] {
  return [
    ...memoryEvents.slice(0, floatingMemoryCount),
    ...contributionEvents,
    ...memoryEvents.slice(floatingMemoryCount),
  ];
}

function kindlePaymentEvents(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  sourceId: GrandArchiveObjectId,
  selectedIds: readonly GrandArchiveObjectId[],
  maximum: number,
  reserveAmount: number,
): readonly GrandArchiveProposedEvent[] {
  if (!Number.isSafeInteger(maximum) || maximum < 0) {
    throw new Error("Kindle requires a non-negative integer allowance");
  }
  if (new Set(selectedIds).size !== selectedIds.length) {
    throw new Error("A Kindle payment card cannot be banished more than once");
  }
  if (selectedIds.length > maximum) {
    throw new Error(`Kindle permits at most ${maximum} graveyard cards`);
  }
  if (selectedIds.length > reserveAmount) {
    throw new Error("Kindle cannot pay more than the activation's reserve cost");
  }
  return selectedIds.map((objectId): GrandArchiveProposedEvent => {
    const object = state.objects[objectId];
    if (
      !object ||
      object.id === sourceId ||
      object.ownerId !== playerId ||
      object.zone !== "graveyard"
    ) {
      throw new Error("Kindle payment cards must be other cards in the activator's graveyard");
    }
    if (
      !grandArchiveObjectCurrentCharacteristics(program, state, object).elements.includes("FIRE")
    ) {
      throw new Error("Kindle payment cards must have the fire element");
    }
    return {
      type: "object-moved",
      objectId,
      from: "graveyard",
      to: "banishment",
      actorId: playerId,
      cause: { kind: "rule", rule: "pay-reserve-cost-with-kindle" },
    };
  });
}

function imbuePaymentCardIds(
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  sourceId: GrandArchiveObjectId,
  command: ActivateCardCommand,
): readonly GrandArchiveObjectId[] {
  return (command.reservePayment ?? []).flatMap((payment) => {
    if (payment.kind !== "card") return [];
    const card = state.objects[payment.cardId];
    if (!card || card.ownerId !== playerId || card.zone !== "hand" || card.id === sourceId) {
      throw new Error("Imbue can only reveal other hand cards reserved for this activation");
    }
    return [card.id];
  });
}

function imbueCardMatches(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  cardId: GrandArchiveObjectId,
  sourceElements: readonly import("@tcg/grand-archive-types").GrandArchiveElement[],
  requirement: ImbueKeyword["elementRequirement"],
): boolean {
  const card = state.objects[cardId];
  if (!card) return false;
  const elements = grandArchiveObjectCurrentCharacteristics(program, state, card).elements;
  if (requirement === "advanced") {
    return elements.some(
      (element) =>
        element !== "NORM" && element !== "FIRE" && element !== "WATER" && element !== "WIND",
    );
  }
  if (requirement === "source-elements") {
    return elements.some((element) => sourceElements.includes(element));
  }
  if ("element" in requirement) return elements.includes(requirement.element);
  return elements.some((element) => requirement.oneOf.includes(element));
}

function evaluateImbueAnnouncement(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  source: GrandArchiveCardInstance,
  face: ReturnType<typeof grandArchiveObjectFace>,
  keywords: readonly ImbueKeywordInstance[],
  command: ActivateCardCommand,
  evaluation: GrandArchiveEvaluationContext,
): {
  readonly invoked: boolean;
  readonly imbued: boolean;
  readonly revealedCardIds: readonly GrandArchiveObjectId[];
} {
  if (command.revealForImbue !== true) {
    return { invoked: false, imbued: false, revealedCardIds: [] };
  }
  if (keywords.length === 0) throw new Error("This card does not have an active Imbue ability");
  const revealedCardIds = imbuePaymentCardIds(state, playerId, source.id, command);
  // Keywords and Abilities — Imbue rules 5–6: multiple instances share the
  // smallest N, independently of which listed characteristic the player uses.
  const thresholds = keywords.map((instance) => {
    const keyword = instance.keyword;
    const printedAbility = flattenGrandArchiveAbilities(face.abilities).find(
      (ability) =>
        ability.kind === "static" &&
        ability.staticKind === "intrinsic" &&
        ability.keyword === keyword,
    );
    if (printedAbility?.variables) {
      validateGrandArchiveChosenVariables(printedAbility.variables, [], evaluation);
    }
    const amount = evaluateGrandArchiveActiveKeywordAmount(instance, keyword.value, evaluation);
    if (!Number.isSafeInteger(amount) || amount < 0) {
      throw new Error("Imbue requires a non-negative integer threshold");
    }
    return amount;
  });
  const threshold = Math.min(...thresholds);
  const sourceElements = grandArchiveObjectCurrentCharacteristics(program, state, source).elements;
  const thresholdSatisfied = keywords.some(({ keyword }) => {
    const matching = revealedCardIds.filter((cardId) =>
      imbueCardMatches(program, state, cardId, sourceElements, keyword.elementRequirement),
    ).length;
    return matching >= threshold;
  });
  const imbueIsForbidden =
    thresholdSatisfied &&
    collectGrandArchiveActionRules({
      action: "imbue",
      activationKind: "card",
      playerId,
      candidateId: source.id,
      fromZone: source.zone,
      evaluation,
    }).some((rule) => rule.effect.mode === "forbid");
  const imbued = thresholdSatisfied && !imbueIsForbidden;
  return { invoked: true, imbued, revealedCardIds };
}

export function proposeGrandArchiveCardActivation(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  command: ActivateCardCommand,
  activationContext: GrandArchiveCardActivationContext = {},
): GrandArchiveActivationProposal {
  const activatedViaStarcalling = command.activationMethod === "starcalling";
  const activatedViaBrew = command.activationMethod === "brew";
  const effectGranted = activationContext.effect !== undefined;
  const paysCosts = activationContext.effect?.payCosts !== false;
  if (!effectGranted && !activatedViaStarcalling && state.opportunity?.holderId !== playerId) {
    throw new Error("Player does not have Opportunity");
  }
  const card = state.objects[command.cardId];
  if (!card) throw new Error("The activated card does not exist");
  const face = grandArchiveObjectFace(program, card);
  const characteristics = grandArchiveObjectCurrentCharacteristics(program, state, card);
  const storedEmpower = state.players[playerId]?.states.empower;
  const empowerAmount =
    characteristics.subtypes.includes("SPELL") &&
    typeof storedEmpower === "number" &&
    storedEmpower > 0
      ? storedEmpower
      : 0;
  const elysianAuraAmount =
    characteristics.subtypes.includes("AENEAN") &&
    characteristics.subtypes.includes("SPELL") &&
    grandArchivePlayerControlsActiveKeyword(program, state, playerId, "elysian-aura")
      ? 2
      : 0;
  let evaluation: GrandArchiveEvaluationContext = {
    ...baseEvaluation(
      program,
      state,
      playerId,
      card.id,
      command.variables,
      empowerAmount + elysianAuraAmount,
    ),
    candidateId: card.id,
  };
  const activationActionRules = collectGrandArchiveActionRules({
    action: "activate",
    activationKind: "card",
    playerId,
    candidateId: card.id,
    fromZone: card.zone,
    evaluation,
  });
  const playActionRules = collectGrandArchiveActionRules({
    action: "play",
    activationKind: "card",
    playerId,
    candidateId: card.id,
    fromZone: card.zone,
    evaluation,
  });
  assertActionRuleLegality([...activationActionRules, ...playActionRules], "Card activation");
  assertPlayerCanPlayCard(program, state, playerId);
  const activationAllows = [...activationActionRules, ...playActionRules].filter((rule) =>
    ruleGrantsPermissionToPlayer(rule, playerId),
  );
  if (!effectGranted && card.controllerId !== playerId && activationAllows.length === 0) {
    throw new Error("Player does not control this card and has no permission to activate it");
  }
  const activeKeywordInstances = grandArchiveObjectActiveKeywordInstances(program, state, card);
  const activeKeywords = activeKeywordInstances.map((instance) => instance.keyword);
  const imbueKeywords = activeKeywordInstances.filter(
    (instance): instance is ImbueKeywordInstance => instance.keyword.name === "imbue",
  );
  if (command.revealForImbue !== undefined && imbueKeywords.length === 0) {
    throw new Error("This card does not have an active Imbue ability");
  }
  const kindleKeywords = activeKeywordInstances.filter(
    (
      instance,
    ): instance is GrandArchiveActiveKeywordInstance & { readonly keyword: KindleKeyword } =>
      instance.keyword.name === "kindle",
  );
  if (command.kindleCardIds !== undefined && kindleKeywords.length === 0) {
    throw new Error("This card does not have an active Kindle ability");
  }
  const prepareKeywords = activeKeywordInstances.filter(
    (
      instance,
    ): instance is GrandArchiveActiveKeywordInstance & {
      readonly keyword: GrandArchiveKeyword & {
        readonly name: "prepare";
        readonly value: import("@tcg/grand-archive-types").GrandArchiveAmount;
      };
    } => instance.keyword.name === "prepare",
  );
  const prepareAbilityIndexes = command.prepareAbilityIndexes ?? [];
  if (new Set(prepareAbilityIndexes).size !== prepareAbilityIndexes.length) {
    throw new Error("A Prepare ability cannot be paid more than once");
  }
  const selectedPrepareKeywords = prepareAbilityIndexes.map((index) => {
    const instance = prepareKeywords[index];
    if (!instance) throw new Error(`Prepare ability index ${index} is not active`);
    return instance;
  });
  const paysPrepare = selectedPrepareKeywords.length > 0;
  let prepareChampion: import("../../game/model.ts").GrandArchiveCardInstance | undefined;
  const prepareAmounts: number[] = [];
  if (paysPrepare) {
    for (const instance of selectedPrepareKeywords) {
      const keyword = instance.keyword;
      const printedAbility = flattenGrandArchiveAbilities(face.abilities).find(
        (ability) =>
          ability.kind === "static" &&
          ability.staticKind === "intrinsic" &&
          ability.keyword === keyword,
      );
      if (printedAbility?.variables) {
        validateGrandArchiveChosenVariables(printedAbility.variables, [], evaluation);
      }
      const amount = evaluateGrandArchiveActiveKeywordAmount(instance, keyword.value, evaluation);
      if (!Number.isSafeInteger(amount) || amount < 0) {
        throw new Error("Prepare requires a non-negative integer counter cost");
      }
      prepareAmounts.push(amount);
    }
    prepareChampion = Object.values(state.objects).find(
      (object) =>
        object.controllerId === playerId &&
        object.zone === "field" &&
        grandArchiveObjectCurrentCharacteristics(program, state, object).types.includes("CHAMPION"),
    );
    const totalPrepareAmount = prepareAmounts.reduce((total, amount) => total + amount, 0);
    if (!prepareChampion || (prepareChampion.counters.preparation ?? 0) < totalPrepareAmount) {
      throw new Error(
        `Selected Prepare costs require ${totalPrepareAmount} preparation counters on your champion`,
      );
    }
  }
  const isAttackCard = characteristics.types.includes("ATTACK");
  const activeCommandKeywords = activeKeywords.filter(
    (keyword): keyword is Extract<GrandArchiveKeyword, { readonly name: "command" }> =>
      keyword.name === "command",
  );
  const attackAttacker = command.attackAttackerId
    ? state.objects[command.attackAttackerId]
    : undefined;
  if (isAttackCard) {
    if (
      !attackAttacker ||
      attackAttacker.zone !== "field" ||
      attackAttacker.controllerId !== playerId ||
      attackAttacker.states.has("rested")
    ) {
      throw new Error("An Attack activation must select an awake controlled unit");
    }
    const attackerCharacteristics = grandArchiveObjectCurrentCharacteristics(
      program,
      state,
      attackAttacker,
    );
    if (activeCommandKeywords.length > 0) {
      if (
        !attackerCharacteristics.types.includes("ALLY") ||
        !activeCommandKeywords.some((keyword) =>
          attackerCharacteristics.subtypes.includes(keyword.subtype.toUpperCase()),
        )
      ) {
        const allowedSubtypes = [
          ...new Set(activeCommandKeywords.map((keyword) => keyword.subtype)),
        ].join(" or ");
        throw new Error(`Command requires an awake ${allowedSubtypes} ally`);
      }
    } else if (!attackerCharacteristics.types.includes("CHAMPION")) {
      throw new Error("A non-Command Attack must rest the activator's champion");
    }
  } else if (command.attackAttackerId !== undefined) {
    throw new Error("Only an Attack card activation may select an attack unit");
  }
  const activatedViaEphemerate = command.activationMethod === "ephemerate";
  const activeAlternativeKeywords = activeKeywords.filter(isAlternativeActivationKeyword);
  const activeBrewKeywords = activeKeywords.filter(
    (keyword): keyword is BrewKeyword => keyword.name === "brew",
  );
  const grantedKeyword = activationContext.starcalling?.grantedKeyword;
  const grantedStarcalling =
    grantedKeyword &&
    isAlternativeActivationKeyword(grantedKeyword) &&
    grantedKeyword.name === "starcalling"
      ? grantedKeyword
      : undefined;
  const alternativeKeyword = activatedViaEphemerate
    ? activeAlternativeKeywords.find((keyword) => keyword.name === "ephemerate")
    : activatedViaStarcalling
      ? (activeAlternativeKeywords.find((keyword) => keyword.name === "starcalling") ??
        grantedStarcalling)
      : undefined;
  if (activatedViaEphemerate) {
    if (card.zone !== "graveyard" || !alternativeKeyword) {
      throw new Error("Ephemerate requires an eligible card in the activator's graveyard");
    }
    if (
      alternativeKeyword.activationCondition &&
      !evaluateGrandArchiveCondition(alternativeKeyword.activationCondition, evaluation)
    ) {
      throw new Error("The Ephemerate activation condition is not satisfied");
    }
  } else if (activatedViaStarcalling) {
    if (
      card.zone !== "main-deck" ||
      !activationContext.starcalling?.cardIds.includes(card.id) ||
      !alternativeKeyword ||
      alternativeKeyword.name !== "starcalling"
    ) {
      throw new Error("Starcalling requires an eligible card in the current Glimpse");
    }
    if (
      alternativeKeyword.activationCondition &&
      !evaluateGrandArchiveCondition(alternativeKeyword.activationCondition, evaluation)
    ) {
      throw new Error("The Starcalling activation condition is not satisfied");
    }
  } else if (activatedViaBrew) {
    if (card.zone !== "hand" || face.cost.kind !== "reserve" || activeBrewKeywords.length === 0) {
      throw new Error("Brew requires a reserve-cost card with active Brew in the activator's hand");
    }
  } else if (effectGranted) {
    if (command.activationMethod !== undefined) {
      throw new Error("Effect-granted activation cannot declare another activation method");
    }
  } else if (
    card.zone !== "hand" &&
    !activationAllows.some((rule) => rule.effect.fromZone === card.zone)
  ) {
    throw new Error("No active rule permits this card to be activated from its current zone");
  }
  if (!activatedViaBrew && command.brewIngredientIds !== undefined) {
    throw new Error("Brew ingredients may only be declared for a Brew activation");
  }
  const fastActivationRules = collectGrandArchiveActionRules({
    action: "activate-fast",
    activationKind: "card",
    playerId,
    candidateId: card.id,
    fromZone: card.zone,
    evaluation,
  });
  assertActionRuleLegality(fastActivationRules, "Fast activation");
  const speed =
    activationContext.effect?.speed ??
    (fastActivationRules.some((rule) => ruleGrantsPermissionToPlayer(rule, playerId))
      ? "fast"
      : (face.speed ??
        (grandArchiveObjectHasActiveKeyword(program, state, card, "fast-activation")
          ? "fast"
          : "slow")));
  if (
    !effectGranted &&
    !activatedViaStarcalling &&
    speed === "slow" &&
    !isSlowTimingLegal(state, playerId)
  ) {
    throw new Error("Slow cards require the turn player's empty-stack Main phase");
  }
  const enabled = grandArchivePlayerEnabledElements(program, state, playerId);
  const ignoredElementRules = collectGrandArchiveActionRules({
    action: "ignore-element-requirement",
    activationKind: "card",
    playerId,
    candidateId: card.id,
    fromZone: card.zone,
    evaluation,
  }).filter((rule) => ruleGrantsPermissionToPlayer(rule, playerId));
  const missingElements = characteristics.elements.filter((element) => !enabled.has(element));
  if (
    !activationContext.effect?.ignoreElementRequirements &&
    missingElements.some(
      (element) =>
        !ignoredElementRules.some(
          (rule) =>
            rule.effect.elementRequirement === undefined ||
            rule.effect.elementRequirement === element,
        ),
    )
  ) {
    throw new Error("The activator does not have every required element enabled");
  }
  const imbueAnnouncement = evaluateImbueAnnouncement(
    program,
    state,
    playerId,
    card,
    face,
    imbueKeywords,
    command,
    evaluation,
  );
  if (imbueAnnouncement.imbued) {
    evaluation = { ...evaluation, announcementActivationStates: ["imbued"] };
  }
  const resolution = composeGrandArchiveCardResolution(face, evaluation);
  const announcedCardResolutionAbilities = captureGrandArchiveCardResolutionAbilities(
    face,
    evaluation,
  );
  const modes = declareGrandArchiveModes(
    getGrandArchiveAnnouncementModes(resolution?.modes, resolution?.effect, evaluation),
    command.modeIds,
    evaluation,
  );
  validateGrandArchiveChosenVariables(resolution?.variables, modes.modes, evaluation);
  const targetDeclarations = collectGrandArchiveCardTargets(
    program,
    state,
    card,
    resolution?.targets,
    modes.modes,
  );
  const targets = declareGrandArchiveTargets(targetDeclarations, command.targets, {
    ...evaluation,
    targeting: grandArchiveTargetingContext("card-activation", characteristics.subtypes, [
      resolution?.effect,
      ...modes.modes.map((mode) => mode.effect),
    ]),
  });
  assertGrandArchiveReservePaymentDistinct(command.reservePayment ?? []);
  if (
    new Set(command.floatingMemoryCardIds ?? []).size !==
    (command.floatingMemoryCardIds?.length ?? 0)
  ) {
    throw new Error("A Floating Memory card cannot be used twice");
  }
  if (
    (activatedViaBrew ||
      activatedViaEphemerate ||
      activatedViaStarcalling ||
      face.cost.kind !== "memory") &&
    (command.floatingMemoryCardIds?.length ?? 0) > 0
  ) {
    throw new Error("Floating Memory can only pay a memory cost");
  }
  const paymentEvaluation: GrandArchiveEvaluationContext = {
    ...evaluation,
    bindings: Object.fromEntries(targets.map((target) => [target.binding, target.targetIds])),
    declaredTargetIds: targets.flatMap((target) => target.targetIds),
  };
  const activationCostRequest: GrandArchiveRuleRequest = {
    action: "activate",
    activationKind: "card",
    playerId,
    candidateId: card.id,
    fromZone: card.zone,
    evaluation: paymentEvaluation,
  };
  const activationCostRules = [
    ...collectGrandArchiveCostRules(activationCostRequest),
    ...cardResolutionActivationCostRules(
      resolution,
      card,
      activationCostRequest,
      paymentEvaluation,
    ),
  ].sort((left, right) => left.timestamp - right.timestamp || left.order - right.order);
  const optionalReplacementCostRules = collectGrandArchiveCostRules({
    action: "pay-cost",
    activationKind: "card",
    costComponent: activatedViaStarcalling
      ? "starcalling"
      : activatedViaEphemerate
        ? "ephemerate"
        : "activation",
    playerId,
    candidateId: card.id,
    fromZone: card.zone,
    evaluation: paymentEvaluation,
  });
  const paymentContributionRules = collectGrandArchivePaymentContributionRules({
    action: "pay-cost",
    activationKind: "card",
    playerId,
    candidateId: card.id,
    fromZone: card.zone,
    evaluation: paymentEvaluation,
  });
  const chosenReplacementRule = paysCosts
    ? selectedReplacementRule(
        !activatedViaBrew &&
          (activatedViaEphemerate || activatedViaStarcalling || face.cost.kind !== "none"),
        activationCostRules,
        optionalReplacementCostRules,
        command.costOptionIndex,
      )
    : undefined;
  const usesZonePermission =
    card.zone !== "hand" &&
    !effectGranted &&
    !activatedViaBrew &&
    !activatedViaEphemerate &&
    !activatedViaStarcalling;
  const zonePermissions = activationAllows.filter((rule) => rule.effect.fromZone === card.zone);
  const permissionCosts =
    usesZonePermission && !zonePermissions.some((rule) => !rule.effect.cost)
      ? zonePermissions.flatMap((rule) => (rule.effect.cost ? [rule.effect.cost] : []))
      : [];
  const [firstPermissionCost, secondPermissionCost, ...otherPermissionCosts] = permissionCosts;
  const permissionCost: GrandArchiveAbilityCost | undefined = firstPermissionCost
    ? secondPermissionCost
      ? {
          kind: "one-of",
          costs: [firstPermissionCost, secondPermissionCost, ...otherPermissionCosts],
        }
      : firstPermissionCost
    : undefined;
  const ruleAdditionalCosts = [
    ...addedCostsFromRules(activationCostRules),
    ...(permissionCost ? [permissionCost] : []),
  ];
  const kindleCardIds = command.kindleCardIds ?? [];
  const mandatoryReplacementCostActive = activationCostRules.some(
    (rule) => rule.effect.mode === "replace-cost",
  );
  const optionalReplacementCostSelected =
    optionalReplacementCostRules.some((rule) => rule.effect.mode === "replace-cost") &&
    (command.costOptionIndex ?? 0) > 0;
  if (
    kindleCardIds.length > 0 &&
    (mandatoryReplacementCostActive || optionalReplacementCostSelected)
  ) {
    throw new Error("Kindle cannot pay a replaced activation cost");
  }
  const kindleMaximum = paysCosts
    ? kindleKeywords.reduce((total, instance) => {
        const keyword = instance.keyword;
        const printedAbility = flattenGrandArchiveAbilities(face.abilities).find(
          (ability) =>
            ability.kind === "static" &&
            ability.staticKind === "intrinsic" &&
            ability.keyword === keyword,
        );
        if (printedAbility?.variables) {
          validateGrandArchiveChosenVariables(
            printedAbility.variables,
            modes.modes,
            paymentEvaluation,
          );
        }
        const amount = evaluateGrandArchiveActiveKeywordAmount(
          instance,
          keyword.value,
          paymentEvaluation,
        );
        if (!Number.isSafeInteger(amount) || amount < 0) {
          throw new Error("Kindle requires a non-negative integer allowance");
        }
        return total + amount;
      }, 0)
    : 0;
  let paymentEvents: readonly GrandArchiveProposedEvent[];
  let paidBindings: GrandArchiveEvaluationContext["bindings"];
  if (!paysCosts) {
    if (
      command.brewIngredientIds !== undefined ||
      (command.reservePayment?.length ?? 0) > 0 ||
      (command.kindleCardIds?.length ?? 0) > 0 ||
      (command.floatingMemoryCardIds?.length ?? 0) > 0 ||
      (command.paymentContributions?.length ?? 0) > 0 ||
      (command.costSelections?.length ?? 0) > 0 ||
      (command.costPaymentOrders?.length ?? 0) > 0 ||
      command.costOptionIndex !== undefined ||
      command.payOptionalCost !== undefined ||
      command.prepareAbilityIndexes !== undefined ||
      command.revealForImbue !== undefined
    ) {
      throw new Error("A cost-free activation cannot include payment declarations");
    }
    paymentEvents = [];
    paidBindings = {};
  } else if (activatedViaEphemerate || activatedViaStarcalling) {
    if (!alternativeKeyword) {
      throw new Error("Alternative activation ability is no longer available");
    }
    const alternativeCost = effectiveAlternativeActivationCost(
      alternativeKeyword,
      paymentEvaluation,
    );
    let payableAlternativeCost = alternativeCost;
    if (alternativeCost.kind === "pay-reserve") {
      const alternativeAmount = evaluateGrandArchiveAmount(
        alternativeCost.amount,
        paymentEvaluation,
      );
      payableAlternativeCost = {
        ...alternativeCost,
        amount: numericCostAfterRules(
          alternativeAmount,
          "reserve",
          "activation",
          activationCostRules,
        ),
      };
    }
    let kindleEvents: readonly GrandArchiveProposedEvent[] = [];
    if (kindleCardIds.length > 0) {
      if (payableAlternativeCost.kind !== "pay-reserve") {
        throw new GrandArchiveUnsupportedRuleError("Kindle with a non-reserve alternative cost");
      }
      const alternativeAmount = evaluateGrandArchiveAmount(
        payableAlternativeCost.amount,
        paymentEvaluation,
      );
      kindleEvents = kindlePaymentEvents(
        program,
        state,
        playerId,
        card.id,
        kindleCardIds,
        kindleMaximum,
        alternativeAmount,
      );
      payableAlternativeCost = {
        ...payableAlternativeCost,
        amount: alternativeAmount - kindleCardIds.length,
      };
    }
    const primaryCost = replacementCostFromRules(
      payableAlternativeCost,
      activationCostRules,
      optionalReplacementCostRules,
    );
    if (!primaryCost)
      throw new GrandArchiveUnsupportedRuleError("activation without a payable cost");
    const contribution = applyGrandArchivePaymentContributions(
      primaryCost,
      paymentContributionRules,
      command.paymentContributions,
      paymentEvaluation,
      command,
    );
    const combinedCost = combineGrandArchiveCosts([
      contribution.cost,
      ...ruleAdditionalCosts,
      ...(resolution?.additionalCost ? [resolution.additionalCost] : []),
    ]);
    if (!combinedCost) throw new GrandArchiveUnsupportedRuleError("activation without costs");
    const payment = payGrandArchiveAbilityCost(combinedCost, command, paymentEvaluation);
    assertIndependentPaymentSourcesDistinct([kindleEvents, contribution.events, payment.events]);
    paymentEvents = [...kindleEvents, ...contribution.events, ...payment.events];
    paidBindings = { ...contribution.paidBindings, ...payment.paidBindings };
  } else if (activatedViaBrew) {
    if (kindleCardIds.length > 0) {
      throw new Error("Kindle cannot pay a Brew alternative cost");
    }
    if ((command.paymentContributions?.length ?? 0) > 0) {
      throw new Error("Payment contributions cannot pay a Brew alternative cost");
    }
    const ingredientIds = command.brewIngredientIds ?? [];
    let brewEvents: readonly GrandArchiveProposedEvent[] | undefined;
    let brewFailure: Error | undefined;
    for (const keyword of activeBrewKeywords) {
      try {
        brewEvents = brewPaymentEvents(
          program,
          state,
          playerId,
          keyword,
          ingredientIds,
          paymentEvaluation,
        );
        break;
      } catch (error) {
        if (error instanceof Error) brewFailure = error;
        else throw error;
      }
    }
    if (!brewEvents) {
      throw brewFailure ?? new Error("The declared Brew cost cannot be paid");
    }
    const additionalCost = combineGrandArchiveCosts([
      ...ruleAdditionalCosts,
      ...(resolution?.additionalCost ? [resolution.additionalCost] : []),
    ]);
    const additionalPayment = additionalCost
      ? payGrandArchiveAbilityCost(additionalCost, command, paymentEvaluation)
      : { events: [], paidBindings: {}, paidUnits: 0 };
    if (
      !additionalCost &&
      ((command.reservePayment?.length ?? 0) > 0 ||
        (command.costSelections?.length ?? 0) > 0 ||
        (command.costPaymentOrders?.length ?? 0) > 0)
    ) {
      throw new Error("A Brew activation includes payment declarations that are not required");
    }
    paymentEvents = [...brewEvents, ...additionalPayment.events];
    paidBindings = additionalPayment.paidBindings;
  } else {
    const declaredAmount =
      face.cost.kind === "none"
        ? undefined
        : typeof face.cost.amount === "number"
          ? face.cost.amount
          : command.variables?.[face.cost.amount.symbol];
    if (face.cost.kind !== "none" && (declaredAmount === undefined || declaredAmount < 0)) {
      throw new Error(`Variable ${face.cost.kind} cost must be declared`);
    }
    const efficiencyCount = activeKeywordInstances.filter(
      (instance) => instance.keyword.name === "efficiency",
    ).length;
    const efficiencyReduction =
      face.cost.kind === "reserve" && efficiencyCount > 0
        ? efficiencyCount *
          evaluateGrandArchiveAmount(
            {
              kind: "property",
              subject: { kind: "champion", player: "controller" },
              property: "level",
              basis: "current",
              missing: "zero",
            },
            evaluation,
          )
        : 0;
    const resolvedAeneanProgression = state.players[playerId]?.states.aeneanProgressionResolved;
    const aeneanProgressionCount = activeKeywordInstances.filter(
      (instance) => instance.keyword.name === "aenean-progression",
    ).length;
    const aeneanProgressionIncrease =
      face.cost.kind === "reserve" && aeneanProgressionCount > 0
        ? 2 *
          aeneanProgressionCount *
          (typeof resolvedAeneanProgression === "number" ? resolvedAeneanProgression : 0)
        : 0;
    const effectCostModification = effectGrantedNumericCostModification(
      activationContext.effect?.costModifiers,
      paymentEvaluation,
    );
    const numericAmount = (() => {
      if (face.cost.kind === "none") return undefined;
      if (declaredAmount === undefined) {
        throw new Error(`Variable ${face.cost.kind} cost must be declared`);
      }
      return numericCostAfterRules(
        effectCostModification.setTo ?? declaredAmount,
        face.cost.kind,
        "activation",
        activationCostRules,
        aeneanProgressionIncrease - efficiencyReduction + effectCostModification.adjustment,
      );
    })();
    if (kindleCardIds.length > 0 && face.cost.kind !== "reserve") {
      throw new Error("Kindle can only pay a reserve activation cost");
    }
    const kindleEvents =
      face.cost.kind === "reserve" && numericAmount !== undefined
        ? kindlePaymentEvents(
            program,
            state,
            playerId,
            card.id,
            kindleCardIds,
            kindleMaximum,
            numericAmount,
          )
        : [];
    const payableNumericAmount =
      numericAmount === undefined ? undefined : numericAmount - kindleCardIds.length;
    const baseCost: GrandArchiveAbilityCost | undefined =
      face.cost.kind === "reserve" && payableNumericAmount !== undefined
        ? { kind: "pay-reserve", amount: payableNumericAmount }
        : face.cost.kind === "memory" && payableNumericAmount !== undefined
          ? { kind: "pay-memory", amount: payableNumericAmount }
          : undefined;
    const primaryCost = replacementCostFromRules(
      baseCost,
      activationCostRules,
      optionalReplacementCostRules,
    );
    if (!primaryCost && (command.paymentContributions?.length ?? 0) > 0) {
      throw new Error("Card activation has no reserve or memory cost to contribute toward");
    }
    const contribution = primaryCost
      ? applyGrandArchivePaymentContributions(
          primaryCost,
          paymentContributionRules,
          command.paymentContributions,
          paymentEvaluation,
          command,
        )
      : undefined;
    const contributedPrimaryCost = contribution?.cost;
    const nonMemoryCosts = combineGrandArchiveCosts([
      ...(contributedPrimaryCost ? [contributedPrimaryCost] : []),
      ...ruleAdditionalCosts,
      ...(resolution?.additionalCost ? [resolution.additionalCost] : []),
    ]);
    if (
      face.cost.kind === "memory" &&
      contributedPrimaryCost?.kind === "pay-memory" &&
      !activationCostRules.some((rule) => rule.effect.mode === "replace-cost") &&
      optionalReplacementCostRules.length === 0
    ) {
      if (payableNumericAmount === undefined) {
        throw new GrandArchiveUnsupportedRuleError("memory activation without a numeric cost");
      }
      const remainingMemoryAmount = evaluateGrandArchiveAmount(
        contributedPrimaryCost.amount,
        paymentEvaluation,
      );
      const memoryEvents = printedMemoryPayment(
        program,
        state,
        playerId,
        remainingMemoryAmount,
        paymentEvaluation,
        command.floatingMemoryCardIds,
        modes.random ?? state.random,
      );
      const extraCost = combineGrandArchiveCosts([
        ...ruleAdditionalCosts,
        ...(resolution?.additionalCost ? [resolution.additionalCost] : []),
      ]);
      const extraPayment = extraCost
        ? payGrandArchiveAbilityCost(extraCost, command, paymentEvaluation)
        : { events: [], paidBindings: {}, paidUnits: 0 };
      assertIndependentPaymentSourcesDistinct([
        kindleEvents,
        contribution?.events ?? [],
        memoryEvents,
        extraPayment.events,
      ]);
      paymentEvents = [
        ...kindleEvents,
        ...orderMemoryPaymentEvents(
          memoryEvents,
          command.floatingMemoryCardIds?.length ?? 0,
          contribution?.events ?? [],
        ),
        ...extraPayment.events,
      ];
      paidBindings = { ...contribution?.paidBindings, ...extraPayment.paidBindings };
    } else if (nonMemoryCosts) {
      if ((command.floatingMemoryCardIds?.length ?? 0) > 0) {
        throw new GrandArchiveUnsupportedRuleError(
          "Floating Memory with a replacement or composite activation cost",
        );
      }
      const payment = payGrandArchiveAbilityCost(nonMemoryCosts, command, paymentEvaluation);
      assertIndependentPaymentSourcesDistinct([
        kindleEvents,
        contribution?.events ?? [],
        payment.events,
      ]);
      paymentEvents = [...kindleEvents, ...(contribution?.events ?? []), ...payment.events];
      paidBindings = { ...contribution?.paidBindings, ...payment.paidBindings };
    } else {
      if (
        (command.reservePayment?.length ?? 0) > 0 ||
        (command.costSelections?.length ?? 0) > 0 ||
        (command.costPaymentOrders?.length ?? 0) > 0
      ) {
        throw new Error("Card activation includes payment declarations that are not required");
      }
      paymentEvents = kindleEvents;
      paidBindings = {};
    }
  }
  if (imbueAnnouncement.invoked) {
    const revealed = new Set<GrandArchiveObjectId>(imbueAnnouncement.revealedCardIds);
    paymentEvents = paymentEvents.map((event) =>
      event.type === "object-moved" &&
      event.from === "hand" &&
      event.to === "memory" &&
      revealed.has(event.objectId)
        ? { ...event, entryFacing: "face-down" as const }
        : event,
    );
  }
  if (prepareChampion && prepareAmounts.some((amount) => amount > 0)) {
    paymentEvents = [
      ...paymentEvents,
      ...prepareAmounts.flatMap((amount): readonly GrandArchiveProposedEvent[] =>
        amount > 0
          ? [
              {
                type: "counter-changed",
                objectId: prepareChampion.id,
                counter: "preparation",
                delta: -amount,
                actorId: playerId,
                cause: { kind: "rule", rule: "prepare-additional-cost" },
              },
            ]
          : [],
      ),
    ];
  }
  const activationPayment = [
    ...activationPaymentRecords(paymentEvents),
    ...(paysCosts && attackAttacker ? [{ objectId: attackAttacker.id }] : []),
  ];
  const activationStates = [
    ...(paysPrepare ? (["prepared"] as const) : []),
    ...(imbueAnnouncement.imbued ? (["imbued"] as const) : []),
    ...(empowerAmount > 0 ? (["empowered"] as const) : []),
    ...(activatedViaBrew ? (["brewed"] as const) : []),
    ...(activatedViaEphemerate ? (["ephemeral"] as const) : []),
    ...(activatedViaStarcalling ? (["starcalled"] as const) : []),
  ];
  const permissionResult = activationResultFromRules([
    ...activationAllows,
    ...(chosenReplacementRule ? [chosenReplacementRule] : []),
  ]);
  const keywordEntryState = alternativeKeyword?.activationResult?.entryState;
  const activationResult: GrandArchiveCardActivationResult = {
    entryStateChanges: [
      ...permissionResult.entryStateChanges,
      ...(keywordEntryState ? [keywordEntryState] : []),
    ],
    afterResolutionEffects: permissionResult.afterResolutionEffects,
  };
  const entryEvent: GrandArchiveProposedEvent = {
    type: "object-moved",
    objectId: card.id,
    from: card.zone,
    to: "effects-stack",
    newControllerId: playerId,
    entryActivationStates: activationStates,
    entryActivationPayment: activationPayment,
    entryActivationBindings: paidBindings,
    entryActivationVariables: command.variables ?? {},
    ...(activatedViaEphemerate &&
    !grandArchiveCardIsObject(face) &&
    !characteristics.types.includes("ATTACK")
      ? { entryStates: ["ephemeral" as const] }
      : {}),
    actorId: playerId,
    cause: effectGranted
      ? { kind: "rule", rule: "effect-granted-activation" }
      : { kind: "command", move: "activate-card" },
  };
  let finalizedResolution = resolution;
  let finalizedAnnouncements = announcedCardResolutionAbilities;
  let finalizedTargetDeclarations = targetDeclarations;
  let finalizedTargets = targets;
  if (paymentEvents.length > 0) {
    // Card Activation 1.8.2 repeats announcement-dependent work when paying
    // costs modifies the activation. Preview the already validated payment in
    // rules order so static restrictions such as Memory N+ are sampled at the
    // end of cost payment, before the activation is finalized in step 1.9.
    const paymentCompletedState = new GrandArchiveTransactionKernel().transact(state, [
      entryEvent,
      ...paymentEvents,
      ...(paysCosts && attackAttacker
        ? [
            {
              type: "object-state-changed" as const,
              objectId: attackAttacker.id,
              state: "rested" as const,
              value: true,
              actorId: playerId,
              cause: { kind: "rule" as const, rule: "attack-card-additional-cost" },
            },
          ]
        : []),
    ]).state;
    const paymentCompletedEvaluation: GrandArchiveEvaluationContext = {
      ...paymentEvaluation,
      state: paymentCompletedState,
      bindings: { ...paymentEvaluation.bindings, ...paidBindings },
    };
    const paymentCompletedAnnouncements = captureGrandArchiveCardResolutionAbilities(
      face,
      paymentCompletedEvaluation,
    );
    if (
      capturedRestrictionStateChanged(
        announcedCardResolutionAbilities,
        paymentCompletedAnnouncements,
      )
    ) {
      const paymentCompletedResolution = composeGrandArchiveCardResolution(
        face,
        paymentCompletedEvaluation,
      );
      const beforeModes = getGrandArchiveAnnouncementModes(
        resolution?.modes,
        resolution?.effect,
        paymentEvaluation,
      );
      const afterModes = getGrandArchiveAnnouncementModes(
        paymentCompletedResolution?.modes,
        paymentCompletedResolution?.effect,
        paymentCompletedEvaluation,
      );
      if (
        !sameAnnouncementDeclaration(beforeModes, afterModes) ||
        !sameAnnouncementDeclaration(
          resolution?.additionalCost,
          paymentCompletedResolution?.additionalCost,
        ) ||
        !sameAnnouncementDeclaration(
          resolution?.activationRules,
          paymentCompletedResolution?.activationRules,
        ) ||
        !sameAnnouncementDeclaration(resolution?.variables, paymentCompletedResolution?.variables)
      ) {
        throw new GrandArchiveUnsupportedRuleError(
          "cost-payment restriction change requiring new modes, costs, rules, or variables",
        );
      }
      const paymentCompletedCard = paymentCompletedState.objects[card.id];
      if (!paymentCompletedCard) {
        throw new Error("The activated card disappeared while previewing its cost payment");
      }
      const paymentCompletedTargetDeclarations = collectGrandArchiveCardTargets(
        program,
        paymentCompletedState,
        paymentCompletedCard,
        paymentCompletedResolution?.targets,
        modes.modes,
      );
      if (!sameAnnouncementDeclaration(targetDeclarations, paymentCompletedTargetDeclarations)) {
        throw new GrandArchiveUnsupportedRuleError(
          "cost-payment restriction change requiring new target declarations",
        );
      }
      validateGrandArchiveChosenVariables(
        paymentCompletedResolution?.variables,
        modes.modes,
        paymentCompletedEvaluation,
      );
      finalizedTargets = declareGrandArchiveTargets(
        paymentCompletedTargetDeclarations,
        command.targets,
        {
          ...paymentCompletedEvaluation,
          targeting: grandArchiveTargetingContext("card-activation", characteristics.subtypes, [
            paymentCompletedResolution?.effect,
            ...modes.modes.map((mode) => mode.effect),
          ]),
        },
      );
      finalizedResolution = paymentCompletedResolution;
      finalizedAnnouncements = paymentCompletedAnnouncements;
      finalizedTargetDeclarations = paymentCompletedTargetDeclarations;
    }
  }
  const stackItem: GrandArchiveStackItem = {
    id: grandArchiveStackItemId(`stack-${state.nextStackOrdinal}`),
    kind: "card-activation",
    controllerId: playerId,
    sourceId: card.id,
    ...(attackAttacker ? { attackAttackerId: attackAttacker.id } : {}),
    selectedModeIds: modes.ids,
    cardId: card.id,
    originZone: card.zone,
    paidCostKind: !paysCosts
      ? "none"
      : activatedViaBrew || activatedViaEphemerate || activatedViaStarcalling
        ? "reserve"
        : face.cost.kind,
    elysianAuraActiveAtAnnouncement: elysianAuraAmount > 0,
    announcedCardResolutionAbilities: finalizedAnnouncements,
    ...(activationResult.entryStateChanges.length > 0 ||
    activationResult.afterResolutionEffects.length > 0
      ? { activationResult }
      : {}),
    ...(finalizedResolution ? { ability: finalizedResolution } : {}),
    targetDeclarations: finalizedTargetDeclarations,
    targets: finalizedTargets,
    createdAtVersion: state.stateVersion,
    activationPhase: state.turn.phase,
    isCopy: false,
    negated: false,
    opportunityPolicy: activeKeywords.some((keyword) => keyword.name === "interdiction")
      ? "interdiction"
      : "normal",
    activationStates,
    activationPayment,
    championLevelModifier: empowerAmount,
    variables: command.variables ?? {},
    bindings: paidBindings,
  };
  return {
    stackItem,
    events: [
      ...(modes.random
        ? [
            {
              type: "random-state-changed" as const,
              random: modes.random,
              cause: { kind: "rule" as const, rule: "random-mode-selection" },
            },
          ]
        : []),
      entryEvent,
      ...grandArchiveModeTrackingEvents(
        modes,
        playerId,
        effectGranted
          ? { kind: "rule", rule: "effect-granted-activation" }
          : { kind: "command", move: "activate-card" },
      ),
      ...(empowerAmount > 0
        ? [
            {
              type: "object-activation-state-changed" as const,
              objectId: card.id,
              state: "empowered" as const,
              value: true,
              actorId: playerId,
              cause: { kind: "rule" as const, rule: "empower-next-spell" },
            },
            {
              type: "player-state-changed" as const,
              playerId,
              state: "empower",
              value: 0,
              actorId: playerId,
              cause: { kind: "rule" as const, rule: "empower-consumed" },
            },
          ]
        : []),
      ...(imbueAnnouncement.invoked
        ? imbueAnnouncement.revealedCardIds.map((objectId) => ({
            type: "card-revealed" as const,
            objectId,
            playerId,
            actorId: playerId,
            cause: { kind: "rule" as const, rule: "imbue-reveal-reserve-payment" },
          }))
        : []),
      ...(imbueAnnouncement.imbued
        ? [
            {
              type: "object-activation-state-changed" as const,
              objectId: card.id,
              state: "imbued" as const,
              value: true,
              actorId: playerId,
              cause: { kind: "rule" as const, rule: "imbue-threshold-satisfied" },
            },
          ]
        : []),
      ...(paysPrepare
        ? [
            {
              type: "object-activation-state-changed" as const,
              objectId: card.id,
              state: "prepared" as const,
              value: true,
              actorId: playerId,
              cause: { kind: "rule" as const, rule: "prepare-additional-cost-paid" },
            },
          ]
        : []),
      ...(activatedViaStarcalling
        ? [
            {
              type: "object-activation-state-changed" as const,
              objectId: card.id,
              state: "starcalled" as const,
              value: true,
              actorId: playerId,
              cause: { kind: "rule" as const, rule: "starcalling-alternative-activation" },
            },
          ]
        : []),
      ...(activatedViaBrew
        ? [
            {
              type: "object-activation-state-changed" as const,
              objectId: card.id,
              state: "brewed" as const,
              value: true,
              actorId: playerId,
              cause: { kind: "rule" as const, rule: "brew-alternative-activation" },
            },
          ]
        : []),
      ...paymentEvents,
      ...(paysCosts && attackAttacker
        ? [
            {
              type: "object-state-changed" as const,
              objectId: attackAttacker.id,
              state: "rested" as const,
              value: true,
              actorId: playerId,
              cause: { kind: "rule" as const, rule: "attack-card-additional-cost" },
            },
          ]
        : []),
      ...(activatedViaBrew
        ? [
            {
              type: "keyword-action-performed" as const,
              action: "brew" as const,
              playerId,
              objectIds: [card.id],
              actorId: playerId,
              cause: { kind: "rule" as const, rule: "brew-alternative-activation" },
            },
          ]
        : []),
      {
        type: effectGranted ? "stack-item-deferred" : "stack-item-added",
        item: stackItem,
        actorId: playerId,
        cause: effectGranted
          ? { kind: "rule", rule: "effect-granted-activation" }
          : { kind: "command", move: "activate-card" },
      },
      ...(effectGranted
        ? []
        : stackItem.opportunityPolicy === "interdiction"
          ? [
              {
                type: "opportunity-closed" as const,
                actorId: playerId,
                cause: { kind: "rule" as const, rule: "interdiction-activation" },
              },
            ]
          : grandArchiveOpportunityIsSuppressed(state)
            ? []
            : [
                {
                  type: "opportunity-opened" as const,
                  window: openGrandArchiveOpportunity(state, playerId, "stack-item-added"),
                  actorId: playerId,
                  cause: { kind: "command" as const, move: "activate-card" },
                },
              ]),
    ],
  };
}

export function proposeGrandArchiveBoonBestowment(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  command: BestowBoonCommand,
): GrandArchiveActivationProposal {
  const pregame = state.status === "pregame" ? state.pregame : null;
  if (pregame) {
    if (
      pregame.stage !== "player-actions" ||
      state.turnOrder[pregame.currentPlayerIndex] !== playerId
    ) {
      throw new Error("Only the current pre-game player may bestow a First Boon");
    }
  } else if (state.opportunity?.holderId !== playerId) {
    throw new Error("Player does not have Opportunity");
  }
  const card = state.objects[command.cardId];
  if (
    !card ||
    card.ownerId !== playerId ||
    card.zone !== "pantheon" ||
    card.facing !== "face-down"
  ) {
    throw new Error("A face-down boon in the player's Pantheon must be selected");
  }
  const face = grandArchiveObjectFace(program, card);
  const characteristics = grandArchiveObjectCurrentCharacteristics(program, state, card);
  if (
    !characteristics.types.includes("LESSER BOON") &&
    !characteristics.types.includes("GREATER BOON")
  ) {
    throw new Error("Only a Boon card can be bestowed");
  }
  const hasFirstBoon = grandArchiveObjectHasActiveKeyword(program, state, card, "first-boon");
  if (pregame && !hasFirstBoon) {
    throw new Error("Only a card with First Boon can be bestowed during pre-game actions");
  }
  if (!pregame) {
    const speed = face.speed ?? "slow";
    if (speed === "slow" && !isSlowTimingLegal(state, playerId)) {
      throw new Error("Slow boons require the turn player's empty-stack Main phase");
    }
  }
  const evaluation: GrandArchiveEvaluationContext = {
    ...baseEvaluation(program, state, playerId, card.id, command.variables),
    candidateId: card.id,
  };
  const bestowActionRules = collectGrandArchiveActionRules({
    action: "bestow",
    activationKind: "card",
    playerId,
    candidateId: card.id,
    fromZone: card.zone,
    evaluation,
  });
  const playActionRules = collectGrandArchiveActionRules({
    action: "play",
    activationKind: "card",
    playerId,
    candidateId: card.id,
    fromZone: card.zone,
    evaluation,
  });
  assertActionRuleLegality([...bestowActionRules, ...playActionRules], "Boon bestowment");
  assertPlayerCanPlayCard(program, state, playerId);
  const enabled = grandArchivePlayerEnabledElements(program, state, playerId);
  const ignoredElementRules = collectGrandArchiveActionRules({
    action: "ignore-element-requirement",
    activationKind: "card",
    playerId,
    candidateId: card.id,
    fromZone: card.zone,
    evaluation,
  }).filter((rule) => ruleGrantsPermissionToPlayer(rule, playerId));
  if (
    characteristics.elements.some(
      (element) =>
        !enabled.has(element) &&
        !ignoredElementRules.some(
          (rule) =>
            rule.effect.elementRequirement === undefined ||
            rule.effect.elementRequirement === element,
        ),
    )
  ) {
    throw new Error("The player does not have every element required to bestow this boon");
  }
  if (face.cost.kind !== "reserve") {
    throw new Error("Boons must have a reserve cost to be bestowed");
  }
  const resolution = composeGrandArchiveCardResolution(face, evaluation);
  const announcedCardResolutionAbilities = captureGrandArchiveCardResolutionAbilities(
    face,
    evaluation,
  );
  const modes = declareGrandArchiveModes(
    getGrandArchiveAnnouncementModes(resolution?.modes, resolution?.effect, evaluation),
    command.modeIds,
    evaluation,
  );
  validateGrandArchiveChosenVariables(resolution?.variables, modes.modes, evaluation);
  const targetDeclarations = collectGrandArchiveCardTargets(
    program,
    state,
    card,
    resolution?.targets,
    modes.modes,
  );
  const targets = declareGrandArchiveTargets(targetDeclarations, command.targets, {
    ...evaluation,
    targeting: grandArchiveTargetingContext("bestowment", characteristics.subtypes, [
      resolution?.effect,
      ...modes.modes.map((mode) => mode.effect),
    ]),
  });
  const paymentEvaluation: GrandArchiveEvaluationContext = {
    ...evaluation,
    bindings: Object.fromEntries(targets.map((target) => [target.binding, target.targetIds])),
    declaredTargetIds: targets.flatMap((target) => target.targetIds),
  };
  const bestowCostRules = collectGrandArchiveCostRules({
    action: "bestow",
    activationKind: "card",
    playerId,
    candidateId: card.id,
    fromZone: card.zone,
    evaluation: paymentEvaluation,
  });
  const optionalReplacementCostRules = collectGrandArchiveCostRules({
    action: "pay-cost",
    activationKind: "card",
    costComponent: "activation",
    playerId,
    candidateId: card.id,
    fromZone: card.zone,
    evaluation: paymentEvaluation,
  });
  const paymentContributionRules = collectGrandArchivePaymentContributionRules({
    action: "pay-cost",
    activationKind: "card",
    playerId,
    candidateId: card.id,
    fromZone: card.zone,
    evaluation: paymentEvaluation,
  });
  const printedReserveCost = evaluateGrandArchiveAmount(face.cost.amount, paymentEvaluation);
  const reserveCost = numericCostAfterRules(
    printedReserveCost,
    "reserve",
    "activation",
    bestowCostRules,
  );
  const primaryCost = replacementCostFromRules(
    { kind: "pay-reserve", amount: reserveCost },
    bestowCostRules,
    optionalReplacementCostRules,
  );
  if (!primaryCost) throw new GrandArchiveUnsupportedRuleError("bestowment without a payable cost");
  const contribution = applyGrandArchivePaymentContributions(
    primaryCost,
    paymentContributionRules,
    command.paymentContributions,
    paymentEvaluation,
    command,
  );
  const totalCost = combineGrandArchiveCosts([
    contribution.cost,
    ...addedCostsFromRules(bestowCostRules),
    ...(resolution?.additionalCost ? [resolution.additionalCost] : []),
  ]);
  if (!totalCost) throw new GrandArchiveUnsupportedRuleError("bestowment without costs");
  const payment = payGrandArchiveAbilityCost(totalCost, command, paymentEvaluation);
  assertIndependentPaymentSourcesDistinct([contribution.events, payment.events]);
  const paymentEvents = [...contribution.events, ...payment.events];
  const activationPayment = activationPaymentRecords(paymentEvents);
  const stackItem: GrandArchiveStackItem = {
    id: grandArchiveStackItemId(`stack-${state.nextStackOrdinal}`),
    kind: "bestowment",
    controllerId: playerId,
    sourceId: card.id,
    selectedModeIds: modes.ids,
    cardId: card.id,
    originZone: "pantheon",
    paidCostKind: "reserve",
    elysianAuraActiveAtAnnouncement: false,
    announcedCardResolutionAbilities,
    ...(resolution ? { ability: resolution } : {}),
    targetDeclarations,
    targets,
    createdAtVersion: state.stateVersion,
    activationPhase: state.turn.phase,
    isCopy: false,
    negated: false,
    opportunityPolicy: "bestowment",
    activationStates: [],
    activationPayment,
    championLevelModifier: 0,
    variables: command.variables ?? {},
    bindings: { ...contribution.paidBindings, ...payment.paidBindings },
  };
  return {
    stackItem,
    events: [
      ...(modes.random
        ? [
            {
              type: "random-state-changed" as const,
              random: modes.random,
              cause: { kind: "rule" as const, rule: "random-mode-selection" },
            },
          ]
        : []),
      {
        type: "object-moved",
        objectId: card.id,
        from: "pantheon",
        to: "effects-stack",
        newControllerId: playerId,
        entryActivationPayment: activationPayment,
        entryActivationBindings: { ...contribution.paidBindings, ...payment.paidBindings },
        actorId: playerId,
        cause: { kind: "command", move: "bestow-boon" },
      },
      ...grandArchiveModeTrackingEvents(modes, playerId, {
        kind: "command",
        move: "bestow-boon",
      }),
      ...paymentEvents,
      {
        type: "stack-item-added",
        item: stackItem,
        actorId: playerId,
        cause: { kind: "command", move: "bestow-boon" },
      },
      {
        type: "opportunity-closed",
        actorId: playerId,
        cause: { kind: "rule", rule: "boon-bestowment" },
      },
    ],
  };
}

export function proposeGrandArchiveAbilityActivation(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  command: ActivateAbilityCommand,
): GrandArchiveActivationProposal {
  if (state.opportunity?.holderId !== playerId) throw new Error("Player does not have Opportunity");
  const source = state.objects[command.sourceId];
  if (!source) throw new Error("Ability source does not exist");
  const face = grandArchiveObjectFace(program, source);
  const ability = grandArchiveObjectActiveAbilities(program, state, source).find(
    (
      candidate,
    ): candidate is Extract<GrandArchiveExecutableAbility, { readonly kind: "activated" }> =>
      candidate.kind === "activated" && candidate.id === command.abilityId,
  );
  if (!ability) throw new Error("Activated ability does not exist on the source's active face");
  if (!grandArchiveAbilityIsFunctional(face, ability, source))
    throw new Error("Ability is not functional in the source zone");
  const executionObject = grandArchiveAbilityExecutionObject(state, source, ability);
  if (!executionObject) throw new Error("Ability execution source does not exist");
  const evaluation: GrandArchiveEvaluationContext = {
    ...baseEvaluation(program, state, playerId, executionObject.id, command.variables),
    abilityId: ability.id,
  };
  const abilityIdentity = {
    ...(ability.keyword || ability.label
      ? { keyword: ability.keyword?.name ?? ability.label?.name }
      : {}),
    ...(ability.label ? { label: ability.label.name } : {}),
  };
  const actionRules = collectGrandArchiveActionRules({
    action: "activate",
    activationKind: "ability",
    playerId,
    candidateId: executionObject.id,
    fromZone: executionObject.zone,
    abilityIdentity,
    evaluation,
  });
  assertActionRuleLegality(actionRules, "Ability activation");
  const hasGrantedAuthority = actionRules.some((rule) =>
    ruleGrantsPermissionToPlayer(rule, playerId),
  );
  if (
    executionObject.controllerId !== playerId &&
    ability.activationAuthority !== "any-player" &&
    !hasGrantedAuthority
  ) {
    throw new Error("Player cannot activate an ability of this source");
  }
  if (!grandArchiveObjectObeysController(program, state, executionObject)) {
    throw new Error("Player cannot activate an ability of a disobedient ally");
  }
  const activationLimitUsageKey = assertActivatedAbilityLimitAvailable(
    state,
    executionObject,
    ability,
  );
  const fastRules = collectGrandArchiveActionRules({
    action: "activate-fast",
    activationKind: "ability",
    playerId,
    candidateId: executionObject.id,
    fromZone: executionObject.zone,
    abilityIdentity,
    evaluation,
  });
  assertActionRuleLegality(fastRules, "Fast ability activation");
  const speed = fastRules.some((rule) => ruleGrantsPermissionToPlayer(rule, playerId))
    ? "fast"
    : (ability.speed ?? "fast");
  if (speed === "slow" && !isSlowTimingLegal(state, playerId)) {
    throw new Error("Slow abilities require the turn player's empty-stack Main phase");
  }
  if (
    ability.restrictions?.some(
      (restriction) =>
        restriction.kind === "static" &&
        !evaluateGrandArchiveCondition(restriction.condition, evaluation),
    )
  ) {
    throw new Error("Activated ability restrictions are not satisfied");
  }
  if (ability.condition && !evaluateGrandArchiveCondition(ability.condition, evaluation)) {
    throw new Error("Activated ability condition is not satisfied");
  }
  if (ability.cascade && ability.cascade.advanceOn !== "activation") {
    throw new GrandArchiveUnsupportedRuleError(
      "activated Cascade configured to advance on trigger",
    );
  }
  if (ability.cascade && (command.modeIds?.length ?? 0) > 0) {
    throw new Error("A Cascade mode is selected automatically and cannot be declared");
  }
  const cascadeCount = ability.cascade
    ? (executionObject.cascadeCounts[ability.id] ?? 0) + 1
    : undefined;
  const cascadeMode =
    ability.cascade && cascadeCount !== undefined
      ? ability.cascade.modes.find((mode) => mode.counts.includes(cascadeCount))
      : undefined;
  const modes = ability.cascade
    ? {
        ids: cascadeMode ? [cascadeMode.id] : [],
        modes: cascadeMode ? [cascadeMode] : [],
        random: undefined,
      }
    : declareGrandArchiveModes(
        getGrandArchiveAnnouncementModes(ability.modes, ability.effect, evaluation),
        command.modeIds,
        evaluation,
      );
  validateGrandArchiveChosenVariables(ability.variables, modes.modes, evaluation);
  const targets = declareGrandArchiveTargets(
    collectGrandArchiveModeTargets(ability.targets, modes.modes),
    command.targets,
    {
      ...evaluation,
      targeting: grandArchiveTargetingContext(
        "activated-ability",
        grandArchiveObjectCurrentCharacteristics(program, state, executionObject).subtypes,
        [ability.effect, ...modes.modes.map((mode) => mode.effect)],
      ),
    },
  );
  const paymentEvaluation: GrandArchiveEvaluationContext = {
    ...evaluation,
    bindings: Object.fromEntries(targets.map((target) => [target.binding, target.targetIds])),
    declaredTargetIds: targets.flatMap((target) => target.targetIds),
  };
  const abilityCostRules = collectGrandArchiveCostRules({
    action: "activate",
    activationKind: "ability",
    playerId,
    candidateId: executionObject.id,
    fromZone: executionObject.zone,
    abilityIdentity,
    evaluation: paymentEvaluation,
  });
  const optionalReplacementCostRules = collectGrandArchiveCostRules({
    action: "pay-cost",
    activationKind: "ability",
    costComponent: "activation",
    playerId,
    candidateId: executionObject.id,
    fromZone: executionObject.zone,
    abilityIdentity,
    evaluation: paymentEvaluation,
  });
  const paymentContributionRules = collectGrandArchivePaymentContributionRules({
    action: "pay-cost",
    activationKind: "ability",
    playerId,
    candidateId: executionObject.id,
    fromZone: executionObject.zone,
    abilityIdentity,
    evaluation: paymentEvaluation,
  });
  const modifiedAbilityCost = effectiveActivatedAbilityCost(
    ability.cost,
    ability.costModifiers,
    paymentEvaluation,
    abilityCostRules,
  );
  const primaryAbilityCost = replacementCostFromRules(
    modifiedAbilityCost,
    abilityCostRules,
    optionalReplacementCostRules,
  );
  if (!primaryAbilityCost) {
    throw new GrandArchiveUnsupportedRuleError("activated ability without a payable cost");
  }
  const contribution = applyGrandArchivePaymentContributions(
    primaryAbilityCost,
    paymentContributionRules,
    command.paymentContributions,
    paymentEvaluation,
    command,
  );
  const totalAbilityCost = combineGrandArchiveCosts([
    contribution.cost,
    ...addedCostsFromRules(abilityCostRules),
  ]);
  if (!totalAbilityCost) {
    throw new GrandArchiveUnsupportedRuleError("activated ability without costs");
  }
  const payment = payGrandArchiveAbilityCost(totalAbilityCost, command, paymentEvaluation);
  assertIndependentPaymentSourcesDistinct([contribution.events, payment.events]);
  const paymentEvents = [...contribution.events, ...payment.events];
  const activationPayment = activationPaymentRecords(paymentEvents);
  const sourcePaymentZoneChanges = paymentEvents.filter(
    (event) =>
      event.type === "object-moved" &&
      event.objectId === executionObject.id &&
      event.from !== event.to,
  ).length;
  const stackItem: GrandArchiveStackItem = {
    id: grandArchiveStackItemId(`stack-${state.nextStackOrdinal}`),
    kind: "activated-ability",
    controllerId: playerId,
    sourceId: executionObject.id,
    sourceIncarnation: executionObject.incarnation + sourcePaymentZoneChanges,
    selectedModeIds: modes.ids,
    ability,
    ...(activationLimitUsageKey ? { activationLimitUsageKey } : {}),
    targets,
    createdAtVersion: state.stateVersion,
    activationPhase: state.turn.phase,
    isCopy: false,
    negated: false,
    opportunityPolicy: "normal",
    activationStates: [],
    activationPayment,
    championLevelModifier: 0,
    variables: command.variables ?? {},
    bindings: { ...contribution.paidBindings, ...payment.paidBindings },
  };
  return {
    stackItem,
    events: [
      ...(modes.random
        ? [
            {
              type: "random-state-changed" as const,
              random: modes.random,
              cause: { kind: "rule" as const, rule: "random-mode-selection" },
            },
          ]
        : []),
      ...(cascadeCount !== undefined
        ? [
            {
              type: "cascade-advanced" as const,
              objectId: executionObject.id,
              abilityId: ability.id,
              count: cascadeCount,
              actorId: playerId,
              cause: { kind: "rule" as const, rule: "cascade-ability-activated" },
            },
          ]
        : []),
      ...grandArchiveModeTrackingEvents(modes, playerId, {
        kind: "command",
        move: "activate-ability",
      }),
      ...paymentEvents,
      {
        type: "stack-item-added",
        item: stackItem,
        actorId: playerId,
        cause: { kind: "command", move: "activate-ability" },
      },
      ...(grandArchiveOpportunityIsSuppressed(state)
        ? []
        : [
            {
              type: "opportunity-opened" as const,
              window: openGrandArchiveOpportunity(state, playerId, "stack-item-added"),
              actorId: playerId,
              cause: { kind: "command" as const, move: "activate-ability" },
            },
          ]),
    ],
  };
}

export function proposeGrandArchiveMaterialization(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  command: MaterializeCommand,
  materializationContext?: GrandArchiveMaterializationContext,
): GrandArchiveActivationProposal {
  const effectGranted = materializationContext?.kind === "effect";
  if (!effectGranted) {
    if (
      state.turn.playerId !== playerId ||
      state.turn.phase !== "materialize" ||
      !state.turn.materializeChoicePending ||
      state.stack.length > 0 ||
      state.opportunity
    ) {
      throw new Error(
        "Natural materialization is only available in the turn player's Materialize phase",
      );
    }
  }
  const card = state.objects[command.cardId];
  if (!card) throw new Error("The materialized card does not exist");
  if (!effectGranted && (card.ownerId !== playerId || card.zone !== "material-deck")) {
    throw new Error("Natural materialization requires a card from the player's material deck");
  }
  if (effectGranted && card.zone === "effects-stack") {
    throw new Error("A card already on the Effects Stack cannot be materialized again");
  }
  const face = grandArchiveObjectFace(program, card);
  const characteristics = grandArchiveObjectCurrentCharacteristics(program, state, card);
  const isChampion = characteristics.types.includes("CHAMPION");
  const isRegalia = characteristics.supertypes.includes("REGALIA");
  if (!isChampion && !isRegalia) {
    throw new Error("Only champions and regalia may be naturally materialized");
  }
  if (face.cost.kind !== "memory") {
    throw new Error("Only cards with memory costs can be materialized");
  }
  const currentChampion = isChampion
    ? Object.values(state.objects).find(
        (object) =>
          object.controllerId === playerId &&
          object.zone === "field" &&
          grandArchiveObjectCurrentCharacteristics(program, state, object).types.includes(
            "CHAMPION",
          ),
      )
    : undefined;
  const evaluation: GrandArchiveEvaluationContext = {
    ...baseEvaluation(program, state, playerId, card.id, command.variables),
    candidateId: card.id,
  };
  const materializeActionRules = collectGrandArchiveActionRules({
    action: "materialize",
    activationKind: "card",
    playerId,
    candidateId: card.id,
    fromZone: card.zone,
    evaluation,
  });
  const playActionRules = collectGrandArchiveActionRules({
    action: "play",
    activationKind: "card",
    playerId,
    candidateId: card.id,
    fromZone: card.zone,
    evaluation,
  });
  assertActionRuleLegality([...materializeActionRules, ...playActionRules], "Materialization");
  assertPlayerCanPlayCard(program, state, playerId);
  if (isChampion) {
    if (!currentChampion) throw new Error("Player does not control a champion lineage");
    const levelEvaluation: GrandArchiveEvaluationContext = {
      ...evaluation,
      sourceId: currentChampion.id,
      abilityBearerId: currentChampion.id,
      candidateId: card.id,
    };
    const levelUpRules = collectGrandArchiveActionRules({
      action: "level-up",
      activationKind: "card",
      playerId,
      candidateId: currentChampion.id,
      destinationId: card.id,
      fromZone: currentChampion.zone,
      evaluation: levelEvaluation,
    });
    assertActionRuleLegality(levelUpRules, "Champion level-up");
    const requirements = grandArchiveChampionLevelUpRequirements(
      program,
      state,
      card,
      currentChampion,
    );
    const hasLevelUpPermission = levelUpRules.some((rule) =>
      ruleGrantsPermissionToPlayer(rule, playerId),
    );
    if (!requirements.lineageSatisfied) {
      throw new Error("Champion materialization does not satisfy its Lineage restriction");
    }
    if (!requirements.nextBaseLevel && !hasLevelUpPermission) {
      throw new Error("Champion materialization must be the next base level");
    }
  }
  // Champion / Leveling Up 3: materializing a champion ignores element requirements.
  // Regalia still require their elements unless an explicit permission waives them.
  if (!isChampion && !materializationContext?.ignoreElementRequirements) {
    const enabled = grandArchivePlayerEnabledElements(program, state, playerId);
    const ignoredElementRules = collectGrandArchiveActionRules({
      action: "ignore-element-requirement",
      activationKind: "card",
      playerId,
      candidateId: card.id,
      fromZone: card.zone,
      evaluation,
    }).filter((rule) => ruleGrantsPermissionToPlayer(rule, playerId));
    if (
      characteristics.elements.some(
        (element) =>
          !enabled.has(element) &&
          !ignoredElementRules.some(
            (rule) =>
              rule.effect.elementRequirement === undefined ||
              rule.effect.elementRequirement === element,
          ),
      )
    ) {
      throw new Error("The player does not have every element required to materialize this card");
    }
  }
  const resolution = composeGrandArchiveCardResolution(face, evaluation);
  const announcedCardResolutionAbilities = captureGrandArchiveCardResolutionAbilities(
    face,
    evaluation,
  );
  const modes = declareGrandArchiveModes(
    getGrandArchiveAnnouncementModes(resolution?.modes, resolution?.effect, evaluation),
    command.modeIds,
    evaluation,
  );
  validateGrandArchiveChosenVariables(resolution?.variables, modes.modes, evaluation);
  const targetDeclarations = collectGrandArchiveCardTargets(
    program,
    state,
    card,
    resolution?.targets,
    modes.modes,
  );
  const targets = declareGrandArchiveTargets(targetDeclarations, command.targets, {
    ...evaluation,
    targeting: grandArchiveTargetingContext("materialization", characteristics.subtypes, [
      resolution?.effect,
      ...modes.modes.map((mode) => mode.effect),
    ]),
  });
  const paymentEvaluation: GrandArchiveEvaluationContext = {
    ...evaluation,
    candidateId: card.id,
    bindings: Object.fromEntries(targets.map((target) => [target.binding, target.targetIds])),
    declaredTargetIds: targets.flatMap((target) => target.targetIds),
  };
  const materializationCostRules = collectGrandArchiveCostRules({
    action: "materialize",
    activationKind: "card",
    playerId,
    candidateId: card.id,
    fromZone: card.zone,
    evaluation: paymentEvaluation,
  });
  const optionalReplacementCostRules = collectGrandArchiveCostRules({
    action: "pay-cost",
    activationKind: "card",
    costComponent: "materialization",
    playerId,
    candidateId: card.id,
    fromZone: card.zone,
    evaluation: paymentEvaluation,
  });
  const paymentContributionRules = collectGrandArchivePaymentContributionRules({
    action: "pay-cost",
    activationKind: "card",
    playerId,
    candidateId: card.id,
    fromZone: card.zone,
    evaluation: paymentEvaluation,
  });
  const paysCosts = materializationContext?.payCosts !== false;
  const printedAmount =
    typeof face.cost.amount === "number"
      ? face.cost.amount
      : command.variables?.[face.cost.amount.symbol];
  if (paysCosts && (printedAmount === undefined || printedAmount < 0))
    throw new Error("Variable materialization cost must be declared");
  const effectCostModification = effectGrantedNumericCostModification(
    materializationContext?.costModifiers,
    paymentEvaluation,
  );
  const amount = numericCostAfterRules(
    effectCostModification.setTo ?? printedAmount ?? 0,
    "memory",
    "materialization",
    materializationCostRules,
    effectCostModification.adjustment,
  );
  assertGrandArchiveReservePaymentDistinct(command.reservePayment ?? []);
  if (
    new Set(command.floatingMemoryCardIds ?? []).size !==
    (command.floatingMemoryCardIds?.length ?? 0)
  ) {
    throw new Error("A Floating Memory card cannot be used twice");
  }
  const baseCost: GrandArchiveAbilityCost = { kind: "pay-memory", amount };
  const primaryCost = replacementCostFromRules(
    baseCost,
    materializationCostRules,
    optionalReplacementCostRules,
  );
  if (!primaryCost) {
    throw new GrandArchiveUnsupportedRuleError("materialization without a payable cost");
  }
  const addedCosts = [
    ...addedCostsFromRules(materializationCostRules),
    ...(resolution?.additionalCost ? [resolution.additionalCost] : []),
  ];
  let paymentEvents: readonly GrandArchiveProposedEvent[];
  let paidBindings: GrandArchiveEvaluationContext["bindings"];
  if (!paysCosts) {
    if (
      (command.reservePayment?.length ?? 0) > 0 ||
      (command.floatingMemoryCardIds?.length ?? 0) > 0 ||
      (command.paymentContributions?.length ?? 0) > 0 ||
      (command.costSelections?.length ?? 0) > 0 ||
      (command.costPaymentOrders?.length ?? 0) > 0 ||
      command.costOptionIndex !== undefined ||
      command.payOptionalCost !== undefined
    ) {
      throw new Error("A cost-free materialization cannot include payment declarations");
    }
    paymentEvents = [];
    paidBindings = {};
  } else {
    const contribution = applyGrandArchivePaymentContributions(
      primaryCost,
      paymentContributionRules,
      command.paymentContributions,
      paymentEvaluation,
      command,
    );
    if (
      contribution.cost.kind === "pay-memory" &&
      !materializationCostRules.some((rule) => rule.effect.mode === "replace-cost") &&
      optionalReplacementCostRules.length === 0
    ) {
      const remainingAmount = evaluateGrandArchiveAmount(
        contribution.cost.amount,
        paymentEvaluation,
      );
      const memoryEvents = printedMemoryPayment(
        program,
        state,
        playerId,
        remainingAmount,
        paymentEvaluation,
        command.floatingMemoryCardIds,
        modes.random ?? state.random,
      );
      const additionalCost = combineGrandArchiveCosts(addedCosts);
      const additionalPayment = additionalCost
        ? payGrandArchiveAbilityCost(additionalCost, command, paymentEvaluation)
        : { events: [], paidBindings: {}, paidUnits: 0 };
      assertIndependentPaymentSourcesDistinct([
        contribution.events,
        memoryEvents,
        additionalPayment.events,
      ]);
      paymentEvents = [
        ...orderMemoryPaymentEvents(
          memoryEvents,
          command.floatingMemoryCardIds?.length ?? 0,
          contribution.events,
        ),
        ...additionalPayment.events,
      ];
      paidBindings = { ...contribution.paidBindings, ...additionalPayment.paidBindings };
    } else {
      if ((command.floatingMemoryCardIds?.length ?? 0) > 0) {
        throw new GrandArchiveUnsupportedRuleError(
          "Floating Memory with a replacement or composite materialization cost",
        );
      }
      const totalCost = combineGrandArchiveCosts([contribution.cost, ...addedCosts]);
      if (!totalCost) {
        throw new GrandArchiveUnsupportedRuleError("materialization without costs");
      }
      const payment = payGrandArchiveAbilityCost(totalCost, command, paymentEvaluation);
      assertIndependentPaymentSourcesDistinct([contribution.events, payment.events]);
      paymentEvents = [...contribution.events, ...payment.events];
      paidBindings = { ...contribution.paidBindings, ...payment.paidBindings };
    }
  }
  const activationPayment = activationPaymentRecords([...paymentEvents]);
  const stackItem: GrandArchiveStackItem = {
    id: grandArchiveStackItemId(`stack-${state.nextStackOrdinal}`),
    kind: "materialization",
    materializationContext: effectGranted ? "effect-instruction" : "turn-based-action",
    controllerId: playerId,
    sourceId: card.id,
    selectedModeIds: modes.ids,
    cardId: card.id,
    originZone: card.zone,
    paidCostKind: paysCosts ? face.cost.kind : "none",
    elysianAuraActiveAtAnnouncement: false,
    announcedCardResolutionAbilities,
    ...(resolution ? { ability: resolution } : {}),
    targetDeclarations,
    targets,
    createdAtVersion: state.stateVersion,
    activationPhase: state.turn.phase,
    isCopy: false,
    negated: false,
    opportunityPolicy: "normal",
    activationStates: [],
    activationPayment,
    championLevelModifier: 0,
    variables: command.variables ?? {},
    bindings: paidBindings,
  };
  return {
    stackItem,
    events: [
      ...(modes.random
        ? [
            {
              type: "random-state-changed" as const,
              random: modes.random,
              cause: { kind: "rule" as const, rule: "random-mode-selection" },
            },
          ]
        : []),
      ...(!effectGranted
        ? [
            {
              type: "materialization-choice-consumed" as const,
              actorId: playerId,
              cause: { kind: "command" as const, move: "materialize" as const },
            },
          ]
        : []),
      {
        type: "object-moved",
        objectId: card.id,
        from: card.zone,
        to: "effects-stack",
        newControllerId: playerId,
        entryActivationPayment: activationPayment,
        entryActivationBindings: paidBindings,
        actorId: playerId,
        cause: effectGranted
          ? { kind: "rule", rule: "effect-granted-materialization" }
          : { kind: "command", move: "materialize" },
      },
      ...grandArchiveModeTrackingEvents(
        modes,
        playerId,
        effectGranted
          ? { kind: "rule", rule: "effect-granted-materialization" }
          : { kind: "command", move: "materialize" },
      ),
      ...paymentEvents,
      {
        type: effectGranted ? "stack-item-deferred" : "stack-item-added",
        item: stackItem,
        actorId: playerId,
        cause: effectGranted
          ? { kind: "rule", rule: "effect-granted-materialization" }
          : { kind: "command", move: "materialize" },
      },
      ...(effectGranted || grandArchiveOpportunityIsSuppressed(state)
        ? []
        : [
            {
              type: "opportunity-opened" as const,
              window: openGrandArchiveOpportunity(state, playerId, "stack-item-added"),
              actorId: playerId,
              cause: { kind: "command" as const, move: "materialize" },
            },
          ]),
    ],
  };
}

function assertNever(value: never): never {
  throw new Error(`Unhandled Grand Archive activation variant: ${JSON.stringify(value)}`);
}
