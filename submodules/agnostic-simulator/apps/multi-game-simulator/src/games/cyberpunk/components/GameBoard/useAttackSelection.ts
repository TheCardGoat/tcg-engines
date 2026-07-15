import { useContext } from "react";
import type { Side } from "../../engine";
import { PLAYER_SIDE_TO_ID, useEngineInteractionView, useEngineOptional } from "../../engine";
import {
  interactionViewCanAttackRival,
  interactionViewCanFightTarget,
  interactionViewHasAttackUnitAttacker,
} from "../../engine/interactionViewHelpers";
import {
  AttackSelectionContext,
  type AttackSelectionContextValue,
  type AttackSelectionState,
} from "./attackSelectionContextValue";

export function useAttackSelection(): AttackSelectionContextValue {
  const ctx = useContext(AttackSelectionContext);
  if (!ctx) {
    return {
      selection: null,
      setAttacker: () => undefined,
      clearSelection: () => undefined,
    };
  }
  return ctx;
}

export function useAttackSelectionState(side: Side | undefined, cardId: string | undefined) {
  const attackSelection = useAttackSelection();
  const engine = useEngineOptional();
  const humanSide = engine?.humanSide ?? "player";
  const interactionView = useEngineInteractionView(humanSide);
  const selection = attackSelection.selection;
  const isHumanMainPhase =
    engine?.matchState.G.gamePhase === "main" &&
    engine.activeSide === humanSide &&
    interactionView.status === "ready";
  const cardIsHumanSide = side === humanSide;

  const canStartAttack =
    Boolean(cardId) &&
    isHumanMainPhase &&
    cardIsHumanSide &&
    (interactionViewHasAttackUnitAttacker(interactionView, cardId!) ||
      interactionViewCanAttackRival(interactionView, cardId!));
  const isSelectedAttacker =
    Boolean(cardId) && selection?.side === side && selection?.attackerId === cardId;
  const canSelectFightTarget =
    Boolean(cardId) &&
    isHumanMainPhase &&
    Boolean(selection) &&
    selection!.intent !== "steal" &&
    side !== humanSide &&
    interactionViewCanFightTarget(interactionView, selection!.attackerId, cardId!);

  return {
    canStartAttack,
    isSelectedAttacker,
    canSelectFightTarget,
    selectAttacker: (intent?: AttackSelectionState["intent"]) => {
      if (side && cardId && canStartAttack) {
        attackSelection.setAttacker(side, cardId, intent);
      }
    },
    selectFightTarget: () => {
      if (cardId && canSelectFightTarget && selection && engine) {
        engine.dispatch({
          type: "attackUnit",
          attackerId: selection.attackerId,
          defenderId: cardId,
          as: PLAYER_SIDE_TO_ID[selection.side],
        });
        attackSelection.clearSelection();
      }
    },
  };
}

export function useRivalAttackTargetState(opponent: boolean) {
  const attackSelection = useAttackSelection();
  const engine = useEngineOptional();
  const humanSide = engine?.humanSide ?? "player";
  const interactionView = useEngineInteractionView(humanSide);
  const selection = attackSelection.selection;
  const canSelectRival =
    opponent &&
    engine?.matchState.G.gamePhase === "main" &&
    engine.activeSide === humanSide &&
    interactionView.status === "ready" &&
    Boolean(selection) &&
    selection!.intent !== "fight" &&
    interactionViewCanAttackRival(interactionView, selection!.attackerId);

  return {
    canSelectRival,
    selectRival: () => {
      if (canSelectRival && selection && engine) {
        engine.dispatch({
          type: "attackRival",
          attackerId: selection.attackerId,
          as: PLAYER_SIDE_TO_ID[selection.side],
        });
        attackSelection.clearSelection();
      }
    },
  };
}
