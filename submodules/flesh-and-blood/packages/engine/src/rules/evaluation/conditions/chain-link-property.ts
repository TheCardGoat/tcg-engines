import type { FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { compare } from "../compare.ts";

export function evaluateChainLinkProperty(
  condition: FabCondition & { type: "chain-link-property" },
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  const combat = context.facts?.combat;
  if (!combat) return false;
  const value = condition.property === "has-hit" ? (combat.didHit ? 1 : 0) : combat.chainLinkNumber;
  return condition.comparison ? compare(value, condition.comparison, context, objects) : value > 0;
}
