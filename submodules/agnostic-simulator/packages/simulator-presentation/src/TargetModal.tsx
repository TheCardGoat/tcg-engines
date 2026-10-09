import { Modal } from "@mantine/core";
import { useEffect, useState, type ReactNode } from "react";
import { selectionVariables } from "./card-selection";
import "./target-modal.css";

export interface TargetCard {
  id: string;
  label: string;
  imageUrl?: string;
  detail?: string;
  aspectRatio?: number;
  group?: string;
  enabled?: boolean;
  disabledReason?: string;
}
/** Only pass viewer-safe cards. The caller owns eligibility and selection state. */
export interface TargetModalProps<T extends TargetCard> {
  opened: boolean;
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
  onInspect,
}: TargetModalProps<T>) {
  const results = filterTargetCards(cards, filter);
  const [query, setQuery] = useState("");
  useEffect(() => {
    setQuery("");
  }, [opened, title]);
  const visible = results.filter((card) =>
    `${card.label} ${card.detail ?? ""}`
      .toLocaleLowerCase()
      .includes(query.trim().toLocaleLowerCase()),
  );
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      centered
      size={results.length || content ? "min(1100px, 94vw)" : 440}
      closeButtonProps={{ "aria-label": closeLabel ?? "Close cards and targets" }}
      overlayProps={{ backgroundOpacity: 0.55, color: "#040a10" }}
      transitionProps={{ transition: "fade", duration: 160 }}
      classNames={{
        content: "tcg-target",
        header: "tcg-target__header",
        title: "tcg-target__title",
        close: "tcg-target__close",
        body: "tcg-target__body",
      }}
    >
      {source && (
        <div className="tcg-target__source">
          {source.imageUrl && <img src={source.imageUrl} alt="" />}
          <div>
            <small>Resolving</small>
            <strong>{source.label}</strong>
            {source.detail && <p>{source.detail}</p>}
          </div>
        </div>
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
        {description && <p>{description}</p>}
      </div>
      {results.length > 8 && (
        <input
          className="tcg-target__search"
          aria-label="Find a card"
          placeholder="Find a card…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      )}
      {content ??
        (visible.length ? (
          <div className="tcg-target__groups" style={selectionVariables}>
            {[...new Set(visible.map((card) => card.group ?? ""))].map((group) => (
              <section
                key={group}
                aria-label={group || "Candidates"}
                style={{
                  flexBasis:
                    Math.min(5, visible.filter((card) => (card.group ?? "") === group).length) *
                      176 +
                    32,
                }}
              >
                {group && <h3>{group}</h3>}
                <div className="tcg-target__cards">
                  {visible
                    .filter((card) => (card.group ?? "") === group)
                    .map((card) => (
                      <div className="tcg-target__candidate" key={card.id}>
                        <button
                          type="button"
                          className="tcg-target__card"
                          aria-label={`${mode === "select" ? "Select" : "Inspect"} ${card.label}${card.disabledReason ? `. ${card.disabledReason}` : ""}`}
                          aria-pressed={
                            mode === "select" ? selectedIds?.has(card.id) === true : undefined
                          }
                          aria-disabled={locked || card.enabled === false || undefined}
                          data-selected={selectedIds?.has(card.id) || undefined}
                          onClick={() => {
                            if (!locked && card.enabled !== false) onCard(card);
                          }}
                          style={{ aspectRatio: card.aspectRatio ?? 5 / 7 }}
                        >
                          <TargetArtwork card={card} />
                          {selectionOrder?.includes(card.id) && (
                            <span
                              className="tcg-target__order"
                              aria-label={`Position ${selectionOrder.indexOf(card.id) + 1}`}
                            >
                              {selectionOrder.indexOf(card.id) + 1}
                            </span>
                          )}
                        </button>
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
            ))}
          </div>
        ) : (
          <div className="tcg-target__empty" role="status">
            <span aria-hidden="true">◇</span>
            <p>{query ? "No cards match your search." : emptyMessage}</p>
          </div>
        ))}
      <footer className="tcg-target__footer">
        {footer}
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
        {source && <small>{source.label}</small>}
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
