import { useState } from "react";
import type { InteractionInput } from "@tcg/protocol";
import { resolveInteractionText } from "@tcg/simulator-ui";
import { CardReference } from "@tcg/simulator-presentation/card-reference";
import type { TargetCard } from "@tcg/simulator-presentation/target-modal";

type ChoiceInput = Extract<InteractionInput, { kind: "option-selection" | "boolean" }>;

/** Viewer-safe choices only. Search changes the visible list, never the native answer IDs. */
export function ContextualChoiceControl({
  input,
  cards,
  locked,
  onChoose,
}: {
  input: ChoiceInput;
  cards: ReadonlyMap<string, TargetCard>;
  locked: boolean;
  onChoose: (value: boolean | string[]) => void;
}) {
  const [query, setQuery] = useState("");
  if (input.kind === "boolean")
    return (
      <>
        <button type="button" disabled={locked} onClick={() => onChoose(false)}>
          {input.falseText ? resolveInteractionText(input.falseText) : "Decline"}
        </button>
        <button type="button" data-primary disabled={locked} onClick={() => onChoose(true)}>
          {input.trueText ? resolveInteractionText(input.trueText) : "Use effect"}
        </button>
      </>
    );
  const searchable = input.options.length > 6;
  const search = query.trim().toLocaleLowerCase();
  const options = input.options.filter((option) =>
    resolveInteractionText(option.text).toLocaleLowerCase().includes(search),
  );
  return (
    <div className="tcg-choice-options">
      {searchable && (
        <label className="tcg-choice-options__search">
          Search choices
          <input
            type="search"
            aria-label="Search choices"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Type a name…"
            disabled={locked}
          />
          <small role="status">
            {options.length} of {input.options.length} choices
          </small>
        </label>
      )}
      <div
        className="tcg-choice-options__list"
        role="group"
        aria-label={resolveInteractionText(input.text)}
      >
        {options.map((option) => {
          const card = option.entity ? cards.get(option.entity.instanceId) : undefined;
          const disabled = locked || option.enabled === false;
          const reason = option.disabledText
            ? resolveInteractionText(option.disabledText)
            : undefined;
          return (
            <div
              key={option.id}
              className={card ? "tcg-contextual-choice__card-option" : "tcg-choice-options__option"}
            >
              {card && <CardReference card={card} />}
              <button
                type="button"
                disabled={disabled}
                title={reason}
                aria-label={card ? `Choose ${card.label}` : undefined}
                onClick={() => {
                  if (!disabled) onChoose([option.id]);
                }}
              >
                {card ? "Choose" : resolveInteractionText(option.text)}
              </button>
              {reason && <small>{reason}</small>}
            </div>
          );
        })}
        {options.length === 0 && (
          <span role="status">No matching choices. Change your search.</span>
        )}
      </div>
    </div>
  );
}
