/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { dingleHopper } from "@lorcanito/lorcana-engine/cards/001/items/items";
import { forbiddenMountainMaleficentsCastle } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
import { youreWelcome } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("You're Welcome", () => {
  describe("Shuffle chosen character, item, or location into their player's deck. That player draws 2 cards.", () => {
    it("Shuffling your own", () => {
      const testStore = new TestStore(
        {
          inkwell: youreWelcome.cost,
          hand: [youreWelcome],
          play: [forbiddenMountainMaleficentsCastle],
          deck: 4,
        },
        {
          deck: 3,
        },
      );

      const cardUnderTest = testStore.getCard(youreWelcome);
      const target = testStore.getCard(forbiddenMountainMaleficentsCastle);

      cardUnderTest.playFromHand();
      testStore.resolveTopOfStack({ targets: [target] });

      expect(target.zone).toBe("deck");
      expect(testStore.getZonesCardCount("player_one").deck).toBe(3);
      expect(testStore.getZonesCardCount("player_one").hand).toBe(2);

      expect(testStore.getZonesCardCount("player_two").hand).toBe(0);
      expect(testStore.getZonesCardCount("player_two").deck).toBe(3);
    });

    it("Shuffling opponent's cards", () => {
      const testStore = new TestStore(
        {
          inkwell: youreWelcome.cost,
          hand: [youreWelcome],
          deck: 4,
        },
        {
          play: [dingleHopper],
          deck: 3,
        },
      );

      const cardUnderTest = testStore.getCard(youreWelcome);
      const target = testStore.getCard(dingleHopper);

      cardUnderTest.playFromHand();
      testStore.resolveTopOfStack({ targets: [target] });

      expect(target.zone).toBe("deck");
      expect(testStore.getZonesCardCount("player_two").hand).toBe(2);
      expect(testStore.getZonesCardCount("player_two").deck).toBe(2);

      expect(testStore.getZonesCardCount("player_one").deck).toBe(4);
      expect(testStore.getZonesCardCount("player_one").hand).toBe(0);
    });
  });
});
