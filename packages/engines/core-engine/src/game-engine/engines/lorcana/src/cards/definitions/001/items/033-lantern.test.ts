import { describe, expect, it } from "bun:test";
import {
  liloMakingAWish,
  peterPanNeverLanding,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { lantern } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Lantern", () => {
  describe("Birthday Lights - You pay 1 {I} less for the next character you play this turn.", () => {
    it("First character gets a discount.", () => {
      const testStore = new TestStore({
        inkwell: 0, // Lilo costs 0 and peter pan costs 3
        hand: [liloMakingAWish],
        play: [lantern],
      });

      const reducedCostChar = testStore.getByZoneAndId(
        "hand",
        liloMakingAWish.id,
      );

      const cardUnderTest = testStore.getByZoneAndId("play", lantern.id);
      cardUnderTest.activate();

      reducedCostChar.playFromHand();

      expect(testStore.store.tableStore.getTable().inkAvailable()).toEqual(0);
      expect(reducedCostChar.zone).toEqual("play");
    });

    it("Second Character doesn't get a discount", () => {
      const testStore = new TestStore({
        inkwell: 3, // Lilo costs 0 and peter pan costs 3
        hand: [peterPanNeverLanding, liloMakingAWish],
        play: [lantern],
      });

      const reducedCostChar = testStore.getByZoneAndId(
        "hand",
        liloMakingAWish.id,
      );
      const normalCost = testStore.getByZoneAndId(
        "hand",
        peterPanNeverLanding.id,
      );

      const cardUnderTest = testStore.getByZoneAndId("play", lantern.id);
      cardUnderTest.activate();

      reducedCostChar.playFromHand();

      expect(testStore.store.tableStore.getTable().inkAvailable()).toEqual(3);
      expect(reducedCostChar.zone).toEqual("play");

      normalCost.playFromHand();

      expect(testStore.store.tableStore.getTable().inkAvailable()).toEqual(0);
      expect(reducedCostChar.zone).toEqual("play");
    });

    it.skip("shift", () => {
      expect(1).toEqual(2);
    });
    it.skip("shift second", () => {
      expect(1).toEqual(2);
    });
  });
});
