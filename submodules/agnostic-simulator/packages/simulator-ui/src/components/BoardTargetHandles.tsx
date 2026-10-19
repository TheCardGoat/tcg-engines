import { useRef, useState } from "react";
import "./board-target-handles.css";

export interface TargetAnchor {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Slot keys preserve the same marker when its target changes. No engine state lives here. */
export function BoardTargetHandles({
  anchors,
  selectedIds,
  ordered,
  reducedMotion,
  activeSlot,
  onActivate,
  onRetarget,
}: {
  anchors: readonly TargetAnchor[];
  selectedIds: readonly string[];
  ordered: boolean;
  reducedMotion: boolean;
  activeSlot: number | null;
  onActivate: (slot: number | null) => void;
  onRetarget: (slot: number, id: string) => boolean;
}) {
  const [notice, setNotice] = useState("");
  const moved = useRef(false);
  const cancelled = useRef(false);
  return (
    <div className="tcg-board-target-handles" data-reduced-motion={reducedMotion || undefined}>
      {selectedIds.map((id, slot) => {
        const anchor = anchors.find((entry) => entry.id === id);
        if (!anchor) return null;
        return (
          <button
            key={slot}
            type="button"
            className="tcg-board-target-handle"
            data-target-slot={slot}
            aria-label={`Change target ${slot + 1}`}
            aria-pressed={activeSlot === slot}
            style={{ left: anchor.left + anchor.width / 2 - 22, top: anchor.top - 16 }}
            onClick={() => {
              if (moved.current) {
                moved.current = false;
                return;
              }
              setNotice("");
              onActivate(activeSlot === slot ? null : slot);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                cancelled.current = true;
                onActivate(null);
              }
            }}
            onPointerDown={(event) => {
              moved.current = false;
              cancelled.current = false;
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerCancel={() => {
              cancelled.current = true;
            }}
            onPointerUp={(event) => {
              if (cancelled.current) {
                moved.current = true;
                return;
              }
              const target = document
                .elementsFromPoint(event.clientX, event.clientY)
                .map((element) => element.closest<HTMLElement>("[data-board-target-id]"))
                .find((element) => element?.dataset.boardTargetId);
              const next = target?.dataset.boardTargetId;
              if (!next || next === id) return;
              moved.current = true;
              const accepted = onRetarget(slot, next);
              setNotice(
                accepted
                  ? `Target ${slot + 1} changed.`
                  : "That card is not a legal target. Choose another card.",
              );
            }}
          >
            {ordered ? slot + 1 : "◎"}
          </button>
        );
      })}
      <span className="tcg-target-notice" role="status">
        {notice ||
          (activeSlot !== null ? "Choose a legal card to move this target. Escape cancels." : "")}
      </span>
    </div>
  );
}

export function replaceBoardTarget(
  selected: readonly string[],
  slot: number,
  id: string,
  legal: ReadonlySet<string>,
): string[] | undefined {
  if (
    !legal.has(id) ||
    slot < 0 ||
    slot >= selected.length ||
    selected.some((value, index) => index !== slot && value === id)
  )
    return undefined;
  return selected.map((value, index) => (index === slot ? id : value));
}
