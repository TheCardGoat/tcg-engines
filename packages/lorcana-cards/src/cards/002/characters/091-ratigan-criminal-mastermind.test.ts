import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { ratiganCriminalMastermind } from "./091-ratigan-criminal-mastermind";

describe("Ratigan - Criminal Mastermind", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [ratiganCriminalMastermind],
    });

    const cardUnderTest = testEngine.getCardModel(ratiganCriminalMastermind);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
