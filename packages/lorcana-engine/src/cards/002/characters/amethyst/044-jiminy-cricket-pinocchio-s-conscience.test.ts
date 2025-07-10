/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  jiminyCricketPinocchiosConscience,
  pinocchioOnTheRun,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Jiminy Cricket - Pinocchio's Conscience", () => {
  describe("**THAT STILL, SMALL VOICE** When you play this character, if you have a character named Pinocchio in play, you may draw a card.", () => {
    it("should draw card if pinocchio is on play", () => {
      const testStore = new TestStore({
        inkwell: jiminyCricketPinocchiosConscience.cost,
        play: [pinocchioOnTheRun],
        hand: [jiminyCricketPinocchiosConscience],
        deck: [jiminyCricketPinocchiosConscience],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        jiminyCricketPinocchiosConscience.id,
      );

      expect(
        testStore.getByZoneAndId("play", pinocchioOnTheRun.id),
      ).toBeTruthy();

      cardUnderTest.playFromHand();
      testStore.resolveOptionalAbility();
      testStore.resolveTopOfStack({});
      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({
          hand: 1,
          deck: 0,
          play: 2,
        }),
      );
    });
  });
});
