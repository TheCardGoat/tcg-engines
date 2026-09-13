import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { isDefined, refKey } from "../helpers.ts";

export function resolveThisAttack(
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): readonly MutableObject[] {
  const ref = context.facts?.combat?.attack;
  return ref ? [objects.get(refKey(ref))].filter(isDefined) : [];
}
