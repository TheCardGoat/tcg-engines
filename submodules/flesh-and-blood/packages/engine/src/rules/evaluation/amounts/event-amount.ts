import type { FabAmount } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import { requireBoundNumber, type MutableObject } from "../helpers.ts";

export function evaluateEventAmount(
  amount: Exclude<FabAmount, number> & { type: "event-amount" },
  context: FabEvalContext,
  _objects: ReadonlyMap<string, MutableObject>,
): number {
  void amount;
  return requireBoundNumber("event-amount", context);
}
