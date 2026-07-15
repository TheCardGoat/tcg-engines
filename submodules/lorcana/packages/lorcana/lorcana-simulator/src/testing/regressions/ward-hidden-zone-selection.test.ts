import { describe, expect, it } from "bun:test";
import {
  donaldDuckStruttingHisStuff,
  partOfYourWorld,
  ransack,
} from "@tcg/lorcana-cards/cards/001";
import { peteBadGuy, theNokkWaterSpirit } from "@tcg/lorcana-cards/cards/002";
import { createRegressionTestEngine } from "./create-regression-test-engine.js";

describe("regression fixture: ward-hidden-zone-selection", () => {
  it("allows choosing cards in hand even if they have Ward", () => {
    const testEngine = createRegressionTestEngine("ward-hidden-zone-selection");

    expect(testEngine.asPlayerOne().playCard(ransack)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().respondWith(theNokkWaterSpirit, donaldDuckStruttingHisStuff),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(theNokkWaterSpirit)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(donaldDuckStruttingHisStuff)).toBe("discard");
  });

  it("allows choosing cards in discard even if they have Ward", () => {
    const testEngine = createRegressionTestEngine("ward-hidden-zone-selection");

    expect(
      testEngine.asPlayerOne().playCard(partOfYourWorld, {
        targets: [peteBadGuy],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(partOfYourWorld)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(peteBadGuy)).toBe("hand");
  });
});
