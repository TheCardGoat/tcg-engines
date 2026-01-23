import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { diabloSpitefulRaven } from "./066-diablo-spiteful-raven";

describe("Diablo - Spiteful Raven", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [diabloSpitefulRaven],
    });

    const cardUnderTest = testEngine.getCardModel(diabloSpitefulRaven);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it("should have Challenger 2 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [diabloSpitefulRaven],
    });

    const cardUnderTest = testEngine.getCardModel(diabloSpitefulRaven);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
