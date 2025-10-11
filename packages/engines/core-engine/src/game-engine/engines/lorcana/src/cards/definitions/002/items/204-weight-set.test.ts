import { describe, expect, it } from "bun:test";
import {
  cruellaDeVilPerfectlyWretched,
  grandPabbieOldestAndWisest,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { weightSet } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Weight Set", () => {
  describe("**TRAINING** Whenever you play a character with 4 {S} or more, you may pay 1 {I} to draw a card.", () => {
    it("should trigger when playing a character with 4 or more strength", () => {
      const testStore = new TestStore({
        deck: 2,
        inkwell: 1 + cruellaDeVilPerfectlyWretched.cost,
        hand: [cruellaDeVilPerfectlyWretched],
        play: [weightSet],
      });

      const target = testStore.getByZoneAndId(
        "hand",
        cruellaDeVilPerfectlyWretched.id,
      );
      target.playFromHand();

      testStore.resolveOptionalAbility();

      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({
          deck: 1,
          hand: 1,
        }),
      );
    });

    it("should not trigger when playing a character with less than 4 strength", () => {
      const testStore = new TestStore({
        deck: 2,
        inkwell: 1 + grandPabbieOldestAndWisest.cost,
        hand: [grandPabbieOldestAndWisest],
        play: [weightSet],
      });

      const target = testStore.getByZoneAndId(
        "hand",
        grandPabbieOldestAndWisest.id,
      );
      target.playFromHand();

      expect(testStore.stackLayers).toHaveLength(0);
      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({
          deck: 2,
          hand: 0,
        }),
      );
    });
  });
});
