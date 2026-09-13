import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";

/**
 * Resolve the host of the source object — the object that has this card
 * underneath it (material, Evo transform, etc.).
 *
 * The rules view derives the host's children from the sole container topology.
 * We walk all objects to find the one whose children include the source.
 */
export function resolveHost(
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): readonly MutableObject[] {
  const sourceId = context.source?.instanceId;
  if (!sourceId) return [];
  for (const object of objects.values()) {
    const children = object.input.underInstanceIds;
    if (children && children.includes(sourceId)) {
      return [object];
    }
  }
  return [];
}
