import { useCallback, useEffect, useMemo, useState } from "react";
import { useCardInspect } from "./CardInspectContext";
import { useMoveSelection } from "./MoveSelectionContext";
import {
  PLAYER_SIDE_TO_ID,
  getGearAttachTargets,
  getProgramSpatialTargets,
  useBoardMode,
  useEngineOptional,
  useInteractionPermission,
  type EngineCardType,
  type Side,
} from "../../engine";

interface HandCommandCard {
  imageUrl: string;
  name: string;
  cardId?: string;
  cardType?: EngineCardType;
}

interface UseHandCommandOptions {
  cards?: ReadonlyArray<HandCommandCard>;
  selectedCardId: string | null;
  setSelectedCardId: (cardId: string | null) => void;
  side?: Side;
}

export function useHandCommand({
  cards,
  selectedCardId,
  setSelectedCardId,
  side,
}: UseHandCommandOptions) {
  const engine = useEngineOptional();
  const boardMode = useBoardMode(side ?? "player");
  const permission = useInteractionPermission(side ?? "player", selectedCardId ?? "");
  const moveSelection = useMoveSelection();
  const { inspect } = useCardInspect();
  const selectedCard = useMemo(
    () => cards?.find((card) => card.cardId === selectedCardId) ?? null,
    [cards, selectedCardId],
  );
  const legalMoveIds = useMemo(
    () => (permission.kind === "armable" ? new Set(permission.actionIds) : new Set<string>()),
    [permission],
  );
  const canPlay = legalMoveIds.has("playCard");
  const canSell = legalMoveIds.has("sellCard");
  const canGoSolo = legalMoveIds.has("goSolo");
  const visible = Boolean(selectedCard && permission.kind === "armable");

  useEffect(() => {
    if (!selectedCardId) {
      return;
    }
    if (!cards?.some((card) => card.cardId === selectedCardId)) {
      setSelectedCardId(null);
    }
  }, [cards, selectedCardId, setSelectedCardId]);

  useEffect(() => {
    if (boardMode !== "select-action") {
      setSelectedCardId(null);
    }
  }, [boardMode, setSelectedCardId]);

  const selectCard = useCallback(
    (cardId: string | undefined) => {
      if (!cardId) {
        return;
      }
      setSelectedCardId(selectedCardId === cardId ? null : cardId);
    },
    [selectedCardId, setSelectedCardId],
  );

  const play = useCallback(() => {
    if (
      !engine ||
      !side ||
      !selectedCard ||
      !selectedCardId ||
      permission.kind !== "armable" ||
      !canPlay
    ) {
      return;
    }
    const legalCtx = { interactionView: engine.interactionViews[side] };
    const attachTargets = getGearAttachTargets(legalCtx, selectedCardId, selectedCard.cardType);
    const programTargets = getProgramSpatialTargets(
      { matchState: engine.matchState, side, interactionView: engine.interactionViews[side] },
      selectedCardId,
    );
    if (attachTargets.length > 0 || programTargets.length > 0) {
      moveSelection.setSelection({
        side,
        moveId: "playCard",
        sourceCardId: selectedCardId,
        sourceCardType: selectedCard.cardType,
      });
      setSelectedCardId(null);
      return;
    }
    const result = engine.dispatch({
      type: "playCard",
      cardId: selectedCardId,
      as: PLAYER_SIDE_TO_ID[side],
    });
    if (result.success) {
      moveSelection.clearSelection();
      setSelectedCardId(null);
    }
  }, [
    canPlay,
    engine,
    moveSelection,
    permission,
    selectedCard,
    selectedCardId,
    setSelectedCardId,
    side,
  ]);

  const sell = useCallback(() => {
    if (!engine || !side || !selectedCardId || !canSell) {
      return;
    }
    const result = engine.dispatch({
      type: "sellCard",
      cardId: selectedCardId,
      as: PLAYER_SIDE_TO_ID[side],
    });
    if (result.success) {
      moveSelection.clearSelection();
      setSelectedCardId(null);
    }
  }, [canSell, engine, moveSelection, selectedCardId, setSelectedCardId, side]);

  const goSolo = useCallback(() => {
    if (!engine || !side || !selectedCardId || !canGoSolo) {
      return;
    }
    const result = engine.dispatch({
      type: "goSolo",
      cardId: selectedCardId,
      as: PLAYER_SIDE_TO_ID[side],
    });
    if (result.success) {
      moveSelection.clearSelection();
      setSelectedCardId(null);
    }
  }, [canGoSolo, engine, moveSelection, selectedCardId, setSelectedCardId, side]);

  const inspectSelected = useCallback(() => {
    if (!selectedCard) {
      return;
    }
    inspect({
      imageUrl: selectedCard.imageUrl,
      name: selectedCard.name,
      zone: "p-hand",
    });
  }, [inspect, selectedCard]);

  return {
    canGoSolo,
    canPlay,
    canSell,
    goSolo,
    inspectSelected,
    play,
    selectCard,
    selectedCard,
    sell,
    visible,
  };
}

export function useSelectedHandCard() {
  return useState<string | null>(null);
}
