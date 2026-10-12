import { ContextualChoiceControl } from "./ContextualChoiceControl";
import type { EntitySelectionInput, OptionSelectionInput } from "@tcg/protocol";
import {
  useInteractionDraft,
  resolveInteractionText,
  type useInteractionSurface,
} from "@tcg/simulator-ui";
import { CardReference } from "@tcg/simulator-presentation/card-reference";
import type { TargetCard } from "@tcg/simulator-presentation/target-modal";
import type { SimulatorAudioCueId } from "@tcg/protocol";

/**
 * A destination choice rendered in the shared compact prompt convention: one
 * draft, board selection on the highlighted cards, explicit confirm. No zone
 * mutation until the command is submitted.
 */
export function CardDestinationPrompt({
  input,
  surface,
  cards,
  source,
  onCue,
  selectionCommits = false,
}: {
  input: EntitySelectionInput | OptionSelectionInput;
  surface: ReturnType<typeof useInteractionSurface>;
  cards: ReadonlyMap<string, TargetCard>;
  source?: TargetCard;
  onCue?: (cue: SimulatorAudioCueId) => void;
  /** The owning board submits a single required pick immediately. */
  selectionCommits?: boolean;
}) {
  const draft = useInteractionDraft();
  const destination = input.cardDestination!;
  const label = resolveInteractionText(destination.label);
  const entries =
    input.kind === "entity-selection"
      ? input.candidates.map((c) => ({
          id: c.entity.instanceId,
          text: c.text,
          enabled: c.enabled,
        }))
      : input.options;
  const tokenLabel = (id: string) => {
    const card = cards.get(id);
    if (card) return card.label;
    const entry = entries.find((candidate) => candidate.id === id);
    return entry?.text ? resolveInteractionText(entry.text) : "Card";
  };
  const value = surface.values[input.id];
  const selected = Array.isArray(value) ? value : [];
  const offBoardOptions = input.kind === "option-selection" && !surface.spatial;
  const selectedAlternative =
    input.kind === "option-selection" && selected.length === 1
      ? input.options.find((option) => option.id === selected[0] && !option.entity)
      : undefined;
  const change = (ids: string[]) => {
    draft.change(input.id, ids);
    onCue?.("card.move");
  };
  const status = surface.locked
    ? "Waiting for the game. Input is paused."
    : surface.rejected
      ? "The choice was not accepted. Review your selection and retry."
      : undefined;
  return (
    <section
      className="tcg-contextual-choice"
      aria-label="Current game prompt"
      data-kind="destination"
    >
      <div className="tcg-contextual-choice__copy">
        {source && (
          <small>
            <CardReference card={source} />
          </small>
        )}
        <strong>{surface.title}</strong>
        <span>
          {destination.staysInZone
            ? "Reveal only. The card stays in its current zone."
            : `Destination: ${label}`}
        </span>
        <span>
          {offBoardOptions
            ? "Choose a card or option below, then confirm."
            : selectionCommits
              ? "Click a highlighted card to continue."
              : "Select a highlighted card on the board."}
        </span>
        {selected.length > 0 && (
          <span>{selected.map(tokenLabel).join(", ")} selected. Not yet applied.</span>
        )}
        {status && <span role="status">{status}</span>}
      </div>
      <div className="tcg-contextual-choice__controls">
        {!selectionCommits && (
          <button disabled={surface.locked || selected.length === 0} onClick={() => change([])}>
            Cancel selection
          </button>
        )}
        {offBoardOptions && input.kind === "option-selection" && (
          <ContextualChoiceControl
            input={input}
            cards={cards}
            locked={surface.locked}
            onChoose={(value) => {
              if (Array.isArray(value)) change(value);
            }}
          />
        )}
        {!offBoardOptions &&
          input.kind === "option-selection" &&
          input.options
            .filter((o) => !o.entity)
            .map((option) => (
              <button
                key={option.id}
                disabled={surface.locked || option.enabled === false}
                onClick={() => change([option.id])}
              >
                {resolveInteractionText(option.text)}
              </button>
            ))}
        {(!selectionCommits || surface.rejected) && (
          <button data-primary disabled={!surface.canConfirm} onClick={surface.confirm}>
            {selectedAlternative
              ? `Confirm: ${resolveInteractionText(selectedAlternative.text)}`
              : selected.length
                ? resolveInteractionText(destination.confirmText)
                : "Confirm choice"}
          </button>
        )}
        {surface.canRetry && <button onClick={surface.retry}>Retry choice</button>}
        {surface.canCancel && <button onClick={surface.cancel}>Cancel action</button>}
      </div>
    </section>
  );
}
