import type { FabEvaluatedRule, FabRulesFacts } from "../rules-view.ts";
import type { FabObjectRef } from "../continuous/ir.ts";
import type { MutableObject } from "./mutable.ts";
import { matchesFilter } from "./matches-filter.ts";
import { refKey } from "./helpers.ts";

/**
 * Printed "attack action cards can't gain {p} from …" (Snag, Chokeslam crush).
 * Restrict-gain-power rules skip numeric power-add from matching sources.
 */
export function powerGainIsRestricted(
  rules: readonly FabEvaluatedRule[],
  subject: MutableObject,
  generatingSource: FabObjectRef,
  objects: ReadonlyMap<string, MutableObject>,
  facts: FabRulesFacts,
): boolean {
  for (const rule of rules) {
    if (rule.action !== "gain-power" || rule.mode !== "restrict") continue;
    if (rule.parameters.kind !== "rule-modification") continue;
    if (!subjectMatchesNumericGainRule(rule, subject, objects, facts)) continue;
    const restriction = rule.parameters.sourceRestriction;
    if (restriction === null) return true;
    if (restriction === "self-or-attack-reaction-effects") {
      if (generatingSource.instanceId === subject.input.ref.instanceId) return true;
      const sourceObject = liveObjectForRef(objects, generatingSource);
      if (sourceObject?.properties.types.includes("Attack Reaction")) return true;
    }
  }
  return false;
}

/**
 * Combo "would gain X, instead it gains that much plus 1" (Back Heel Kick):
 * amplify-mode rules add their printed constant on top of an incoming
 * power-add. The amplifier is itself a rule atom, so it cannot recursively
 * re-enter this numeric-atom path.
 */
export function powerGainAmplification(
  rules: readonly FabEvaluatedRule[],
  subject: MutableObject,
  objects: ReadonlyMap<string, MutableObject>,
  facts: FabRulesFacts,
): number {
  let bonus = 0;
  for (const rule of rules) {
    if (rule.action !== "gain-power" || rule.mode !== "amplify") continue;
    if (rule.parameters.kind !== "rule-modification") continue;
    if (!subjectMatchesNumericGainRule(rule, subject, objects, facts)) continue;
    bonus += rule.parameters.gainDelta ?? 1;
  }
  return bonus;
}

/**
 * Printed "cards defending this can't gain {d}" (Smash with Big Rock).
 * Restrict-gain-defense rules skip numeric defense-add on matching subjects.
 */
/**
 * Printed "its {r} cost to play, {p}, and {d} can't be modified" (Numbskull).
 * Restrict-be-modified skips any numeric atom on power, defense, or cost.
 */
export function numericModificationIsRestricted(
  rules: readonly FabEvaluatedRule[],
  subject: MutableObject,
  objects: ReadonlyMap<string, MutableObject>,
  facts: FabRulesFacts,
): boolean {
  for (const rule of rules) {
    if (rule.action !== "be-modified" || rule.mode !== "restrict") continue;
    if (rule.parameters.kind !== "rule-modification") continue;
    if (subjectMatchesNumericGainRule(rule, subject, objects, facts)) return true;
  }
  return false;
}

export function defenseGainIsRestricted(
  rules: readonly FabEvaluatedRule[],
  subject: MutableObject,
  objects: ReadonlyMap<string, MutableObject>,
  facts: FabRulesFacts,
): boolean {
  for (const rule of rules) {
    if (rule.action !== "gain-defense" || rule.mode !== "restrict") continue;
    if (rule.parameters.kind !== "rule-modification") continue;
    if (subjectMatchesNumericGainRule(rule, subject, objects, facts)) return true;
  }
  return false;
}

function subjectMatchesNumericGainRule(
  rule: FabEvaluatedRule,
  subject: MutableObject,
  objects: ReadonlyMap<string, MutableObject>,
  facts: FabRulesFacts,
): boolean {
  if (rule.parameters.kind !== "rule-modification") return false;
  const subjectKey = refKey(subject.input.ref);
  if (rule.scope.kind === "objects" && rule.scope.selection === "latched") {
    return rule.scope.subjects.some((ref) => ref.instanceId === subject.input.ref.instanceId);
  }
  const evalContext = {
    controllerId: rule.controllerId,
    source: null,
    bindings: { objects: {}, numbers: {}, strings: {} },
    facts,
  };
  const subjectFilter = rule.parameters.subjectFilter;
  if (subjectFilter) {
    return matchesFilter(subject, subjectFilter, evalContext, objects);
  }
  if (rule.filter) {
    return matchesFilter(subject, rule.filter, evalContext, objects);
  }
  if (rule.scope.kind === "game") return true;
  return rule.scope.subjects.some((ref) => refKey(ref) === subjectKey);
}

function liveObjectForRef(
  objects: ReadonlyMap<string, MutableObject>,
  ref: FabObjectRef,
): MutableObject | undefined {
  const exact = objects.get(refKey(ref));
  if (exact) return exact;
  for (const object of objects.values()) {
    if (object.input.ref.instanceId === ref.instanceId) return object;
  }
  return undefined;
}
