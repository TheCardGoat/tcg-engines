import type { FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { compare } from "../compare.ts";
import { refKey } from "../helpers.ts";

export function evaluateAttackPower(
  condition: Extract<FabCondition, { type: "attack-power" | "attack-defense" }>,
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  const attack = context.facts?.combat?.attack;
  const power = attack ? objects.get(refKey(attack))?.properties.numeric.power : undefined;
  return power !== undefined && compare(power, condition.comparison, context, objects);
}
