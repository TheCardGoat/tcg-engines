import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { isDefined, refKey } from "../helpers.ts";

export function resolveEachHero(
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): readonly MutableObject[] {
  return Object.values(context.facts?.heroRefs ?? {})
    .map((ref) => objects.get(refKey(ref)))
    .filter(isDefined);
}
