import type { FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { comparePrimitive } from "../helpers.ts";
import { evaluateAmount } from "../evaluate-amount.ts";

/**
 * Compare a numeric layer binding ("if you gain no Silver this way").
 * Missing bindings read as 0.
 */
export function evaluateBindingNumeric(
  condition: FabCondition & { type: "binding-numeric" },
  context: FabEvalContext,
  _objects: ReadonlyMap<string, MutableObject>,
): boolean {
  const bound = context.bindings.numbers[condition.binding] ?? 0;
  const threshold =
    typeof condition.comparison.value === "number"
      ? condition.comparison.value
      : evaluateAmount(condition.comparison.value, context, _objects);
  return comparePrimitive(bound, condition.comparison.op, threshold);
}
