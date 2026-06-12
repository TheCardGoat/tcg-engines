import { useCallback, useEffect, useRef, useState } from "react";

import type { SimulatorEntity } from "@tcg/simulator-contract";

import { cx } from "../class-names";
import { CardFace } from "./CardFace";

interface ChoiceResolutionOverlayProps {
  open: boolean;
  title: string;
  entities: SimulatorEntity[];
  selectedIds: string[];
  ordered?: boolean;
  onConfirm?: (selectedIds: string[]) => void;
  onClose?: () => void;
}

export function ChoiceResolutionOverlay({
  open,
  title,
  entities,
  selectedIds,
  ordered = false,
  onConfirm,
  onClose,
}: ChoiceResolutionOverlayProps) {
  const [pos, setPos] = useState({ x: 20, y: 80 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);

  const startDrag = useCallback(
    (event: React.PointerEvent) => {
      setDragging(true);
      dragOffset.current = { x: event.clientX - pos.x, y: event.clientY - pos.y };
      overlayRef.current?.setPointerCapture(event.pointerId);
    },
    [pos],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent) => {
      if (!dragging) return;
      setPos({ x: event.clientX - dragOffset.current.x, y: event.clientY - dragOffset.current.y });
    },
    [dragging],
  );

  const onPointerUp = useCallback((event: React.PointerEvent) => {
    setDragging(false);
    overlayRef.current?.releasePointerCapture(event.pointerId);
  }, []);

  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) onClose?.();
    },
    [open, onClose],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [handleKeydown]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className={cx(
        "choice-resolution-overlay absolute z-30 w-[320px] overflow-hidden rounded-xl border border-white/10 bg-[var(--board-surface)]/90 shadow-2xl backdrop-blur-lg",
        dragging ? "cursor-grabbing" : "cursor-grab",
      )}
      style={{ left: pos.x, top: pos.y }}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} details`}
    >
      <div
        className="flex items-center justify-between border-b border-white/10 px-3 py-2"
        onPointerDown={startDrag}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        role="button"
        tabIndex={0}
        aria-label="Drag overlay"
      >
        <div className="flex items-center gap-2">
          <div className="h-1 w-6 rounded-full bg-[var(--board-border)]" />
          <span className="text-xs font-black text-[var(--board-text)]">{title}</span>
        </div>
        <button
          className="grid h-6 w-6 place-items-center rounded-md text-[var(--board-muted)] hover:bg-white/10 hover:text-[var(--board-text)]"
          onClick={onClose}
          aria-label="Close overlay"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {ordered && selectedIds.length > 0 && (
        <div className="border-b border-white/10 px-3 py-2">
          <p className="text-[10px] font-black uppercase text-[var(--board-muted)]">
            Selected order
          </p>
          <div className="mt-1 flex flex-col gap-1">
            {selectedIds.map((id, i) => {
              const entity = entities.find((e) => e.id === id);
              if (!entity) return null;
              return (
                <div key={id} className="flex items-center gap-2 rounded-md bg-white/5 px-2 py-1">
                  <span className="text-[10px] font-black text-[var(--game-accent)]">{i + 1}</span>
                  <span className="min-w-0 flex-1 truncate text-xs font-bold text-[var(--board-text)]">
                    {entity.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="max-h-[50vh] overflow-y-auto p-3">
        <div className="grid grid-cols-3 gap-2">
          {entities.map((entity) => (
            <button
              key={entity.id}
              className={cx(
                "relative rounded-md border-2 transition-colors",
                selectedIds.includes(entity.id)
                  ? "border-[var(--game-accent)]"
                  : "border-transparent hover:border-[var(--board-border)]",
              )}
              onClick={() => {
                const next = selectedIds.includes(entity.id)
                  ? selectedIds.filter((id) => id !== entity.id)
                  : [...selectedIds, entity.id];
                onConfirm?.(next);
              }}
            >
              <CardFace entity={entity} density="mini" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 border-t border-white/10 p-3">
        <button
          className="flex-1 rounded-md border border-[var(--board-border)] py-2 text-xs font-bold text-[var(--board-muted)] transition-colors hover:bg-[var(--board-surface-soft)] hover:text-[var(--board-text)]"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="flex-1 rounded-md bg-[var(--game-accent)] py-2 text-xs font-black text-white transition-opacity hover:opacity-90"
          onClick={() => onConfirm?.(selectedIds)}
        >
          Confirm ({selectedIds.length})
        </button>
      </div>
    </div>
  );
}
