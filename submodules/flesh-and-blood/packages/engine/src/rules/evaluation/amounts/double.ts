import type { FabAmount } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { evaluateAmount } from "../evaluate-amount.ts";

export function evaluateDouble(
  amount: Extract<FabAmount, { type: "sum" | "difference" | "negate" | "double" }>,
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): number {
  return (
    2 *
    amount.operands.reduce<number>(
      (total, operand) => total + evaluateAmount(operand, context, objects),
      0,
    )
  );
}
