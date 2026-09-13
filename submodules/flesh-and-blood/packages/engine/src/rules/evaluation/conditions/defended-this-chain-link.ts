import type { FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { refKey } from "../helpers.ts";
import { matchesFilter } from "../matches-filter.ts";

export function evaluateDefendedThisChainLink(
  condition: FabCondition & { type: "defended-this-chain-link" },
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  if (condition.from === "hand" && context.facts?.combat?.defendedFromHand !== true) {
    return false;
  }
  const defending = context.facts?.combat?.defending ?? [];
  return defending.some((ref) => {
    const object = objects.get(refKey(ref));
    return (
      object && (!condition.filter || matchesFilter(object, condition.filter, context, objects))
    );
  });
}
