import { describe, expect, it } from "bun:test";
import { clarabelleLightOnHerHooves } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Clarabelle - Light on Her Hooves", () => {
  it("Shift", () => {
    const testStore = new TestStore({
      play: [clarabelleLightOnHerHooves],
    });

    const cardUnderTest = testStore.getCard(clarabelleLightOnHerHooves);
    expect(cardUnderTest.hasShift).toBe(true);
  });

  describe("**KEEP IN STEP** At the end of your turn, if chosen opponent has more cards in their hand than you, you may draw cards until you have the same number.", () => {
    it("Draws cards until you have the same number of cards as the opponent", () => {
      const testStore = new TestStore(
        {
          play: [clarabelleLightOnHerHooves],
          hand: 2,
          deck: 10,
        },
        {
          hand: 6,
          deck: 1,
        },
      );

      testStore.passTurn();
      testStore.resolveOptionalAbility();

      expect(testStore.store.turnCount).toBe(1);
      expect(testStore.getZonesCardCount("player_one").hand).toBe(6);
      expect(testStore.getZonesCardCount("player_two").hand).toBe(6 + 1); // 1 card drawn
    });

    it("You have more cards than the opponent", () => {
      const testStore = new TestStore(
        {
          play: [clarabelleLightOnHerHooves],
          hand: 6,
          deck: 10,
        },
        {
          hand: 2,
          deck: 1,
        },
      );

      testStore.passTurn();

      expect(testStore.store.turnCount).toBe(1);
      expect(testStore.getZonesCardCount("player_one").hand).toBe(6);
      expect(testStore.getZonesCardCount("player_two").hand).toBe(2 + 1); // 1 card drawn
    });
  });

  describe("Regression tests", () => {
    it("Double Clarabelles should let you pass your turn.", async () => {
      const testStore = new TestEngine(
        {
          play: [clarabelleLightOnHerHooves, clarabelleLightOnHerHooves],
          deck: 10,
          hand: 2,
        },
        {
          hand: 6,
          deck: 1,
        },
      );

      expect(testStore.store.turnCount).toBe(0);
      testStore.passTurn();
      expect(testStore.store.turnCount).toBe(0);

      testStore.changeActivePlayer("player_one");
      await testStore.acceptOptionalLayer();
      await testStore.skipTopOfStack();

      // After resolving the ability, the turn should end
      expect(testStore.store.turnCount).toBe(1);
    });
  });
});
