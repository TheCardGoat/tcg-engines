import { describe, expect, it } from "bun:test";
import { zeroToHero } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import {
  arthurTrainedSwordsman,
  cheshireCatAlwaysGrinning,
  feliciaAlwaysHungry,
  flynnRiderConfidentVagabond,
  littleJohnLoyalFriend,
  rabbitReluctantHost,
  ratiganCriminalMastermind,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import {
  fangCrossbow,
  pawpsicle,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/items";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Zero To Hero", () => {
  describe("Count the number of characters you have in play. You pay that amount of {I} less for the next character you play this turn.", () => {
    it("One character in play", () => {
      const testStore = new TestStore({
        inkwell: zeroToHero.cost,
        hand: [zeroToHero, feliciaAlwaysHungry],
        play: [pawpsicle, arthurTrainedSwordsman],
      });

      const cardUnderTest = testStore.getByZoneAndId("hand", zeroToHero.id);
      const target = testStore.getByZoneAndId("hand", feliciaAlwaysHungry.id);

      cardUnderTest.playFromHand();
      target.playFromHand();

      expect(target.zone).toEqual("play");
    });

    it("Five character in play", () => {
      const testStore = new TestStore({
        inkwell: zeroToHero.cost,
        hand: [zeroToHero, rabbitReluctantHost],
        play: [
          pawpsicle,
          fangCrossbow,
          arthurTrainedSwordsman,
          cheshireCatAlwaysGrinning,
          flynnRiderConfidentVagabond,
          littleJohnLoyalFriend,
          ratiganCriminalMastermind,
        ],
      });

      const cardUnderTest = testStore.getByZoneAndId("hand", zeroToHero.id);
      const target = testStore.getByZoneAndId("hand", rabbitReluctantHost.id);

      cardUnderTest.playFromHand();
      target.playFromHand();

      expect(target.zone).toEqual("play");
    });
  });
});
