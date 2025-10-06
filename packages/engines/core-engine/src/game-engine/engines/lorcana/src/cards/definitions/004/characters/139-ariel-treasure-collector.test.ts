/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  arielTreasureCollector,
  peteRottenGuy,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import { fortisphere } from "~/game-engine/engines/lorcana/src/cards/definitions/004/items/items";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Ariel - Treasure Collector", () => {
  describe("** THE GIRLS WHO HAS EVERYTHING** While you have more items in play than each opponent, this character gets +2 {L}.", () => {
    it("should give +2 {L} when you have more items in play than each opponent", () => {
      const testStore = new TestStore(
        {
          play: [arielTreasureCollector, fortisphere],
        },
        {
          play: [peteRottenGuy],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        arielTreasureCollector.id,
      );
      expect(cardUnderTest.lore).toBe(arielTreasureCollector.lore + 2);
    });
  });
});
