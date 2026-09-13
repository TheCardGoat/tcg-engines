import type { OrderingInput } from "@tcg/protocol";
import { resolveInteractionText } from "@tcg/simulator-ui";
import { CircleHelp, ListChecks, Undo2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import type { FabCardArtResolver } from "./cardArt";
import { useFabCardArt, useFabCardLocale } from "./FabPresentationCatalog";
import { FabCardArtLadderImage } from "./useFabCardArtFallback";

interface FabPitchStackOrderingPanelProps {
  readonly input: OrderingInput;
  readonly disabled?: boolean;
  /** Resolves a candidate instance to its presentation identity (chosen printing included). */
  readonly identityForCard?: (
    instanceId: string,
    label: string,
  ) => {
    canonicalId?: string;
    printingId?: string;
  };
  readonly pitchValueForCard?: (instanceId: string) => number | undefined;
  /** Player-facing order: the first id is the first pitched card drawn later. */
  readonly onComplete: (drawOrder: readonly string[]) => void;
}

interface PitchStackEntry {
  readonly id: string;
  readonly label: string;
  readonly imageUrl?: string;
  /** Shard-default board art retried once when the chosen printing's URL 404s. */
  readonly defaultImageUrl?: string;
  readonly pitchValue?: number;
}

function pitchEntry(
  input: OrderingInput,
  index: number,
  locale: string,
  resolver: FabCardArtResolver,
  identityForCard?: (
    instanceId: string,
    label: string,
  ) => {
    canonicalId?: string;
    printingId?: string;
  },
  pitchValueForCard?: (instanceId: string) => number | undefined,
): PitchStackEntry {
  const candidate = input.candidates[index]!;
  const label = resolveInteractionText(candidate.text ?? { key: candidate.entity.instanceId });
  const identity = identityForCard?.(candidate.entity.instanceId, label);
  return {
    id: candidate.entity.instanceId,
    label,
    pitchValue: pitchValueForCard?.(candidate.entity.instanceId),
    ...((): { imageUrl?: string; defaultImageUrl?: string } => {
      const art = resolver.resolveFabCardArt({
        locale,
        canonicalId: identity?.canonicalId ?? candidate.entity.definitionId,
        printingId: identity?.printingId,
        name: label,
      });
      return art.boardImageUrl ? { imageUrl: art.boardImageUrl } : {};
    })(),
  };
}

function ordinal(position: number): string {
  if (position === 1) return "first";
  if (position === 2) return "second";
  if (position === 3) return "third";
  return `${position}th`;
}

export function FabPitchStackOrderingPanel({
  input,
  disabled = false,
  identityForCard,
  pitchValueForCard,
  onComplete,
}: FabPitchStackOrderingPanelProps) {
  const locale = useFabCardLocale();
  const resolver = useFabCardArt();
  const entries = useMemo(
    () =>
      input.candidates.map((_, index) =>
        pitchEntry(input, index, locale, resolver, identityForCard, pitchValueForCard),
      ),
    [identityForCard, input, pitchValueForCard, locale, resolver],
  );
  const [drawOrder, setDrawOrder] = useState<readonly string[]>([]);
  const [helpOpen, setHelpOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const submittedRef = useRef(false);

  useEffect(() => {
    setDrawOrder([]);
    setAnnouncement("");
    submittedRef.current = false;
  }, [input.id]);

  const chosenEntries = drawOrder.flatMap((id) => {
    const entry = entries.find((candidate) => candidate.id === id);
    return entry ? [entry] : [];
  });
  const availableEntries = entries.filter((entry) => !drawOrder.includes(entry.id));
  const nextPosition = drawOrder.length + 1;

  const choose = (entry: PitchStackEntry) => {
    if (disabled || submittedRef.current || drawOrder.includes(entry.id)) return;
    const nextOrder = [...drawOrder, entry.id];
    const remaining = entries.filter((candidate) => !nextOrder.includes(candidate.id));
    if (remaining.length === 1) {
      const completedOrder = [...nextOrder, remaining[0]!.id];
      submittedRef.current = true;
      setDrawOrder(completedOrder);
      setAnnouncement(
        `${entry.label} added as the ${ordinal(nextOrder.length)} pitched card drawn. ${remaining[0]!.label} placed last automatically.`,
      );
      onComplete(completedOrder);
      return;
    }
    setDrawOrder(nextOrder);
    setAnnouncement(`${entry.label} will be the ${ordinal(nextOrder.length)} pitched card drawn.`);
  };

  const undo = (entry: PitchStackEntry) => {
    if (disabled || submittedRef.current) return;
    setDrawOrder((current) => current.filter((id) => id !== entry.id));
    setAnnouncement(`${entry.label} returned to the available pitched cards.`);
  };

  const autoSort = () => {
    if (disabled || submittedRef.current) return;
    // Decision candidates are listed deepest-first for the engine. The board
    // presents the opposite, player-facing draw order.
    const automaticDrawOrder = entries.map((entry) => entry.id).reverse();
    submittedRef.current = true;
    setDrawOrder(automaticDrawOrder);
    setAnnouncement("Pitch stack sorted in the order the cards were pitched.");
    onComplete(automaticDrawOrder);
  };

  return (
    <section
      className="fab-pitch-order-panel"
      data-testid="fab-pitch-order-panel"
      aria-labelledby="fab-pitch-order-heading"
      aria-describedby="fab-pitch-order-instructions"
    >
      <header className="fab-pitch-order-heading">
        <span id="fab-pitch-order-heading">Pitch stack</span>
        <span className="fab-pitch-order-heading-actions">
          <span>{entries.length} cards</span>
          <button
            type="button"
            className="fab-pitch-order-help"
            aria-label="Explain pitch-stack draw order"
            aria-expanded={helpOpen}
            aria-controls="fab-pitch-order-help-text"
            onClick={() => setHelpOpen((current) => !current)}
          >
            <CircleHelp size={13} strokeWidth={2} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="fab-pitch-order-auto-sort"
            data-testid="fab-pitch-order-auto-sort"
            disabled={disabled}
            aria-label="Auto-sort pitch stack in pitched order"
            title="Keep cards in the order they were pitched"
            onClick={autoSort}
          >
            <ListChecks aria-hidden="true" size={13} />
            Auto-sort
          </button>
        </span>
        {helpOpen ? (
          <span id="fab-pitch-order-help-text" className="fab-pitch-order-help-text">
            First picked draws first. The final card is placed automatically.
          </span>
        ) : null}
      </header>

      <div
        className="fab-pitch-order-body"
        style={{
          gridTemplateColumns: `minmax(0, ${Math.max(availableEntries.length, 1)}fr) minmax(2.75rem, ${Math.max(chosenEntries.length, 0.45)}fr)`,
        }}
      >
        <div className="fab-pitch-order-available">
          <ul aria-label="Available pitched cards">
            {availableEntries.map((entry) => (
              <li key={entry.id}>
                <button
                  type="button"
                  className="fab-pitch-order-card fab-pitch-order-card--available"
                  disabled={disabled}
                  aria-label={`Choose ${entry.label} as the ${ordinal(nextPosition)} pitched card drawn`}
                  onClick={() => choose(entry)}
                >
                  {entry.pitchValue ? (
                    <span
                      className="fab-pitch-order-color-strip"
                      data-pitch-value={entry.pitchValue}
                      aria-hidden="true"
                    />
                  ) : null}
                  <span className="fab-pitch-order-art" aria-hidden="true">
                    {entry.imageUrl ? (
                      <FabCardArtLadderImage
                        src={entry.imageUrl}
                        defaultSrc={entry.defaultImageUrl}
                        variant="no-text"
                      />
                    ) : null}
                    {!entry.imageUrl ? <span>{entry.label.slice(0, 2)}</span> : null}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="fab-pitch-order-chosen">
          {chosenEntries.length > 0 ? (
            <ol aria-label="Chosen pitch-stack draw order">
              {chosenEntries.map((entry, index) => (
                <li
                  key={entry.id}
                  style={
                    {
                      "--fab-pitch-order-index": index,
                      zIndex: chosenEntries.length - index,
                    } as CSSProperties
                  }
                >
                  <button
                    type="button"
                    className="fab-pitch-order-card fab-pitch-order-card--chosen"
                    disabled={disabled}
                    aria-label={`Remove ${entry.label} from position ${index + 1} in the pitch-stack draw order`}
                    onClick={() => undo(entry)}
                  >
                    {entry.pitchValue ? (
                      <span
                        className="fab-pitch-order-color-strip"
                        data-pitch-value={entry.pitchValue}
                        aria-hidden="true"
                      />
                    ) : null}
                    <span className="fab-pitch-order-art" aria-hidden="true">
                      {entry.imageUrl ? (
                        <FabCardArtLadderImage
                          src={entry.imageUrl}
                          defaultSrc={entry.defaultImageUrl}
                          variant="no-text"
                        />
                      ) : null}
                      {!entry.imageUrl ? <span>{entry.label.slice(0, 2)}</span> : null}
                    </span>
                    {index === 0 ? <span className="fab-pitch-order-first">Draw first</span> : null}
                    <span className="fab-pitch-order-undo" aria-hidden="true">
                      <Undo2 size={13} />
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      </div>

      <span id="fab-pitch-order-instructions" className="sr-only">
        Choose cards in future draw order, or auto-sort them in pitched order. The final card is
        placed automatically.
      </span>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </section>
  );
}
