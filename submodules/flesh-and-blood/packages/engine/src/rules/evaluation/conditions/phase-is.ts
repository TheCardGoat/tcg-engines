import type { FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";

/** "During an X phase" — evaluated against the rules facts' current phase
 * (null between turns fails every comparison). */
export function evaluatePhaseIs(
  condition: FabCondition & { type: "phase-is" },
  context: FabEvalContext,
  _objects: ReadonlyMap<string, MutableObject>,
): boolean {
  return context.facts?.phase === condition.phase;
}
