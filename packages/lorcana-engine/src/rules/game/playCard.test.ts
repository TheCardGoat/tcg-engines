/**
 * @jest-environment node
 */

import { expect, it } from "@jest/globals";

it("Can play a card costing exact the amount of ink you have in inkwell", () => {
  // const inkwell = [moanaOfMotunui, moanaOfMotunui, moanaOfMotunui];
  // const engine = createRuleEngine(
  //   createMockGame({
  //     inkwell,
  //     hand: [mickeyMouseTrueFriend],
  //   }),
  // );
  //
  // expect(engine.get.zoneCards("inkwell", testPlayer)).toHaveLength(
  //   inkwell.length,
  // );
  //
  // const cardInHand = engine.get.zoneCards("hand", testPlayer)[0];
  // engine.moves.playCardFromHand(cardInHand);
  //
  // const cardUnderTest = engine.get.tableCard(cardInHand);
  //
  // expect(engine.get.zoneCards("play", testPlayer)).toContain(cardInHand);
  // expect(cardUnderTest?.meta?.playedThisTurn).toBe(true);
  // expect(cardUnderTest?.meta?.exerted).toBeFalsy();
  //
  // const cardCost = mickeyMouseTrueFriend.cost;
  //
  // expect(
  //   engine.get
  //     .zoneTableCards("inkwell", testPlayer)
  //     .filter((card) => card?.meta?.exerted),
  // ).toHaveLength(cardCost);
  // expect(
  //   engine.get
  //     .zoneTableCards("inkwell", testPlayer)
  //     .filter((card) => !card?.meta?.exerted),
  // ).toHaveLength(inkwell.length - cardCost);
});

it("Can play a card costing less the amount of ink you have in inkwell", () => {
  // const inkwell = [
  //   moanaOfMotunui,
  //   moanaOfMotunui,
  //   moanaOfMotunui,
  //   moanaOfMotunui,
  // ];
  // const engine = createRuleEngine(
  //   createMockGame({
  //     inkwell,
  //     hand: [mickeyMouseTrueFriend],
  //   }),
  // );
  //
  // expect(engine.get.zoneCards("inkwell", testPlayer)).toHaveLength(
  //   inkwell.length,
  // );
  //
  // const cardInHand = engine.get.zoneCards("hand", testPlayer)[0];
  // engine.moves.playCardFromHand(cardInHand);
  //
  // const cardUnderTest = engine.get.tableCard(cardInHand);
  //
  // expect(engine.get.zoneCards("play", testPlayer)).toContain(cardInHand);
  // expect(cardUnderTest?.meta?.playedThisTurn).toBe(true);
  // expect(cardUnderTest?.meta?.exerted).toBeFalsy();
  //
  // const cost = mickeyMouseTrueFriend.cost || 0;
  // expect(
  //   engine.get
  //     .zoneTableCards("inkwell", testPlayer)
  //     .filter((card) => card?.meta?.exerted),
  // ).toHaveLength(cost);
  // expect(
  //   engine.get
  //     .zoneTableCards("inkwell", testPlayer)
  //     .filter((card) => !card?.meta?.exerted),
  // ).toHaveLength(inkwell.length - cost);
});

it("When you play a card, it has fresh ink", () => {
  // const inkwell = [
  //   moanaOfMotunui,
  //   moanaOfMotunui,
  //   moanaOfMotunui,
  //   moanaOfMotunui,
  // ];
  // const engine = createRuleEngine(
  //   createMockGame({
  //     inkwell,
  //     hand: [mickeyMouseTrueFriend],
  //   }),
  // );
  //
  // const cardInHand = engine.get.zoneCards("hand", testPlayer)[0];
  // engine.moves.playCardFromHand(cardInHand);
  //
  // const cardUnderTest = engine.get.tableCard(cardInHand);
  // expect(engine.get.zoneCards("play", testPlayer)).toContain(cardInHand);
  // expect(cardUnderTest?.meta?.playedThisTurn).toBe(true);
  // expect(cardUnderTest?.meta?.exerted).toBeFalsy();
  // expect(cardUnderTest?.meta?.playedThisTurn).toBeTruthy();
});
