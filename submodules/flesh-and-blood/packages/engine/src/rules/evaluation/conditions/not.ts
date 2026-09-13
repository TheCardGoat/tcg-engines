import type { FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { evaluateCondition } from "../evaluate-condition.ts";

export function evaluateNot(
  condition: FabCondition & { type: "not" },
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  return !evaluateCondition(condition.condition, context, objects);
}
