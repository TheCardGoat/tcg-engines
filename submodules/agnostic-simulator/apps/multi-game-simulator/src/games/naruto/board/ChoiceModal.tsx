/**
 * ChoiceModal: pendingChoice options that live in hand/deck/trash render as a
 * card grid in a modal (board-zone options render as targetable rings on the
 * board instead). Cancel chip when the choice is cancellable.
 */

import { cardImageUrl } from "../projection/labels.ts";
import type { ChoiceView } from "../projection/projectSimulator.ts";
import animations from "./animations.module.css";
import classes from "./board.module.css";

export interface ChoiceModalProps {
  readonly choice: ChoiceView;
  readonly onResolve: (key: string | null) => void;
}

const ZONE_LABELS: Record<string, string> = {
  hand: "Hand",
  deck: "Deck",
  trash: "Trash",
};

export function ChoiceModal({ choice, onResolve }: ChoiceModalProps) {
  return (
    <div className={`${classes.backdrop} ${animations.fadeIn}`} data-testid="naruto-choice-modal">
      <div className={classes.dialog} role="dialog" aria-label={choice.prompt}>
        <h2 className={classes.dialogTitle}>Choose a card</h2>
        <p className={classes.dialogPrompt}>{choice.prompt}</p>
        <div className={classes.choiceGrid}>
          {choice.modalOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              className={classes.choiceOption}
              data-testid={`naruto-choice-option-${option.key}`}
              onClick={() => onResolve(option.key)}
            >
              <img src={cardImageUrl(option.cardId)} alt="" draggable={false} />
              <span>{option.name}</span>
              <span>{ZONE_LABELS[option.zone] ?? option.zone}</span>
            </button>
          ))}
        </div>
        {choice.cancellable ? (
          <div className={classes.dialogActions}>
            <button
              type="button"
              className={classes.cancelChip}
              data-testid="naruto-choice-modal-cancel"
              onClick={() => onResolve(null)}
            >
              Cancel
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
