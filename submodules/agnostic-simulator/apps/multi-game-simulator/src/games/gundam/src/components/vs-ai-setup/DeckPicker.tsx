import { cn } from "../../lib/utils.ts";
import { SAMPLE_DECKS, SAMPLE_DECK_IDS, type SampleDeckId } from "../../data/sample-decks/index.ts";

/**
 * Summarise a deck in a tiny chip row — total card count + a rough
 * card-type breakdown. Pulled from the decklist itself (no catalog
 * lookup) so this stays cheap to render for every deck in the grid.
 */
function deckTotals(deckId: SampleDeckId): { readonly main: number; readonly resource: number } {
  const list = SAMPLE_DECKS[deckId];
  const main = list.cards.reduce((sum, entry) => sum + entry.count, 0);
  return { main, resource: list.resource.count };
}

export interface DeckPickerProps {
  readonly label: string;
  readonly selected: SampleDeckId;
  readonly onSelect: (id: SampleDeckId) => void;
  /** Ids to visually mark as the opponent's pick (dimmed, not
   * disabled — same deck vs self is allowed in Gundam TCG). Purely
   * cosmetic. */
  readonly opponentId?: SampleDeckId;
  readonly idPrefix: string;
}

export function DeckPicker({ label, selected, onSelect, opponentId, idPrefix }: DeckPickerProps) {
  return (
    <fieldset className="min-w-0">
      <legend className="gd-mono text-hud-xs font-bold text-hud-info mb-2 tracking-hud-label uppercase">
        {label}
      </legend>
      <div role="radiogroup" aria-label={label} className="grid gap-2 grid-cols-1 sm:grid-cols-3">
        {SAMPLE_DECK_IDS.map((id) => {
          const deck = SAMPLE_DECKS[id];
          const isSelected = id === selected;
          const isOpponent = id === opponentId;
          const totals = deckTotals(id);
          const inputId = `${idPrefix}-${id}`;
          return (
            <label
              key={id}
              htmlFor={inputId}
              className={cn(
                "relative flex flex-col gap-1 cursor-pointer pt-2.5 pr-3 pb-2.5 pl-3 clip-hud-6",
                "bg-[linear-gradient(180deg,rgba(255,255,255,.85),rgba(248,250,254,.95))]",
                "border transition-[border-color,box-shadow,filter] duration-150",
                isSelected
                  ? "border-hud-accent-hot shadow-[0_0_16px_rgba(45,107,255,.35)]"
                  : "border-hud-border hover:border-hud-border-hot",
                isOpponent && !isSelected && "opacity-60",
              )}
            >
              <input
                type="radio"
                id={inputId}
                name={idPrefix}
                value={id}
                checked={isSelected}
                onChange={() => onSelect(id)}
                className="sr-only"
              />
              <div className="flex items-start justify-between gap-2">
                <span
                  className={cn(
                    "gd-display font-extrabold tracking-hud-body text-hud-md leading-tight",
                    isSelected ? "text-hud-accent-hot" : "text-hud-text",
                  )}
                >
                  {deck.name}
                </span>
                {isOpponent && (
                  <span
                    className="gd-mono text-hud-2xs font-bold tracking-hud-label uppercase text-hud-danger/80 flex-shrink-0"
                    aria-hidden="true"
                  >
                    OPP
                  </span>
                )}
              </div>
              {deck.description && (
                <span className="text-hud-xs text-hud-text-muted leading-snug">
                  {deck.description}
                </span>
              )}
              <div className="mt-1 flex gap-2 flex-wrap">
                <Chip>{totals.main}-MAIN</Chip>
                <Chip>{totals.resource}-RES</Chip>
              </div>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function Chip({ children }: { readonly children: React.ReactNode }) {
  return (
    <span className="gd-mono text-hud-2xs font-bold tracking-hud-label uppercase text-hud-text-faint border border-hud-border/60 px-1.5 py-0.5 clip-hud-4">
      {children}
    </span>
  );
}
