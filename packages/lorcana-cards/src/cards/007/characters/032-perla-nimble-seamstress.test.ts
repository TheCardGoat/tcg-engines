import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { perlaNimbleSeamstress } from "./032-perla-nimble-seamstress";

describe("Perla - Nimble Seamstress", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [perlaNimbleSeamstress],
    });

    const cardUnderTest = testEngine.getCardModel(perlaNimbleSeamstress);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [perlaNimbleSeamstress],
    });

    const cardUnderTest = testEngine.getCardModel(perlaNimbleSeamstress);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
