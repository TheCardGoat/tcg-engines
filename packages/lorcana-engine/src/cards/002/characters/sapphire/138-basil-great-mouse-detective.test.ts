/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  basilGreatMouseDetective,
  basilOfBakerStreet,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Basil - Great Mouse Detective", () => {
  it("Shift", () => {
    const testStore = new TestStore({
      inkwell: basilGreatMouseDetective.cost,
      play: [basilGreatMouseDetective],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      basilGreatMouseDetective.id,
    );

    expect(cardUnderTest.hasShift).toEqual(true);
  });

  describe("**THERE'S ALWAYS A CHANCE** If you used **Shift** to play this character, you may draw 2 cards when he enters play.", () => {
    it("Not Shift", () => {
      const testStore = new TestStore({
        inkwell: basilGreatMouseDetective.cost,
        hand: [basilGreatMouseDetective],
        play: [basilOfBakerStreet],
        deck: 3,
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        basilGreatMouseDetective.id,
      );

      cardUnderTest.playFromHand();

      expect(testStore.getZonesCardCount().deck).toEqual(3);
      expect(testStore.stackLayers).toHaveLength(0);
    });

    it("Shift", () => {
      const testStore = new TestStore({
        inkwell: basilGreatMouseDetective.cost,
        hand: [basilGreatMouseDetective],
        play: [basilOfBakerStreet],
        deck: 3,
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        basilGreatMouseDetective.id,
      );
      const target = testStore.getByZoneAndId("play", basilOfBakerStreet.id);

      cardUnderTest.shift(target);
      testStore.resolveOptionalAbility();

      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({ deck: 1, hand: 2 }),
      );
    });
  });
});
