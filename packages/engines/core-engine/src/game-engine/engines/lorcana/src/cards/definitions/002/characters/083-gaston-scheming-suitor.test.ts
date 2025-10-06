/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { gastonSchemingSuitor } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Gaston - Scheming Suitor", () => {
  describe("**YES, I'M INTIMIDATING** While one or more opponents have no cards in their hands, this character gets +3 {S}.", () => {
    it("No Cards in Hand", () => {
      const testStore = new TestStore(
        {
          play: [gastonSchemingSuitor],
        },
        { hand: 0 },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        gastonSchemingSuitor.id,
      );

      expect(cardUnderTest.strength).toEqual(gastonSchemingSuitor.strength + 3);
    });

    it("Cards in Hand", () => {
      const testStore = new TestStore(
        {
          play: [gastonSchemingSuitor],
        },
        { hand: 1 },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        gastonSchemingSuitor.id,
      );

      expect(cardUnderTest.strength).toEqual(gastonSchemingSuitor.strength);
    });
  });
});
