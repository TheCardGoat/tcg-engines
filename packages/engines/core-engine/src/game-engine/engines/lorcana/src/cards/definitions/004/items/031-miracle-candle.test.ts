/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { cinderellaBallroomSensation } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { mrSmeeBumblingMate } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import { neverLandMermaidLagoon } from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations/indext";
import { miracleCandle } from "~/game-engine/engines/lorcana/src/cards/definitions/004/items/index";
import { daisyDuckDonaldsDate } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
