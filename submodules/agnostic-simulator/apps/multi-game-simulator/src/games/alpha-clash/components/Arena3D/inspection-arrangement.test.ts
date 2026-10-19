import { expect, test } from "vite-plus/test";
import { resourceBoard } from "../../resource-step-fixture";
import { createAlphaClashVisualFixture } from "../../visual-fixtures";
import { arrangeHand, canInspectCard, moveHandCard } from "./inspection-arrangement";

function fixture() {
  const engine = createAlphaClashVisualFixture("inspection-arrangement");

  return {
    engine,
    board: resourceBoard(engine),
  };
}

test("local arrangement preserves native state, public pile order, and legal actions", () => {
  const { engine, board } = fixture();
  const before = JSON.stringify(engine.state);
  const actions = engine.getInteractionView("human");
  const hand = board.cards.filter(
    (card) => card.zone === "hand" && card.controller === "player-one",
  );
  const arranged = arrangeHand(board, "player-one", moveHandCard(hand, hand[0].instanceId, 1));
  expect(
    arranged.cards
      .filter((card) => card.zone === "hand" && card.controller === "player-one")
      .map((card) => card.instanceId),
  ).toEqual([
    hand[1].instanceId,
    hand[0].instanceId,
    ...hand.slice(2).map((card) => card.instanceId),
  ]);
  expect(
    arranged.cards.filter((card) => card.zone !== "hand" || card.controller !== "player-one"),
  ).toEqual(board.cards.filter((card) => card.zone !== "hand" || card.controller !== "player-one"));
  expect(JSON.stringify(engine.state)).toBe(before);
  expect(engine.getInteractionView("human")).toEqual(actions);
});

test("hidden opponent cards and unexposed deck faces cannot be inspected", () => {
  const { board } = fixture();
  const hidden = board.cards.filter(
    (card) => card.controller === "player-two" && (card.zone === "hand" || card.faceDown),
  );
  expect(hidden.length).toBeGreaterThan(0);
  expect(hidden.every((card) => !canInspectCard(card, "player-one"))).toBe(true);
  const own = board.cards.find((card) => card.zone === "hand" && card.controller === "player-one")!;
  expect(canInspectCard(own, "player-one")).toBe(true);
  expect(canInspectCard({ ...own, zone: "deck", definitionId: null }, "player-one")).toBe(false);
  expect(canInspectCard({ ...own, zone: "deck" }, "player-one")).toBe(true);
  expect(
    canInspectCard({ ...own, controller: "player-two", definitionId: null }, "player-one"),
  ).toBe(false);
  expect(canInspectCard({ ...own, controller: "player-two" }, "player-one")).toBe(true);
  expect(
    board.cards
      .filter((card) => card.zone === "oblivion")
      .every((card) => canInspectCard(card, "player-one")),
  ).toBe(true);
});

test("boundaries, unknown IDs, duplicate IDs and removed cards cannot corrupt a hand", () => {
  const { board } = fixture();
  const hand = board.cards.filter(
    (card) => card.zone === "hand" && card.controller === "player-one",
  );
  const ids = hand.map((card) => card.instanceId);
  expect(moveHandCard(hand, ids[0], -1)).toEqual(ids);
  expect(moveHandCard(hand, ids.at(-1)!, 1)).toEqual(ids);
  expect(moveHandCard(hand, "not-in-hand", 1)).toEqual(ids);
  const arranged = arrangeHand(board, "player-one", ["removed", ids[1], ids[1]]);
  const result = arranged.cards.filter(
    (card) => card.zone === "hand" && card.controller === "player-one",
  );
  expect(result).toHaveLength(hand.length);
  expect(new Set(result.map((card) => card.instanceId))).toEqual(new Set(ids));
  expect(result[0].instanceId).toBe(ids[1]);
});
