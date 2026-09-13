import { Eye, Home, RotateCcw, Trophy } from "lucide-react";
import { useGrandArchiveDialogFocus } from "./dialog-focus";

interface GrandArchiveGameSummaryProps {
  readonly viewerId: string;
  readonly winnerIds: readonly string[];
  readonly participantLabel: (playerId: string) => string;
  readonly onInspectBoard: () => void;
  readonly onMainMenu: () => void;
  readonly onPlayAgain?: () => void;
}

export function GrandArchiveGameSummary({
  viewerId,
  winnerIds,
  participantLabel,
  onInspectBoard,
  onMainMenu,
  onPlayAgain,
}: GrandArchiveGameSummaryProps) {
  const viewerWon = winnerIds.length === 1 && winnerIds[0] === viewerId;
  const result = winnerIds.length !== 1 ? "Draw" : viewerWon ? "Victory" : "Defeat";
  const winnerLabel = winnerIds.length === 1 ? participantLabel(winnerIds[0]!) : "No sole winner";
  const dialogRef = useGrandArchiveDialogFocus<HTMLElement>(true, onInspectBoard);

  return (
    <div className="ga-game-summary-backdrop" role="presentation">
      <section
        ref={dialogRef}
        className="ga-game-summary"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ga-game-summary-title"
        data-result={result.toLowerCase()}
        tabIndex={-1}
      >
        <div className="ga-game-summary-mark" aria-hidden="true">
          <Trophy size={30} strokeWidth={1.5} />
        </div>
        <p>Grand Archive · Final result</p>
        <h1 id="ga-game-summary-title">{result}</h1>
        <div className="ga-game-summary-rule" aria-hidden="true" />
        <dl>
          <div>
            <dt>Winner</dt>
            <dd>{winnerLabel}</dd>
          </div>
          <div>
            <dt>Your seat</dt>
            <dd>{participantLabel(viewerId)}</dd>
          </div>
        </dl>
        <p className="ga-game-summary-note">
          The final board remains available for inspection. Detailed turn and card analytics are not
          yet published by the Grand Archive engine.
        </p>
        <div className="ga-game-summary-actions">
          <button type="button" onClick={onInspectBoard} data-dialog-autofocus>
            <Eye aria-hidden="true" size={17} />
            Inspect board
          </button>
          {onPlayAgain ? (
            <button type="button" onClick={onPlayAgain}>
              <RotateCcw aria-hidden="true" size={17} />
              Play again
            </button>
          ) : null}
          <button type="button" onClick={onMainMenu}>
            <Home aria-hidden="true" size={17} />
            Main menu
          </button>
        </div>
      </section>
    </div>
  );
}
