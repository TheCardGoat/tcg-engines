import { continuousEffectSourceContext } from "./continuous-source.ts";
import type {
  GrandArchiveCardCharacteristic,
  GrandArchiveCharacteristicChange,
  GrandArchiveClass,
  GrandArchiveContinuousEffect,
  GrandArchiveElement,
  GrandArchiveNumericProperty,
  GrandArchiveRulesType,
  GrandArchiveSupertype,
} from "@tcg/grand-archive-types";
import {
  GRAND_ARCHIVE_CARD_TYPES,
  GRAND_ARCHIVE_CLASSES,
  GRAND_ARCHIVE_ELEMENTS,
} from "@tcg/grand-archive-types";
import { grandArchiveAdditionalAbilityInstances } from "../abilities/ability-multipliers.ts";
import {
  grandArchiveContinuousApplicationLayer,
  grandArchiveContinuousHasLayerDependency,
  grandArchiveDependencyLayerOrder,
  type GrandArchiveDependencyLayer,
} from "./continuous-dependencies.ts";
import {
  flattenGrandArchiveAbilities,
  grandArchiveAbilityExecutionObject,
  grandArchiveAbilityIsFunctional,
  grandArchiveObjectFace,
  grandArchiveObjectHasConcealedCharacteristics,
  grandArchiveObjectPrintedAbilities,
} from "../../game/card-runtime.ts";
import {
  evaluateGrandArchiveAmount,
  evaluateGrandArchiveCondition,
  resolveGrandArchivePlayers,
  resolveGrandArchiveSubjectObjects,
  GrandArchiveUnsupportedRuleError,
  withGrandArchiveDerivedVariables,
  type GrandArchiveEvaluationContext,
} from "../../procedures/effects/evaluation.ts";
import { grandArchiveDurationStatus, type GrandArchiveDurationStatus } from "./durations.ts";
import { grandArchiveObjectActiveAbilities } from "../abilities/intrinsic-keywords.ts";
import type {
  GrandArchiveCardInstance,
  GrandArchiveContinuousEffectInstance,
} from "../../game/model.ts";

interface NumericModifier {
  readonly id: string;
  readonly effect: GrandArchiveContinuousEffect;
  readonly affectedObjectIds: readonly string[];
  readonly affectedObjectIncarnations: Readonly<Record<string, number>>;
  readonly evaluation: GrandArchiveEvaluationContext;
  readonly applicationLayer: GrandArchiveDependencyLayer;
  readonly timestamp: number;
}

type NumericModifierScope = "object" | "attack";

type NumericSwapChange = Extract<
  GrandArchiveCharacteristicChange,
  { readonly kind: "numeric"; readonly operation: "swap" }
>;

function numericModifierIsSwap(modifier: NumericModifier): modifier is NumericModifier & {
  readonly effect: GrandArchiveContinuousEffect & { readonly change: NumericSwapChange };
} {
  return modifier.effect.change.kind === "numeric" && modifier.effect.change.operation === "swap";
}

interface ControlModifier {
  readonly id: string;
  readonly controllerId: import("../../game/identity.ts").GrandArchivePlayerId;
  readonly applicationLayer: GrandArchiveDependencyLayer;
  readonly dependent: boolean;
  readonly timestamp: number;
}

type CharacteristicChange = Extract<
  GrandArchiveCharacteristicChange,
  {
    readonly kind:
      | "add-characteristic"
      | "remove-characteristic"
      | "add-tracked-characteristic"
      | "set-elements"
      | "set-types"
      | "copy-characteristic";
  }
>;

interface CharacteristicModifier {
  readonly id: string;
  readonly effect: GrandArchiveContinuousEffect;
  readonly affectedObjectIds: readonly string[];
  readonly affectedObjectIncarnations: Readonly<Record<string, number>>;
  readonly change: CharacteristicChange;
  readonly evaluation: GrandArchiveEvaluationContext;
  readonly applicationLayer: GrandArchiveDependencyLayer;
  readonly timestamp: number;
}

function characteristicChangeSetsValue(change: CharacteristicChange): boolean {
  return (
    change.kind === "set-elements" ||
    change.kind === "set-types" ||
    change.kind === "copy-characteristic"
  );
}

export interface GrandArchiveDerivedCharacteristics {
  readonly names: readonly string[];
  readonly supertypes: readonly GrandArchiveSupertype[];
  readonly types: readonly GrandArchiveRulesType[];
  readonly classes: readonly GrandArchiveClass[];
  readonly subtypes: readonly string[];
  readonly elements: readonly GrandArchiveElement[];
}

export interface GrandArchiveControllerDerivation {
  readonly controllerId: import("../../game/identity.ts").GrandArchivePlayerId;
  /** Absent when effective control falls back to the object's base controller. */
  readonly effectId?: string;
}

function baseNumericProperty(
  object: GrandArchiveCardInstance,
  property: GrandArchiveNumericProperty,
  context: GrandArchiveEvaluationContext,
): number | undefined {
  if (grandArchiveObjectHasConcealedCharacteristics(context.program, object)) return undefined;
  const face = grandArchiveObjectFace(context.program, object);
  switch (property) {
    case "level":
    case "power":
    case "life":
    case "durability":
      return face.stats[property];
    case "reserve-cost":
    case "memory-cost": {
      const costKind = property === "reserve-cost" ? "reserve" : "memory";
      return face.cost.kind === costKind && typeof face.cost.amount === "number"
        ? face.cost.amount
        : undefined;
    }
    default:
      return assertNever(property);
  }
}

function numericOverrideKey(
  object: GrandArchiveCardInstance,
  property: GrandArchiveNumericProperty,
): string {
  return `${object.id}:${property}`;
}

function withNumericOverride(
  context: GrandArchiveEvaluationContext,
  object: GrandArchiveCardInstance,
  property: GrandArchiveNumericProperty,
  value: number | undefined,
): GrandArchiveEvaluationContext {
  return {
    ...context,
    numericOverrides: new Map([
      ...(context.numericOverrides?.entries() ?? []),
      [numericOverrideKey(object, property), value] as const,
    ]),
  };
}

function numericModifierCurrentlyApplies(
  modifier: NumericModifier,
  object: GrandArchiveCardInstance,
  evaluation: GrandArchiveEvaluationContext,
): boolean {
  return (
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

interface NumericModifierObservation {
  readonly applies: boolean;
  readonly amount: number;
}

function observeNumericModifier(
  modifier: NumericModifier,
  object: GrandArchiveCardInstance,
  property: GrandArchiveNumericProperty,
  value: number | undefined,
): NumericModifierObservation {
  const change = modifier.effect.change;
  // Card Characteristics — Stat-Setting rule 1 gives an absent stat a
  // provisional base value of zero before the setter itself is evaluated.
  const observedValue =
    change.kind === "numeric" && change.operation === "set" && value === undefined ? 0 : value;
  const evaluation = withNumericOverride(modifier.evaluation, object, property, observedValue);
  if (!numericModifierCurrentlyApplies(modifier, object, evaluation)) {
    return { applies: false, amount: 0 };
  }
  if (change.kind !== "numeric" || change.operation === "swap") {
    return { applies: false, amount: 0 };
  }
  return {
    applies: true,
    amount: change.amount === undefined ? 0 : evaluateGrandArchiveAmount(change.amount, evaluation),
  };
}

function applyObservedNumericModifier(
  modifier: NumericModifier,
  observation: NumericModifierObservation,
  value: number | undefined,
): number | undefined {
  if (!observation.applies) return value;
  const change = modifier.effect.change;
  if (change.kind !== "numeric" || change.operation === "swap") return value;
  if (change.operation === "set") return observation.amount;
  if (value === undefined) return value;
  return change.operation === "add" ? value + observation.amount : value - observation.amount;
}

function numericModifierDependsOn(
  candidate: NumericModifier,
  prerequisite: NumericModifier,
  object: GrandArchiveCardInstance,
  property: GrandArchiveNumericProperty,
  value: number | undefined,
): boolean {
  if (
    candidate.id === prerequisite.id ||
    candidate.applicationLayer !== prerequisite.applicationLayer
  ) {
    return false;
  }
  const candidateChange = candidate.effect.change;
  const prerequisiteChange = prerequisite.effect.change;
  if (
    candidateChange.kind !== "numeric" ||
    candidateChange.operation === "swap" ||
    prerequisiteChange.kind !== "numeric" ||
    prerequisiteChange.operation === "swap" ||
    (candidateChange.operation === "set") !== (prerequisiteChange.operation === "set")
  ) {
    return false;
  }
  const before = observeNumericModifier(candidate, object, property, value);
  const prerequisiteObservation = observeNumericModifier(prerequisite, object, property, value);
  const afterValue = applyObservedNumericModifier(prerequisite, prerequisiteObservation, value);
  const after = observeNumericModifier(candidate, object, property, afterValue);
  return before.applies !== after.applies || (before.applies && before.amount !== after.amount);
}

export function grandArchiveObjectTimestamp(
  object: GrandArchiveCardInstance,
  context: GrandArchiveEvaluationContext,
) {
  for (let index = context.state.eventHistory.length - 1; index >= 0; index -= 1) {
    const event = context.state.eventHistory[index];
    if (event?.type === "object-transformed" && event.objectId === object.id) {
      return event.stateVersion;
    }
    if (
      event?.type === "champion-leveled-up" &&
      event.cardId === object.id &&
      event.championId === object.hostId
    ) {
      return event.stateVersion;
    }
    if (
      event?.type === "object-moved" &&
      event.objectId === object.id &&
      (event.to === "field" || event.to === "inner-lineage" || event.to === "pantheon")
    )
      return event.stateVersion;
    if (event?.type === "object-created" && event.object.id === object.id)
      return event.stateVersion;
    if (
      event?.type === "tokens-summoned" &&
      event.objects.some((summoned) => summoned.id === object.id)
    ) {
      return event.stateVersion;
    }
  }
  return 0;
}

export function grandArchiveContinuousEffectIsActive(
  instance: GrandArchiveContinuousEffectInstance,
  context: GrandArchiveEvaluationContext,
): boolean {
  return continuousDurationStatus(instance, context) === "active";
}

function continuousDurationStatus(
  instance: GrandArchiveContinuousEffectInstance,
  context: GrandArchiveEvaluationContext,
): GrandArchiveDurationStatus {
  const duration = instance.effect.duration;
  const subjects =
    duration.kind === "while-subjects-in-zone"
      ? resolveGrandArchiveSubjectObjects(duration.subjects, context)
      : [];
  return grandArchiveDurationStatus(duration, instance, context, {
    conditionMet:
      !("condition" in instance.effect) ||
      !instance.effect.condition ||
      evaluateGrandArchiveCondition(instance.effect.condition, context),
    subjectsRemainInZone:
      duration.kind === "while-subjects-in-zone" &&
      subjects.length > 0 &&
      (duration.scope === "all"
        ? subjects.every((object) => object.zone === duration.zone)
        : subjects.some((object) => object.zone === duration.zone)),
  });
}

export function grandArchiveContinuousEffectAffectsObject(
  effect: GrandArchiveContinuousEffect,
  affectedObjectIds: readonly string[],
  affectedObjectIncarnations: Readonly<Record<string, number>>,
  object: GrandArchiveCardInstance,
  context: GrandArchiveEvaluationContext,
): boolean {
  if (effect.affectedSet === "locked") {
    return (
      affectedObjectIds.includes(object.id) &&
      affectedObjectIncarnations[object.id] === object.incarnation
    );
  }
  return resolveGrandArchiveSubjectObjects(effect.subjects, context).some(
    (candidate) => candidate.id === object.id,
  );
}

function isObjectContinuousEffect(
  effect: GrandArchiveContinuousEffectInstance["effect"],
): effect is GrandArchiveContinuousEffect {
  return effect.kind === "continuous";
}

function continuousStaticAbilities(
  source: GrandArchiveCardInstance,
  context: GrandArchiveEvaluationContext,
) {
  const printedAbilities = grandArchiveObjectPrintedAbilities(context.program, source);
  const currentAbilities = objectHasAbilityLayerModifier(source, context)
    ? grandArchiveObjectActiveAbilities(context.program, context.state, source, {
        ...(context.resolutionStartedEventHistoryIndex !== undefined
          ? { resolutionStartedEventHistoryIndex: context.resolutionStartedEventHistoryIndex }
          : {}),
        ...(context.derivingProperties ? { derivingProperties: context.derivingProperties } : {}),
      })
    : printedAbilities;
  // Removing an ability in Layer D stops its later stat effects, but must not
  // erase type/base-characteristic changes already applied in earlier layers.
  const earlierLayerAbilities = printedAbilities.flatMap((ability) => {
    if (
      currentAbilities.includes(ability) ||
      ability.kind !== "static" ||
      ability.staticKind !== "effects"
    )
      return [];
    const [first, ...rest] = ability.effects.filter(
      (effect) =>
        effect.kind === "continuous" &&
        (effect.layer.layer === "A" || effect.layer.layer === "B" || effect.layer.layer === "C"),
    );
    return first ? [{ ...ability, effects: [first, ...rest] as const }] : [];
  });
  return [...earlierLayerAbilities, ...currentAbilities];
}

const printedStaticSourcesByState = new WeakMap<
  object,
  WeakMap<object, readonly GrandArchiveCardInstance[]>
>();

function continuousStaticSources(
  context: GrandArchiveEvaluationContext,
): readonly GrandArchiveCardInstance[] {
  // Granted/copied abilities can make any source relevant, and their applicability
  // depends on the current layer context. Retain the full derivation in that case.
  if (
    context.state.continuousEffects.some(
      (instance) =>
        isObjectContinuousEffect(instance.effect) && isAbilityLayerChange(instance.effect.change),
    )
  )
    return Object.values(context.state.objects);
  let programs = printedStaticSourcesByState.get(context.state);
  if (!programs) {
    programs = new WeakMap();
    printedStaticSourcesByState.set(context.state, programs);
  }
  const existing = programs.get(context.program);
  if (existing) return existing;
  const sources = Object.values(context.state.objects).filter((source) => {
    const face = grandArchiveObjectFace(context.program, source);
    return grandArchiveObjectPrintedAbilities(context.program, source).some(
      (ability) =>
        ability.kind === "static" &&
        ability.staticKind === "effects" &&
        grandArchiveAbilityIsFunctional(face, ability, source),
    );
  });
  programs.set(context.program, sources);
  return sources;
}

function collectNumericModifiers(
  object: GrandArchiveCardInstance,
  property: GrandArchiveNumericProperty,
  context: GrandArchiveEvaluationContext,
  scope: NumericModifierScope = "object",
): readonly NumericModifier[] {
  const modifiers: NumericModifier[] = [];
  for (const source of continuousStaticSources(context)) {
    const face = grandArchiveObjectFace(context.program, source);
    for (const ability of continuousStaticAbilities(source, context)) {
      if (ability.kind !== "static" || ability.staticKind !== "effects") continue;
      // Restrictions may derive other properties. Only evaluate them when this
      // ability can contribute to the property and scope currently being read.
      if (
        !ability.effects.some(
          (effect) =>
            effect.kind === "continuous" &&
            effect.change.kind === "numeric" &&
            effect.change.property === property &&
            (effect.subjects.kind === "current-attack" || effect.subjects.kind === "attacks-by") ===
              (scope === "attack"),
        )
      )
        continue;
      if (!grandArchiveAbilityIsFunctional(face, ability, source)) continue;
      const executionObject = grandArchiveAbilityExecutionObject(context.state, source, ability);
      if (!executionObject) continue;
      const evaluation = withGrandArchiveDerivedVariables(ability.variables, {
        ...context,
        controllerId: executionObject.controllerId,
        sourceId: executionObject.id,
        abilityBearerId: executionObject.id,
        bindings: { ...executionObject.activationBindings, ...context.bindings },
        variables: { ...executionObject.activationVariables, ...context.variables },
      });
      const restrictionEvaluation =
        executionObject.id === source.id
          ? evaluation
          : { ...evaluation, sourceId: source.id, abilityBearerId: source.id };
      if (
        !staticRestrictionsAreSatisfied(ability, restrictionEvaluation) ||
        (ability.condition && !evaluateGrandArchiveCondition(ability.condition, evaluation))
      )
        continue;
      for (const [effectIndex, effect] of ability.effects.entries()) {
        const isAttackScoped =
          effect.kind === "continuous" &&
          (effect.subjects.kind === "current-attack" || effect.subjects.kind === "attacks-by");
        if (
          effect.kind !== "continuous" ||
          effect.change.kind !== "numeric" ||
          effect.change.property !== property ||
          isAttackScoped !== (scope === "attack")
        )
          continue;
        const instances =
          effect.layer.layer === "E"
            ? 1 +
              grandArchiveAdditionalAbilityInstances(
                context.program,
                context.state,
                executionObject,
                ability,
              )
            : 1;
        for (let index = 0; index < instances; index += 1) {
          modifiers.push({
            id: `static:${source.id}:${ability.id}:${effectIndex}:${index}`,
            effect,
            affectedObjectIds: [],
            affectedObjectIncarnations: {},
            evaluation,
            applicationLayer: grandArchiveContinuousApplicationLayer(effect),
            timestamp: grandArchiveObjectTimestamp(source, context),
          });
        }
      }
    }
  }
  for (const instance of context.state.continuousEffects) {
    const evaluation = {
      ...context,
      controllerId: instance.controllerId,
      ...continuousEffectSourceContext(instance),
      bindings: instance.bindings,
      variables: instance.variables,
    };
    if (
      !grandArchiveContinuousEffectIsActive(instance, evaluation) ||
      !isObjectContinuousEffect(instance.effect) ||
      instance.effect.change.kind !== "numeric" ||
      instance.effect.change.property !== property ||
      (instance.effect.subjects.kind === "current-attack" ||
        instance.effect.subjects.kind === "attacks-by") !==
        (scope === "attack")
    )
      continue;
    modifiers.push({
      id: instance.id,
      effect: instance.effect,
      affectedObjectIds: instance.affectedObjectIds,
      affectedObjectIncarnations: instance.affectedObjectIncarnations,
      evaluation,
      applicationLayer: grandArchiveContinuousApplicationLayer(instance.effect),
      timestamp: instance.createdAtVersion,
    });
  }
  return modifiers.sort((left, right) => {
    return (
      grandArchiveDependencyLayerOrder(left.applicationLayer) -
        grandArchiveDependencyLayerOrder(right.applicationLayer) ||
      left.timestamp - right.timestamp ||
      left.id.localeCompare(right.id)
    );
  });
}

function collectControlModifiers(
  object: GrandArchiveCardInstance,
  context: GrandArchiveEvaluationContext,
): readonly ControlModifier[] {
  const modifiers: ControlModifier[] = [];
  for (const source of continuousStaticSources(context)) {
    const face = grandArchiveObjectFace(context.program, source);
    for (const ability of continuousStaticAbilities(source, context)) {
      if (ability.kind !== "static" || ability.staticKind !== "effects") continue;
      if (!grandArchiveAbilityIsFunctional(face, ability, source)) continue;
      const executionObject = grandArchiveAbilityExecutionObject(context.state, source, ability);
      if (!executionObject) continue;
      const evaluation = withGrandArchiveDerivedVariables(ability.variables, {
        ...context,
        controllerId: executionObject.controllerId,
        sourceId: executionObject.id,
        abilityBearerId: executionObject.id,
        bindings: {},
      });
      if (ability.condition && !evaluateGrandArchiveCondition(ability.condition, evaluation)) {
        continue;
      }
      for (const [effectIndex, effect] of ability.effects.entries()) {
        if (
          effect.kind !== "continuous" ||
          effect.change.kind !== "control" ||
          (effect.condition && !evaluateGrandArchiveCondition(effect.condition, evaluation)) ||
          !grandArchiveContinuousEffectAffectsObject(effect, [], {}, object, evaluation)
        ) {
          continue;
        }
        const controllers = resolveGrandArchivePlayers(effect.change.controller, evaluation);
        if (controllers.length !== 1) {
          throw new GrandArchiveUnsupportedRuleError(
            "continuous control effect requires exactly one controller",
          );
        }
        modifiers.push({
          id: `static:${source.id}:${ability.id}:${effectIndex}`,
          controllerId: controllers[0]!,
          applicationLayer: grandArchiveContinuousApplicationLayer(effect),
          dependent: grandArchiveContinuousHasLayerDependency(effect),
          timestamp: grandArchiveObjectTimestamp(source, context),
        });
      }
    }
  }
  for (const instance of context.state.continuousEffects) {
    const evaluation: GrandArchiveEvaluationContext = {
      ...context,
      controllerId: instance.controllerId,
      ...continuousEffectSourceContext(instance),
      bindings: instance.bindings,
      variables: instance.variables,
    };
    if (
      !grandArchiveContinuousEffectIsActive(instance, evaluation) ||
      !isObjectContinuousEffect(instance.effect) ||
      instance.effect.change.kind !== "control" ||
      (instance.effect.condition &&
        !evaluateGrandArchiveCondition(instance.effect.condition, evaluation)) ||
      !grandArchiveContinuousEffectAffectsObject(
        instance.effect,
        instance.affectedObjectIds,
        instance.affectedObjectIncarnations,
        object,
        evaluation,
      )
    ) {
      continue;
    }
    const controllers = resolveGrandArchivePlayers(instance.effect.change.controller, evaluation);
    if (controllers.length !== 1) {
      throw new GrandArchiveUnsupportedRuleError(
        "continuous control effect requires exactly one controller",
      );
    }
    modifiers.push({
      id: instance.id,
      controllerId: controllers[0]!,
      applicationLayer: grandArchiveContinuousApplicationLayer(instance.effect),
      dependent: grandArchiveContinuousHasLayerDependency(instance.effect),
      timestamp: instance.createdAtVersion,
    });
  }
  return modifiers.sort(
    (left, right) =>
      grandArchiveDependencyLayerOrder(left.applicationLayer) -
        grandArchiveDependencyLayerOrder(right.applicationLayer) ||
      Number(left.dependent) - Number(right.dependent) ||
      left.timestamp - right.timestamp ||
      left.id.localeCompare(right.id),
  );
}

function isCharacteristicChange(
  change: GrandArchiveCharacteristicChange,
): change is CharacteristicChange {
  return (
    change.kind === "add-characteristic" ||
    change.kind === "remove-characteristic" ||
    change.kind === "add-tracked-characteristic" ||
    change.kind === "set-elements" ||
    change.kind === "set-types" ||
    change.kind === "copy-characteristic"
  );
}

function isAbilityLayerChange(change: GrandArchiveCharacteristicChange): boolean {
  return (
    change.kind === "grant-ability" ||
    change.kind === "remove-abilities" ||
    change.kind === "copy-abilities" ||
    change.kind === "copy-abilities-from-collection" ||
    change.kind === "transform-abilities"
  );
}

function staticRestrictionsAreSatisfied(
  ability: Exclude<
    import("@tcg/grand-archive-types").GrandArchiveExecutableAbility,
    { readonly kind: "composite" }
  >,
  evaluation: GrandArchiveEvaluationContext,
): boolean {
  return !ability.restrictions?.some(
    (restriction) =>
      restriction.kind === "static" &&
      !evaluateGrandArchiveCondition(restriction.condition, evaluation),
  );
}

function objectHasAbilityLayerModifier(
  object: GrandArchiveCardInstance,
  context: GrandArchiveEvaluationContext,
): boolean {
  // Layer B/C reads made while Layer D is resolving must not feed Layer-D
  // granted abilities back into an earlier layer in the same derivation.
  if (
    [...(context.derivingProperties ?? [])].some(
      (key) => key.endsWith(":layer-d-keywords") || key === "layer-d:grant-keyword-rules",
    )
  ) {
    return false;
  }
  return context.state.continuousEffects.some((instance) => {
    const evaluation: GrandArchiveEvaluationContext = {
      ...context,
      controllerId: instance.controllerId,
      ...continuousEffectSourceContext(instance),
      bindings: instance.bindings,
      variables: instance.variables,
    };
    return (
      grandArchiveContinuousEffectIsActive(instance, evaluation) &&
      isObjectContinuousEffect(instance.effect) &&
      isAbilityLayerChange(instance.effect.change) &&
      (!instance.effect.condition ||
        evaluateGrandArchiveCondition(instance.effect.condition, evaluation)) &&
      grandArchiveContinuousEffectAffectsObject(
        instance.effect,
        instance.affectedObjectIds,
        instance.affectedObjectIncarnations,
        object,
        evaluation,
      )
    );
  });
}

function collectCharacteristicModifiers(
  object: GrandArchiveCardInstance,
  context: GrandArchiveEvaluationContext,
): readonly CharacteristicModifier[] {
  const modifiers: CharacteristicModifier[] = [];
  for (const source of continuousStaticSources(context)) {
    const face = grandArchiveObjectFace(context.program, source);
    // Earlier characteristic layers still use printed static effects even if Layer D removes
    // their abilities. Granted/copied abilities are added so their static effects can apply on
    // subsequent derivations.
    const abilities = continuousStaticAbilities(source, context);
    for (const ability of abilities) {
      if (ability.kind !== "static" || ability.staticKind !== "effects") continue;
      // A restriction can itself read derived characteristics. Do not evaluate
      // it for abilities that cannot affect these layers: otherwise unrelated
      // level/cost rules recursively derive every object's characteristics.
      if (
        !ability.effects.some(
          (effect) =>
            effect.kind === "continuous" &&
            isCharacteristicChange(effect.change) &&
            (effect.layer.layer === "B" || effect.layer.layer === "C"),
        )
      )
        continue;
      const executionObject = grandArchiveAbilityExecutionObject(context.state, source, ability);
      if (!executionObject) continue;
      const evaluation = withGrandArchiveDerivedVariables(ability.variables, {
        ...context,
        controllerId: executionObject.controllerId,
        sourceId: executionObject.id,
        abilityBearerId: executionObject.id,
        bindings: {},
      });
      const restrictionEvaluation =
        executionObject.id === source.id
          ? evaluation
          : { ...evaluation, sourceId: source.id, abilityBearerId: source.id };
      if (
        !grandArchiveAbilityIsFunctional(face, ability, source) ||
        !staticRestrictionsAreSatisfied(ability, restrictionEvaluation) ||
        (ability.condition && !evaluateGrandArchiveCondition(ability.condition, evaluation))
      ) {
        continue;
      }
      for (const [effectIndex, effect] of ability.effects.entries()) {
        if (
          effect.kind !== "continuous" ||
          !isCharacteristicChange(effect.change) ||
          (effect.layer.layer !== "B" && effect.layer.layer !== "C")
        ) {
          continue;
        }
        modifiers.push({
          id: `static:${source.id}:${ability.id}:${effectIndex}`,
          effect,
          affectedObjectIds: [],
          affectedObjectIncarnations: {},
          change: effect.change,
          evaluation,
          applicationLayer: grandArchiveContinuousApplicationLayer(effect),
          timestamp: grandArchiveObjectTimestamp(source, evaluation),
        });
      }
    }
  }
  for (const instance of context.state.continuousEffects) {
    const evaluation: GrandArchiveEvaluationContext = {
      ...context,
      controllerId: instance.controllerId,
      ...continuousEffectSourceContext(instance),
      bindings: instance.bindings,
      variables: instance.variables,
    };
    if (
      !grandArchiveContinuousEffectIsActive(instance, evaluation) ||
      !isObjectContinuousEffect(instance.effect) ||
      !isCharacteristicChange(instance.effect.change) ||
      (instance.effect.layer.layer !== "B" && instance.effect.layer.layer !== "C")
    ) {
      continue;
    }
    modifiers.push({
      id: instance.id,
      effect: instance.effect,
      affectedObjectIds: instance.affectedObjectIds,
      affectedObjectIncarnations: instance.affectedObjectIncarnations,
      change: instance.effect.change,
      evaluation,
      applicationLayer: grandArchiveContinuousApplicationLayer(instance.effect),
      timestamp: instance.createdAtVersion,
    });
  }
  return modifiers.sort(
    (left, right) =>
      grandArchiveDependencyLayerOrder(left.applicationLayer) -
        grandArchiveDependencyLayerOrder(right.applicationLayer) ||
      left.timestamp - right.timestamp ||
      left.id.localeCompare(right.id),
  );
}

function addUnique<T>(values: readonly T[], value: T): readonly T[] {
  return values.includes(value) ? values : [...values, value];
}

function removeValue<T>(values: readonly T[], value: T): readonly T[] {
  return values.filter((candidate) => candidate !== value);
}

function applyCardCharacteristic(
  current: GrandArchiveDerivedCharacteristics,
  operation: "add" | "remove",
  characteristic: GrandArchiveCardCharacteristic,
): GrandArchiveDerivedCharacteristics {
  const update = <T>(values: readonly T[], value: T) =>
    operation === "add" ? addUnique(values, value) : removeValue(values, value);
  switch (characteristic.kind) {
    case "name":
      return { ...current, names: update(current.names, characteristic.value) };
    case "supertype":
      return { ...current, supertypes: update(current.supertypes, characteristic.value) };
    case "type":
      return { ...current, types: update(current.types, characteristic.value) };
    case "class":
      return { ...current, classes: update(current.classes, characteristic.value) };
    case "subtype":
      return { ...current, subtypes: update(current.subtypes, characteristic.value) };
    case "element":
      return { ...current, elements: update(current.elements, characteristic.value) };
    default:
      return assertNever(characteristic);
  }
}

function trackedCharacteristicValues(
  change: Extract<CharacteristicChange, { readonly kind: "add-tracked-characteristic" }>,
  evaluation: GrandArchiveEvaluationContext,
): readonly string[] {
  const captured = evaluation.bindings[`tracked:${change.key}`];
  if (typeof captured === "string") return [captured];
  if (Array.isArray(captured) && captured.every((value) => typeof value === "string")) {
    return captured;
  }
  const source = evaluation.sourceId ? evaluation.state.objects[evaluation.sourceId] : undefined;
  const tracked = source ? evaluation.state.trackedCharacteristics[source.id] : undefined;
  return source && tracked?.incarnation === source.incarnation
    ? (tracked.values[change.key] ?? [])
    : [];
}

function applyTrackedCharacteristic(
  current: GrandArchiveDerivedCharacteristics,
  change: Extract<CharacteristicChange, { readonly kind: "add-tracked-characteristic" }>,
  evaluation: GrandArchiveEvaluationContext,
): GrandArchiveDerivedCharacteristics {
  return trackedCharacteristicValues(change, evaluation).reduce((derived, value) => {
    switch (change.characteristic) {
      case "class": {
        const classValue = GRAND_ARCHIVE_CLASSES.find((candidate) => candidate === value);
        if (!classValue) {
          throw new GrandArchiveUnsupportedRuleError(`tracked class ${value}`);
        }
        return applyCardCharacteristic(derived, "add", {
          kind: "class",
          value: classValue,
        });
      }
      case "element": {
        const element = GRAND_ARCHIVE_ELEMENTS.find((candidate) => candidate === value);
        if (!element) {
          throw new GrandArchiveUnsupportedRuleError(`tracked element ${value}`);
        }
        return applyCardCharacteristic(derived, "add", { kind: "element", value: element });
      }
      case "subtype":
        return applyCardCharacteristic(derived, "add", { kind: "subtype", value });
      case "type": {
        const type = GRAND_ARCHIVE_CARD_TYPES.find((candidate) => candidate === value);
        if (!type || type === "UNIQUE" || type === "REGALIA" || type === "TOKEN") {
          throw new GrandArchiveUnsupportedRuleError(`tracked type ${value}`);
        }
        return applyCardCharacteristic(derived, "add", { kind: "type", value: type });
      }
      default:
        return assertNever(change.characteristic);
    }
  }, current);
}

function characteristicModifierApplies(
  modifier: CharacteristicModifier,
  object: GrandArchiveCardInstance,
  current: GrandArchiveDerivedCharacteristics,
): boolean {
  const evaluation: GrandArchiveEvaluationContext = {
    ...modifier.evaluation,
    characteristicOverrides: new Map([
      ...(modifier.evaluation.characteristicOverrides?.entries() ?? []),
      [object.id, current],
    ]),
  };
  return (
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

function applyCharacteristicModifier(
  current: GrandArchiveDerivedCharacteristics,
  modifier: CharacteristicModifier,
  derivingProperties: ReadonlySet<string>,
): GrandArchiveDerivedCharacteristics {
  const change = modifier.change;
  switch (change.kind) {
    case "add-characteristic":
      return applyCardCharacteristic(current, "add", change.characteristic);
    case "remove-characteristic":
      return applyCardCharacteristic(current, "remove", change.characteristic);
    case "add-tracked-characteristic":
      return applyTrackedCharacteristic(current, change, modifier.evaluation);
    case "set-elements":
      return { ...current, elements: [...change.elements] };
    case "set-types":
      return { ...current, supertypes: [], types: [...change.types] };
    case "copy-characteristic": {
      const sources = resolveGrandArchiveSubjectObjects(change.from, modifier.evaluation);
      if (sources.length !== 1) {
        throw new GrandArchiveUnsupportedRuleError(
          `copy ${change.characteristic} requires exactly one source`,
        );
      }
      const copied = deriveGrandArchiveCharacteristics(sources[0]!, {
        ...modifier.evaluation,
        derivingProperties,
      });
      return change.characteristic === "class"
        ? { ...current, classes: [...copied.classes] }
        : change.characteristic === "element"
          ? { ...current, elements: [...copied.elements] }
          : change.characteristic === "subtype"
            ? { ...current, subtypes: [...copied.subtypes] }
            : { ...current, supertypes: [...copied.supertypes], types: [...copied.types] };
    }
    default:
      return assertNever(change);
  }
}

function characteristicModifierDependsOn(
  candidate: CharacteristicModifier,
  prerequisite: CharacteristicModifier,
  object: GrandArchiveCardInstance,
  current: GrandArchiveDerivedCharacteristics,
  derivingProperties: ReadonlySet<string>,
): boolean {
  if (
    candidate.id === prerequisite.id ||
    candidate.applicationLayer !== prerequisite.applicationLayer ||
    characteristicChangeSetsValue(candidate.change) !==
      characteristicChangeSetsValue(prerequisite.change) ||
    !characteristicModifierApplies(prerequisite, object, current)
  ) {
    return false;
  }
  const before = characteristicModifierApplies(candidate, object, current);
  const afterCurrent = applyCharacteristicModifier(current, prerequisite, derivingProperties);
  const after = characteristicModifierApplies(candidate, object, afterCurrent);
  return before !== after;
}

export function deriveGrandArchiveCharacteristics(
  object: GrandArchiveCardInstance,
  context: GrandArchiveEvaluationContext,
): GrandArchiveDerivedCharacteristics {
  const isTrackedSource = object.id === context.sourceId || object.id === context.abilityBearerId;
  const usesLastKnownInformation =
    context.objectInformationBasis === "last-known" ||
    (isTrackedSource && context.sourceInformationBasis === "last-known");
  const sourceLkiEventId = isTrackedSource ? context.sourceLkiEventId : undefined;
  // A source without a departure reference is still current; its earlier entry
  // move is not an LKI checkpoint for this ability instance.
  if (usesLastKnownInformation && (!isTrackedSource || sourceLkiEventId !== undefined)) {
    for (let index = context.state.eventHistory.length - 1; index >= 0; index -= 1) {
      const event = context.state.eventHistory[index]!;
      if (
        event.type === "object-moved" &&
        event.objectId === object.id &&
        (sourceLkiEventId === undefined || event.eventId === sourceLkiEventId) &&
        (context.sourceIncarnation === undefined ||
          !isTrackedSource ||
          (event.previousObject?.incarnation ?? -1) + 1 === context.sourceIncarnation)
      ) {
        if (event.previousCharacteristics) return event.previousCharacteristics;
        break;
      }
    }
  }
  const override = context.characteristicOverrides?.get(object.id);
  if (override) return override;
  const face = grandArchiveObjectFace(context.program, object);
  const base: GrandArchiveDerivedCharacteristics = grandArchiveObjectHasConcealedCharacteristics(
    context.program,
    object,
  )
    ? { names: [], supertypes: [], types: [], classes: [], subtypes: [], elements: [] }
    : {
        names: [object.nameOverride ?? face.name],
        supertypes: face.typeLine.supertypes,
        types: face.typeLine.types,
        classes: face.typeLine.classes,
        subtypes: face.typeLine.subtypes,
        elements: face.elements,
      };
  const derivationKey = `${object.id}:characteristics`;
  if (context.derivingProperties?.has(derivationKey)) return base;
  const derivingProperties = new Set(context.derivingProperties ?? []).add(derivationKey);
  let current = base;
  const pending = [
    ...collectCharacteristicModifiers(object, {
      ...context,
      derivingProperties,
    }),
  ];
  // A pending effect can become applicable after another same-layer effect changes its
  // condition or dynamic subject set (CR Continuous Effects — Dependencies 2.2).
  while (pending.length > 0) {
    const applicable = pending
      .map((modifier, index) => ({
        index,
        applies: characteristicModifierApplies(modifier, object, current),
      }))
      .filter((entry) => entry.applies);
    if (applicable.length === 0) break;
    const firstLayer = pending[applicable[0]!.index]!.applicationLayer;
    const layerApplicable = applicable.filter(
      ({ index }) => pending[index]!.applicationLayer === firstLayer,
    );
    const independent = layerApplicable.find(({ index }) =>
      pending.every(
        (prerequisite) =>
          !characteristicModifierDependsOn(
            pending[index]!,
            prerequisite,
            object,
            current,
            derivingProperties,
          ),
      ),
    );
    const selected = independent ?? layerApplicable[0]!;
    const modifier = pending.splice(selected.index, 1)[0]!;
    current = applyCharacteristicModifier(current, modifier, derivingProperties);
  }
  return current;
}

/** Current Layer B/C characteristics for rules paths that do not already carry an evaluation context. */
const currentCharacteristicsByState = new WeakMap<
  object,
  WeakMap<object, WeakMap<GrandArchiveCardInstance, GrandArchiveDerivedCharacteristics>>
>();

export function grandArchiveObjectCurrentCharacteristics(
  program: GrandArchiveEvaluationContext["program"],
  state: GrandArchiveEvaluationContext["state"],
  object: GrandArchiveCardInstance,
): GrandArchiveDerivedCharacteristics {
  let programs = currentCharacteristicsByState.get(state);
  if (!programs) {
    programs = new WeakMap();
    currentCharacteristicsByState.set(state, programs);
  }
  let objects = programs.get(program);
  if (!objects) {
    objects = new WeakMap();
    programs.set(program, objects);
  }
  const existing = objects.get(object);
  if (existing) return existing;
  const characteristics = deriveGrandArchiveCharacteristics(object, {
    program,
    state,
    controllerId: object.controllerId,
    sourceId: object.id,
    abilityBearerId: object.id,
    bindings: {},
  });
  objects.set(object, characteristics);
  return characteristics;
}

export function deriveGrandArchiveController(
  object: GrandArchiveCardInstance,
  context: GrandArchiveEvaluationContext,
): GrandArchiveControllerDerivation {
  const modifiers = collectControlModifiers(object, context);
  const newest = modifiers.at(-1);
  return newest
    ? { controllerId: newest.controllerId, effectId: newest.id }
    : { controllerId: object.baseControllerId };
}

function deriveGrandArchiveNumericPropertyBeforeSwap(
  object: GrandArchiveCardInstance,
  property: GrandArchiveNumericProperty,
  context: GrandArchiveEvaluationContext,
): number | undefined {
  let value = baseNumericProperty(object, property, context);
  const pending = collectNumericModifiers(object, property, context).filter(
    (modifier) => !numericModifierIsSwap(modifier),
  );
  while (pending.length > 0) {
    const applicable = pending
      .map((modifier, index) => ({
        index,
        observation: observeNumericModifier(modifier, object, property, value),
      }))
      .filter((entry) => entry.observation.applies);
    if (applicable.length === 0) break;
    const firstLayer = pending[applicable[0]!.index]!.applicationLayer;
    const layerApplicable = applicable.filter(
      ({ index }) => pending[index]!.applicationLayer === firstLayer,
    );
    const independent = layerApplicable.find(({ index }) =>
      pending.every(
        (prerequisite) =>
          !numericModifierDependsOn(pending[index]!, prerequisite, object, property, value),
      ),
    );
    // A dependency loop has no independent member; CR Dependencies 2.1 falls
    // back to the existing timestamp order, represented by the first entry.
    const selected = independent ?? layerApplicable[0]!;
    const modifier = pending.splice(selected.index, 1)[0]!;
    value = applyObservedNumericModifier(modifier, selected.observation, value);
  }
  if (value === undefined) return undefined;
  if (property === "power" || property === "life") {
    value += (object.counters.buff ?? 0) - (object.counters.debuff ?? 0);
  }
  if (property === "level") {
    value += object.counters.level ?? 0;
    const activationModifier = context.championLevelModifier;
    if (
      activationModifier &&
      object.controllerId === activationModifier.controllerId &&
      deriveGrandArchiveCharacteristics(object, context).types.includes("CHAMPION")
    ) {
      value += activationModifier.amount;
    }
  }
  if (property === "reserve-cost" || property === "memory-cost") {
    value = Math.max(0, value);
  }
  return value;
}

function deriveGrandArchivePowerAndLife(
  object: GrandArchiveCardInstance,
  context: GrandArchiveEvaluationContext,
): Readonly<{ power: number | undefined; life: number | undefined }> {
  const derivingProperties = new Set(context.derivingProperties ?? []);
  derivingProperties.add(`${object.id}:power`);
  derivingProperties.add(`${object.id}:life`);
  const evaluation = { ...context, derivingProperties };
  let power = deriveGrandArchiveNumericPropertyBeforeSwap(object, "power", evaluation);
  let life = deriveGrandArchiveNumericPropertyBeforeSwap(object, "life", evaluation);
  const swaps = [
    ...collectNumericModifiers(object, "power", evaluation),
    ...collectNumericModifiers(object, "life", evaluation),
  ]
    .filter(numericModifierIsSwap)
    .filter(
      (modifier, index, modifiers) =>
        modifiers.findIndex((candidate) => candidate.id === modifier.id) === index,
    )
    .sort((left, right) => left.timestamp - right.timestamp || left.id.localeCompare(right.id));
  for (const swap of swaps) {
    const evaluation = withNumericOverride(
      withNumericOverride(swap.evaluation, object, "power", power),
      object,
      "life",
      life,
    );
    if (!numericModifierCurrentlyApplies(swap, object, evaluation)) continue;
    [power, life] = [life, power];
  }
  return { power, life };
}

export function deriveGrandArchiveNumericProperty(
  object: GrandArchiveCardInstance,
  property: GrandArchiveNumericProperty,
  context: GrandArchiveEvaluationContext,
): number | undefined {
  const derivationKey = `${object.id}:${property}`;
  if (context.numericOverrides?.has(derivationKey)) {
    return context.numericOverrides.get(derivationKey);
  }
  const base = baseNumericProperty(object, property, context);
  if (context.derivingProperties?.has(derivationKey)) return base;
  if (property === "power" || property === "life") {
    return deriveGrandArchivePowerAndLife(object, context)[property];
  }
  const derivingProperties = new Set(context.derivingProperties ?? []).add(derivationKey);
  return deriveGrandArchiveNumericPropertyBeforeSwap(object, property, {
    ...context,
    derivingProperties,
  });
}

/**
 * Applies Layer E modifiers that target the attack itself to its already
 * combined power. Attack-scoped effects are intentionally excluded from
 * `deriveGrandArchiveNumericProperty`: an attack is not a card object and its
 * modifiers must neither create a power stat on the attacker nor be counted
 * once per intent/weapon component.
 */
export function deriveGrandArchiveAttackPower(
  attacker: GrandArchiveCardInstance,
  combinedPower: number,
  context: GrandArchiveEvaluationContext,
): number {
  const derivationKey = `${attacker.id}:attack-power`;
  if (context.derivingProperties?.has(derivationKey)) return combinedPower;
  const derivingProperties = new Set(context.derivingProperties ?? []).add(derivationKey);
  let value = combinedPower;
  for (const modifier of collectNumericModifiers(
    attacker,
    "power",
    { ...context, derivingProperties },
    "attack",
  )) {
    const change = modifier.effect.change;
    if (change.kind !== "numeric") continue;
    if (change.operation === "swap") {
      throw new GrandArchiveUnsupportedRuleError("continuous numeric swap sublayer");
    }
    const evaluation = withNumericOverride(modifier.evaluation, attacker, "power", value);
    if (!numericModifierCurrentlyApplies(modifier, attacker, evaluation)) continue;
    const amount = change.amount ? evaluateGrandArchiveAmount(change.amount, evaluation) : 0;
    if (change.operation === "set") value = amount;
    else if (change.operation === "add") value += amount;
    else if (change.operation === "subtract") value -= amount;
  }
  return value;
}

export function collectExpiredGrandArchiveContinuousEffects(
  context: GrandArchiveEvaluationContext,
): readonly string[] {
  return context.state.continuousEffects
    .filter((instance) => {
      const instanceEvaluation: GrandArchiveEvaluationContext = {
        ...context,
        controllerId: instance.controllerId,
        ...continuousEffectSourceContext(instance),
        bindings: instance.bindings,
        variables: instance.variables,
        abilityId: instance.id,
      };
      return continuousDurationStatus(instance, instanceEvaluation) === "expired";
    })
    .map((instance) => instance.id);
}

function assertNever(value: never): never {
  throw new Error(`Unhandled Grand Archive continuous variant: ${JSON.stringify(value)}`);
}
