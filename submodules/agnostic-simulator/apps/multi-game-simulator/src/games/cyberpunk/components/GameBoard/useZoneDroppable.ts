import { useDroppable } from "@dnd-kit/core";
import { encodeTargetId, useDragDrop } from "./DragDropContext";

/**
 * Convenience hook for zones (Field, Trash, Legends, etc.) so they don't each
 * have to encode their drop-target id by hand.
 */
export function useZoneDroppable(zone: string | null | undefined) {
  const { activeSource } = useDragDrop();
  const dropReady =
    activeSource?.zone === "p-hand" && zone === "p-field"
      ? "play"
      : activeSource?.zone === "p-legendArea" && zone === "p-field"
        ? "goSolo"
        : activeSource?.zone === "p-field" && zone === "opp-field"
          ? "attack"
          : undefined;
  const drop = useDroppable({
    id: encodeTargetId({ type: "zone", zone: zone ?? "__disabled-zone__" }),
    disabled: !zone,
  });
  return { ...drop, dropReady };
}
