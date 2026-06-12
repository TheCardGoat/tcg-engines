import { useDroppable } from "@dnd-kit/core";
import { encodeTargetId } from "./DragDropContext";

/**
 * Convenience hook for zones (Field, Trash, Legends, etc.) so they don't each
 * have to encode their drop-target id by hand.
 */
export function useZoneDroppable(zone: string | null | undefined) {
  return useDroppable({
    id: encodeTargetId({ type: "zone", zone: zone ?? "__disabled-zone__" }),
    disabled: !zone,
  });
}
