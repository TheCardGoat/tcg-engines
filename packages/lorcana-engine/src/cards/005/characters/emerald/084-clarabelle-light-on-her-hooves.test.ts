/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { clarabelleLightOnHerHooves } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
});
