/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { simbaReturnedKing } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Simba - Returned King", () => {
  describe("POUNCE: During your turn, this character gains **Evasive**.", () => {
    it("During your turn.", () => {
      const testStore = new TestStore(
        {
          play: [simbaReturnedKing],
        },
        {
          play: [simbaReturnedKing],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        simbaReturnedKing.id,
      );

      expect(cardUnderTest.hasEvasive).toBeTruthy();
    });

    it("During opponent's turn.", () => {
      const testStore = new TestStore(
        {},
        {
          play: [simbaReturnedKing],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        simbaReturnedKing.id,
        "player_two",
      );

      expect(cardUnderTest.hasEvasive).toBeFalsy();
    });
  });
});
