import { CardReference, type CardIdentityMarker } from "./CardReference";
import { Modal } from "@mantine/core";
import { useEffect, useState, type ReactNode } from "react";
import { selectionVariables } from "./card-selection";
import "./target-modal.css";

export interface TargetCard {
  id: string;
  label: string;
  imageUrl?: string;
  identity?: readonly CardIdentityMarker[];
  detail?: string;
  aspectRatio?: number;
  group?: string;
  enabled?: boolean;
  disabledReason?: string;
  /** Cards sharing a stackKey are fungible copies; the modal shows one tile with a count. */
  stackKey?: string;
}

type StackedCard<T extends TargetCard> = T & {
  stackCount: number;
  stackSelected: boolean;
};

/** Collapse fungible copies into representative tiles while preserving first-seen order. */
function stackTargetCards<T extends TargetCard>(
  cards: readonly T[],
  selectedIds?: ReadonlySet<string>,
): Array<StackedCard<T>> {
  const byKey = new Map<string, StackedCard<T>>();
  const out: Array<StackedCard<T>> = [];
  for (const card of cards) {
    const selected = selectedIds?.has(card.id) === true;
    if (!card.stackKey) {
      out.push({ ...card, stackCount: 1, stackSelected: selected });
      continue;
    }
    const key = `${card.group ?? ""}|${card.stackKey}`;
    const existing = byKey.get(key);
    if (existing) {
      existing.stackCount += 1;
      existing.stackSelected ||= selected;
      continue;
    }
    const stacked = { ...card, stackCount: 1, stackSelected: selected };
    byKey.set(key, stacked);
    out.push(stacked);
  }
  return out;
}
/** Only pass viewer-safe cards. The caller owns eligibility and selection state. */
export interface TargetModalProps<T extends TargetCard> {
  opened: boolean;
  returnFocus?: boolean;
  /** Optional game theme for this modal only. */
  className?: string;
  fullScreen?: boolean;
  presentation?: "dialog" | "tray" | "focus";
  title: string;
  cards: readonly T[];
  filter?: (card: T) => boolean;
  selectedIds?: ReadonlySet<string>;
  selectionOrder?: readonly string[];
  mode?: "inspect" | "select";
  onCard: (card: T) => void;
  onClose: () => void;
  emptyMessage?: string;
  description?: string;
  footer?: ReactNode;
  content?: ReactNode;
  source?: TargetCard;
  summary?: string;
  closeLabel?: string;
  locked?: boolean;
  reducedMotion?: boolean;
  onInspect?: (card: T) => void;
}
export function filterTargetCards<T extends TargetCard>(
  cards: readonly T[],
  filter?: (card: T) => boolean,
): readonly T[] {
  return filter ? cards.filter(filter) : cards;
}
export function TargetModal<T extends TargetCard>({
  opened,
  returnFocus = true,
  className,
  fullScreen = false,
  presentation = "dialog",
  title,
  cards,
  filter,
  selectedIds,
  selectionOrder,
  mode = "inspect",
  onCard,
  onClose,
  emptyMessage = "No cards match this target filter.",
  description,
  footer,
  content,
  source,
  summary,
  closeLabel,
  locked = false,
  reducedMotion = false,
  onInspect,
}: TargetModalProps<T>) {
  const results = filterTargetCards(cards, filter);
  const [query, setQuery] = useState("");
  const [grouped, setGrouped] = useState(true);
  useEffect(() => {
    setQuery("");
  }, [opened, title]);
  const visible = results.filter((card) =>
    `${card.label} ${card.detail ?? ""}`
      .toLocaleLowerCase()
      .includes(query.trim().toLocaleLowerCase()),
  );
  const hasStacks = visible.some((card) => card.stackKey);
  const stacked = stackTargetCards(
    grouped ? visible : visible.map((card) => ({ ...card, stackKey: undefined })),
    selectedIds,
  );
  return (
    <Modal
      opened={opened}
      returnFocus={returnFocus}
      fullScreen={fullScreen}
      onClose={onClose}
      title={title}
      centered={presentation !== "tray"}
      withOverlay={presentation !== "tray"}
      trapFocus={presentation !== "tray"}
      closeOnClickOutside={presentation === "dialog"}
      lockScroll={presentation !== "tray"}
      size={
        presentation === "focus" ? "100%" : results.length || content ? "min(1100px, 94vw)" : 440
      }
      closeButtonProps={{ "aria-label": closeLabel ?? "Close cards and targets" }}
      overlayProps={{
        backgroundOpacity: presentation === "focus" ? 0.8 : 0.55,
        color: "#040a10",
        blur: presentation === "focus" ? 3 : 0,
      }}
      transitionProps={{ transition: "fade", duration: reducedMotion ? 0 : 160 }}
      classNames={{
        inner:
          presentation === "tray"
            ? "tcg-target-tray__inner"
            : presentation === "focus"
              ? "tcg-target-focus__inner"
              : undefined,
        content: [
          "tcg-target",
          presentation === "tray" && "tcg-target-tray",
          presentation === "focus" && "tcg-target-focus",
          className,
        ]
          .filter(Boolean)
          .join(" "),
        header: "tcg-target__header",
        title: "tcg-target__title",
        close: "tcg-target__close",
        body: "tcg-target__body",
      }}
    >
      {source && (
        <figure className="tcg-target__source">
          {source.imageUrl && (
            <span className="tcg-target__source-frame">
              <img src={source.imageUrl} alt="" />
            </span>
          )}
          <figcaption>
            <small>Resolving</small>
            <strong>
              <CardReference card={source} />
            </strong>
            {source.detail && <p>{source.detail}</p>}
          </figcaption>
        </figure>
      )}
      <div className="tcg-target__summary">
        <span>
          {summary ?? (
            <>
              {mode === "select" ? "Choose targets" : "Inspect cards"} ·{" "}
              {query.trim() ? `${visible.length} of ${results.length}` : results.length}{" "}
              {results.length === 1 ? "card" : "cards"}
            </>
          )}
        </span>
        {hasStacks && (
          <div className="tcg-target__stack-toggle" role="group" aria-label="Group identical cards">
            <button type="button" aria-pressed={grouped} onClick={() => setGrouped(true)}>
              Grouped
            </button>
            <button type="button" aria-pressed={!grouped} onClick={() => setGrouped(false)}>
              All copies
            </button>
          </div>
        )}
        {description && <p>{description}</p>}
      </div>
      {content ??
        (visible.length ? (
          <div className="tcg-target__groups" style={selectionVariables}>
            {[...new Set(stacked.map((card) => card.group ?? ""))].map((group) => {
              const tiles = stacked.filter((card) => (card.group ?? "") === group);
              const copies = visible.filter((card) => (card.group ?? "") === group).length;
              return (
                <section
                  key={group}
                  aria-label={group || "Candidates"}
                  style={{ flexBasis: Math.min(5, tiles.length) * 176 + 32 }}
                >
                  {group && (
                    <h3>
                      {group}
                      {copies > tiles.length ? ` · ${copies} cards` : ""}
                    </h3>
                  )}
                  <div className="tcg-target__cards">
                    {tiles.map((card) => (
                      <div className="tcg-target__candidate" key={card.id}>
                        <button
                          type="button"
                          className="tcg-target__card"
                          aria-label={`${mode === "select" ? "Select" : "Inspect"} ${card.label}${
                            card.stackCount > 1 ? ` (1 of ${card.stackCount} copies)` : ""
                          }${card.disabledReason ? `. ${card.disabledReason}` : ""}`}
                          aria-pressed={mode === "select" ? card.stackSelected : undefined}
                          aria-disabled={locked || card.enabled === false || undefined}
                          data-selected={card.stackSelected || undefined}
                          onClick={() => {
                            if (!locked && card.enabled !== false) onCard(card);
                          }}
                          style={{ aspectRatio: card.aspectRatio ?? 5 / 7 }}
                        >
                          <TargetArtwork card={card} />
                          {card.stackCount > 1 && (
                            <span className="tcg-target__stack-count" aria-hidden="true">
                              ×{card.stackCount}
                            </span>
                          )}
                          {selectionOrder?.includes(card.id) && (
                            <span
                              className="tcg-target__order"
                              aria-label={`Position ${selectionOrder.indexOf(card.id) + 1}`}
                            >
                              {selectionOrder.indexOf(card.id) + 1}
                            </span>
                          )}
                        </button>
                        <span className="tcg-target__candidate-label" aria-hidden="true">
                          {card.label}
                        </span>
                        {card.enabled === false && (
                          <small className="tcg-target__reason">
                            {card.disabledReason ?? "Unavailable"}
                          </small>
                        )}
                        {onInspect && card.imageUrl && (
                          <button
                            className="tcg-target__inspect"
                            type="button"
                            aria-label={`Inspect details for ${card.label}`}
                            onClick={() => onInspect(card)}
                          >
                            Inspect
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="tcg-target__empty" role="status">
            <span aria-hidden="true">◇</span>
            <p>{query ? "No cards match your search." : emptyMessage}</p>
          </div>
        ))}
      <footer className="tcg-target__footer">
        {footer}
        {results.length > 8 && (
          <input
            className="tcg-target__search"
            aria-label="Find a card"
            placeholder="Find a card…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        )}
        <button type="button" onClick={onClose}>
          {closeLabel ?? (mode === "select" ? "Done" : "Return to board")} <kbd>Esc</kbd>
        </button>
      </footer>
    </Modal>
  );
}
function TargetArtwork({ card }: { card: TargetCard }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [card.imageUrl]);
  return card.imageUrl && !failed ? (
    <img
      src={card.imageUrl}
      alt=""
      draggable={false}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  ) : (
    <span className="tcg-target__fallback">{card.label}</span>
  );
}

/** Compact game prompt. Visibility controls never submit or cancel an engine choice. */
export function PromptBanner({
  title,
  detail,
  source,
  status,
  onRestore,
  restoreDisabled,
  children,
}: {
  title: string;
  detail?: string;
  source?: TargetCard;
  status?: string;
  onRestore: () => void;
  restoreDisabled?: boolean;
  children?: ReactNode;
}) {
  return (
    <section className="tcg-prompt-banner" aria-label="Current game prompt">
      {source?.imageUrl && <img src={source.imageUrl} alt="" />}
      <div className="tcg-prompt-banner__copy">
        {source && (
          <small>
            <CardReference card={source} />
          </small>
        )}
        <strong>{title}</strong>
        {detail && <span>{detail}</span>}
        {status && <span role="status">{status}</span>}
      </div>
      <div className="tcg-prompt-banner__actions">
        {children}
        <button type="button" onClick={onRestore} disabled={restoreDisabled}>
          Show choices
        </button>
      </div>
    </section>
  );
}
