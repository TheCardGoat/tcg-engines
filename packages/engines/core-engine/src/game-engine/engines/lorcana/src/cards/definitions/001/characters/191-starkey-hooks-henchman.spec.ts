/**
 * @jest-environment node
 */

import { describe, expect, test } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  captainColonelsLieutenant,
  johnSilverAlienPirate,
  starkeyHooksHenchman,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";

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
