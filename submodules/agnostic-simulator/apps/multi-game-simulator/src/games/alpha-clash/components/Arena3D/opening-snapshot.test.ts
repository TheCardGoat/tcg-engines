import { expect, test } from "vite-plus/test";
import { createAlphaClashVisualFixture } from "../../visual-fixtures";
import { captureOpeningHand, openingPresentationBoard } from "./opening-snapshot";

// Presentation-boundary checks; these do not replace native browser acceptance.
test("opening snapshots contain only one projected hand and never cross viewer boundaries", () => {
  const engine = createAlphaClashVisualFixture("opening-preview");
  const board = engine.getViewerState({ role: "player", actorId: "human" });
  const hand = board.cards.filter(
    (card) => card.controller === "player-one" && card.zone === "hand",
  );
  const ids = hand.map((card) => card.instanceId);
  const snapshot = captureOpeningHand(hand, ids);
  expect(snapshot?.cards).toEqual(hand);
  expect(snapshot?.cards[0]).not.toBe(hand[0]);
  expect(captureOpeningHand(board.cards, ids)).toBeUndefined();
  expect(captureOpeningHand(hand, [...ids, ids[0]])).toBeUndefined();
  expect(captureOpeningHand(hand, ids.slice(1))).toBeUndefined();
  expect(openingPresentationBoard(board, "player-two", "return", snapshot)).toBe(board);
  expect(openingPresentationBoard(board, "player-one", "redraw", snapshot)).toBe(board);
  expect(openingPresentationBoard(board, "player-one", "hand", snapshot)).toBe(board);
  const rendered = openingPresentationBoard(board, "player-one", "return", snapshot);
  expect(rendered).not.toBe(board);
  expect(
    rendered.cards.filter((card) => card.controller === "player-one" && card.zone === "hand"),
  ).toEqual(hand);
  expect(board).toEqual(engine.getViewerState({ role: "player", actorId: "human" }));
});
