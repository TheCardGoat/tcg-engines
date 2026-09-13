import type { FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { resolveTarget } from "../resolve-target.ts";

export function evaluateTargetExists(
  condition: FabCondition & { type: "target-exists" },
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  return resolveTarget(condition.target, context, objects).length > 0;
}
