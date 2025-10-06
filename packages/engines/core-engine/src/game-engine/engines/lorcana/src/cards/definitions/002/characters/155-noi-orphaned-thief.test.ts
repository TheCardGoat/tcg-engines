/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { noiOrphanedThief } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import { pawpsicle } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items/items";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Noi - Orphaned Thief", () => {
  describe("**HIDE AND SEEK** While you have an item in play, this character gains **Resist** +1 and **Ward**. _(Damage dealt to this character is reduced by 1. Opponents can't choose this character except to challenge.)_", () => {
    it("item in play", () => {
      const testStore = new TestStore({
        play: [noiOrphanedThief, pawpsicle],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        noiOrphanedThief.id,
      );

      expect(cardUnderTest.hasResist).toBe(true);
      expect(cardUnderTest.hasWard).toBe(true);
    });

    it("NO item in play", () => {
      const testStore = new TestStore({
        play: [noiOrphanedThief],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        noiOrphanedThief.id,
      );

      expect(cardUnderTest.hasResist).toBe(false);
      expect(cardUnderTest.hasWard).toBe(false);
    });
  });
});
