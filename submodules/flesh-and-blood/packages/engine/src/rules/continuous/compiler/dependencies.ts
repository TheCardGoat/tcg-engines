import type { FabAmount, FabCardFilter, FabCondition, FabTarget } from "@tcg/flesh-and-blood-types";
import type { FabRulesStage } from "../ir.ts";
import { assertNever } from "../../evaluation/assert-never.ts";

export type DependencyResult =
  | { readonly ok: true; readonly stages: readonly FabRulesStage[] }
  | { readonly ok: false; readonly mechanic: string };

export function dependencyStages(input: {
  readonly condition?: FabCondition | null;
  readonly filter?: FabCardFilter | null;
  readonly amount?: FabAmount;
  readonly target?: FabTarget | null;
}): DependencyResult {
  const stages = new Set<FabRulesStage>();
  for (const result of [
    input.condition ? conditionDependencies(input.condition) : okDependencies(),
    input.filter ? filterDependencies(input.filter) : okDependencies(),
    input.amount !== undefined ? amountDependencies(input.amount) : okDependencies(),
    input.target ? targetDependencies(input.target) : okDependencies(),
  ]) {
    if (!result.ok) return result;
    for (const stage of result.stages) stages.add(stage);
  }
  return { ok: true, stages: [...stages].sort((a, b) => a - b) };
}

export function filterDependencies(filter: FabCardFilter): DependencyResult {
  const stages = new Set<FabRulesStage>();
  if (filter.name || filter.sameNameAs || filter.nameContains || filter.moniker || filter.color)
    stages.add(3);
  if (
    filter.typeBox?.types ||
    filter.typeBox?.subtypes ||
    filter.typeBox?.metatypes ||
    filter.typeBox?.traits ||
    filter.typeBox?.excludeTypes ||
    filter.typeBox?.excludeSubtypes ||
    filter.typeBox?.excludeMetatypes ||
    filter.typeBox?.excludeTraits
  )
    stages.add(4);
  if (filter.typeBox?.supertypes || filter.typeBox?.excludeSupertypes) stages.add(5);
  if (filter.sameTypeBoxAs?.categories.some((category) => category === "supertypes")) stages.add(5);
  if (filter.sameTypeBoxAs?.categories.some((category) => category !== "supertypes")) stages.add(4);

  if (filter.hasKeyword || filter.hasLabel) stages.add(6);
  if (
    filter.pitch ||
    filter.hasProperty ||
    filter.lacksProperty ||
    filter.hasCounter ||
    filter.lacksCounter
  )
    stages.add(8);
  // Legacy cost/power/defense comparisons use current evaluated numerics
  // (matches-filter.ts); prefer filter.numeric with basis when authoring new
  // continuous atoms, but catalog cards still emit the legacy shape.
  if (filter.cost || filter.power || filter.defense) stages.add(8);
  for (const numeric of filter.numeric ?? []) stages.add(numeric.basis === "base" ? 7 : 8);
  const nested = [
    ...(filter.and ?? []),
    ...(filter.or ?? []),
    ...(filter.defendingAgainst ? [filter.defendingAgainst] : []),
  ];
  for (const child of nested) {
    const result = filterDependencies(child);
    if (!result.ok) return result;
    for (const stage of result.stages) stages.add(stage);
  }
  return { ok: true, stages: [...stages] };
}

export function targetDependencies(target: FabTarget): DependencyResult {
  return target.selector === "object" && target.filter
    ? filterDependencies(target.filter)
    : okDependencies();
}

export function conditionDependencies(condition: FabCondition): DependencyResult {
  switch (condition.type) {
    case "and":
    case "or":
      return combineDependencies(condition.conditions.map(conditionDependencies));
    case "not":
      return conditionDependencies(condition.condition);
    case "zone-count":
    case "left-arena-count":
    case "control-object":
    case "equipped-count":
    case "pitch-zone-has":
    case "binding-matches":
    case "defended-this-chain-link":
      return "filter" in condition && condition.filter
        ? filterDependencies(condition.filter)
        : okDependencies();
    case "played-this":
      return filterDependencies(condition.filter);
    case "target-exists":
    case "is-marked":
      return targetDependencies(condition.target);
    case "has-counter":
      return { ok: true, stages: [8] };
    case "attack-power":
    case "attack-defense":
    case "life-comparison":
      return { ok: true, stages: [8] };
    case "object-numeric-comparison":
      return {
        ok: true,
        stages: [condition.left === "base" && condition.right === "base" ? 7 : 8],
      };
    case "has-keyword":
      return { ok: true, stages: [6] };
    case "last-attack-this-combat-chain":
      return condition.filter ? filterDependencies(condition.filter) : okDependencies();
    case "last-attack-this-turn":
      return okDependencies();
    case "last-action-this-turn":
      return filterDependencies(condition.filter);
    case "moved-this-turn":
      return okDependencies();
    case "chain-link-count":
    case "chain-link-property":
    case "damage-dealt":
    case "damage-taken":
    case "source-damage-dealt":
    case "die-result":
    case "performed-this-turn":
    case "sword-hit-this-turn":
    case "another-weapon-gained-go-again-this-turn":
    case "source-is-subcard-of-host":
    case "turn-player":
    case "phase-is":
      return okDependencies();
    case "combat-chain-attack-count":
      return { ok: true, stages: [8] };
    case "has-status":
      // Current-vs-base power is a stage-8 numeric fact. Without this
      // dependency the grant (stage 6) evaluates before floating +N{p}
      // modifiers and never sees extra power (Bolt 'n' Shot).
      return combineDependencies([
        condition.target ? targetDependencies(condition.target) : okDependencies(),
        condition.status === "power-greater-than-base" ||
        condition.status === "defended-attack-power-greater-than-base"
          ? { ok: true, stages: [8] }
          : okDependencies(),
      ]);
    case "binding-numeric":
      return okDependencies();
    case "compare-amount":
      return amountDependencies(condition.amount);
    default:
      return assertNever(condition, "FabCondition.type");
  }
}

export function amountDependencies(amount: FabAmount): DependencyResult {
  if (typeof amount === "number") return okDependencies();
  switch (amount.type) {
    case "count":
      return amount.filter ? filterDependencies(amount.filter) : okDependencies();
    case "reference":
      return amount.property ? { ok: true, stages: [8] } : okDependencies();
    case "subject-property":
      return { ok: true, stages: [amount.basis === "base" ? 7 : 8] };
    case "max":
      return combineDependencies([
        { ok: true, stages: [7] },
        amount.filter ? filterDependencies(amount.filter) : okDependencies(),
      ]);
    case "keyword-value":
      return { ok: true, stages: [6] };
    case "conditional":
      return combineDependencies([
        conditionDependencies(amount.condition),
        amountDependencies(amount.then),
        amount.else !== undefined ? amountDependencies(amount.else) : okDependencies(),
      ]);
    case "up-to":
      return amountDependencies(amount.amount);
    case "sum":
    case "difference":
    case "negate":
    case "double":
      return combineDependencies(amount.operands.map(amountDependencies));
    case "hero-property":
      return { ok: true, stages: [8] };
    case "x":
    case "y":
    case "z":
    case "roll":
    case "event-amount":
    case "trigger-event-damage":
    case "roll-result":
      return okDependencies();
    default:
      return assertNever(amount, "FabAmount.type");
  }
}

export function combineDependencies(results: readonly DependencyResult[]): DependencyResult {
  const stages = new Set<FabRulesStage>();
  for (const result of results) {
    if (!result.ok) return result;
    for (const stage of result.stages) stages.add(stage);
  }
  return { ok: true, stages: [...stages] };
}

export function okDependencies(): DependencyResult {
  return { ok: true, stages: [] };
}
