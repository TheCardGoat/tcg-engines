/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  chipFriendIndeed,
  chipRangerLeader,
  daleFriendInNeed,
} from "@lorcanito/lorcana-engine/cards/006/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Chip - Ranger Leader", () => {
  describe("**THE VALUE OF FRIENDSHIP** While you have a character named Dale in play, this character gains **Support**. _(Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)_", () => {
    it("should have support when Dale is in play", async () => {
      const testEngine = new TestEngine({
        play: [chipRangerLeader, daleFriendInNeed],
      });

      const cardUnderTest = testEngine.getCardModel(chipRangerLeader);

      expect(cardUnderTest.hasSupport).toBe(true);
    });

    it("should not have support when Dale is not in play", async () => {
      const testEngine = new TestEngine({
        play: [chipRangerLeader],
      });

      const cardUnderTest = testEngine.getCardModel(chipRangerLeader);

      expect(cardUnderTest.hasSupport).toBe(false);
    });
  });
});
