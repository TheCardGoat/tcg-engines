/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { simbaReturnedKing } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
