import { useLayoutEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { interactionViewActionHasCandidate, useEngine } from "../../engine";
import { interactionViewCanAttackRival } from "../../engine/interactionViewHelpers";
import { useDragDrop } from "../GameBoard/DragDropContext";
import { PInfoZone } from "../GameBoard/PInfoZone";
import { useZoneDroppable } from "../GameBoard/useZoneDroppable";
import classes from "./DropAreas.module.css";

interface SellBounds {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** The Gig lane marks the top of the lower-left sell surface in every layout;
    the local Legend rack marks its floor — a drop on a Legend plays Gear, it
    never sells, so the surface stops just above the corner rack. */
function useSellBounds(visible: boolean): SellBounds | null {
  const [bounds, setBounds] = useState<SellBounds | null>(null);
  useLayoutEffect(() => {
    if (!visible) return;
    const lane = document.querySelector('[data-sim-zone-id="p-gigArea"]');
    if (!lane) return;
    const rack = document.querySelector('[data-v2-legend-rack="local"]');
    const update = () => {
      const rect = lane.getBoundingClientRect();
      const left = Math.max(0, Math.floor(rect.left - 18));
      const top = Math.max(56, Math.floor(rect.top - 12));
      const rackTop = rack ? rack.getBoundingClientRect().top : window.innerHeight;
      const width = Math.min(
        window.innerWidth - left,
        Math.max(160, Math.ceil(rect.right - left + 18)),
      );
      const height = Math.max(
        120,
        Math.min(window.innerHeight - top, Math.floor(rackTop - top - 6)),
      );
      const next = { left, top, width, height };
      setBounds((current) =>
        current?.left === left &&
        current.top === top &&
        current.width === width &&
        current.height === height
          ? current
          : next,
      );
    };
    update();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    observer?.observe(lane);
    if (rack) observer?.observe(rack);
    window.addEventListener("resize", update);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [visible]);
  return bounds;
}

/** Keep action targets in screen pixels so a fitted mobile board cannot shrink them. */
export function SellDropArea() {
  const { activeSource } = useDragDrop();
  const { humanSide, interactionViews } = useEngine();
  const visible = activeSource?.zone === "p-hand";
  const enabled = Boolean(
    visible &&
    activeSource?.cardId &&
    interactionViewActionHasCandidate(
      interactionViews[humanSide],
      "sellCard",
      "cardId",
      activeSource.cardId,
    ),
  );
  const bounds = useSellBounds(Boolean(visible));
  const drop = useZoneDroppable(enabled ? "p-eddies" : null);
  if (!visible) return null;
  return createPortal(
    <div
      ref={drop.setNodeRef}
      className={`${classes.action} ${classes.sell}`}
      style={bounds ?? undefined}
      data-v2-drop-action="sell"
      data-sim-zone-id={enabled ? "p-eddies" : undefined}
      data-enabled={enabled}
      data-drop-ready={enabled || undefined}
      data-over={drop.isOver}
    >
      <strong>{enabled ? "Drop to sell" : "Sale unavailable"}</strong>
      <span>Eddies area</span>
    </div>,
    document.body,
  );
}

/** Relocate the existing rival target; never register two targets with the same ID. */
export function RivalDropTarget({ children }: { children: ReactNode }) {
  const { activeSource } = useDragDrop();
  const { humanSide, interactionViews } = useEngine();
  const expanded =
    activeSource?.zone === "p-field" &&
    activeSource.cardId &&
    interactionViewCanAttackRival(interactionViews[humanSide], activeSource.cardId);
  if (!expanded) return <PInfoZone opponent>{children}</PInfoZone>;
  return (
    <>
      {children}
      {createPortal(
        <div className={`${classes.action} ${classes.attack}`} data-v2-drop-action="attackRival">
          <PInfoZone opponent />
        </div>,
        document.body,
      )}
    </>
  );
}
