import type { FabAmount } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import { FabRulesEvaluationError } from "../errors.ts";
import type { MutableObject } from "../mutable.ts";
import { evaluateAmount } from "../evaluate-amount.ts";

export function evaluateDifference(
  amount: Extract<FabAmount, { type: "sum" | "difference" | "negate" | "double" }>,
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): number {
  const [first, ...rest] = amount.operands;
  if (first === undefined) throw new FabRulesEvaluationError("empty difference amount");
  return rest.reduce<number>(
    (value, operand) => value - evaluateAmount(operand, context, objects),
    evaluateAmount(first, context, objects),
  );
}
