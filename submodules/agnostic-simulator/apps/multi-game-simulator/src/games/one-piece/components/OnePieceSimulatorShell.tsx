import { useState } from "react";
import { ChevronsRight, ListCollapse, ListTree } from "lucide-react";
import { EventLogPanel } from "@tcg/simulator-ui";
import type { LegalCommandDescriptor } from "@tcg/op-engine/practice-st01";
import type { OnePieceStaticBoard } from "../data/staticBoard.ts";
import { OnePieceTabletopBoard } from "./OnePieceTabletopBoard.tsx";
import classes from "./OnePieceTabletopBoard.module.css";

export interface OnePieceSimulatorShellProps {
  board: OnePieceStaticBoard;
  actions?: readonly LegalCommandDescriptor[];
  onAction?: (action: LegalCommandDescriptor) => void;
}

export function OnePieceSimulatorShell({
  board,
  actions = [],
  onAction,
}: OnePieceSimulatorShellProps) {
  const [logOpen, setLogOpen] = useState(false);

  return (
    <main
      className={classes.shell}
      data-game="one-piece"
      data-theme="light"
      data-testid="one-piece-shell"
    >
      <div className={classes.shellFrame}>
        <section className={classes.boardSlot} aria-label="One Piece simulator play area">
          <OnePieceTabletopBoard board={board} actions={actions} onAction={onAction} />
        </section>
      </div>

      <aside className={classes.floatingLog} data-expanded={logOpen} aria-label="Event log modal">
        <button
          type="button"
          className={classes.floatingLogToggle}
          aria-label={logOpen ? "Collapse event log" : "Expand event log"}
          onClick={() => setLogOpen((value) => !value)}
        >
          {logOpen ? <ListCollapse size={16} /> : <ListTree size={16} />}
          <span>Event log</span>
          <strong>{board.eventLog.length}</strong>
          <ChevronsRight size={14} aria-hidden="true" />
        </button>
        {logOpen && (
          <div className={classes.floatingLogBody}>
            <EventLogPanel entries={board.eventLog} embedded />
          </div>
        )}
      </aside>
    </main>
  );
}
