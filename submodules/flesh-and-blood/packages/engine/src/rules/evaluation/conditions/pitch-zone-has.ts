import type { FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { matchesFilter } from "../matches-filter.ts";

export function evaluatePitchZoneHas(
  condition: FabCondition & { type: "pitch-zone-has" },
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  return [...objects.values()].some(
    (object) =>
      object.input.zone.zone === "pitch" &&
      object.input.zone.playerId === context.controllerId &&
      matchesFilter(object, condition.filter, context, objects),
  );
}
