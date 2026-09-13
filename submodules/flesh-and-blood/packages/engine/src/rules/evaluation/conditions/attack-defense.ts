import type { FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { compare } from "../compare.ts";
import { refKey } from "../helpers.ts";

export function evaluateAttackDefense(
  condition: Extract<FabCondition, { type: "attack-power" | "attack-defense" }>,
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  const combat = context.facts?.combat;
  if (!combat) return false;
  const defense = combat.defending.reduce(
    (total, ref) => total + (objects.get(refKey(ref))?.properties.numeric.defense ?? 0),
    0,
  );
  return compare(defense, condition.comparison, context, objects);
}
