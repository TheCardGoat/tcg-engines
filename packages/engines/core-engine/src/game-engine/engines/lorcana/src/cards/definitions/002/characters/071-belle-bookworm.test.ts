/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { belleBookworm } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Belle - Bookworm", () => {
  describe("**USE YOUR IMAGINATION** While an opponent has no cards in their hand, this character gets +2 {L}.", () => {
    it("No Cards in Hand", () => {
      const testStore = new TestStore(
        {
          play: [belleBookworm],
        },
        { hand: 0 },
      );

      const cardUnderTest = testStore.getByZoneAndId("play", belleBookworm.id);

      expect(cardUnderTest.lore).toEqual(belleBookworm.lore + 2);
    });

    it("Cards in Hand", () => {
      const testStore = new TestStore(
        {
          play: [belleBookworm],
        },
        { hand: 1 },
      );

      const cardUnderTest = testStore.getByZoneAndId("play", belleBookworm.id);

      expect(cardUnderTest.lore).toEqual(belleBookworm.lore);
    });
  });
});
