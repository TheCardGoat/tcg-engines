import { defOf } from "@tcg/cyberpunk-engine";
import {
  getGearAttachTargets,
  getProgramSpatialTargets,
  PLAYER_SIDE_TO_ID,
  useEngine,
  useEngineInteractionView,
  type Side,
} from "../../engine";
import {
  interactionViewCanAttackRival,
  interactionViewCanFightTarget,
} from "../../engine/interactionViewHelpers";
import { useAttackSelection } from "../GameBoard/useAttackSelection";
import { useMoveSelection } from "../GameBoard/MoveSelectionContext";
import { usePaymentSelection } from "../PaymentSelection/PaymentSelectionContext";
import { setChoiceModalOpen } from "./choiceModalState";

/** A local, unsubmitted choice shared by the board prompt and its target list. */
export function useLocalTargetSelection(side: Side) {
  const { matchState, dispatch, activeSide } = useEngine();
  const interactionView = useEngineInteractionView(side);
  const attackSelection = useAttackSelection();
  const moveSelection = useMoveSelection();
  const { dispatchCostedAction } = usePaymentSelection();
  const attack = attackSelection.selection?.side === side ? attackSelection.selection : null;
  const play =
    moveSelection.selection?.side === side && moveSelection.selection.moveId === "playCard"
      ? moveSelection.selection
      : null;
  const sourceCardId = attack?.attackerId ?? play?.sourceCardId;
  const source = sourceCardId ? matchState.G.cardIndex[sourceCardId] : undefined;
  const definition = source ? defOf(source) : null;
  const kind = attack
    ? "attack"
    : definition?.type === "gear"
      ? "gear"
      : definition?.type === "program"
        ? "program"
        : null;
  if (
    !sourceCardId ||
    !definition ||
    !kind ||
    (attack !== null && (activeSide !== side || matchState.G.gamePhase !== "main")) ||
    interactionView.status !== "ready"
  )
    return null;
  const targetIds = attack
    ? Object.keys(matchState.G.cardIndex).filter(
        (id) =>
          attack.intent !== "steal" &&
          interactionViewCanFightTarget(interactionView, sourceCardId, id),
      )
    : kind === "gear"
      ? getGearAttachTargets({ interactionView }, sourceCardId, "gear")
      : getProgramSpatialTargets({ matchState, side, interactionView }, sourceCardId);
  const canTargetRival = Boolean(
    attack &&
    attack.intent !== "fight" &&
    interactionViewCanAttackRival(interactionView, sourceCardId),
  );
  const requestId = [
    "local-target",
    side,
    kind,
    sourceCardId,
    attack?.intent ?? "",
    ...targetIds,
    canTargetRival,
  ].join(":");
  const clear = () => {
    setChoiceModalOpen(side, requestId, false);
    attackSelection.clearSelection();
    moveSelection.clearSelection();
  };
  const as = PLAYER_SIDE_TO_ID[side];
  const selectCard = (targetId: string) => {
    if (!targetIds.includes(targetId)) return;
    switch (kind) {
      case "attack": {
        const result = dispatch({
          type: "attackUnit",
          attackerId: sourceCardId,
          defenderId: targetId,
          as,
        });
        if (result.success) clear();
        return;
      }
      case "gear":
        dispatchCostedAction({ type: "playCard", cardId: sourceCardId, attachToId: targetId, as });
        clear();
        return;
      case "program":
        // Payment may defer play; resolve its target only after successful play.
        dispatchCostedAction({ type: "playCard", cardId: sourceCardId, as }, (result) => {
          if (result.success) dispatch({ type: "resolveEffectTarget", targetIds: [targetId], as });
        });
        clear();
        return;
      default: {
        const exhaustive: never = kind;
        return exhaustive;
      }
    }
  };
  const selectRival = () => {
    if (!canTargetRival) return;
    const result = dispatch({ type: "attackRival", attackerId: sourceCardId, as });
    if (result.success) clear();
  };
  return {
    kind,
    sourceCardId,
    sourceName: definition.displayName ?? definition.name,
    targetIds,
    canTargetRival,
    requestId,
    selectCard,
    selectRival,
    cancel: clear,
  };
}
