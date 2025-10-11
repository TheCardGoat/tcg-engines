import { describe, expect, it } from "bun:test";
import { goofyKnightForADay } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { fangRiverCity } from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Fang - River City", () => {
  describe("**SURROUNDED BY WATER** Characters gain **Ward** and **Evasive** while here. _(Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)_", () => {
    it("Characters gain **Ward** and **Evasive** while here.", () => {
      const testStore = new TestStore({
        inkwell: fangRiverCity.moveCost,
        play: [fangRiverCity, goofyKnightForADay],
      });

      const cardUnderTest = testStore.getCard(fangRiverCity);
      const targetCard = testStore.getCard(goofyKnightForADay);

      expect(targetCard.hasWard()).toBe(false);

      targetCard.enterLocation(cardUnderTest);

      expect(targetCard.hasWard()).toBe(true);
    });

    it("Characters gain **Evasive** while here.", () => {
      const testStore = new TestStore({
        inkwell: fangRiverCity.moveCost,
        play: [fangRiverCity, goofyKnightForADay],
      });

      const cardUnderTest = testStore.getCard(fangRiverCity);
      const targetCard = testStore.getCard(goofyKnightForADay);

      expect(targetCard.hasEvasive).toBe(false);

      targetCard.enterLocation(cardUnderTest);

      expect(targetCard.hasEvasive).toBe(true);
    });
  });
});
