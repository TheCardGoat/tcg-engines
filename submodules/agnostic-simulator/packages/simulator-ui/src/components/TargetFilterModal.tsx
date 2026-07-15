import { useCallback, useEffect, useId, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { IconX } from "@tabler/icons-react";
import {
  resolveSimulatorTargetFilter,
  type SimulatorEntity,
  type SimulatorTable,
  type SimulatorTargetFilter,
} from "@tcg/simulator-contract";

import { cx } from "../class-names";
import { CardGrid } from "./CardGrid";

export interface TargetFilterModalClassNames {
  backdrop?: string;
  sheet?: string;
  header?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  closeButton?: string;
}

export interface TargetFilterModalProps {
  opened: boolean;
  title: string;
  filter: SimulatorTargetFilter;
  table: SimulatorTable;
  entities: readonly SimulatorEntity[];
  onClose: () => void;
  classNames?: TargetFilterModalClassNames;
  renderEntity?: (entity: SimulatorEntity) => ReactNode;
  emptyLabel?: string;
}

export function TargetFilterModal({
  opened,
  title,
  filter,
  table,
  entities,
  onClose,
  classNames,
  renderEntity,
  emptyLabel = "No matching cards",
}: TargetFilterModalProps) {
  const titleId = useId();
  const subtitleId = useId();
  const matchedEntities = resolveSimulatorTargetFilter(filter, table, entities);
  const countLabel =
    matchedEntities.length === 1 ? "1 card" : `${matchedEntities.length.toString()} cards`;

  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && opened) onClose();
    },
    [onClose, opened],
  );

  useEffect(() => {
    if (!opened) return;
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [handleKeydown, opened]);

  if (!opened) return null;

  const modal = (
    <div
      className={cx(
        "target-filter-modal-backdrop fixed inset-0 z-50 grid place-items-center bg-black/60 p-3 backdrop-blur-sm",
        classNames?.backdrop,
      )}
      data-testid="target-filter-modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <section
        className={cx(
          "target-filter-modal flex max-h-[86vh] w-full max-w-[760px] flex-col overflow-hidden rounded-lg border border-[var(--board-border,rgba(216,229,247,0.22))] bg-[var(--board-surface,#0c0f14)] text-[var(--board-text,#f8fbff)] shadow-2xl",
          classNames?.sheet,
        )}
        data-testid="target-filter-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={subtitleId}
        onClick={(event) => event.stopPropagation()}
      >
        <header
          className={cx(
            "flex items-start justify-between gap-4 border-b border-[var(--board-border,rgba(216,229,247,0.22))] px-4 py-3",
            classNames?.header,
          )}
        >
          <div className="min-w-0">
            <h2
              id={titleId}
              className={cx("text-base font-black leading-tight", classNames?.title)}
            >
              {title}
            </h2>
            <p
              id={subtitleId}
              className={cx(
                "mt-1 text-xs font-bold uppercase leading-none tracking-normal text-[var(--board-muted,rgba(216,229,247,0.72))]",
                classNames?.subtitle,
              )}
              data-testid="target-filter-modal-count"
            >
              {countLabel}
            </p>
          </div>
          <button
            type="button"
            className={cx(
              "grid size-8 shrink-0 place-items-center rounded-md border border-[var(--board-border,rgba(216,229,247,0.22))] bg-[var(--board-surface-soft,rgba(216,229,247,0.08))] text-[var(--board-muted,rgba(216,229,247,0.72))] transition-colors hover:border-[var(--game-accent,#f5e642)] hover:text-[var(--board-text,#f8fbff)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--game-accent,#f5e642)]",
              classNames?.closeButton,
            )}
            data-testid="target-filter-modal-close"
            aria-label={`Close ${title}`}
            onClick={onClose}
          >
            <IconX size={16} stroke={2} aria-hidden="true" />
          </button>
        </header>
        <div className={cx("min-h-0 flex-1 overflow-auto p-4", classNames?.body)}>
          {matchedEntities.length === 0 ? (
            <p
              className="rounded-md border border-[var(--board-border,rgba(216,229,247,0.22))] bg-[var(--board-surface-soft,rgba(216,229,247,0.08))] px-3 py-4 text-center text-sm font-bold text-[var(--board-muted,rgba(216,229,247,0.72))]"
              data-testid="target-filter-modal-empty"
            >
              {emptyLabel}
            </p>
          ) : renderEntity ? (
            <div
              className="grid grid-cols-[repeat(auto-fit,minmax(118px,1fr))] items-stretch gap-2"
              role="list"
              aria-label={title}
            >
              {matchedEntities.map((entity) => (
                <div
                  key={entity.id}
                  data-testid="target-filter-modal-card"
                  data-entity-id={entity.id}
                  data-sim-entity-id={entity.id}
                  role="listitem"
                >
                  {renderEntity(entity)}
                </div>
              ))}
            </div>
          ) : (
            <CardGrid
              entities={[...matchedEntities]}
              emptyLabel={emptyLabel}
              countLabel={countLabel}
              density="normal"
              ariaLabel={title}
            />
          )}
        </div>
      </section>
    </div>
  );

  if (typeof document === "undefined") return modal;

  return createPortal(modal, document.body);
}
