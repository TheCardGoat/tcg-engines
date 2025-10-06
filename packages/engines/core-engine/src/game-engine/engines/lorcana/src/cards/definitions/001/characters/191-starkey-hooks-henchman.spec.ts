/**
 * @jest-environment node
 */

import { describe, expect, test } from "@jest/globals";
import {
  captainColonelsLieutenant,
  johnSilverAlienPirate,
  starkeyHooksHenchman,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Starkey - Hook's Henchman", () => {
  describe("**AYE AYE, CAPTAIN** While you have a Captain character in play, this character gets +1 {L}.", () => {
    test("No Captain in play", () => {
      const testStore = new TestStore({
        play: [starkeyHooksHenchman],
      });
      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        starkeyHooksHenchman.id,
      );

      expect(cardUnderTest.lore).toEqual(starkeyHooksHenchman.lore);
    });

    test("With Captain in play", () => {
      const testStore = new TestStore({
        play: [starkeyHooksHenchman, johnSilverAlienPirate],
      });
      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        starkeyHooksHenchman.id,
      );

      expect(cardUnderTest.lore).toEqual(starkeyHooksHenchman.lore + 1);
    });

    test("With Captain in play", () => {
      const testStore = new TestStore({
        play: [starkeyHooksHenchman, captainColonelsLieutenant],
      });
      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        starkeyHooksHenchman.id,
      );

      expect(cardUnderTest.lore).toEqual(starkeyHooksHenchman.lore + 1);
    });
  });
});
