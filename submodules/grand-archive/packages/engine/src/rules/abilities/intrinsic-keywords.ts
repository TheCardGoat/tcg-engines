import { continuousEffectSourceContext } from "../state/continuous-source.ts";
import type {
  GrandArchiveCharacteristicChange,
  GrandArchiveContinuousEffect,
  GrandArchiveExecutableAbility,
  GrandArchiveKeyword,
  GrandArchiveAmount,
  GrandArchiveCondition,
} from "@tcg/grand-archive-types";
import { grandArchiveAdditionalAbilityInstances } from "./ability-multipliers.ts";
import {
  grandArchiveConditionDependencyLayers,
  grandArchiveContinuousApplicationLayer,
  grandArchiveContinuousHasLayerDependency,
  grandArchiveDependencyLayerOrder,
  type GrandArchiveDependencyLayer,
} from "../state/continuous-dependencies.ts";
import {
  flattenGrandArchiveAbilities,
  grandArchiveAbilityExecutionObject,
  grandArchiveAbilityIsFunctional,
  grandArchiveCardIsObject,
  grandArchiveObjectFace,
  grandArchiveObjectPrintedAbilities,
} from "../../game/card-runtime.ts";
import {
  grandArchiveContinuousEffectAffectsObject,
  grandArchiveContinuousEffectIsActive,
  grandArchiveObjectTimestamp,
} from "../state/continuous.ts";
import {
  evaluateGrandArchiveCondition,
  evaluateGrandArchiveAmount,
  resolveGrandArchiveCollection,
  resolveGrandArchiveSubjectObjects,
  GrandArchiveUnsupportedRuleError,
  withGrandArchiveDerivedVariables,
  type GrandArchiveEvaluationContext,
} from "../../procedures/effects/evaluation.ts";
import type { GrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type {
  GrandArchiveCardInstance,
  GrandArchiveContinuousEffectInstance,
  GrandArchiveMatchState,
} from "../../game/model.ts";
import {
  grandArchiveActiveMasteryAbilities,
  grandArchiveMasteryTimestamp,
} from "../../game/mastery.ts";
import { collectGrandArchiveActionRules } from "../state/rule-modifications.ts";
import { GRAND_ARCHIVE_ENLIGHTEN_COUNTER_ACTIVATED_ABILITY } from "./game-abilities.ts";
import type { GrandArchiveObjectId } from "../../game/identity.ts";

type AbilityModifierChange = Extract<
  GrandArchiveCharacteristicChange,
  {
    readonly kind:
      | "grant-keyword"
      | "remove-keyword"
      | "grant-ability"
      | "remove-abilities"
      | "copy-abilities"
      | "copy-abilities-from-collection"
      | "transform-abilities";
  }
>;

type KeywordModifierChange = Extract<
  AbilityModifierChange,
  { readonly kind: "grant-keyword" | "remove-keyword" | "grant-ability" | "remove-abilities" }
>;

interface AbilityModifier {
  readonly id: string;
  readonly effect: GrandArchiveContinuousEffect;
  readonly change: AbilityModifierChange;
  readonly affectedObjectIds: readonly string[];
  readonly affectedObjectIncarnations: Readonly<Record<string, number>>;
  readonly instance?: GrandArchiveContinuousEffectInstance;
  /** Printed/mastery ability whose own gate determines whether its static effect exists. */
  readonly sourceAbility?: FlatAbility;
  readonly evaluation: GrandArchiveEvaluationContext;
  readonly applicationLayer: GrandArchiveDependencyLayer;
  readonly dependent: boolean;
  readonly timestamp: number;
  readonly order: number;
}

/** One active keyword together with the rules context that produced its parameters. */
export interface GrandArchiveActiveKeywordInstance {
  readonly keyword: GrandArchiveKeyword;
  readonly evaluation: GrandArchiveEvaluationContext;
  readonly originId: string;
}

/** Evaluates a keyword parameter without discarding either its producer or action context. */
export function evaluateGrandArchiveActiveKeywordAmount(
  instance: GrandArchiveActiveKeywordInstance,
  amount: GrandArchiveAmount,
  context?: GrandArchiveEvaluationContext,
): number {
  const producer = instance.evaluation;
  return evaluateGrandArchiveAmount(amount, {
    ...producer,
    ...context,
    bindings: { ...producer.bindings, ...context?.bindings },
    variables: { ...producer.variables, ...context?.variables },
  });
}

export interface GrandArchiveAbilityDerivationContext {
  /** Makes resolution-scoped historical collections available while triggers are collected. */
  readonly resolutionStartedEventHistoryIndex?: number;
  /** Shares recursion guards with characteristic and numeric continuous derivations. */
  readonly derivingProperties?: ReadonlySet<string>;
  /** Uses the local partial Layer D view while recursively deriving another effect source. */
  readonly skipCrossObjectKeywordDerivation?: boolean;
  /** Identifies an attacker while validating an attack before combat has been created. */
  readonly prospectiveAttackAttackerId?: GrandArchiveObjectId;
}

interface GrandArchiveDefaultAbilityDerivationCache {
  functionalStaticSources?: readonly {
    readonly source: GrandArchiveCardInstance;
    readonly ability: Extract<FlatAbility, { kind: "static"; staticKind: "effects" }>;
  }[];
  readonly abilityModifiersByObject: WeakMap<GrandArchiveCardInstance, readonly AbilityModifier[]>;
  readonly abilitiesByObject: WeakMap<GrandArchiveCardInstance, readonly FlatAbility[]>;
  readonly keywordInstancesByObject: WeakMap<
    GrandArchiveCardInstance,
    readonly GrandArchiveActiveKeywordInstance[]
  >;
}

/**
 * Ephemeral derived rules views keyed by immutable state and compiled program.
 * Like FAB's state-rules view cache, these values never enter snapshots and a
 * newly committed state object receives a distinct cache generation.
 */
const defaultAbilityDerivationsByState = new WeakMap<
  object,
  WeakMap<object, GrandArchiveDefaultAbilityDerivationCache>
>();

function defaultAbilityDerivationCache(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
): GrandArchiveDefaultAbilityDerivationCache {
  let byProgram = defaultAbilityDerivationsByState.get(state);
  if (!byProgram) {
    byProgram = new WeakMap();
    defaultAbilityDerivationsByState.set(state, byProgram);
  }
  let cache = byProgram.get(program);
  if (!cache) {
    cache = {
      abilityModifiersByObject: new WeakMap(),
      abilitiesByObject: new WeakMap(),
      keywordInstancesByObject: new WeakMap(),
    };
    byProgram.set(program, cache);
  }
  return cache;
}

function functionalStaticSources(program: GrandArchiveMatchProgram, state: GrandArchiveMatchState) {
  const cache = defaultAbilityDerivationCache(program, state);
  return (cache.functionalStaticSources ??= Object.values(state.objects).flatMap((source) => {
    const face = grandArchiveObjectFace(program, source);
    return grandArchiveObjectPrintedAbilities(program, source).flatMap((ability) =>
      ability.kind === "static" &&
      ability.staticKind === "effects" &&
      grandArchiveAbilityIsFunctional(face, ability, source)
        ? [{ source, ability }]
        : [],
    );
  }));
}

function isDefaultAbilityDerivationContext(context: GrandArchiveAbilityDerivationContext) {
  return (
    context.resolutionStartedEventHistoryIndex === undefined &&
    context.derivingProperties === undefined &&
    context.skipCrossObjectKeywordDerivation === undefined &&
    context.prospectiveAttackAttackerId === undefined
  );
}

function isAbilityModifierChange(
  change: GrandArchiveCharacteristicChange,
): change is AbilityModifierChange {
  return (
    change.kind === "grant-keyword" ||
    change.kind === "remove-keyword" ||
    change.kind === "grant-ability" ||
    change.kind === "remove-abilities" ||
    change.kind === "copy-abilities" ||
    change.kind === "copy-abilities-from-collection" ||
    change.kind === "transform-abilities"
  );
}

function isKeywordModifierChange(change: AbilityModifierChange): change is KeywordModifierChange {
  return (
    change.kind === "grant-keyword" ||
    change.kind === "remove-keyword" ||
    change.kind === "grant-ability" ||
    change.kind === "remove-abilities"
  );
}

function subjectUsesResolutionHistory(
  subject: import("@tcg/grand-archive-types").GrandArchiveSubject,
): boolean {
  return subject.kind === "each" && subject.collection.history?.window === "this-resolution";
}

function abilityModifierUsesResolutionHistory(effect: GrandArchiveContinuousEffect): boolean {
  if (subjectUsesResolutionHistory(effect.subjects)) return true;
  const change = effect.change;
  return (
    (change.kind === "copy-abilities" && subjectUsesResolutionHistory(change.from)) ||
    (change.kind === "copy-abilities-from-collection" &&
      change.collection.history?.window === "this-resolution")
  );
}

function abilityKeywords(
  ability: Exclude<GrandArchiveExecutableAbility, { readonly kind: "composite" }>,
) {
  if (ability.kind === "keyword-group") return ability.keywords;
  if (ability.kind === "triggered" && "intrinsic" in ability && ability.intrinsic) {
    return [ability.keyword];
  }
  if (ability.kind === "static" && ability.staticKind === "intrinsic") {
    return [ability.keyword, ...(ability.additionalKeywords ?? [])];
  }
  return [];
}

function keywordsFromAbilities(
  abilities: readonly Exclude<GrandArchiveExecutableAbility, { readonly kind: "composite" }>[],
): readonly GrandArchiveKeyword[] {
  return abilities.flatMap(abilityKeywords);
}

function withObjectKeywordOverride(
  evaluation: GrandArchiveEvaluationContext,
  object: GrandArchiveCardInstance,
  keywords: readonly GrandArchiveKeyword[],
): GrandArchiveEvaluationContext {
  const baselineKeywords = Object.values(evaluation.state.objects).map(
    (candidate) =>
      [
        candidate.id,
        keywordsFromAbilities(
          flattenGrandArchiveAbilities(
            grandArchiveObjectFace(evaluation.program, candidate).abilities,
          ),
        ),
      ] as const,
  );
  return {
    ...evaluation,
    keywordOverrides: new Map([
      ...baselineKeywords,
      ...(evaluation.keywordOverrides?.entries() ?? []),
      [object.id, keywords] as const,
    ]),
  };
}

function abilityModifierCurrentlyApplies(
  modifier: AbilityModifier,
  object: GrandArchiveCardInstance,
  keywords: readonly GrandArchiveKeyword[],
): boolean {
  let evaluation = withObjectKeywordOverride(modifier.evaluation, object, keywords);
  const source =
    modifier.sourceAbility &&
    abilityGateDependsOnLayerD(modifier.sourceAbility) &&
    !evaluation.skipCrossObjectKeywordDerivation &&
    evaluation.sourceId
      ? evaluation.state.objects[evaluation.sourceId]
      : undefined;
  if (source && source.id !== object.id) {
    const derivationKey = `${source.id}:layer-d-keywords`;
    if (!evaluation.derivingProperties?.has(derivationKey)) {
      const derivingProperties = new Set(evaluation.derivingProperties ?? []).add(derivationKey);
      const sourceKeywords = deriveGrandArchiveDependencyKeywordValues(
        evaluation.program,
        evaluation.state,
        source,
        {
          ...(evaluation.resolutionStartedEventHistoryIndex !== undefined
            ? { resolutionStartedEventHistoryIndex: evaluation.resolutionStartedEventHistoryIndex }
            : {}),
          derivingProperties,
          skipCrossObjectKeywordDerivation: true,
        },
      );
      evaluation = {
        ...evaluation,
        derivingProperties,
        keywordOverrides: new Map([
          ...(evaluation.keywordOverrides?.entries() ?? []),
          [source.id, sourceKeywords],
        ]),
      };
    }
  }
  const sourceAbilityCondition = modifier.sourceAbility
    ? grandArchiveAbilityCondition(modifier.sourceAbility)
    : undefined;
  return (
    (!modifier.instance || grandArchiveContinuousEffectIsActive(modifier.instance, evaluation)) &&
    (!modifier.sourceAbility ||
      (restrictionsAreSatisfied(modifier.sourceAbility, evaluation) &&
        (!sourceAbilityCondition ||
          evaluateGrandArchiveCondition(sourceAbilityCondition, evaluation)))) &&
    (!modifier.effect.condition ||
      evaluateGrandArchiveCondition(modifier.effect.condition, evaluation)) &&
    grandArchiveContinuousEffectAffectsObject(
      modifier.effect,
      modifier.affectedObjectIds,
      modifier.affectedObjectIncarnations,
      object,
      evaluation,
    )
  );
}

function grandArchiveAbilityCondition(ability: FlatAbility): GrandArchiveCondition | undefined {
  return "condition" in ability ? ability.condition : undefined;
}

function abilityGateDependencyLayers(ability: FlatAbility): readonly GrandArchiveDependencyLayer[] {
  const condition = grandArchiveAbilityCondition(ability);
  const conditions: GrandArchiveCondition[] = [
    ...(condition ? [condition] : []),
    ...(ability.restrictions ?? []).flatMap((restriction) =>
      restriction.kind === "static" ? [restriction.condition] : [],
    ),
  ];
  return [...new Set(conditions.flatMap(grandArchiveConditionDependencyLayers))];
}

function modifierLayerFromAbilityGate(
  effect: GrandArchiveContinuousEffect,
  ability: FlatAbility,
): GrandArchiveDependencyLayer {
  return abilityGateDependencyLayers(ability).reduce(
    (latest, dependency) =>
      grandArchiveDependencyLayerOrder(dependency) > grandArchiveDependencyLayerOrder(latest)
        ? dependency
        : latest,
    grandArchiveContinuousApplicationLayer(effect),
  );
}

function abilityGateDependsOnLayerD(ability: FlatAbility): boolean {
  return abilityGateDependencyLayers(ability).some(
    (dependency) =>
      grandArchiveDependencyLayerOrder(dependency) >= grandArchiveDependencyLayerOrder("D"),
  );
}

function restrictionsAreSatisfied(
  ability: Exclude<GrandArchiveExecutableAbility, { readonly kind: "composite" }>,
  evaluation: GrandArchiveEvaluationContext,
): boolean {
  return !ability.restrictions?.some(
    (restriction) =>
      restriction.kind === "static" &&
      !evaluateGrandArchiveCondition(restriction.condition, evaluation),
  );
}

function applyKeywordModifier(
  instances: readonly GrandArchiveActiveKeywordInstance[],
  change: KeywordModifierChange,
  evaluation: GrandArchiveEvaluationContext,
  originId: string,
): readonly GrandArchiveActiveKeywordInstance[] {
  switch (change.kind) {
    case "grant-keyword":
      return [...instances, { keyword: change.keyword, evaluation, originId }];
    case "remove-keyword": {
      const removeAnyValue = "anyValue" in change.keyword && change.keyword.anyValue;
      return instances.filter(
        (instance) =>
          instance.keyword.name !== change.keyword.name ||
          (!removeAnyValue && JSON.stringify(instance.keyword) !== JSON.stringify(change.keyword)),
      );
    }
    case "grant-ability": {
      const keywords = flattenGrandArchiveAbilities([change.ability]).flatMap(abilityKeywords);
      if (keywords.length === 0) return instances;
      const grantedEvaluation = withGrandArchiveDerivedVariables(
        "variables" in change.ability ? change.ability.variables : undefined,
        evaluation,
      );
      return [
        ...instances,
        ...keywords.map((keyword) => ({
          keyword,
          evaluation: grantedEvaluation,
          originId,
        })),
      ];
    }
    case "remove-abilities": {
      if (change.filter?.abilityKinds && !change.filter.abilityKinds.includes("static")) {
        return instances;
      }
      if (change.filter?.abilityId || change.filter?.label) return instances;
      if (!change.filter?.keyword) return [];
      return instances.filter((instance) => instance.keyword.name !== change.filter?.keyword);
    }
    default:
      return assertNever(change);
  }
}

function keywordValuesAfterAbilityModifier(
  modifier: AbilityModifier,
  object: GrandArchiveCardInstance,
  keywords: readonly GrandArchiveKeyword[],
  derivationContext: GrandArchiveAbilityDerivationContext,
): readonly GrandArchiveKeyword[] {
  const change = modifier.change;
  switch (change.kind) {
    case "grant-keyword":
      return [...keywords, change.keyword];
    case "remove-keyword": {
      const removeAnyValue = "anyValue" in change.keyword && change.keyword.anyValue;
      return keywords.filter(
        (keyword) =>
          keyword.name !== change.keyword.name ||
          (!removeAnyValue && JSON.stringify(keyword) !== JSON.stringify(change.keyword)),
      );
    }
    case "grant-ability":
      return [
        ...keywords,
        ...flattenGrandArchiveAbilities([change.ability]).flatMap(abilityKeywords),
      ];
    case "remove-abilities":
      if (change.filter?.abilityKinds && !change.filter.abilityKinds.includes("static")) {
        return keywords;
      }
      if (change.filter?.abilityId || change.filter?.label) return keywords;
      if (!change.filter?.keyword) return [];
      return keywords.filter((keyword) => keyword.name !== change.filter?.keyword);
    case "copy-abilities":
    case "copy-abilities-from-collection": {
      const sources =
        change.kind === "copy-abilities"
          ? resolveGrandArchiveSubjectObjects(change.from, modifier.evaluation)
          : resolveGrandArchiveCollection(change.collection, modifier.evaluation).filter(
              (source) => !change.excludingSelf || source.id !== object.id,
            );
      const copied = sources.flatMap((source) =>
        deriveGrandArchiveObjectActiveAbilities(
          modifier.evaluation.program,
          modifier.evaluation.state,
          source,
          new Set([object.id]),
          new Set([modifier.id]),
          derivationContext,
        )
          .filter(
            (ability) =>
              change.kind !== "copy-abilities" ||
              !change.abilityKinds ||
              (abilityRulesKind(ability) !== undefined &&
                change.abilityKinds.includes(abilityRulesKind(ability)!)),
          )
          .flatMap(abilityKeywords),
      );
      return [...keywords, ...copied];
    }
    case "transform-abilities":
      return keywords;
    default:
      return assertNever(change);
  }
}

function abilityModifierDependsOn(
  candidate: AbilityModifier,
  prerequisite: AbilityModifier,
  object: GrandArchiveCardInstance,
  keywords: readonly GrandArchiveKeyword[],
  derivationContext: GrandArchiveAbilityDerivationContext,
): boolean {
  if (
    candidate.id === prerequisite.id ||
    candidate.applicationLayer !== prerequisite.applicationLayer ||
    !abilityModifierCurrentlyApplies(prerequisite, object, keywords)
  ) {
    return false;
  }
  const before = abilityModifierCurrentlyApplies(candidate, object, keywords);
  const afterKeywords = keywordValuesAfterAbilityModifier(
    prerequisite,
    object,
    keywords,
    derivationContext,
  );
  const after = abilityModifierCurrentlyApplies(candidate, object, afterKeywords);
  return before !== after;
}

function selectNextAbilityModifier(
  pending: readonly AbilityModifier[],
  object: GrandArchiveCardInstance,
  keywords: readonly GrandArchiveKeyword[],
  derivationContext: GrandArchiveAbilityDerivationContext,
): number {
  const applicable = pending
    .map((modifier, index) => ({
      index,
      applies: abilityModifierCurrentlyApplies(modifier, object, keywords),
    }))
    .filter((entry) => entry.applies);
  if (applicable.length === 0) return -1;
  const firstLayer = pending[applicable[0]!.index]!.applicationLayer;
  const layerApplicable = applicable.filter(
    ({ index }) => pending[index]!.applicationLayer === firstLayer,
  );
  const independent = layerApplicable.find(({ index }) =>
    pending.every(
      (prerequisite) =>
        !abilityModifierDependsOn(
          pending[index]!,
          prerequisite,
          object,
          keywords,
          derivationContext,
        ),
    ),
  );
  return (independent ?? layerApplicable[0]!).index;
}

function keywordGrantIsForbidden(
  object: GrandArchiveCardInstance,
  keyword: GrandArchiveKeyword,
  modifier: AbilityModifier,
): boolean {
  return collectGrandArchiveActionRules({
    action: "grant-keyword",
    activationKind: "card",
    playerId: modifier.evaluation.controllerId,
    candidateId: object.id,
    fromZone: object.zone,
    grantedKeyword: keyword,
    evaluation: {
      ...modifier.evaluation,
      candidateId: object.id,
      derivingProperties: new Set(modifier.evaluation.derivingProperties ?? []).add(
        "layer-d:grant-keyword-rules",
      ),
      skipCrossObjectKeywordDerivation: true,
    },
  }).some((rule) => rule.effect.mode === "forbid" && rule.timestamp <= modifier.timestamp);
}

/**
 * A resolved Layer D removal can make a static ability cease to exist before
 * that ability grants or removes abilities elsewhere. This is the dependency
 * described by the comprehensive rules' Mordred/Caliburn example: the removal
 * changes whether the other Layer D effect exists, so it applies first even
 * when its timestamp is newer.
 *
 * Resolved effects are independent instances, so suppressing their source's
 * abilities later does not remove the already-created effect itself.
 */
function resolvedLayerDRemovalSuppressesAbility(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  source: GrandArchiveCardInstance,
  ability: Exclude<GrandArchiveExecutableAbility, { readonly kind: "composite" }>,
  derivationContext: GrandArchiveAbilityDerivationContext,
): boolean {
  return state.continuousEffects.some((instance) => {
    if (
      instance.effect.kind !== "continuous" ||
      instance.effect.layer.layer !== "D" ||
      instance.effect.change.kind !== "remove-abilities"
    ) {
      return false;
    }
    const evaluation: GrandArchiveEvaluationContext = {
      program,
      state,
      controllerId: instance.controllerId,
      ...continuousEffectSourceContext(instance),
      bindings: instance.bindings,
      variables: instance.variables,
      ...derivationContext,
    };
    return (
      grandArchiveContinuousEffectIsActive(instance, evaluation) &&
      (!instance.effect.condition ||
        evaluateGrandArchiveCondition(instance.effect.condition, evaluation)) &&
      grandArchiveContinuousEffectAffectsObject(
        instance.effect,
        instance.affectedObjectIds,
        instance.affectedObjectIncarnations,
        source,
        evaluation,
      ) &&
      abilityMatchesRemoval(ability, instance.effect.change.filter)
    );
  });
}

function collectAbilityModifiers(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
  derivationContext: GrandArchiveAbilityDerivationContext,
): readonly AbilityModifier[] {
  const cache = isDefaultAbilityDerivationContext(derivationContext)
    ? defaultAbilityDerivationCache(program, state)
    : undefined;
  const cached = cache?.abilityModifiersByObject.get(object);
  if (cached) return cached;
  const modifiers: AbilityModifier[] = [];
  const baseAbilities = grandArchiveObjectPrintedAbilities(program, object);
  const baseKeywords = keywordsFromAbilities(baseAbilities);
  let order = 0;
  for (const { source, ability } of functionalStaticSources(program, state)) {
    // Gates on unrelated static effects can derive characteristics, which in
    // turn derive granted abilities. Only evaluate gates for this layer.
    if (
      !ability.effects.some(
        (effect) => effect.kind === "continuous" && isAbilityModifierChange(effect.change),
      )
    )
      continue;
    const executionObject = grandArchiveAbilityExecutionObject(state, source, ability);
    if (!executionObject) continue;
    const evaluation = withGrandArchiveDerivedVariables(ability.variables, {
      program,
      state,
      controllerId: executionObject.controllerId,
      sourceId: executionObject.id,
      abilityBearerId: executionObject.id,
      bindings: {},
      ...derivationContext,
    });
    const gateDependsOnLayerD = abilityGateDependsOnLayerD(ability);
    if (
      resolvedLayerDRemovalSuppressesAbility(program, state, source, ability, derivationContext) ||
      (!gateDependsOnLayerD &&
        (!restrictionsAreSatisfied(ability, evaluation) ||
          (ability.condition && !evaluateGrandArchiveCondition(ability.condition, evaluation))))
    ) {
      continue;
    }
    for (const [effectIndex, effect] of ability.effects.entries()) {
      if (
        effect.kind !== "continuous" ||
        !isAbilityModifierChange(effect.change) ||
        (derivationContext.resolutionStartedEventHistoryIndex === undefined &&
          abilityModifierUsesResolutionHistory(effect))
      ) {
        continue;
      }
      const modifier: AbilityModifier = {
        id: `static:${source.id}:${ability.id}:${effectIndex}`,
        effect,
        change: effect.change,
        affectedObjectIds: [],
        affectedObjectIncarnations: {},
        sourceAbility: ability,
        evaluation,
        applicationLayer: modifierLayerFromAbilityGate(effect, ability),
        dependent: grandArchiveContinuousHasLayerDependency(effect) || gateDependsOnLayerD,
        timestamp: grandArchiveObjectTimestamp(source, evaluation),
        order: order++,
      };
      if (!modifier.dependent && !abilityModifierCurrentlyApplies(modifier, object, baseKeywords)) {
        continue;
      }
      modifiers.push(modifier);
    }
  }
  for (const playerId of state.turnOrder) {
    const baseEvaluation: GrandArchiveEvaluationContext = {
      program,
      state,
      controllerId: playerId,
      bindings: {},
      ...derivationContext,
    };
    for (const ability of grandArchiveActiveMasteryAbilities(program, state, playerId)) {
      if (ability.kind !== "static" || ability.staticKind !== "effects") continue;
      if (
        !ability.effects.some(
          (effect) => effect.kind === "continuous" && isAbilityModifierChange(effect.change),
        )
      )
        continue;
      const evaluation = withGrandArchiveDerivedVariables(ability.variables, baseEvaluation);
      const gateDependsOnLayerD = abilityGateDependsOnLayerD(ability);
      if (
        !gateDependsOnLayerD &&
        (!restrictionsAreSatisfied(ability, evaluation) ||
          (ability.condition && !evaluateGrandArchiveCondition(ability.condition, evaluation)))
      ) {
        continue;
      }
      for (const [effectIndex, effect] of ability.effects.entries()) {
        if (
          effect.kind !== "continuous" ||
          !isAbilityModifierChange(effect.change) ||
          (derivationContext.resolutionStartedEventHistoryIndex === undefined &&
            abilityModifierUsesResolutionHistory(effect))
        ) {
          continue;
        }
        const modifier: AbilityModifier = {
          id: `mastery:${playerId}:${ability.id}:${effectIndex}`,
          effect,
          change: effect.change,
          affectedObjectIds: [],
          affectedObjectIncarnations: {},
          sourceAbility: ability,
          evaluation,
          applicationLayer: modifierLayerFromAbilityGate(effect, ability),
          dependent: grandArchiveContinuousHasLayerDependency(effect) || gateDependsOnLayerD,
          timestamp: grandArchiveMasteryTimestamp(state, playerId),
          order: order++,
        };
        if (
          !modifier.dependent &&
          !abilityModifierCurrentlyApplies(modifier, object, baseKeywords)
        ) {
          continue;
        }
        modifiers.push(modifier);
      }
    }
  }
  for (const instance of state.continuousEffects) {
    const evaluation: GrandArchiveEvaluationContext = {
      program,
      state,
      controllerId: instance.controllerId,
      ...continuousEffectSourceContext(instance),
      bindings: instance.bindings,
      variables: instance.variables,
      ...derivationContext,
    };
    if (instance.effect.kind !== "continuous") continue;
    const effect: GrandArchiveContinuousEffect = instance.effect;
    if (!isAbilityModifierChange(effect.change)) {
      continue;
    }
    const modifier: AbilityModifier = {
      id: instance.id,
      effect,
      change: effect.change,
      affectedObjectIds: instance.affectedObjectIds,
      affectedObjectIncarnations: instance.affectedObjectIncarnations,
      instance,
      evaluation,
      applicationLayer: grandArchiveContinuousApplicationLayer(effect),
      dependent: grandArchiveContinuousHasLayerDependency(effect),
      timestamp: instance.createdAtVersion,
      order: order++,
    };
    if (!modifier.dependent && !abilityModifierCurrentlyApplies(modifier, object, baseKeywords)) {
      continue;
    }
    modifiers.push(modifier);
  }
  const ordered = modifiers.sort(
    (left, right) =>
      grandArchiveDependencyLayerOrder(left.applicationLayer) -
        grandArchiveDependencyLayerOrder(right.applicationLayer) ||
      left.timestamp - right.timestamp ||
      left.order - right.order,
  );
  cache?.abilityModifiersByObject.set(object, ordered);
  return ordered;
}

function deriveGrandArchiveDependencyKeywordValues(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
  derivationContext: GrandArchiveAbilityDerivationContext,
): readonly GrandArchiveKeyword[] {
  let keywords = keywordsFromAbilities(grandArchiveObjectPrintedAbilities(program, object));
  const localContext: GrandArchiveAbilityDerivationContext = {
    ...derivationContext,
    skipCrossObjectKeywordDerivation: true,
  };
  const pending = [...collectAbilityModifiers(program, state, object, localContext)];
  while (pending.length > 0) {
    const modifierIndex = selectNextAbilityModifier(pending, object, keywords, localContext);
    if (modifierIndex < 0) break;
    const modifier = pending.splice(modifierIndex, 1)[0]!;
    keywords = keywordValuesAfterAbilityModifier(modifier, object, keywords, localContext);
  }
  return keywords;
}

function abilityMatchesRemoval(
  ability: Exclude<GrandArchiveExecutableAbility, { readonly kind: "composite" }>,
  filter: Extract<KeywordModifierChange, { readonly kind: "remove-abilities" }>["filter"],
): boolean {
  if (!filter) return true;
  if (filter.abilityId && ability.id !== filter.abilityId) return false;
  if (filter.label && (!("label" in ability) || ability.label?.name !== filter.label)) {
    return false;
  }
  const abilityKind =
    ability.kind === "activated" || ability.kind === "triggered" || ability.kind === "static"
      ? ability.kind
      : undefined;
  if (filter.abilityKinds && (!abilityKind || !filter.abilityKinds.includes(abilityKind))) {
    return false;
  }
  if (
    filter.keyword &&
    !abilityKeywords(ability).some((keyword) => keyword.name === filter.keyword)
  ) {
    return false;
  }
  return true;
}

type FlatAbility = Exclude<GrandArchiveExecutableAbility, { readonly kind: "composite" }>;

function abilityRulesKind(ability: FlatAbility): "activated" | "triggered" | "static" | undefined {
  return ability.kind === "activated" || ability.kind === "triggered" || ability.kind === "static"
    ? ability.kind
    : undefined;
}

function transformActivatedAbilityToOnDeath(
  ability: Extract<FlatAbility, { readonly kind: "activated" }>,
): Extract<FlatAbility, { readonly kind: "triggered" }> {
  const {
    kind: _kind,
    speed: _speed,
    activation: _activation,
    activationAuthority: _activationAuthority,
    cost: _cost,
    costModifiers: _costModifiers,
    stackBehavior: _stackBehavior,
    condition,
    limit,
    modes,
    effect,
    cascade,
    ...shared
  } = ability;
  const common = {
    ...shared,
    kind: "triggered" as const,
    trigger: {
      kind: "event" as const,
      event: { name: "object-died" as const, subject: { kind: "source" as const } },
    },
    ...(condition ? { interveningCondition: condition } : {}),
    ...(limit ? { limit: { count: limit.count, per: limit.per } } : {}),
  };
  return effect
    ? { ...common, ...(modes ? { modes } : {}), effect }
    : { ...common, cascade: cascade! };
}

function deriveGrandArchiveObjectActiveAbilities(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
  derivationPath: ReadonlySet<string>,
  excludedModifierIds: ReadonlySet<string>,
  derivationContext: GrandArchiveAbilityDerivationContext,
): readonly FlatAbility[] {
  if (derivationPath.has(object.id)) {
    throw new GrandArchiveUnsupportedRuleError("cyclic ability copying");
  }
  const nextPath = new Set(derivationPath).add(object.id);
  let abilities = grandArchiveObjectPrintedAbilities(program, object);
  const pending = collectAbilityModifiers(program, state, object, derivationContext).filter(
    (modifier) => !excludedModifierIds.has(modifier.id),
  );
  let modifierKeywords = keywordsFromAbilities(abilities);
  while (pending.length > 0) {
    const modifierIndex = selectNextAbilityModifier(
      pending,
      object,
      modifierKeywords,
      derivationContext,
    );
    if (modifierIndex < 0) break;
    const modifier = pending.splice(modifierIndex, 1)[0]!;
    modifierKeywords = keywordValuesAfterAbilityModifier(
      modifier,
      object,
      modifierKeywords,
      derivationContext,
    );
    switch (modifier.change.kind) {
      case "grant-keyword":
      case "remove-keyword":
        break;
      case "grant-ability":
        abilities = [...abilities, ...flattenGrandArchiveAbilities([modifier.change.ability])];
        break;
      case "remove-abilities": {
        const change = modifier.change;
        abilities = abilities.filter((ability) => !abilityMatchesRemoval(ability, change.filter));
        break;
      }
      case "copy-abilities": {
        const change = modifier.change;
        const nextExcludedModifierIds = new Set(excludedModifierIds).add(modifier.id);
        const copied = resolveGrandArchiveSubjectObjects(change.from, modifier.evaluation).flatMap(
          (source) =>
            deriveGrandArchiveObjectActiveAbilities(
              program,
              state,
              source,
              nextPath,
              nextExcludedModifierIds,
              derivationContext,
            ).filter(
              (ability) =>
                !change.abilityKinds ||
                (abilityRulesKind(ability) !== undefined &&
                  change.abilityKinds.includes(abilityRulesKind(ability)!)),
            ),
        );
        abilities = [...abilities, ...copied];
        break;
      }
      case "copy-abilities-from-collection": {
        const change = modifier.change;
        const nextExcludedModifierIds = new Set(excludedModifierIds).add(modifier.id);
        const copied = resolveGrandArchiveCollection(change.collection, modifier.evaluation)
          .filter((source) => !change.excludingSelf || source.id !== object.id)
          .flatMap((source) =>
            deriveGrandArchiveObjectActiveAbilities(
              program,
              state,
              source,
              nextPath,
              nextExcludedModifierIds,
              derivationContext,
            ),
          );
        abilities = [...abilities, ...copied];
        break;
      }
      case "transform-abilities":
        abilities = abilities.map((ability) =>
          ability.kind === "activated" ? transformActivatedAbilityToOnDeath(ability) : ability,
        );
        break;
    }
  }
  return abilities.flatMap((ability) => {
    const executionObject = grandArchiveAbilityExecutionObject(state, object, ability);
    return [
      ability,
      ...Array.from(
        {
          length: executionObject
            ? grandArchiveAdditionalAbilityInstances(program, state, executionObject, ability)
            : 0,
        },
        () => ability,
      ),
    ];
  });
}

/** Derives printed, granted, copied, transformed, and removed abilities in layer-D order. */
export function grandArchiveObjectActiveAbilities(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
  derivationContext: GrandArchiveAbilityDerivationContext = {},
): readonly FlatAbility[] {
  const cache = isDefaultAbilityDerivationContext(derivationContext)
    ? defaultAbilityDerivationCache(program, state)
    : undefined;
  const cached = cache?.abilitiesByObject.get(object);
  if (cached) return cached;
  const derived = deriveGrandArchiveObjectActiveAbilities(
    program,
    state,
    object,
    new Set(),
    new Set(),
    derivationContext,
  );
  const face = grandArchiveObjectFace(program, object);
  const active =
    object.zone === "field" &&
    grandArchiveCardIsObject(face) &&
    (object.counters.enlighten ?? 0) > 0
      ? [...derived, GRAND_ARCHIVE_ENLIGHTEN_COUNTER_ACTIVATED_ABILITY]
      : derived;
  cache?.abilitiesByObject.set(object, active);
  return active;
}

/** Derives every active keyword and preserves the context that gives its parameters meaning. */
export function grandArchiveObjectActiveKeywordInstances(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
  derivationContext: GrandArchiveAbilityDerivationContext = {},
): readonly GrandArchiveActiveKeywordInstance[] {
  const cache = isDefaultAbilityDerivationContext(derivationContext)
    ? defaultAbilityDerivationCache(program, state)
    : undefined;
  const cached = cache?.keywordInstancesByObject.get(object);
  if (cached) return cached;
  const evaluation: GrandArchiveEvaluationContext = {
    program,
    state,
    controllerId: object.controllerId,
    sourceId: object.id,
    abilityBearerId: object.id,
    bindings: {},
    ...derivationContext,
  };
  let instances: readonly GrandArchiveActiveKeywordInstance[] = grandArchiveObjectPrintedAbilities(
    program,
    object,
  ).flatMap((ability) => {
    const printedKeywords = abilityKeywords(ability);
    if (printedKeywords.length === 0) return [];
    const abilityEvaluation = withGrandArchiveDerivedVariables(ability.variables, evaluation);
    try {
      return restrictionsAreSatisfied(ability, abilityEvaluation) &&
        !(
          ability.kind === "static" &&
          ability.condition !== undefined &&
          !evaluateGrandArchiveCondition(ability.condition, abilityEvaluation)
        )
        ? printedKeywords.map((keyword) => ({
            keyword,
            evaluation: abilityEvaluation,
            originId: `printed:${object.id}:${ability.id}`,
          }))
        : [];
    } catch (error) {
      if (!(error instanceof GrandArchiveUnsupportedRuleError)) throw error;
      throw new GrandArchiveUnsupportedRuleError(
        `ability ${ability.id} on ${object.definitionId}: ${error.message.replace(
          "Grand Archive rule feature is not implemented: ",
          "",
        )}`,
      );
    }
  });
  const hostedKeywords = Object.values(state.objects).flatMap(
    (origin): readonly GrandArchiveActiveKeywordInstance[] => {
      if (origin.id === object.id) return [];
      const face = grandArchiveObjectFace(program, origin);
      return grandArchiveObjectPrintedAbilities(program, origin).flatMap(
        (ability): readonly GrandArchiveActiveKeywordInstance[] => {
          if (!ability.executionSource || !grandArchiveAbilityIsFunctional(face, ability, origin)) {
            return [];
          }
          const keywords = abilityKeywords(ability);
          if (keywords.length === 0) return [];
          const executionObject = grandArchiveAbilityExecutionObject(state, origin, ability);
          if (executionObject?.id !== object.id) return [];
          const hostedEvaluation = withGrandArchiveDerivedVariables(ability.variables, {
            ...evaluation,
            controllerId: executionObject.controllerId,
            sourceId: executionObject.id,
            abilityBearerId: executionObject.id,
          });
          return restrictionsAreSatisfied(ability, hostedEvaluation) &&
            !(
              ability.kind === "static" &&
              ability.condition !== undefined &&
              !evaluateGrandArchiveCondition(ability.condition, hostedEvaluation)
            )
            ? keywords.map((keyword) => ({
                keyword,
                evaluation: hostedEvaluation,
                originId: `hosted:${origin.id}:${ability.id}`,
              }))
            : [];
        },
      );
    },
  );
  instances = [...instances, ...hostedKeywords];
  const pending = [...collectAbilityModifiers(program, state, object, derivationContext)];
  while (pending.length > 0) {
    const modifierIndex = selectNextAbilityModifier(
      pending,
      object,
      instances.map((instance) => instance.keyword),
      derivationContext,
    );
    if (modifierIndex < 0) break;
    const modifier = pending.splice(modifierIndex, 1)[0]!;
    if (isKeywordModifierChange(modifier.change)) {
      if (modifier.change.kind === "grant-keyword") {
        if (!keywordGrantIsForbidden(object, modifier.change.keyword, modifier)) {
          instances = applyKeywordModifier(
            instances,
            modifier.change,
            modifier.evaluation,
            modifier.id,
          );
        }
        continue;
      }
      if (modifier.change.kind === "grant-ability") {
        // Event-derived variables belong to the granted trigger, not keyword
        // discovery. Do not evaluate non-keyword abilities before their event.
        const grantedKeywords = flattenGrandArchiveAbilities([modifier.change.ability])
          .flatMap(abilityKeywords)
          .filter((keyword) => !keywordGrantIsForbidden(object, keyword, modifier));
        if (grantedKeywords.length === 0) continue;
        const grantedEvaluation = withGrandArchiveDerivedVariables(
          "variables" in modifier.change.ability ? modifier.change.ability.variables : undefined,
          modifier.evaluation,
        );
        instances = [
          ...instances,
          ...grantedKeywords.map((keyword) => ({
            keyword,
            evaluation: grantedEvaluation,
            originId: modifier.id,
          })),
        ];
        continue;
      }
      instances = applyKeywordModifier(
        instances,
        modifier.change,
        modifier.evaluation,
        modifier.id,
      );
      continue;
    }
    if (
      modifier.change.kind === "copy-abilities" ||
      modifier.change.kind === "copy-abilities-from-collection"
    ) {
      const change = modifier.change;
      const nextExcludedModifierIds = new Set([modifier.id]);
      const sources =
        change.kind === "copy-abilities"
          ? resolveGrandArchiveSubjectObjects(change.from, modifier.evaluation)
          : resolveGrandArchiveCollection(change.collection, modifier.evaluation).filter(
              (source) => !change.excludingSelf || source.id !== object.id,
            );
      const copiedAbilities = sources.flatMap((source) =>
        deriveGrandArchiveObjectActiveAbilities(
          program,
          state,
          source,
          new Set([object.id]),
          nextExcludedModifierIds,
          derivationContext,
        ).filter(
          (ability) =>
            change.kind !== "copy-abilities" ||
            !change.abilityKinds ||
            (abilityRulesKind(ability) !== undefined &&
              change.abilityKinds.includes(abilityRulesKind(ability)!)),
        ),
      );
      const copiedKeywordInstances = copiedAbilities.flatMap((ability) => {
        const keywords = abilityKeywords(ability).filter(
          (keyword) => !keywordGrantIsForbidden(object, keyword, modifier),
        );
        if (keywords.length === 0) return [];
        const copiedEvaluation = withGrandArchiveDerivedVariables(
          ability.variables,
          modifier.evaluation,
        );
        return keywords.map((keyword) => ({
          keyword,
          evaluation: copiedEvaluation,
          originId: modifier.id,
        }));
      });
      instances = [...instances, ...copiedKeywordInstances];
    }
  }
  cache?.keywordInstancesByObject.set(object, instances);
  return instances;
}

/** Derives every currently active keyword instance in continuous-effect order. */
export function grandArchiveObjectActiveKeywords(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
  derivationContext: GrandArchiveAbilityDerivationContext = {},
): readonly GrandArchiveKeyword[] {
  return grandArchiveObjectActiveKeywordInstances(program, state, object, derivationContext).map(
    (instance) => instance.keyword,
  );
}

/**
 * Derives whether an object currently has a keyword after printed conditions,
 * static restrictions, and timestamp-ordered continuous ability changes.
 */
export function grandArchiveObjectHasActiveKeyword(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
  keywordName: string,
): boolean {
  return grandArchiveObjectActiveKeywordInstances(program, state, object).some(
    (instance) => instance.keyword.name === keywordName,
  );
}

export function grandArchivePlayerControlsActiveKeyword(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  playerId: import("../../game/identity.ts").GrandArchivePlayerId,
  keywordName: string,
): boolean {
  return Object.values(state.objects).some(
    (object) =>
      object.zone === "field" &&
      object.controllerId === playerId &&
      grandArchiveObjectHasActiveKeyword(program, state, object, keywordName),
  );
}

function assertNever(value: never): never {
  throw new Error(`Unhandled Grand Archive keyword modifier: ${JSON.stringify(value)}`);
}
