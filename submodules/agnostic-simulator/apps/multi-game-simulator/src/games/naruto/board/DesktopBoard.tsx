/**
 * Desktop board tree (>=900px), design doc section 5:
 *   OPP half (hand backs above) | seam | YOU half | your hand fan | right rail
 * Right rail: inspector, log, end-turn.
 */

import { HandBacks, HandFan } from "./HandFan.tsx";
import { SeamPrompt, TurnBanner } from "./SeamPrompt.tsx";
import { SeatHalf } from "./SeatHalf.tsx";
import classes from "./board.module.css";
import type { BoardKit } from "./types.ts";

export interface DesktopBoardProps {
  readonly kit: BoardKit;
}

export function DesktopBoard({ kit }: DesktopBoardProps) {
  const { projection } = kit;
  const activeName = projection.bottom.isActive ? projection.bottom.name : projection.top.name;

  return (
    <div className={classes.boardColumn} data-testid="naruto-desktop-board">
      <TurnBanner turn={projection.turn} activeName={activeName} />
      <div className={classes.battlefieldColumn} data-testid="naruto-battlefield-column">
        <HandBacks count={projection.top.hand.length} owner={projection.top.player} />
        <SeatHalf seat={projection.top} side="top" kit={kit} />
        <SeamPrompt kit={kit} />
        <SeatHalf seat={projection.bottom} side="bottom" kit={kit} />
      </div>
      <div className={classes.handZone} data-testid="naruto-hand-zone">
        <HandFan hand={projection.bottom.hand} owner={projection.bottom.player} kit={kit} />
      </div>
    </div>
  );
}
