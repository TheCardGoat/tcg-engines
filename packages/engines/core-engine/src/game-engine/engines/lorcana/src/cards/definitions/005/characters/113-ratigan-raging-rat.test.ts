/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { ratiganRagingRat } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Ratigan - Raging Rat", () => {
  describe("**NOTHING CAN STAND IN MY WAY** While this character has damage, he gets +2 {S}.", () => {
    it("should get +2 {S} while having damage", () => {
      const testStore = new TestStore({
        play: [ratiganRagingRat],
      });

      const cardUnderTest = testStore.getCard(ratiganRagingRat);

      expect(cardUnderTest.strength).toBe(ratiganRagingRat.strength);

      cardUnderTest.updateCardDamage(1, "add");

      expect(cardUnderTest.strength).toBe(ratiganRagingRat.strength + 2);

      cardUnderTest.updateCardDamage(1, "remove");

      expect(cardUnderTest.strength).toBe(ratiganRagingRat.strength);
    });
  });
});
