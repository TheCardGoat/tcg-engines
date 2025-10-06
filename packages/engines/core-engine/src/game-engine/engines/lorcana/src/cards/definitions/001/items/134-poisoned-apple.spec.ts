/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  heiheiBoatSnack,
  jasmineQueenOfAgrabah,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { poisonedApple } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/items";

describe("Poisoned Apple", () => {
  describe("**TAKE A BITE . . . ** 1 {I}, Banish this item − Exert chosen character. If a Princess character is chosen, banish her instead.", () => {
    it("Princess", () => {
      const testStore = new TestStore({
        inkwell: 1,
        play: [poisonedApple, jasmineQueenOfAgrabah],
      });

      const cardUnderTest = testStore.getByZoneAndId("play", poisonedApple.id);
      const target = testStore.getByZoneAndId("play", jasmineQueenOfAgrabah.id);

      cardUnderTest.activate();
      testStore.resolveTopOfStack({ targetId: target.instanceId });

      expect(target.zone).toEqual("discard");
      expect(cardUnderTest.zone).toEqual("discard");
    });

    it("Non-Princess", () => {
      const testStore = new TestStore({
        inkwell: 1,
        play: [poisonedApple, heiheiBoatSnack],
      });

      const cardUnderTest = testStore.getByZoneAndId("play", poisonedApple.id);
      const target = testStore.getByZoneAndId("play", heiheiBoatSnack.id);

      cardUnderTest.activate();
      testStore.resolveTopOfStack({ targetId: target.instanceId });

      expect(target.meta.exerted).toBeTruthy();
      expect(target.zone).toEqual("play");
      expect(cardUnderTest.zone).toEqual("discard");
    });
  });
});
