import { useEffect, useRef, useState, type ReactNode } from "react";
import "./inspection.css";
import "./card-selection.css";

/** The caller must provide only cards this viewer is allowed to inspect. */
export function useCardInspection<T>() {
  const [card, setCard] = useState<T | null>(null);
  return { card, inspect: setCard, dismiss: () => setCard(null) };
}

/** Accessible controls only: the card remains in the game's 3D scene. */
export function CardInspectionControls({
  label,
  onClose,
  children,
}: {
  label: string;
  onClose: () => void;
  children?: ReactNode;
}) {
  const close = useRef<HTMLButtonElement>(null);
  const dismiss = useRef(onClose);
  dismiss.current = onClose;
  useEffect(() => {
    const previous = document.activeElement;
    close.current?.focus();
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        dismiss.current();
      }
    };
    window.addEventListener("keydown", escape, true);
    return () => {
      window.removeEventListener("keydown", escape, true);
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus();
    };
  }, []);
  return (
    <div
      className="tcg-inspection"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={() => onClose()}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const buttons = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            'button:not(:disabled), a[href], input:not(:disabled), [tabindex="0"]',
          ),
        ).filter((element) => element.getClientRects().length > 0);
        const index = buttons.findIndex((button) => button === document.activeElement);
        event.preventDefault();
        buttons[(index + (event.shiftKey ? -1 : 1) + buttons.length) % buttons.length]?.focus();
      }}
    >
      <div className="tcg-inspection__actions" onClick={(event) => event.stopPropagation()}>
        {children}
        <button
          ref={close}
          className="tcg-inspection__return"
          aria-label="Close card inspection"
          onClick={onClose}
        >
          Return to board <kbd>Esc</kbd>
        </button>
      </div>
    </div>
  );
}

export interface SpatialHitTarget {
  id: string;
  label: string;
  left: number;
  top: number;
  width: number;
  height: number;
}
/** Projected semantic targets; the game owns positions and visible scene markings. */
export function SpatialZoneTargets({
  targets,
  onOpen,
  onHighlight,
}: {
  targets: readonly SpatialHitTarget[];
  onOpen: (id: string) => void;
  onHighlight: (id: string | null) => void;
}) {
  return (
    <div className="tcg-spatial-targets" aria-label="Board zones">
      {targets.map((target) => (
        <button
          key={target.id}
          type="button"
          className="tcg-spatial-target"
          aria-label={target.label}
          style={{ left: target.left, top: target.top, width: target.width, height: target.height }}
          onPointerEnter={(event) => {
            if (event.pointerType !== "touch") onHighlight(target.id);
          }}
          onPointerLeave={() => onHighlight(null)}
          onFocus={() => onHighlight(target.id)}
          onBlur={() => onHighlight(null)}
          onClick={() => onOpen(target.id)}
        />
      ))}
    </div>
  );
}
