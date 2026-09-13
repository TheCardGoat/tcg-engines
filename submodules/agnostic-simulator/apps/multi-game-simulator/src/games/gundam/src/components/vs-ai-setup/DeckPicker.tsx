import { SAMPLE_DECKS, SAMPLE_DECK_IDS, type SampleDeckId } from "../../data/sample-decks/index.ts";

function deckTotals(deckId: SampleDeckId): { readonly main: number; readonly resource: number } {
  const list = SAMPLE_DECKS[deckId];
  const main = list.cards.reduce((sum, entry) => sum + entry.count, 0);
  return { main, resource: list.resource.count };
}

const DECK_GROUPS = [
  {
    label: "Featured decks",
    ids: SAMPLE_DECK_IDS.filter((id) => !id.startsWith("topdecks-") && !id.startsWith("coverage-")),
  },
  {
    label: "Tournament decks",
    ids: SAMPLE_DECK_IDS.filter((id) => id.startsWith("topdecks-")),
  },
  {
    label: "Card coverage fixtures",
    ids: SAMPLE_DECK_IDS.filter((id) => id.startsWith("coverage-")),
  },
] as const;

export interface DeckPickerProps {
  readonly label: string;
  readonly selected: SampleDeckId;
  readonly onSelect: (id: SampleDeckId) => void;
  readonly opponentId?: SampleDeckId;
  readonly idPrefix: string;
}

export function DeckPicker({ label, selected, onSelect, opponentId, idPrefix }: DeckPickerProps) {
  const deck = SAMPLE_DECKS[selected];
  const totals = deckTotals(selected);
  const isMirrorMatch = selected === opponentId;
  const descriptionId = `${idPrefix}-description`;

  const handleChange = (value: string) => {
    const deckId = SAMPLE_DECK_IDS.find((id) => id === value);
    if (deckId) onSelect(deckId);
  };

  return (
    <div className="min-w-0">
      <label htmlFor={idPrefix} className="mb-2 block text-sm font-bold text-hud-text">
        {label}
      </label>
      <div className="relative">
        <select
          id={idPrefix}
          name={idPrefix}
          value={selected}
          onChange={(event) => handleChange(event.currentTarget.value)}
          aria-describedby={descriptionId}
          className="h-11 w-full appearance-none clip-hud-6 border border-hud-border bg-hud-surface py-2 pl-3 pr-10 text-sm font-bold text-hud-text shadow-sm transition hover:border-hud-border-hot focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hud-info"
        >
          {DECK_GROUPS.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.ids.map((id) => (
                <option key={id} value={id}>
                  {SAMPLE_DECKS[id].name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-hud-accent-hot"
        >
          <path d="m5 7.5 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.75" />
        </svg>
      </div>

      <div
        id={descriptionId}
        className="mt-2 min-h-20 clip-hud-6 bg-hud-surface/70 px-3 py-2.5 ring-1 ring-inset ring-hud-border/70"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="gd-display text-sm font-extrabold text-hud-text">{deck.name}</span>
          <Chip>{totals.main} main</Chip>
          <Chip>{totals.resource} resource</Chip>
          {isMirrorMatch ? (
            <span className="text-[10px] font-bold uppercase tracking-hud-label text-hud-danger">
              Mirror match
            </span>
          ) : null}
        </div>
        {deck.description ? (
          <p className="mt-1 text-xs leading-5 text-hud-text-muted">{deck.description}</p>
        ) : null}
      </div>
    </div>
  );
}

function Chip({ children }: { readonly children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-hud-bg px-2 py-0.5 text-[10px] font-bold uppercase tracking-hud-label text-hud-text-muted ring-1 ring-inset ring-hud-border/70">
      {children}
    </span>
  );
}
