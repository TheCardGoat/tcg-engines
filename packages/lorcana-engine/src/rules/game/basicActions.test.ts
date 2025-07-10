/**
 * @jest-environment node
 */

import { describe, expect, fit, it, test } from "@jest/globals";
import type { Zones } from "@lorcanito/lorcana-engine/types/types";

const testPlayer = "player_one";

const auroraDreamingGuardian = "swtp8deg13gynhoa5c2wybtw";

it("Shuffles deck", () => {
  // const engine = createRuleEngine(gameMock);
  //
  // const initialDeckOrder = selectPlayerZone(
  //   engine.getState(),
  //   "player_two",
  //   "deck",
  // ).join(",");
  //
  // engine.moves.shuffleDeck("player_two");
  //
  // const deckOrder = selectPlayerZone(
  //   engine.getState(),
  //   "player_two",
  //   "deck",
  // ).join(",");
  //
  // expect(deckOrder).not.toEqual(initialDeckOrder);
});

it("Sets players lore", () => {
  // const engine = createRuleEngine(gameMock);
  //
  // expect(selectPlayerLore(engine.getState(), testPlayer)).toEqual(0);
  //
  // const amount = 10;
  // engine.moves.setPlayerLore(testPlayer, amount);
  //
  // expect(selectPlayerLore(engine.getState(), testPlayer)).toEqual(amount);
});

it("Taps a card", () => {
  // const gameMock = createMockGame({
  //   play: [mickeyMouseTrueFriend],
  // });
  // const engine = createRuleEngine(gameMock);
  //
  // const tableCard = engine.get.zoneCards("play", "player_one")[0];
  //
  // if (!tableCard) {
  //   throw new Error("No table card found");
  // }
  //
  // expect(engine.get.tableCard(tableCard)?.meta?.exerted).toBeFalsy();
  //
  // engine.moves.tapCard(tableCard, { exerted: true });
  //
  // expect(engine.get.tableCard(tableCard)?.meta?.exerted).toBeTruthy();
});

it("Updates Card Damage", () => {
  // const client = createRuleEngine(
  //   createMockGame({ play: [mickeyMouseTrueFriend] }),
  // );
  //
  // const tableCard = client.get.zoneCards("play", "player_one")[0];
  // expect(client.get.tableCard(tableCard)?.meta?.damage).toBeFalsy();
  //
  // client.moves.updateCardDamage(tableCard, 2, "add");
  // expect(client.get.tableCard(tableCard)?.meta?.damage).toEqual(2);
  //
  // client.moves.updateCardDamage(tableCard, 1, "remove");
  // expect(client.get.tableCard(tableCard)?.meta?.damage).toEqual(1);
});

it("Quests", () => {
  //
  // const testStore = new TestStore({
  //   play: [pascalRapunzelCompanion],
  // });
  //
  // const cardUnderTest = testStore.getByZoneAndId(
  //   "play",
  //   pascalRapunzelCompanion.id,
  // );
  //
  // expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(0);
  // cardUnderTest.quest();
  // expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(1);
  //
});

describe("Move card between zones", () => {
  // Create permutation of zones
  // hand, deck, inkwell, discard, play
  test.each([
    { from: "deck", to: "hand" },
    { from: "deck", to: "inkwell" },
    { from: "deck", to: "discard" },
    { from: "deck", to: "play" },
    { from: "hand", to: "deck" },
    { from: "hand", to: "inkwell" },
    { from: "hand", to: "discard" },
    { from: "hand", to: "play" },
    { from: "inkwell", to: "deck" },
    { from: "inkwell", to: "hand" },
    { from: "inkwell", to: "discard" },
    { from: "inkwell", to: "play" },
    { from: "discard", to: "deck" },
    { from: "discard", to: "hand" },
    { from: "discard", to: "inkwell" },
    { from: "discard", to: "play" },
    { from: "play", to: "deck" },
    { from: "play", to: "hand" },
    { from: "play", to: "inkwell" },
    { from: "play", to: "discard" },
  ] as Array<{
    from: Zones;
    to: Zones;
  }>)("moves from: $from to: $to", ({ from, to }) => {
    // const engine = createRuleEngine(
    //   createMockGame({ [from]: [arielOnHumanLegs] }),
    // );
    //
    // const fromCards = engine.get.zoneCards(from, testPlayer);
    // expect(fromCards).toHaveLength(1);
    // expect(engine.get.zoneCards(to, testPlayer)).toHaveLength(0);
    //
    // engine.moves.moveCard(fromCards[0], from, to);
    //
    // expect(engine.get.zoneCards(to, testPlayer)).toHaveLength(1);
    // expect(engine.get.zoneCards(from, testPlayer)).toHaveLength(0);
  });
});
