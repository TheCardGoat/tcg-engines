import type { FabAmount } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { evaluateAmount } from "../evaluate-amount.ts";

export function evaluateSum(
  amount: Extract<FabAmount, { type: "sum" | "difference" | "negate" | "double" }>,
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): number {
  return amount.operands.reduce<number>(
    (total, operand) => total + evaluateAmount(operand, context, objects),
    0,
  );
}
