/**
 * Desktop board tree (>=900px), design doc section 5:
 *   OPP half (hand backs above) | seam | YOU half | your hand fan | right rail
 * Right rail: inspector, log, end-turn.
 */

import { useState } from "react";

import { HandBacks, HandFan } from "./HandFan.tsx";
import { Inspector } from "./Inspector.tsx";
import { LogPanel } from "./LogPanel.tsx";
import { SeamPrompt, TurnBanner } from "./SeamPrompt.tsx";
import { SeatHalf } from "./SeatHalf.tsx";
import classes from "./board.module.css";
import type { BoardKit } from "./types.ts";

export interface DesktopBoardProps {
  readonly kit: BoardKit;
  readonly state: import("@tcg-engines/naruto-engine").GameState;
}

export function DesktopBoard({ kit, state }: DesktopBoardProps) {
  const { projection } = kit;
  const [inspected, setInspected] = useState<{
    uid: string | null;
    zone: import("./types.ts").EntityZoneKind | null;
    owner: import("@tcg-engines/naruto-engine").PlayerId | null;
  }>({ uid: null, zone: null, owner: null });

  // Selection drives the inspector when nothing is hovered.
  const inspectedUid = inspected.uid ?? kit.selection?.uid ?? null;
  const inspectedZone = inspected.uid ? inspected.zone : (kit.selection?.kind ?? null);
  const inspectedOwner = inspected.uid ? inspected.owner : kit.selection ? projection.viewer : null;

  const railKit: BoardKit = {
    ...kit,
    onInspect: (uid, zone, owner) => setInspected({ uid, zone, owner }),
  };

  const endTurnPill = projection.seamPills.find((pill) => pill.id === "end-turn");

  return (
    <div className={classes.boardArea} data-testid="naruto-desktop-board">
      <div className={classes.boardColumn}>
        <TurnBanner turn={projection.turn} activeName={state.players[state.activePlayer].name} />
        <HandBacks count={projection.top.hand.length} owner={projection.top.player} />
        <SeatHalf seat={projection.top} side="top" kit={railKit} />
        <SeamPrompt kit={railKit} />
        <SeatHalf seat={projection.bottom} side="bottom" kit={railKit} />
        <div className={classes.handZone} data-testid="naruto-hand-zone">
          <HandFan hand={projection.bottom.hand} owner={projection.bottom.player} kit={railKit} />
        </div>
      </div>
      <aside className={classes.rail} data-testid="naruto-rail">
        <Inspector state={state} uid={inspectedUid} zone={inspectedZone} owner={inspectedOwner} />
        <section className={classes.railSection} style={{ flex: 1 }}>
          <h3 className={classes.railTitle}>Log</h3>
          <LogPanel lines={projection.logLines} />
        </section>
        {kit.interactive && endTurnPill ? (
          <button
            type="button"
            className={classes.endTurnButton}
            data-testid="naruto-end-turn-rail"
            disabled={!endTurnPill.enabled}
            title={endTurnPill.reason ?? undefined}
            onClick={() => railKit.onPill(endTurnPill)}
          >
            End turn
          </button>
        ) : null}
      </aside>
    </div>
  );
}
