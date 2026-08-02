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
  return (
    <div className={`${classes.backdrop} ${animations.fadeIn}`} data-testid="naruto-end-overlay">
      <div className={`${classes.dialog} ${classes.endCard}`} role="dialog" aria-label="Game over">
        <h2 className={classes.endTitle}>{isViewer ? "Victory" : "Defeat"}</h2>
        <p className={classes.endSubtitle}>
          {winnerName} ({winner}) wins the game.
        </p>
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
      </div>
    </div>
  );
}
