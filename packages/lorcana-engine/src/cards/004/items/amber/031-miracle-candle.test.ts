/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { cinderellaBallroomSensation } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { mrSmeeBumblingMate } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { neverLandMermaidLagoon } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
import { miracleCandle } from "@lorcanito/lorcana-engine/cards/004/items/items";
import { daisyDuckDonaldsDate } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Miracle Candle", () => {
  it("**ABUELA'S GIFT** Banish this item − If you have 3 or more characters in play, gain 2 lore and remove up to 2 damage from chosen location.", async () => {
    const testEngine = new TestEngine({
      inkwell: miracleCandle.cost,
      play: [
        miracleCandle,
        daisyDuckDonaldsDate,
        mrSmeeBumblingMate,
        cinderellaBallroomSensation,
        neverLandMermaidLagoon,
      ],
    });

    const cardUnderTest = testEngine.getCardModel(miracleCandle);
    const target = testEngine.getCardModel(neverLandMermaidLagoon);

    target.updateCardDamage(3, "add");
    cardUnderTest.activate();
    await testEngine.resolveTopOfStack({ targets: [target] });

    expect(target.meta.damage).toEqual(1);
    expect(testEngine.getCardZone(cardUnderTest)).toBe("discard");
    expect(testEngine.getPlayerLore()).toBe(2);
  });

  it("Under 3 characters in play", async () => {
    const testEngine = new TestEngine({
      inkwell: miracleCandle.cost,
      play: [
        miracleCandle,
        daisyDuckDonaldsDate,
        cinderellaBallroomSensation,
        neverLandMermaidLagoon,
      ],
    });

    const cardUnderTest = testEngine.getCardModel(miracleCandle);
    const target = testEngine.getCardModel(neverLandMermaidLagoon);

    target.updateCardDamage(3, "add");
    cardUnderTest.activate();
    expect(testEngine.stackLayers).toHaveLength(0);

    expect(target.meta.damage).toEqual(3);
    expect(testEngine.getPlayerLore()).toBe(0);
  });
});
