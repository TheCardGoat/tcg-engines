/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { agustinMadrigalClumsyDad } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { greatStoneDragon } from "@lorcanito/lorcana-engine/cards/004/items/items";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Great Stone Dragon", () => {
  describe("**ASLEEP** This item enters play exerted.", () => {
    it("should enter play exerted", () => {
      const testStore = new TestStore({
        inkwell: greatStoneDragon.cost,
        hand: [greatStoneDragon],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        greatStoneDragon.id,
      );

      cardUnderTest.playFromHand();

      expect(cardUnderTest.meta.exerted).toEqual(true);
    });
  });
  describe("**AWAKEN** {E}- Put a character card from your discard into your inkwell facedown and exerted.", () => {
    it("Put a character card from your discard into your inkwell facedown and exerted.", () => {
      const testStore = new TestStore({
        inkwell: [],
        play: [greatStoneDragon],
        discard: [agustinMadrigalClumsyDad],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        greatStoneDragon.id,
      );
      const targetCard = testStore.getByZoneAndId(
        "discard",
        agustinMadrigalClumsyDad.id,
      );

      cardUnderTest.activate();
      testStore.resolveTopOfStack({ targets: [targetCard] });

      expect(cardUnderTest.meta.exerted).toEqual(true);
      expect(targetCard.zone).toEqual("inkwell");
    });
  });
});
