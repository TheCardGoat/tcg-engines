import type { FabAmount } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { evaluateCondition } from "../evaluate-condition.ts";
import { evaluateAmount } from "../evaluate-amount.ts";

export function evaluateConditional(
  amount: Exclude<FabAmount, number> & { type: "conditional" },
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): number {
  return evaluateCondition(amount.condition, context, objects)
    ? evaluateAmount(amount.then, context, objects)
    : amount.else === undefined
      ? 0
      : evaluateAmount(amount.else, context, objects);
}
