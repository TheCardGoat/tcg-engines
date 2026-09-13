import type { FabObjectSnapshot } from "../rules/events.ts";

/**
 * Single owner for object naming in player-facing logs. Faces of a split card
 * join with " // "; lists of objects join with ", " (see `fabObjectDisplayNames`).
 */
export function fabObjectDisplayName(object: FabObjectSnapshot): string {
  return (
    object.current.names.join(" // ") ||
    object.base.names.join(" // ") ||
    object.canonicalId ||
    object.instanceId
  );
}

/** Join object display names for list placeholders; empty lists read as "nothing". */
export function fabObjectDisplayNames(objects: readonly FabObjectSnapshot[]): string {
  if (objects.length === 0) return "nothing";
  return objects.map(fabObjectDisplayName).join(", ");
}
