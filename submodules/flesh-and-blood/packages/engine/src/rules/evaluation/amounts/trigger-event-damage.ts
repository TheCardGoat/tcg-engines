import type { FabAmount } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import { requireBoundNumber, type MutableObject } from "../helpers.ts";

/** Resolve damage from the exact immutable event that caused this trigger. */
export function evaluateTriggerEventDamage(
  amount: Exclude<FabAmount, number> & { type: "trigger-event-damage" },
  context: FabEvalContext,
  _objects: ReadonlyMap<string, MutableObject>,
): number {
  void amount;
  return requireBoundNumber("trigger-event-damage", context);
}
