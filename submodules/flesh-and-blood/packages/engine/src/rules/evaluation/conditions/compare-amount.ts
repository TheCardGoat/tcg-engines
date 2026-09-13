import type { FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import { compare } from "../compare.ts";
import { evaluateAmount } from "../evaluate-amount.ts";
import type { MutableObject } from "../mutable.ts";

export function evaluateCompareAmount(
  condition: FabCondition & { type: "compare-amount" },
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  return compare(
    evaluateAmount(condition.amount, context, objects),
    condition.comparison,
    context,
    objects,
  );
}
