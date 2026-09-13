import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { isDefined, refKey } from "../helpers.ts";

export function resolveEachOtherHero(
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): readonly MutableObject[] {
  return Object.entries(context.facts?.heroRefs ?? {})
    .filter(([playerId]) => playerId !== context.controllerId)
    .map(([, ref]) => objects.get(refKey(ref)))
    .filter(isDefined);
}
