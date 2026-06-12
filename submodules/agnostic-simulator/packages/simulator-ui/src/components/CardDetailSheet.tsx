import { useCallback, useEffect, useRef } from "react";

import type { SimulatorEntity } from "@tcg/simulator-contract";

import { cx } from "../class-names";
import { CardFace } from "./CardFace";

export interface CardDetailSheetProps {
  entity: SimulatorEntity;
  open: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

export function CardDetailSheet({ entity, open, onClose, children }: CardDetailSheetProps) {
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handlePointerDown = useCallback(() => {
    longPressTimer.current = setTimeout(() => {
      // Parent controls open state
    }, 500);
  }, []);

  const handlePointerUp = useCallback(() => {
    clearTimeout(longPressTimer.current);
  }, []);

  const handlePointerLeave = useCallback(() => {
    clearTimeout(longPressTimer.current);
  }, []);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose?.();
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [open, onClose]);

  return (
    <>
      <span
        className="card-detail-trigger inline-block"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        {children}
      </span>

      {open && (
        <>
          <div
            className="card-detail-backdrop fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            role="presentation"
          />
          <div
            className={cx(
              "choice-detail-sheet fixed z-50 overflow-hidden rounded-t-2xl border border-[var(--board-border)] bg-[var(--board-surface)] shadow-2xl",
              "bottom-0 left-0 right-0 max-h-[85vh] md:bottom-auto md:left-1/2 md:top-1/2 md:max-h-[80vh] md:w-[420px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl",
            )}
            role="dialog"
            aria-modal="true"
            aria-label={`${entity.title} details`}
          >
            <div className="flex justify-center pt-3 pb-1 md:hidden">
              <div className="h-1 w-10 rounded-full bg-[var(--board-border)]" />
            </div>
            <div className="max-h-[calc(85vh-24px)] overflow-y-auto p-4 md:max-h-[calc(80vh-24px)] md:p-6">
              <div className="mx-auto max-w-[280px]">
                <CardFace entity={entity} density="full" />
              </div>
              <div className="mt-4 grid gap-3">
                {entity.states.length > 0 && (
                  <section>
                    <h4 className="text-[11px] font-black uppercase tracking-normal text-[var(--board-muted)]">
                      States
                    </h4>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {entity.states.map((state) => (
                        <span
                          key={state}
                          className="inline-flex min-h-6 items-center rounded-full border border-[var(--pill-border)] bg-[var(--pill-bg)] px-2 py-1 text-[11px] font-extrabold leading-none text-[var(--pill-text)]"
                        >
                          {state}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
                {entity.stats.length > 0 && (
                  <section>
                    <h4 className="text-[11px] font-black uppercase tracking-normal text-[var(--board-muted)]">
                      Stats
                    </h4>
                    <div className="mt-1 grid grid-cols-2 gap-2">
                      {entity.stats.map((stat) => (
                        <span
                          key={`${stat.label}:${stat.value}`}
                          className="inline-grid gap-0.5 rounded-md border border-[var(--board-border)] bg-[var(--board-surface-soft)] px-3 py-2"
                        >
                          <span className="text-[11px] font-extrabold uppercase leading-none text-[var(--board-muted)]">
                            {stat.label}
                          </span>
                          <strong className="text-base leading-none text-[var(--board-text)]">
                            {stat.value}
                          </strong>
                        </span>
                      ))}
                    </div>
                  </section>
                )}
                {entity.traits.length > 0 && (
                  <section>
                    <h4 className="text-[11px] font-black uppercase tracking-normal text-[var(--board-muted)]">
                      Traits
                    </h4>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {entity.traits.map((trait) => (
                        <span
                          key={trait}
                          className="inline-flex min-h-6 items-center rounded-full border border-[var(--pill-border)] bg-[var(--pill-bg)] px-2 py-1 text-[11px] font-extrabold leading-none text-[var(--pill-text)]"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
              </div>
              <button
                className="mt-4 w-full rounded-md bg-[var(--game-accent)]/20 py-2.5 text-sm font-black text-[var(--game-accent)] transition-colors hover:bg-[var(--game-accent)]/30"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
