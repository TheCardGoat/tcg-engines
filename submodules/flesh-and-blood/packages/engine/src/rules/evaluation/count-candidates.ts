import type { FabAmount } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../rules-view.ts";
import { zoneObjectMatchesPlayer, type MutableObject } from "./helpers.ts";
import { matchesFilter } from "./matches-filter.ts";

export function countCandidates(
  amount: Exclude<FabAmount, number> & { type: "count" },
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): readonly MutableObject[] {
  return [...objects.values()].filter((object) => {
    if (!zoneObjectMatchesPlayer(object, amount.player ?? "controller", context)) return false;
    return !amount.filter || matchesFilter(object, amount.filter, context, objects);
  });
}
