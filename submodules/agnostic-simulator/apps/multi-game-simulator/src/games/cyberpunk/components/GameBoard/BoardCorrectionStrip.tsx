import { notifications } from "@mantine/notifications";
import { useEngine, PLAYER_SIDE_TO_ID } from "../../engine";
import classes from "./BoardCorrectionStrip.module.css";

export function BoardCorrectionStrip() {
  const {
    boardCorrectionEnabled,
    boardCorrectionProposalPending,
    boardCorrectionNeedsConsent,
    exitBoardCorrection,
    dispatch,
    matchState,
    humanSide,
  } = useEngine();
  const turnMetadata = matchState.G.turnMetadata;
  const hasPendingResolution = Boolean(
    turnMetadata.currentTrigger || turnMetadata.triggerQueue.length > 0,
  );
  const correctionActive = boardCorrectionEnabled && !boardCorrectionProposalPending;
  const canClear = correctionActive && hasPendingResolution;
  const canResetCombat = correctionActive && matchState.G.attackState !== null;
  const canForcePass =
    correctionActive && matchState.G.gamePhase === "main" && !matchState.G.gameEnded;
  const humanPlayerId = PLAYER_SIDE_TO_ID[humanSide];
  const human = matchState.G.players[humanPlayerId];
  const humanEddies = human?.eddies ?? 0;
  const stuckEffects = matchState.G.effectBag;

  const run = (action: Parameters<typeof dispatch>[0]) => {
    const result = dispatch({
      ...action,
      as: PLAYER_SIDE_TO_ID[humanSide],
    } as Parameters<typeof dispatch>[0]);
    if (!result.success) {
      notifications.show({
        message: "error" in result ? result.error : "Correction failed",
        color: "red",
      });
    }
  };

  if (!boardCorrectionEnabled && !boardCorrectionProposalPending) {
    return null;
  }
  return (
    <div
      className={classes.strip}
      data-testid="board-correction-strip"
      data-pending={boardCorrectionProposalPending ? "true" : "false"}
    >
      <span className={classes.kicker}>Board correction</span>
      <strong>
        {boardCorrectionProposalPending
          ? "Waiting for opponent…"
          : boardCorrectionNeedsConsent
            ? "Both players can edit the board"
            : "You can edit the board"}
      </strong>
      {canClear ? (
        <>
          <button
            type="button"
            className={classes.exit}
            data-testid="board-correction-skip-trigger"
            onClick={(event) => {
              event.stopPropagation();
              run({ type: "manualClearPendingResolution", scope: "current" });
            }}
          >
            Skip effect/trigger
          </button>
          <button
            type="button"
            className={classes.exit}
            data-testid="board-correction-clear-stack"
            onClick={(event) => {
              event.stopPropagation();
              run({ type: "manualClearPendingResolution", scope: "all" });
            }}
          >
            Clear stack
          </button>
        </>
      ) : null}
      {canResetCombat ? (
        <button
          type="button"
          className={classes.exit}
          data-testid="board-correction-reset-combat"
          onClick={(event) => {
            event.stopPropagation();
            run({ type: "manualResetCombat" });
          }}
        >
          Reset combat + stack
        </button>
      ) : null}
      {canForcePass ? (
        <button
          type="button"
          className={classes.exit}
          data-testid="board-correction-force-pass"
          onClick={(event) => {
            event.stopPropagation();
            run({ type: "manualForcePassTurn" });
          }}
        >
          Force pass turn
        </button>
      ) : null}
      {boardCorrectionEnabled ? (
        <details className={classes.tools} data-testid="board-correction-tools">
          <summary className={classes.exit} data-testid="board-correction-tools-toggle">
            Fix…
          </summary>
          <div className={classes.toolsBody}>
            <span className={classes.toolGroup} data-testid="board-correction-eddies">
              Eddies {humanEddies}
              <button
                type="button"
                className={classes.exit}
                data-testid="board-correction-eddies-dec"
                disabled={humanEddies <= 0}
                onClick={(event) => {
                  event.stopPropagation();
                  run({
                    type: "manualSetEddies",
                    playerId: humanPlayerId,
                    amount: humanEddies - 1,
                  });
                }}
              >
                −1
              </button>
              <button
                type="button"
                className={classes.exit}
                data-testid="board-correction-eddies-inc"
                onClick={(event) => {
                  event.stopPropagation();
                  run({
                    type: "manualSetEddies",
                    playerId: humanPlayerId,
                    amount: humanEddies + 1,
                  });
                }}
              >
                +1
              </button>
            </span>
            <button
              type="button"
              className={classes.exit}
              data-testid="board-correction-reset-once-per-turn"
              onClick={(event) => {
                event.stopPropagation();
                run({ type: "manualResetOncePerTurn", playerId: humanPlayerId });
              }}
            >
              Reset 1/turn limits
            </button>
            <button
              type="button"
              className={classes.exit}
              data-testid="board-correction-ready-all"
              onClick={(event) => {
                event.stopPropagation();
                run({ type: "manualReadyAll", playerId: humanPlayerId });
              }}
            >
              Ready all
            </button>
            <button
              type="button"
              className={classes.exit}
              data-testid="board-correction-recompute"
              onClick={(event) => {
                event.stopPropagation();
                run({ type: "manualRecomputeActiveEffects" });
              }}
            >
              Recompute effects
            </button>
            <button
              type="button"
              className={classes.exit}
              data-testid="board-correction-rewind"
              onClick={(event) => {
                event.stopPropagation();
                run({ type: "rewindToTurnStart" });
              }}
            >
              Rewind to turn start
            </button>
            {stuckEffects.length > 0 ? (
              <details className={classes.bagList} data-testid="board-correction-bag">
                <summary>Stuck delayed effects ({stuckEffects.length})</summary>
                <ul>
                  {stuckEffects.map((entry) => (
                    <li key={entry.id}>
                      <span>{entry.abilityText}</span>
                      <button
                        type="button"
                        className={classes.exit}
                        data-testid={`board-correction-drop-bag:${entry.id}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          run({ type: "manualDropEffectBagEntry", entryId: entry.id });
                        }}
                      >
                        Drop
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            ) : null}
          </div>
        </details>
      ) : null}
      {boardCorrectionEnabled ? (
        <button
          type="button"
          className={classes.exit}
          data-testid="board-correction-exit"
          onClick={(event) => {
            event.stopPropagation();
            exitBoardCorrection();
          }}
        >
          Exit
        </button>
      ) : null}
    </div>
  );
}

export interface BoardCorrectionMenuSource {
  boardCorrectionEnabled: boolean;
  boardCorrectionProposalPending: boolean;
  boardCorrectionNeedsConsent: boolean;
  canRequestBoardCorrection: boolean;
  requestBoardCorrection: () => boolean;
  exitBoardCorrection: () => boolean;
}

export function boardCorrectionMenuAction(source: BoardCorrectionMenuSource): {
  id: string;
  label: string;
  disabled?: boolean;
  run: () => void;
} {
  if (source.boardCorrectionEnabled) {
    return {
      id: "exit-board-correction",
      label: "Exit Board State Correction",
      run: () => {
        source.exitBoardCorrection();
      },
    };
  }
  return {
    id: "request-board-correction",
    label: source.boardCorrectionProposalPending
      ? "Waiting for Board State Correction…"
      : source.boardCorrectionNeedsConsent
        ? "Request Board State Correction…"
        : "Enable Board State Correction",
    disabled: source.boardCorrectionProposalPending || !source.canRequestBoardCorrection,
    run: () => {
      source.requestBoardCorrection();
    },
  };
}
