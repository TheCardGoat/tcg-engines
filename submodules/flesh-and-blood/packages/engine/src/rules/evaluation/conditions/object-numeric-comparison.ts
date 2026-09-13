import type { FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { comparePrimitive } from "../helpers.ts";
import { resolveTarget } from "../resolve-target.ts";

export function evaluateObjectNumericComparison(
  condition: FabCondition & { type: "object-numeric-comparison" },
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  const targets = resolveTarget(condition.target ?? { selector: "self" }, context, objects);
  return targets.some((object) => {
    const left =
      condition.left === "base"
        ? object.baseNumeric[condition.property]
        : object.properties.numeric[condition.property];
    const right =
      condition.right === "base"
        ? object.baseNumeric[condition.property]
        : object.properties.numeric[condition.property];
    return (
      left !== undefined &&
      right !== undefined &&
      comparePrimitive(left, condition.op, right * (condition.multiplier ?? 1))
    );
  });
}
