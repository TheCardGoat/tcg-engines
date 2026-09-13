import type { FabAmount } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { evaluateAmount } from "../evaluate-amount.ts";

export function evaluateUpTo(
  amount: Exclude<FabAmount, number> & { type: "up-to" },
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): number {
  return evaluateAmount(amount.amount, context, objects);
}
