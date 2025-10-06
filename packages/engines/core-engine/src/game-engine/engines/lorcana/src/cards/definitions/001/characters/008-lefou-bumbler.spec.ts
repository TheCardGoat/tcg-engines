/**
 * @jest-environment node
 */

import { describe, expect, test } from "@jest/globals";
import {
  gastonArrogantHunter,
  lefouBumbler,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Lefou - Bumbler", () => {
  describe("**LOYAL** If you have a character named Gaston in play, you pay 1 {I} less to play this character.", () => {
    test("Lefou costs 1 {I} if Gaston is in play", () => {
      const testStore = new TestStore({
        inkwell: lefouBumbler.cost - 1,
        hand: [lefouBumbler],
        play: [gastonArrogantHunter],
      });

      const cardUnderTest = testStore.getByZoneAndId("hand", lefouBumbler.id);

      expect(cardUnderTest.cost).toEqual(lefouBumbler.cost - 1);

      cardUnderTest.playFromHand();

      expect(cardUnderTest.zone).toEqual("play");
      expect(testStore.store.tableStore.getTable().inkAvailable()).toEqual(0);
    });

    test("Lefou costs 2 {I} if Gaston is NOT in play", () => {
      const testStore = new TestStore({
        inkwell: lefouBumbler.cost - 1,
        hand: [lefouBumbler],
      });

      const cardUnderTest = testStore.getByZoneAndId("hand", lefouBumbler.id);

      expect(cardUnderTest.cost).toEqual(lefouBumbler.cost);

      cardUnderTest.playFromHand();

      expect(cardUnderTest.zone).toEqual("hand");
    });
  });
});
