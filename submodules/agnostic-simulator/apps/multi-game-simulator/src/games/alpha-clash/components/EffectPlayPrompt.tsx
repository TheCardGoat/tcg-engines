import type { InteractionAction } from "@tcg/protocol";
import { resolveInteractionText } from "@tcg/simulator-ui";
import "../../../components/contextual-interaction.css";

/** A native effect offers one action per playable instance, plus an optional
 * decline. Choose the action before opening its ordinary declaration draft. */
export function EffectPlayPrompt({
  actions,
  disabled,
  onChoose,
}: {
  actions: readonly InteractionAction[];
  disabled: boolean;
  onChoose: (action: InteractionAction) => void;
}) {
  if (!actions.length) return null;
  const labels = actions.map((action) => resolveInteractionText(action.text));
  return (
    <section className="tcg-contextual-choice" aria-label="Current game prompt">
      <div className="tcg-contextual-choice__copy">
        <strong>Choose a card to play</strong>
      </div>
      <div className="tcg-contextual-choice__controls">
        {actions.map((action, index) => {
          const label = labels[index];
          const duplicate = labels.filter((entry) => entry === label).length > 1;
          const ordinal = labels.slice(0, index + 1).filter((entry) => entry === label).length;
          return (
            <button
              key={action.id}
              type="button"
              disabled={disabled || !action.enabled}
              title={action.disabledText ? resolveInteractionText(action.disabledText) : undefined}
              onClick={() => onChoose(action)}
            >
              {label}
              {duplicate ? ` (${ordinal})` : ""}
            </button>
          );
        })}
      </div>
    </section>
  );
}
