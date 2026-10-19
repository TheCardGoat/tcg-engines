import type { LiveBoardCard, LiveBoardState, AcSeat } from "../board-types";

/** Presentation memory only; callers supply the viewer's projected hand before commit. */
export interface OpeningHandSnapshot {
  readonly seat: AcSeat;
  readonly cards: readonly LiveBoardCard[];
}

export function captureOpeningHand(
  cards: readonly LiveBoardCard[],
  handIds: readonly string[],
): OpeningHandSnapshot | undefined {
  const seat = cards[0]?.controller;
  if (seat !== "player-one" && seat !== "player-two") return undefined;
  if (
    cards.length !== handIds.length ||
    new Set(handIds).size !== handIds.length ||
    cards.some((card) => card.controller !== seat || card.zone !== "hand") ||
    handIds.some((id) => !cards.some((card) => card.instanceId === id))
  )
    return undefined;
  return { seat, cards: structuredClone(cards) };
}

export function openingPresentationBoard<T extends Pick<LiveBoardState, "cards">>(
  board: T,
  viewer: AcSeat,
  beatId: string | undefined,
  snapshot: OpeningHandSnapshot | undefined,
): T {
  if (!snapshot || snapshot.seat !== viewer || (beatId !== "return" && beatId !== "reshuffle"))
    return board;
  const oldIds = new Set(snapshot.cards.map((card) => card.instanceId));
  return {
    ...board,
    cards: [
      ...board.cards.filter(
        (card) =>
          !oldIds.has(card.instanceId) && !(card.controller === viewer && card.zone === "hand"),
      ),
      ...snapshot.cards,
    ],
  };
}
