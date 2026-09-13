import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { isDefined, refKey } from "../helpers.ts";

export function resolveSelf(
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): readonly MutableObject[] {
  return context.source ? [objects.get(refKey(context.source))].filter(isDefined) : [];
}
