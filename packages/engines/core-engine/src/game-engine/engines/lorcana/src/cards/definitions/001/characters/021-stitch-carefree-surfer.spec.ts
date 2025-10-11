/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import {
  mauiDemiGod,
  princePhillipDragonSlayer,
  stichtCarefreeSurfer,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Stitch - Carefree Surfer", () => {
  describe("**OHANA** When you play this character, if you have 2 or more other characters in play, you may draw 2 cards.", () => {
    it("should draw 2 cards if you have 2 or more other characters in play", () => {
      const testStore = new TestStore({
        deck: 4,
        inkwell: stichtCarefreeSurfer.cost,
        hand: [stichtCarefreeSurfer],
        play: [princePhillipDragonSlayer, mauiDemiGod],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        stichtCarefreeSurfer.id,
      );

      cardUnderTest.playFromHand();

      expect(testStore.getZonesCardCount("player_one")).toEqual(
        expect.objectContaining({ deck: 2, hand: 2, play: 3 }),
      );
    });

    it("should not draw 2 cards if you have less than 2 other characters in play", () => {
      const testStore = new TestStore({
        deck: 4,
        inkwell: stichtCarefreeSurfer.cost,
        hand: [stichtCarefreeSurfer],
        play: [princePhillipDragonSlayer],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        stichtCarefreeSurfer.id,
      );

      cardUnderTest.playFromHand();

      expect(testStore.getZonesCardCount("player_one")).toEqual(
        expect.objectContaining({ deck: 4, hand: 0, play: 2 }),
      );
    });
  });
});
