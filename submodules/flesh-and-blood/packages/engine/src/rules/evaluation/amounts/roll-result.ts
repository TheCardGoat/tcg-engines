import type { FabAmount } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import { requireSingleNumberBinding, type MutableObject } from "../helpers.ts";

export function evaluateRollResult(
  amount: Exclude<FabAmount, number> & { type: "roll-result" },
  context: FabEvalContext,
  _objects: ReadonlyMap<string, MutableObject>,
): number {
  // Prefer roll-result; fall back to die-result (staged by roll-request / sequence
  // observation) so gain-action-points { type: "roll-result", divisor: 2 } works
  // after a prior roll step on the same layer (Scabskin Leathers, …).
  const bound = context.bindings.numbers["roll-result"] ?? context.bindings.numbers["die-result"];
  const result =
    typeof bound === "number" && Number.isFinite(bound)
      ? bound
      : requireSingleNumberBinding(context, "roll-result");
  if (!amount.divisor) return result;
  return amount.rounding === "up"
    ? Math.ceil(result / amount.divisor)
    : Math.floor(result / amount.divisor);
}
