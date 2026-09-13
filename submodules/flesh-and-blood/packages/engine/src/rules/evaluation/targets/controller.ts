import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { heroObjectsForPlayer } from "../helpers.ts";

export function resolveController(
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): readonly MutableObject[] {
  return heroObjectsForPlayer(context.controllerId, context, objects);
}
