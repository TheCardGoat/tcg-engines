/**
 * ChoiceModal: pendingChoice options that live in hand/deck/trash render as a
 * card grid in a modal (board-zone options render as targetable rings on the
 * board instead). Cancel chip when the choice is cancellable.
 */

import * as Dialog from "@radix-ui/react-dialog";

import { cardImageUrl } from "../projection/labels.ts";
import type { ChoiceView } from "../projection/projectSimulator.ts";
import animations from "./animations.module.css";
import classes from "./board.module.css";
import { NarutoCardImage } from "./NarutoCardImage.tsx";

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
  const cancelIfAllowed = (event: Event) => {
    event.preventDefault();
    if (choice.cancellable) onResolve(null);
  };

  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open && choice.cancellable) onResolve(null);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className={`${classes.backdrop} ${animations.fadeIn}`} />
        <Dialog.Content
          aria-modal="true"
          className={classes.dialog}
          data-testid="naruto-choice-modal"
          onEscapeKeyDown={cancelIfAllowed}
          onInteractOutside={cancelIfAllowed}
        >
          <Dialog.Title className={classes.dialogTitle}>Choose a card</Dialog.Title>
          <Dialog.Description className={classes.dialogPrompt}>{choice.prompt}</Dialog.Description>
          <div className={classes.choiceGrid}>
            {choice.modalOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                className={classes.choiceOption}
                data-testid={`naruto-choice-option-${option.key}`}
                onClick={() => onResolve(option.key)}
              >
                <NarutoCardImage
                  src={cardImageUrl(option.cardId)}
                  alt=""
                  draggable={false}
                  fallbackLabel={option.name}
                />
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
