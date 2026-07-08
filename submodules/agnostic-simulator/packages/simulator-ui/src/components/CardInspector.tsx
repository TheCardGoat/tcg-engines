import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { SimulatorEntity } from "@tcg/simulator-contract";

import { cx } from "../class-names";
import { CardFace } from "./CardFace";

export interface CardInspectorProps {
  entity: SimulatorEntity;
  children: React.ReactNode;
}

export function CardInspector({ entity, children }: CardInspectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const referenceRef = useRef<HTMLSpanElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const open = useCallback(() => {
    clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => setIsOpen(true), 350);
  }, []);

  const openNow = useCallback(() => {
    clearTimeout(hoverTimeoutRef.current);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  }, []);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  const popoverPosition = getPopoverPosition(referenceRef.current);
  const popover = isOpen && (
    <div
      ref={floatingRef}
      className={cx(
        "card-inspector-popover z-50 w-[260px] rounded-lg border border-[var(--board-border)] bg-[var(--board-surface)] p-3 shadow-xl",
        "pointer-events-none",
      )}
      role="dialog"
      tabIndex={-1}
      aria-label={`${entity.title} inspection`}
      onMouseEnter={open}
      onMouseLeave={close}
      style={{
        position: "fixed",
        left: popoverPosition.left,
        top: popoverPosition.top,
      }}
    >
      <CardFace entity={entity} density="large" />
      {entity.traits.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {entity.traits.map((trait) => (
            <span
              key={trait}
              className="inline-flex min-h-6 items-center rounded-full border border-[var(--pill-border)] bg-[var(--pill-bg)] px-2 py-1 text-[11px] font-extrabold leading-none text-[var(--pill-text)]"
            >
              {trait}
            </span>
          ))}
        </div>
      )}
      {entity.stats.length > 0 && (
        <div className="mt-2 grid grid-cols-[repeat(auto-fit,minmax(68px,1fr))] gap-1.5">
          {entity.stats.map((stat) => (
            <span
              key={`${stat.label}:${stat.value}`}
              className="inline-grid min-w-16 gap-0.5 rounded-md border border-[var(--board-border)] bg-[var(--board-surface-soft)] px-2 py-1.5"
            >
              <span className="text-[11px] font-extrabold uppercase leading-none text-[var(--board-muted)]">
                {stat.label}
              </span>
              <strong className="text-sm leading-none text-[var(--board-text)]">
                {stat.value}
              </strong>
            </span>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      <span
        ref={referenceRef}
        className="card-inspector-reference inline-block"
        onMouseEnter={open}
        onMouseLeave={close}
        onFocus={openNow}
        onBlur={close}
        onClick={(event) => {
          event.stopPropagation();
          openNow();
        }}
        onPointerDown={(event) => event.stopPropagation()}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        style={{ pointerEvents: "auto", touchAction: "manipulation" }}
      >
        {children}
      </span>

      {popover && typeof document !== "undefined" ? createPortal(popover, document.body) : popover}
    </>
  );
}

function getPopoverPosition(reference: HTMLElement | null): { left: number; top: number } {
  if (!reference || typeof window === "undefined") {
    return { left: 0, top: 0 };
  }

  const rect = reference.getBoundingClientRect();
  const gap = 12;
  const edgeInset = 12;
  const popoverWidth = 260;
  const estimatedPopoverHeight = 320;
  const fitsRight = rect.right + gap + popoverWidth <= window.innerWidth - edgeInset;
  const left = fitsRight ? rect.right + gap : Math.max(edgeInset, rect.left - gap - popoverWidth);
  const top = Math.min(
    Math.max(edgeInset, rect.top),
    Math.max(edgeInset, window.innerHeight - estimatedPopoverHeight - edgeInset),
  );

  return { left, top };
}
