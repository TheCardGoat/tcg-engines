import type { FabAmount } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import { FabRulesEvaluationError } from "../errors.ts";
import type { MutableObject } from "../mutable.ts";

export function evaluateRoll(
  amount: Exclude<FabAmount, number> & { type: "roll" },
  _context: FabEvalContext,
  _objects: ReadonlyMap<string, MutableObject>,
): number {
  throw new FabRulesEvaluationError(`amount ${amount.type}`);
}
