/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  heiheiBoatSnack,
  mauiDemiGod,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { mauisFishHook } from "@lorcanito/lorcana-engine/cards/003/items/items";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Maui's Fish Hook", () => {
  it("**IT'S MAUI TIME!** If you have a character named Maui in play, you may use this item's Shapeshift ability for free.", () => {
    const testStore = new TestStore({
      play: [mauiDemiGod, mauisFishHook, heiheiBoatSnack],
    });

    const cardUnderTest = testStore.getCard(mauisFishHook);

    cardUnderTest.activate();
    expect(cardUnderTest.ready).toBe(false);
    expect(testStore.stackLayers).toHaveLength(1);
  });

  describe("**SHAPESHIFT** {E}, 2 {I} – Choose one:· Chosen character gains **Evasive** until the start of your next turn. _(Only characters with Evasive can challenge them.)_· Chosen character gets +3 {S} this turn.", () => {
    it("Mode one", () => {
      const testStore = new TestStore({
        inkwell: 2,
        play: [mauisFishHook, heiheiBoatSnack],
      });

      const cardUnderTest = testStore.getCard(mauisFishHook);
      const target = testStore.getCard(heiheiBoatSnack);

      cardUnderTest.activate();
      expect(cardUnderTest.ready).toBe(false);

      testStore.resolveTopOfStack({ mode: "1" }, true);

      expect(target.hasEvasive).toBe(false);
      testStore.resolveTopOfStack({ targets: [target] });
      expect(target.hasEvasive).toBe(true);
    });

    it("Mode two", () => {
      const testStore = new TestStore({
        inkwell: 2,
        play: [mauisFishHook, heiheiBoatSnack],
      });

      const cardUnderTest = testStore.getCard(mauisFishHook);
      const target = testStore.getCard(heiheiBoatSnack);

      cardUnderTest.activate();
      testStore.resolveTopOfStack({ mode: "2" }, true);

      expect(cardUnderTest.ready).toBe(false);

      expect(target.strength).toBe(heiheiBoatSnack.strength);
      testStore.resolveTopOfStack({ targets: [target] });
      expect(target.strength).toBe(heiheiBoatSnack.strength + 3);
    });
  });
});
