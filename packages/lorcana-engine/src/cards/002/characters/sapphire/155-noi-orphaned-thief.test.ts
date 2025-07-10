/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { noiOrphanedThief } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
