import type { FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { evaluateCondition } from "../evaluate-condition.ts";

export function evaluateAnd(
  condition: Extract<FabCondition, { type: "and" | "or" }>,
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  return condition.conditions.every((child) => evaluateCondition(child, context, objects));
}
