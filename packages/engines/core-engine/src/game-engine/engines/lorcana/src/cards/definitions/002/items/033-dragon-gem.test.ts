/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  docLeaderOfTheSevenDwarfs,
  happyGoodNatured,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import { dragonGem } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items/items";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Dragon Gem", () => {
  describe("**BRING BACK TO LIFE** {E}, 3 {I} − Return a character card with **Support** from your discard to your hand.", () => {
    it("Returns a character with Support", () => {
      const testStore = new TestStore({
        inkwell: 3,
        play: [dragonGem],
        discard: [happyGoodNatured],
      });

      const cardUnderTest = testStore.getByZoneAndId("play", dragonGem.id);
      const target = testStore.getByZoneAndId("discard", happyGoodNatured.id);

      cardUnderTest.activate();
      testStore.resolveTopOfStack({ targets: [target] });

      expect(target.zone).toEqual("hand");
    });

    it("Returns a character without Support", () => {
      const testStore = new TestStore({
        inkwell: 3,
        play: [dragonGem],
        discard: [docLeaderOfTheSevenDwarfs],
      });

      const cardUnderTest = testStore.getByZoneAndId("play", dragonGem.id);
      const target = testStore.getByZoneAndId(
        "discard",
        docLeaderOfTheSevenDwarfs.id,
      );

      cardUnderTest.activate();
      testStore.resolveTopOfStack({ targets: [target] }, true);

      expect(target.zone).toEqual("discard");
    });
  });
});
