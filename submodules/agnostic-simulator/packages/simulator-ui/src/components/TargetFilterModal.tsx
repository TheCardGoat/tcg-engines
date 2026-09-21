import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { IconMinus, IconX } from "@tabler/icons-react";
import {
  resolveSimulatorTargetFilter,
  type SimulatorEntity,
  type SimulatorTable,
  type SimulatorTargetFilter,
} from "@tcg/simulator-contract";

import { cx } from "../class-names";
import {
  cardInteractionStateFromFlags,
  type CardInteractionStateResolver,
} from "../interactions/card-interaction";
import { CardFace } from "./CardFace";
import { CardGrid } from "./CardGrid";

const TARGET_FILTER_COLUMN_OPTIONS = [3, 4, 5] as const;

export interface TargetFilterDuplicateFilter {
  readonly label?: string;
  readonly keyFor: (entity: SimulatorEntity) => string | undefined;
}

export interface TargetFilterModalClassNames {
  backdrop?: string;
  sheet?: string;
  header?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  footer?: string;
  closeButton?: string;
  duplicateToggle?: string;
}

interface TargetFilterModalCommonProps {
  opened: boolean;
  title: string;
  description?: string;
  filter: SimulatorTargetFilter;
  table: SimulatorTable;
  entities: readonly SimulatorEntity[];
  classNames?: TargetFilterModalClassNames;
  emptyLabel?: string;
  duplicateFilter?: TargetFilterDuplicateFilter;
  renderPreview?: (entity: SimulatorEntity) => ReactNode;
  /** Replaces the visible heading content; `title` stays the accessible name. */
  renderTitle?: (title: string) => ReactNode;
  /** Context shown at the start of the select toolbar row, beside the cards-per-row control. */
  toolbarNote?: ReactNode;
}

export type TargetFilterModalProps = TargetFilterModalCommonProps &
  (
    | {
        mode?: "inspect";
        presentation?: "modal" | "nonmodal";
        cardInspection?:
          | { readonly kind?: "popover" }
          | {
              readonly kind: "external";
              readonly onInspect?: (entity: SimulatorEntity) => void;
              readonly onPreviewEnd?: () => void;
            };
        interactionStateFor?: CardInteractionStateResolver;
        onSelect?: (entity: SimulatorEntity) => void;
        onClose: () => void;
      }
    | {
        mode: "select";
        presentation?: "modal";
        selectedIds: readonly string[];
        max: number;
        disabledEntityIds?: ReadonlySet<string>;
        onSelect: (entity: SimulatorEntity) => void;
        confirmation?: {
          canConfirm: boolean;
          onConfirm: () => void;
        };
        onChooseNone?: () => void;
        onMinimize: () => void;
      }
  );

export function TargetFilterModal({
  opened,
  title,
  description,
  filter,
  table,
  entities,
  classNames,
  emptyLabel = "No matching cards",
  duplicateFilter,
  renderPreview,
  renderTitle,
  toolbarNote,
  ...modeProps
}: TargetFilterModalProps) {
  const selectable = modeProps.mode === "select";
  const modalPresentation = modeProps.presentation !== "nonmodal";
  const dismiss = selectable ? modeProps.onMinimize : modeProps.onClose;
  const titleId = useId();
  const descriptionId = useId();
  const subtitleId = useId();
  const backdropRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const [columns, setColumns] = useState<number>(4);
  const [hideDuplicates, setHideDuplicates] = useState(true);
  const [previewEntity, setPreviewEntity] = useState<SimulatorEntity | null>(null);
  const matchedEntities = resolveSimulatorTargetFilter(filter, table, entities);
  const deduplicated = duplicateFilter
    ? deduplicateEntities(
        matchedEntities,
        duplicateFilter.keyFor,
        selectable ? new Set(modeProps.selectedIds) : new Set<string>(),
      )
    : { entities: matchedEntities, hiddenCount: 0, copyCounts: new Map<string, number>() };
  const displayedEntities = hideDuplicates ? deduplicated.entities : matchedEntities;
  const displayedPreviewEntity =
    previewEntity && displayedEntities.some((entity) => entity.id === previewEntity.id)
      ? previewEntity
      : (displayedEntities[0] ?? null);
  const totalCountLabel =
    matchedEntities.length === 1 ? "1 card" : `${matchedEntities.length.toString()} cards`;
  const countLabel = selectable
    ? `${modeProps.selectedIds.length}/${modeProps.max} selected`
    : totalCountLabel;

  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (!opened) return;
      if (event.key === "Escape") {
        event.preventDefault();
        dismiss();
        return;
      }
      if (event.key !== "Tab" || !modalPresentation) return;

      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)].filter(
        (element) =>
          !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true",
      );
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable.at(-1);
      const activeElement = document.activeElement;
      if (
        event.shiftKey &&
        (activeElement === dialog || activeElement === first || !dialog.contains(activeElement))
      ) {
        event.preventDefault();
        last?.focus();
      } else if (
        !event.shiftKey &&
        (activeElement === dialog || activeElement === last || !dialog.contains(activeElement))
      ) {
        event.preventDefault();
        first?.focus();
      }
    },
    [dismiss, modalPresentation, opened],
  );

  useEffect(() => {
    if (!opened) return;
    document.addEventListener("keydown", handleKeydown, true);
    return () => document.removeEventListener("keydown", handleKeydown, true);
  }, [handleKeydown, opened]);

  useEffect(() => {
    if (!opened || typeof document === "undefined") return;

    const activeElement = document.activeElement;
    previouslyFocusedRef.current = activeElement instanceof HTMLElement ? activeElement : null;
    const backdrop = backdropRef.current;
    const backgroundStates = modalPresentation
      ? [...document.body.children]
          .filter(
            (element): element is HTMLElement =>
              element instanceof HTMLElement && element !== backdrop,
          )
          .map((element) => ({
            element,
            ariaHidden: element.getAttribute("aria-hidden"),
            inert: element.inert,
          }))
      : [];

    if (modalPresentation) {
      for (const { element } of backgroundStates) {
        element.inert = true;
        element.setAttribute("aria-hidden", "true");
      }
      dialogRef.current?.focus({ preventScroll: true });
    }

    const containFocus = (event: FocusEvent) => {
      const dialog = dialogRef.current;
      const target = event.target;
      if (!(dialog && target instanceof Node) || dialog.contains(target)) return;
      if (
        target instanceof Element &&
        target.closest("[data-card-context-menu], [data-card-context-preview-dialog]")
      ) {
        return;
      }
      dialog.focus({ preventScroll: true });
    };
    if (modalPresentation) document.addEventListener("focusin", containFocus);

    return () => {
      if (modalPresentation) document.removeEventListener("focusin", containFocus);
      for (const { element, ariaHidden, inert } of backgroundStates) {
        element.inert = inert;
        if (ariaHidden === null) element.removeAttribute("aria-hidden");
        else element.setAttribute("aria-hidden", ariaHidden);
      }
      const previouslyFocused = previouslyFocusedRef.current;
      if (previouslyFocused?.isConnected) previouslyFocused.focus({ preventScroll: true });
    };
  }, [modalPresentation, opened]);

  useEffect(() => {
    if (!opened || modalPresentation) return;

    const closeOnOutsidePointer = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && !dialogRef.current?.contains(target)) dismiss();
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer, true);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer, true);
  }, [dismiss, modalPresentation, opened]);

  if (!opened) return null;

  const duplicateToggle = duplicateFilter ? (
    <label
      className={cx(
        "target-filter-duplicate-toggle flex min-h-11 cursor-pointer items-center gap-2 rounded-md px-2 text-xs font-bold text-[var(--board-text,#f8fbff)] hover:bg-[var(--board-surface-soft,rgba(216,229,247,0.08))]",
        classNames?.duplicateToggle,
      )}
      aria-describedby={`${subtitleId}-duplicates`}
    >
      <input
        type="checkbox"
        checked={hideDuplicates}
        onChange={(event) => setHideDuplicates(event.currentTarget.checked)}
        className="size-4 accent-[var(--game-accent,#f5e642)]"
        data-testid="target-filter-hide-duplicates"
      />
      <span>{duplicateFilter.label ?? "Hide duplicates"}</span>
      <span className="font-normal text-[var(--board-muted,rgba(216,229,247,0.72))]">
        {hideDuplicates
          ? `${deduplicated.hiddenCount} grouped`
          : `${deduplicated.hiddenCount} duplicates`}
      </span>
      <span id={`${subtitleId}-duplicates`} className="sr-only">
        Matching copies are grouped because they have the same game identity. Turn this off when
        individual copies matter. Cards without a public identity remain separate.
      </span>
    </label>
  ) : null;

  const modal = (
    <div
      ref={backdropRef}
      className={cx(
        modalPresentation
          ? "target-filter-modal-backdrop fixed inset-0 z-50 grid place-items-center bg-black/60 p-3 backdrop-blur-sm"
          : "target-filter-modal-backdrop pointer-events-none fixed inset-0 z-50 flex items-start justify-end p-3",
        classNames?.backdrop,
      )}
      data-presentation={modalPresentation ? "modal" : "nonmodal"}
      data-testid="target-filter-modal-backdrop"
      onClick={modalPresentation ? dismiss : undefined}
      role="presentation"
    >
      <section
        ref={dialogRef}
        className={cx(
          "target-filter-modal flex w-full flex-col overflow-hidden rounded-lg border border-[var(--board-border,rgba(216,229,247,0.22))] bg-[var(--board-surface,#0c0f14)] text-[var(--board-text,#f8fbff)] shadow-2xl",
          modalPresentation
            ? "max-h-[86vh] max-w-[760px]"
            : "pointer-events-auto max-h-[calc(100dvh-1.5rem)] max-w-[36rem]",
          classNames?.sheet,
        )}
        data-presentation={modalPresentation ? "modal" : "nonmodal"}
        data-testid="target-filter-modal"
        role="dialog"
        tabIndex={-1}
        aria-modal={modalPresentation ? "true" : undefined}
        aria-labelledby={titleId}
        aria-describedby={description ? `${descriptionId} ${subtitleId}` : subtitleId}
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
              {renderTitle ? renderTitle(title) : title}
            </h2>
            {description ? (
              <p
                id={descriptionId}
                className="mt-1 text-sm text-[var(--board-muted,rgba(216,229,247,0.78))]"
              >
                {description}
              </p>
            ) : null}
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
          <div className="flex shrink-0 items-center gap-2">
            {!selectable ? duplicateToggle : null}
            <button
              type="button"
              className={cx(
                "grid size-11 shrink-0 place-items-center rounded-md border border-[var(--board-border,rgba(216,229,247,0.22))] bg-[var(--board-surface-soft,rgba(216,229,247,0.08))] text-[var(--board-muted,rgba(216,229,247,0.72))] transition-colors hover:border-[var(--game-accent,#f5e642)] hover:text-[var(--board-text,#f8fbff)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--game-accent,#f5e642)]",
                classNames?.closeButton,
              )}
              data-testid="target-filter-modal-close"
              aria-label={selectable ? `Minimize ${title}` : `Close ${title}`}
              title={selectable ? `Minimize ${title}` : `Close ${title}`}
              onClick={dismiss}
            >
              {selectable ? (
                <IconMinus size={16} stroke={2} aria-hidden="true" />
              ) : (
                <IconX size={16} stroke={2} aria-hidden="true" />
              )}
            </button>
          </div>
        </header>
        <div className={cx("flex min-h-0 flex-1 flex-col overflow-hidden p-4", classNames?.body)}>
          {matchedEntities.length === 0 ? (
            <p
              className="rounded-md border border-[var(--board-border,rgba(216,229,247,0.22))] bg-[var(--board-surface-soft,rgba(216,229,247,0.08))] px-3 py-4 text-center text-sm font-bold text-[var(--board-muted,rgba(216,229,247,0.72))]"
              data-testid="target-filter-modal-empty"
            >
              {emptyLabel}
            </p>
          ) : (
            <div className="target-filter-modal-workspace flex min-h-0 flex-1 flex-col gap-3">
              {selectable ? (
                <div
                  className={cx(
                    "target-filter-modal-toolbar items-center justify-between gap-3",
                    duplicateFilter || toolbarNote ? "flex" : "hidden min-[720px]:flex",
                  )}
                >
                  <div className="flex min-h-0 min-w-0 flex-1 items-center gap-3">
                    {toolbarNote}
                    {duplicateToggle}
                  </div>
                  <fieldset
                    className="hidden shrink-0 items-center gap-1 rounded-md border border-[var(--board-border,rgba(216,229,247,0.22))] bg-[var(--board-surface-soft,rgba(216,229,247,0.08))] p-1 min-[720px]:flex"
                    aria-label="Cards per row"
                  >
                    <legend className="sr-only">Cards per row</legend>
                    <span className="px-1.5 text-xs font-bold text-[var(--board-muted,rgba(216,229,247,0.72))]">
                      Cards per row
                    </span>
                    {TARGET_FILTER_COLUMN_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={cx(
                          "grid size-9 place-items-center rounded text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--game-accent,#f5e642)]",
                          columns === option
                            ? "bg-[var(--game-accent,#f5e642)] text-[var(--game-accent-contrast,#111827)]"
                            : "text-[var(--board-muted,rgba(216,229,247,0.72))] hover:bg-[var(--board-surface,#0c0f14)] hover:text-[var(--board-text,#f8fbff)]",
                        )}
                        aria-label={`${option} cards per row`}
                        aria-pressed={columns === option}
                        onClick={() => setColumns(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </fieldset>
                </div>
              ) : null}
              <div
                className={cx(
                  "target-filter-modal-content grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] items-start overflow-hidden",
                  selectable
                    ? "grid-cols-[minmax(0,1fr)_minmax(15rem,18rem)] gap-5 max-[719px]:grid-cols-1 max-[719px]:grid-rows-[auto_minmax(0,1fr)] max-[719px]:gap-3"
                    : "grid-cols-1",
                )}
              >
                <div className="target-filter-modal-grid h-full min-h-0 min-w-0 overflow-x-hidden overflow-y-auto p-1 max-[719px]:row-start-2">
                  <CardGrid
                    entities={[...displayedEntities]}
                    copyCounts={hideDuplicates ? deduplicated.copyCounts : undefined}
                    emptyLabel={emptyLabel}
                    countLabel={totalCountLabel}
                    density="normal"
                    ariaLabel={title}
                    inspectable={
                      !selectable &&
                      (modeProps.cardInspection === undefined ||
                        modeProps.cardInspection.kind !== "external")
                    }
                    columns={selectable ? columns : undefined}
                    onPreviewChange={
                      selectable
                        ? setPreviewEntity
                        : modeProps.cardInspection?.kind === "external"
                          ? modeProps.cardInspection.onInspect
                          : undefined
                    }
                    onPreviewEnd={
                      !selectable && modeProps.cardInspection?.kind === "external"
                        ? modeProps.cardInspection.onPreviewEnd
                        : undefined
                    }
                    showTitles={selectable}
                    scrollable={false}
                    interactionStateFor={
                      selectable
                        ? (entity) =>
                            cardInteractionStateFromFlags({
                              selected: modeProps.selectedIds.includes(entity.id),
                              targetable: !modeProps.disabledEntityIds?.has(entity.id),
                            })
                        : modeProps.interactionStateFor
                    }
                    disabledEntityIds={selectable ? modeProps.disabledEntityIds : undefined}
                    onSelect={
                      selectable
                        ? modeProps.onSelect
                        : (modeProps.onSelect ??
                          (modeProps.cardInspection?.kind === "external"
                            ? modeProps.cardInspection.onInspect
                            : undefined))
                    }
                    animated={false}
                  />
                </div>
                {selectable ? (
                  <aside
                    className="target-filter-modal-preview sticky top-0 w-full min-w-0 rounded-lg border border-[var(--board-border,rgba(216,229,247,0.22))] bg-[var(--board-surface-soft,rgba(216,229,247,0.08))] p-3 max-[719px]:row-start-1 max-[719px]:mx-auto max-[719px]:max-w-56 max-[719px]:p-2"
                    aria-live="polite"
                    aria-label="Card preview"
                    data-testid="target-filter-modal-preview"
                  >
                    {displayedPreviewEntity ? (
                      <>
                        {renderPreview ? (
                          renderPreview(displayedPreviewEntity)
                        ) : (
                          <CardFace
                            entity={displayedPreviewEntity}
                            density="full"
                            fill
                            imageMode="full"
                            fullImageFit="contain"
                          />
                        )}
                        <p className="mt-2 text-center text-xs font-bold leading-snug text-[var(--board-text,#f8fbff)]">
                          {displayedPreviewEntity.title}
                        </p>
                      </>
                    ) : (
                      <div className="grid aspect-[5/7] place-items-center rounded-md border border-dashed border-[var(--board-border,rgba(216,229,247,0.22))] px-4 text-center text-xs leading-relaxed text-[var(--board-muted,rgba(216,229,247,0.72))]">
                        Point to or focus a card to see it here.
                      </div>
                    )}
                  </aside>
                ) : null}
              </div>
            </div>
          )}
        </div>
        {selectable && (modeProps.onChooseNone || modeProps.confirmation) ? (
          <footer
            className={cx(
              "flex flex-wrap items-center justify-end gap-2 border-t border-[var(--board-border,rgba(216,229,247,0.22))] bg-[var(--board-surface-soft,rgba(216,229,247,0.08))] px-4 py-3",
              classNames?.footer,
            )}
          >
            {modeProps.onChooseNone ? (
              <button
                type="button"
                className="min-h-10 rounded-md border border-[var(--board-border,rgba(216,229,247,0.22))] px-3 text-sm font-bold text-[var(--board-text,#f8fbff)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--game-accent,#f5e642)]"
                onClick={modeProps.onChooseNone}
              >
                Choose none
              </button>
            ) : null}
            {modeProps.confirmation ? (
              <button
                type="button"
                className="min-h-10 rounded-md bg-[var(--game-accent,#f5e642)] px-3 text-sm font-black text-[var(--game-accent-contrast,#111827)] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--game-accent,#f5e642)] focus-visible:ring-offset-2"
                disabled={!modeProps.confirmation.canConfirm}
                onClick={modeProps.confirmation.onConfirm}
              >
                Confirm choice
              </button>
            ) : null}
          </footer>
        ) : null}
      </section>
    </div>
  );

  if (typeof document === "undefined") return modal;

  return createPortal(modal, document.body);
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

function deduplicateEntities(
  entities: readonly SimulatorEntity[],
  keyFor: (entity: SimulatorEntity) => string | undefined,
  selectedIds: ReadonlySet<string>,
): { entities: SimulatorEntity[]; hiddenCount: number; copyCounts: ReadonlyMap<string, number> } {
  const representatives: SimulatorEntity[] = [];
  const representativeIndexByKey = new Map<string, number>();
  const countByKey = new Map<string, number>();

  for (const entity of entities) {
    const key = keyFor(entity);
    if (!key) {
      representatives.push(entity);
      continue;
    }
    countByKey.set(key, (countByKey.get(key) ?? 0) + 1);

    const representativeIndex = representativeIndexByKey.get(key);
    if (representativeIndex === undefined) {
      representativeIndexByKey.set(key, representatives.length);
      representatives.push(entity);
      continue;
    }

    const currentRepresentative = representatives[representativeIndex];
    if (
      selectedIds.has(entity.id) &&
      currentRepresentative &&
      !selectedIds.has(currentRepresentative.id)
    ) {
      representatives[representativeIndex] = entity;
    }
  }

  return {
    entities: representatives,
    hiddenCount: entities.length - representatives.length,
    copyCounts: new Map(
      representatives.map((entity) => {
        const key = keyFor(entity);
        return [entity.id, key ? (countByKey.get(key) ?? 1) : 1];
      }),
    ),
  };
}
