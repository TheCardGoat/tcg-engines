import { useCallback, useEffect, useRef, useState } from "react";

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

  return (
    <>
      <span
        ref={referenceRef}
        className="card-inspector-reference inline-block"
        onMouseEnter={open}
        onMouseLeave={close}
        onFocus={open}
        onBlur={close}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        {children}
      </span>

      {isOpen && (
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
            position: "absolute",
            left: referenceRef.current
              ? referenceRef.current.getBoundingClientRect().right + 12
              : 0,
            top: referenceRef.current ? referenceRef.current.getBoundingClientRect().top : 0,
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
      )}
    </>
  );
}
