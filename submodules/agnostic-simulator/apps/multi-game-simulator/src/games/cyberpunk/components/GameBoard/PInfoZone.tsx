import type { ReactNode } from "react";
import { useAttackSelection, useRivalAttackTargetState } from "./useAttackSelection";
import { useDragDrop } from "./DragDropContext";
import { useMoveSelection } from "./MoveSelectionContext";
import { useZoneDroppable } from "./useZoneDroppable";
import { useEngineInteractionView, useEngineOptional } from "../../engine";
import { interactionViewCanAttackRival } from "../../engine/interactionViewHelpers";
import { useGameState } from "./gameStateContext";
import type { Phase } from "./gameStateTypes";
import classes from "./PInfoZone.module.css";

interface PInfoZoneProps {
  opponent?: boolean;
  children?: ReactNode;
  phase?: Phase;
}

export function PInfoZone({ opponent = false, children, phase }: PInfoZoneProps) {
  const drop = useZoneDroppable(opponent ? "opp-pinfo" : "p-pinfo");
  const { activeSource } = useDragDrop();
  const engine = useEngineOptional();
  const humanSide = engine?.humanSide ?? "player";
  const interactionView = useEngineInteractionView(humanSide);
  const attackSelection = useAttackSelection();
  const rivalAttackTarget = useRivalAttackTargetState(opponent);
  const moveSelection = useMoveSelection();
  const dragDirectStealTarget =
    opponent &&
    activeSource?.zone === "p-field" &&
    activeSource.cardId &&
    interactionViewCanAttackRival(interactionView, activeSource.cardId);
  const directStealTarget = dragDirectStealTarget || rivalAttackTarget.canSelectRival;
  const resolvedPhase = phase ?? useGameState().phase;
  const selectRival = () => {
    if (!rivalAttackTarget.canSelectRival) {
      return;
    }
    rivalAttackTarget.selectRival();
    moveSelection.clearSelection();
  };

  return (
    <div
      ref={drop.setNodeRef}
      className={`${classes.zone} ${opponent ? classes.opp : ""} ${children ? classes.withDock : ""} ${
        directStealTarget ? classes.directStealTarget : ""
      } ${drop.isOver ? classes.dropOver : ""}`}
      data-phase={resolvedPhase}
      data-testid="pinfo-zone"
      data-drop-hint={directStealTarget ? "attackRival" : undefined}
      aria-label={directStealTarget ? "Attack the rival" : undefined}
      role={directStealTarget ? "button" : undefined}
      tabIndex={directStealTarget ? 0 : undefined}
      onClick={selectRival}
      onKeyDown={(ev) => {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          selectRival();
        }
      }}
    >
      {children ? <div className={classes.dockTarget}>{children}</div> : children}
      {directStealTarget ? (
        <div className={classes.attackDropCue} aria-hidden="true">
          <span className={classes.dropKicker}>{attackSelection.selection ? "Click" : "Drop"}</span>
          <span className={classes.dropAction}>
            <span>Attack</span>
            <span>Rival</span>
          </span>
        </div>
      ) : null}
    </div>
  );
}
