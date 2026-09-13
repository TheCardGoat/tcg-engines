import type { FabAmount } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import { toCatalogZone, zoneObjectMatchesPlayer, type MutableObject } from "../helpers.ts";
import { matchesFilter } from "../matches-filter.ts";

export function evaluateMax(
  amount: Exclude<FabAmount, number> & { type: "max" },
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): number {
  const values = [...objects.values()]
    .filter(
      (object) =>
        (!amount.zones?.length || amount.zones.includes(toCatalogZone(object.input.zone.zone))) &&
        zoneObjectMatchesPlayer(object, amount.player ?? "controller", context) &&
        (!amount.filter || matchesFilter(object, amount.filter, context, objects)),
    )
    .map((object) => object.baseNumeric[amount.property])
    .filter((value): value is number => value !== undefined);
  // A characteristic-defining maximum remains a real numeric property
  // before any qualifying object exists. FAB treats that empty maximum as
  // zero rather than making the defining ability itself non-functional.
  if (values.length === 0) return 0;
  return Math.max(...values);
}
