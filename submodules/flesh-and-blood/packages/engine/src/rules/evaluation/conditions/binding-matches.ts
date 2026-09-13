import type { FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { refKey } from "../helpers.ts";
import { matchesFilter } from "../matches-filter.ts";

export function evaluateBindingMatches(
  condition: FabCondition & { type: "binding-matches" },
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  return (context.bindings.objects[condition.binding] ?? []).some((ref) => {
    const object =
      objects.get(refKey(ref)) ??
      [...objects.values()].find((candidate) => candidate.input.ref.instanceId === ref.instanceId);
    return object ? matchesFilter(object, condition.filter, context, objects) : false;
  });
}
