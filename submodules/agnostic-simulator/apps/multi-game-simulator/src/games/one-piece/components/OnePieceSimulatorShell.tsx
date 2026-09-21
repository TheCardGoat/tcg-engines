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
  practiceMode?: "bot" | "self";
  controlledSeat?: "south" | "north";
}

export function OnePieceSimulatorShell({
  board,
  actions = [],
  cardActions = [],
  onAction,
  onJoKenPoTimeout,
  bugReportContext,
  practiceMode = "bot",
  controlledSeat = "south",
}: OnePieceSimulatorShellProps) {
  const [bugReportOpen, setBugReportOpen] = useState(false);
  const player = board.table.seats.find((seat) => seat.id === "player");
  const opponent = board.table.seats.find((seat) => seat.id === "opponent");
  const openBugReport = bugReportContext ? () => setBugReportOpen(true) : undefined;
  const controllerLabel = controlledSeat === "south" ? "Player 1" : "Player 2";
  const sidebar = (
    <>
      {practiceMode === "self" ? (
        <p className={classes.practiceControllerStatus} role="status" aria-live="polite">
          Play both sides · controlling {controllerLabel}
        </p>
      ) : null}
      <OnePieceSidebar
        board={board}
        actions={actions}
        onAction={onAction}
        onReportBug={openBugReport}
      />
    </>
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
                <small>{practiceMode === "self" ? "Player 2" : "Opponent"}</small>
                <strong>
                  {opponent?.label ?? (practiceMode === "self" ? "Player 2" : "Opponent")}
                </strong>
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
                <small>{practiceMode === "self" ? "Player 1" : "You"}</small>
                <strong>
                  {player?.label ?? (practiceMode === "self" ? "Player 1" : "Player")}
                </strong>
              </div>
            }
            center={
              <span>
                {practiceMode === "self" && actions.length
                  ? `${controllerLabel}'s action`
                  : actions.length
                    ? "Your action"
                    : "Fixture view"}
              </span>
            }
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
