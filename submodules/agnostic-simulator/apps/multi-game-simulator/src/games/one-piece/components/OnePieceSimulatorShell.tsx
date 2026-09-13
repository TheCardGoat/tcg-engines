import type {
  LegalCommandDescriptor,
  PotentialCardCommandDescriptor,
} from "@tcg/op-engine/practice-st01";
import { MobilePlayerRail, SimulatorViewportShell } from "@tcg/simulator-ui";
import { useState } from "react";

import { BugReportDialog } from "../../../runtime/BugReportDialog.tsx";
import type { BugReportContext } from "../../../runtime/bugReportApi.ts";
import type { OnePieceStaticBoard } from "../data/staticBoard.ts";
import {
  OnePieceMatchActions,
  OnePieceMobileActivity,
  OnePieceSidebar,
} from "./OnePieceSidebar.tsx";
import { OnePieceTabletopBoard } from "./OnePieceTabletopBoard.tsx";
import { OnePieceCardContextController } from "./OnePieceCardContextController.tsx";
import classes from "./OnePieceTabletopBoard.module.css";

export interface OnePieceSimulatorShellProps {
  board: OnePieceStaticBoard;
  actions?: readonly LegalCommandDescriptor[];
  cardActions?: readonly PotentialCardCommandDescriptor[];
  onAction?: (action: LegalCommandDescriptor) => void;
  onJoKenPoTimeout?: () => void;
  bugReportContext?: BugReportContext;
}

export function OnePieceSimulatorShell({
  board,
  actions = [],
  cardActions = [],
  onAction,
  onJoKenPoTimeout,
  bugReportContext,
}: OnePieceSimulatorShellProps) {
  const [bugReportOpen, setBugReportOpen] = useState(false);
  const player = board.table.seats.find((seat) => seat.id === "player");
  const opponent = board.table.seats.find((seat) => seat.id === "opponent");
  const openBugReport = bugReportContext ? () => setBugReportOpen(true) : undefined;
  const sidebar = (
    <OnePieceSidebar
      board={board}
      actions={actions}
      onAction={onAction}
      onReportBug={openBugReport}
    />
  );

  return (
    <OnePieceCardContextController
      board={board}
      actions={actions}
      cardActions={cardActions}
      onAction={onAction}
    >
      <SimulatorViewportShell
        className={classes.shell}
        data-game="one-piece"
        data-theme="light"
        data-testid="one-piece-shell"
        sidebar={sidebar}
        mobilePanel={<OnePieceMobileActivity board={board} onReportBug={openBugReport} />}
        mobilePanelLabel="One Piece activity"
        mobileTopRail={({ openSidebar }) => (
          <MobilePlayerRail
            side="opponent"
            className={classes.mobileTopRail}
            left={
              <button type="button" onClick={openSidebar} aria-label="Open match activity">
                Activity
              </button>
            }
            center={
              <span>
                Turn {board.table.status.turn} · {board.table.status.phase}
              </span>
            }
            right={
              <div>
                <small>Opponent</small>
                <strong>{opponent?.label ?? "Opponent"}</strong>
              </div>
            }
          />
        )}
        mobileBottomRail={
          <MobilePlayerRail
            side="player"
            className={classes.mobileBottomRail}
            left={
              <div>
                <small>You</small>
                <strong>{player?.label ?? "Player"}</strong>
              </div>
            }
            center={<span>{actions.length ? "Your action" : "Fixture view"}</span>}
            right={<OnePieceMatchActions actions={actions} onAction={onAction} />}
          />
        }
        tabletop={
          <section className={classes.boardSlot} aria-label="One Piece simulator play area">
            <OnePieceTabletopBoard
              board={board}
              actions={actions}
              onAction={onAction}
              onJoKenPoTimeout={onJoKenPoTimeout}
            />
          </section>
        }
      />
      {bugReportContext ? (
        <BugReportDialog
          open={bugReportOpen}
          onOpenChange={setBugReportOpen}
          context={bugReportContext}
          source="one-piece-simulator"
          gameName="One Piece"
        />
      ) : null}
    </OnePieceCardContextController>
  );
}
