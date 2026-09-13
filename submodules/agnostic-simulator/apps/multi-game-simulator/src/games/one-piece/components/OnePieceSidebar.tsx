import type { LegalCommandDescriptor } from "@tcg/op-engine/practice-st01";
import {
  EventLogPanel,
  SimulatorActivityTabs,
  SimulatorMatchActionDock,
  SimulatorMatchSidebar,
  type SimulatorMatchActions,
  type SimulatorMatchActivity,
  type SimulatorMatchParticipant,
} from "@tcg/simulator-ui";
import { useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { SimulatorSelfParticipantActions } from "../../../simulator/participant-actions";
import { SoundVolumeControl } from "../../../simulator/settings";
import type { OnePieceStaticBoard } from "../data/staticBoard.ts";
import classes from "./OnePieceTabletopBoard.module.css";

export interface OnePieceSidebarProps {
  readonly board: OnePieceStaticBoard;
  readonly actions?: readonly LegalCommandDescriptor[];
  readonly onAction?: (action: LegalCommandDescriptor) => void;
  readonly onReportBug?: () => void;
}

export function OnePieceSidebar({
  board,
  actions = [],
  onAction,
  onReportBug,
}: OnePieceSidebarProps) {
  const player = toParticipant(board, "player");
  const opponent = toParticipant(board, "opponent");
  const matchActions = useOnePieceMatchActions(actions, onAction);

  return (
    <>
      <SimulatorMatchSidebar
        className={classes.matchSidebar}
        data-testid="one-piece-sidebar"
        opponent={opponent}
        self={{
          ...player,
          actions: (
            <SimulatorSelfParticipantActions
              gameConfiguration={{
                title: "Configure a new One Piece game?",
                description:
                  "Opening game configuration leaves the current board and returns to setup.",
                confirmLabel: "Open configuration",
                onSelect: () => window.location.assign("/one-piece/simulator"),
              }}
              support={{
                source: "one-piece-participant-menu",
                gameSlug: "one-piece",
                turn: board.table.status.turn,
              }}
            />
          ),
        }}
        activity={onePieceActivity(board, onReportBug)}
        actions={matchActions.actions}
      />
      {matchActions.confirmation}
    </>
  );
}

export function OnePieceMobileActivity({
  board,
  onReportBug,
}: {
  readonly board: OnePieceStaticBoard;
  readonly onReportBug?: () => void;
}) {
  return (
    <div className={classes.mobileActivityPanel}>
      <header>
        <strong>One Piece TCG</strong>
        <span>
          Turn {board.table.status.turn} · {board.table.status.phase}
        </span>
      </header>
      <SimulatorActivityTabs {...onePieceActivity(board, onReportBug)} />
    </div>
  );
}

function onePieceActivity(
  board: OnePieceStaticBoard,
  onReportBug?: () => void,
): SimulatorMatchActivity {
  return {
    log: <EventLogPanel entries={board.eventLog} embedded />,
    logLabel: "Log",
    secondary: (
      <div className={classes.matchSidebarUtilities}>
        <SoundVolumeControl />
        {onReportBug ? (
          <button type="button" onClick={onReportBug}>
            Report a bug from this turn
          </button>
        ) : null}
      </div>
    ),
    secondaryLabel: "More",
  };
}

export function OnePieceMatchActions({
  actions,
  onAction,
}: {
  readonly actions: readonly LegalCommandDescriptor[];
  readonly onAction?: (action: LegalCommandDescriptor) => void;
}) {
  const matchActions = useOnePieceMatchActions(actions, onAction);

  return (
    <>
      <SimulatorMatchActionDock {...matchActions.actions} />
      {matchActions.confirmation}
    </>
  );
}

function useOnePieceMatchActions(
  commands: readonly LegalCommandDescriptor[],
  onAction?: (action: LegalCommandDescriptor) => void,
): { readonly actions: SimulatorMatchActions; readonly confirmation: ReactNode } {
  const [confirmingConcede, setConfirmingConcede] = useState(false);
  const confirmTitleId = useId();
  const passTurn = commands.find((action) => action.type === "endTurn");
  const concede = commands.find((action) => action.type === "concede");
  const actions: SimulatorMatchActions = {
    className: classes.matchActionDock,
    undo: (
      <button type="button" disabled aria-label="No undoable move available">
        Undo
      </button>
    ),
    primary: (
      <button type="button" disabled={!passTurn} onClick={() => passTurn && onAction?.(passTurn)}>
        Pass turn
      </button>
    ),
    danger: (
      <button
        type="button"
        disabled={!concede}
        data-danger="true"
        onClick={() => setConfirmingConcede(true)}
      >
        Concede
      </button>
    ),
  };
  const confirmation =
    confirmingConcede && concede
      ? createPortal(
          <div className={classes.matchActionScrim} role="presentation">
            <section
              className={classes.matchActionConfirm}
              role="dialog"
              aria-modal="true"
              aria-labelledby={confirmTitleId}
            >
              <strong id={confirmTitleId}>Concede match?</strong>
              <p>This ends the match as a loss and cannot be undone.</p>
              <div>
                <button type="button" onClick={() => setConfirmingConcede(false)}>
                  Keep playing
                </button>
                <button
                  type="button"
                  data-danger="true"
                  onClick={() => {
                    setConfirmingConcede(false);
                    onAction?.(concede);
                  }}
                >
                  Concede
                </button>
              </div>
            </section>
          </div>,
          document.body,
        )
      : null;
  return { actions, confirmation };
}

function toParticipant(
  board: OnePieceStaticBoard,
  id: "player" | "opponent",
): SimulatorMatchParticipant {
  const seat = board.table.seats.find((candidate) => candidate.id === id);
  const isSelf = id === "player";
  return {
    id,
    role: isSelf ? "self" : "opponent",
    name: seat?.label ?? (isSelf ? "Player" : "Opponent"),
    shortLabel: isSelf ? "YOU" : "OP",
    active: board.table.status.activeSeatId === id,
    priority: board.table.status.activeSeatId === id,
    status: board.table.status.activeSeatId === id ? "Active" : "Waiting",
    clock: seat?.timerMs === undefined ? "—" : formatTimer(seat.timerMs),
    meta: seat?.role === "agent" ? "Automated rival" : isSelf ? "Local player" : "Rival",
    metrics: (seat?.counters ?? []).slice(0, 4).map((counter, index) => ({
      id: `${counter.label}-${index}`,
      label: counter.label,
      value: counter.value,
    })),
  };
}

function formatTimer(timerMs: number) {
  const totalSeconds = Math.max(0, Math.floor(timerMs / 1000));
  return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, "0")}`;
}
