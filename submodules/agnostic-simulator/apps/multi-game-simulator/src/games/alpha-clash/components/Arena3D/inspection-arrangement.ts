import { arrangeCardSlots, moveCardInLocalOrder } from "../../../../components/local-card-order";
import type { AcSeat, LiveBoardCard, LiveBoardState } from "../board-types";

export function canInspectCard(card: LiveBoardCard, viewer: AcSeat) {
  return !!card.definitionId && (!card.faceDown || card.controller === viewer);
}

/** Replace only local hand slots. Never sort the projection or any public pile. */
export function arrangeHand(
  board: LiveBoardState,
  viewer: AcSeat,
  order: readonly string[],
): LiveBoardState {
  return {
    ...board,
    cards: arrangeCardSlots(
      board.cards,
      (card) => card.zone === "hand" && card.controller === viewer,
      (card) => card.instanceId,
      order,
    ),
  };
}

export function moveHandCard(
  hand: readonly LiveBoardCard[],
  id: string,
  direction: -1 | 1,
): string[] {
  return moveCardInLocalOrder(
    hand.map((card) => card.instanceId),
    id,
    direction,
  );
}
