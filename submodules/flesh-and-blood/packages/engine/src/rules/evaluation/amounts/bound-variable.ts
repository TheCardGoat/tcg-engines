import type { FabAmount } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import { requireBoundNumber, type MutableObject } from "../helpers.ts";

/** x / y / z amount variables bound on the layer. */
export function evaluateBoundVariable(
  amount: Exclude<FabAmount, number> & { type: "x" | "y" | "z" },
  context: FabEvalContext,
  _objects: ReadonlyMap<string, MutableObject>,
): number {
  const bound = requireBoundNumber(amount.type, context);
  const copies = "count" in amount && typeof amount.count === "number" ? amount.count : 1;
  const plus = "plus" in amount && typeof amount.plus === "number" ? amount.plus : 0;
  return bound * copies + plus;
}
