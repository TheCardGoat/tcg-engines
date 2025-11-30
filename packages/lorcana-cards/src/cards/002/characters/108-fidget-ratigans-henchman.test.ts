import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { fidgetRatigansHenchman } from "./108-fidget-ratigans-henchman";

describe("Fidget - Ratigan's Henchman", () => {
  it("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [fidgetRatigansHenchman],
    });
    const cardUnderTest = testEngine.getCardModel(fidgetRatigansHenchman);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
