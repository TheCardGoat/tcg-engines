import type { FabCardFilter, FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { compare } from "../compare.ts";
import { zoneObjectMatchesPlayer } from "../helpers.ts";
import { matchesFilter } from "../matches-filter.ts";

export function evaluateEquippedCount(
  condition: FabCondition & { type: "equipped-count" },
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  const equipmentZones = new Set(["head", "chest", "arms", "legs", "weapon1", "weapon2"]);
  let count = [...objects.values()].filter((object) => {
    if (!equipmentZones.has(object.input.zone.zone)) return false;
    if (!zoneObjectMatchesPlayer(object, condition.player ?? "controller", context)) return false;
    return !condition.filter || matchesFilter(object, condition.filter, context, objects);
  }).length;
  // Add virtual equipped counts from active "count-as-equipped" rule
  // modifications (e.g. Teklovossen "counts as having 4 Evos equipped").
  const activeRules = context.rules;
  if (activeRules) {
    for (const rule of activeRules) {
      if (rule.action !== "count-as-equipped" || rule.mode !== "allow") continue;
      if (!condition.filter) {
        count += rule.limit?.count ?? 0;
        continue;
      }
      // Only add the virtual count when the condition filter matches the
      // rule's filter. E.g. EVO010 a4 `filter: { subtypes: ["Evo"] }`
      // should only boost queries for Evo equipment.
      if (subtypeFilterOverlaps(condition.filter, rule.filter)) {
        count += rule.limit?.count ?? 0;
      }
    }
  }
  return compare(count, condition.comparison, context, objects);
}

/** True when both filters target the same subtypes. */
function subtypeFilterOverlaps(
  conditionFilter: FabCardFilter,
  ruleFilter?: FabCardFilter | null,
): boolean {
  if (!ruleFilter) return false;
  const conditionSubtypes = conditionFilter.typeBox?.subtypes;
  const ruleSubtypes = ruleFilter.typeBox?.subtypes;
  if (!conditionSubtypes || !ruleSubtypes) return false;
  return conditionSubtypes.some((subtype) => ruleSubtypes.includes(subtype));
}
