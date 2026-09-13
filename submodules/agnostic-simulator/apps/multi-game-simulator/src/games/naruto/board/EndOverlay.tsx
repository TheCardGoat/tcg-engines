import * as Dialog from "@radix-ui/react-dialog";

/**
 * Game-end overlay: winner announcement + optional new-game action.
 */

import type { PlayerId } from "@tcg-engines/naruto-engine";

import animations from "./animations.module.css";
import classes from "./board.module.css";

export interface EndOverlayProps {
  readonly winner: PlayerId;
  readonly winnerName: string;
  readonly isViewer: boolean;
  readonly onNewGame?: (() => void) | undefined;
}

export function EndOverlay({ winner, winnerName, isViewer, onNewGame }: EndOverlayProps) {
  const preventDismissal = (event: Event) => event.preventDefault();
  return (
    <Dialog.Root open>
      <Dialog.Portal>
        <Dialog.Overlay className={`${classes.backdrop} ${animations.fadeIn}`} />
        <Dialog.Content
          aria-modal="true"
          className={`${classes.dialog} ${classes.endCard}`}
          data-testid="naruto-end-overlay"
          onEscapeKeyDown={preventDismissal}
          onInteractOutside={preventDismissal}
        >
          <Dialog.Title className={classes.endTitle}>
            {isViewer ? "Victory" : "Defeat"}
          </Dialog.Title>
          <Dialog.Description className={classes.endSubtitle}>
            {winnerName} ({winner}) wins the game.
          </Dialog.Description>
          {onNewGame ? (
            <div className={classes.dialogActions} style={{ justifyContent: "center" }}>
              <button
                type="button"
                className={classes.endTurnButton}
                data-testid="naruto-new-game"
                onClick={onNewGame}
              >
                New game
              </button>
            </div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
