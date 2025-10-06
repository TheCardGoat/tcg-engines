/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { liloMakingAWish } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { scepterOfArendelle } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/items";
import { theGreatIlluminaryRadiantBallroom } from "~/game-engine/engines/lorcana/src/cards/definitions/005/locations/locations";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("The Great Illuminary - Radiant Ballroom", () => {
  describe("**WARM WELCOME** Characters with **Support** get +1 {L} and +2 {W}️ while here.", () => {
    it("should give characters with **Support** +1 {L} and +2 {W}️", () => {
      const testStore = new TestStore({
        inkwell: theGreatIlluminaryRadiantBallroom.moveCost,
        play: [
          theGreatIlluminaryRadiantBallroom,
          liloMakingAWish,
          scepterOfArendelle,
        ],
      });

      const cardUnderTest = testStore.getCard(
        theGreatIlluminaryRadiantBallroom,
      );
      const target = testStore.getCard(liloMakingAWish);
      const item = testStore.getCard(scepterOfArendelle);

      expect(target.willpower).toEqual(liloMakingAWish.willpower);
      expect(target.lore).toEqual(liloMakingAWish.lore);

      target.enterLocation(cardUnderTest);

      expect(target.willpower).toEqual(liloMakingAWish.willpower);
      expect(target.lore).toEqual(liloMakingAWish.lore);

      item.activate();
      testStore.resolveTopOfStack({ targets: [target] });

      expect(target.hasSupport).toEqual(true);
      expect(target.willpower).toEqual(liloMakingAWish.willpower + 2);
      expect(target.lore).toEqual(liloMakingAWish.lore + 1);
      expect(cardUnderTest.willpower).toEqual(
        theGreatIlluminaryRadiantBallroom.willpower,
      );
    });
  });
});
