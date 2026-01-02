import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { fidgetRatigansHenchman } from "./108-fidget-ratigans-henchman";

describe("Fidget - Ratigan's Henchman", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [fidgetRatigansHenchman],
    });

    const cardUnderTest = testEngine.getCardModel(fidgetRatigansHenchman);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
