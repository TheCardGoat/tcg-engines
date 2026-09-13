import type { FabComparison } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../rules-view.ts";
import { assertNever } from "./assert-never.ts";
import { evaluateAmount } from "./evaluate-amount.ts";
import type { MutableObject } from "./mutable.ts";
export { comparePrimitive, matchesNumericComparison } from "./helpers.ts";

export function compare(
  left: number,
  comparison: FabComparison,
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  const right = evaluateAmount(comparison.value, context, objects);
  switch (comparison.op) {
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
      return assertNever(comparison.op, "comparison.op");
  }
}
