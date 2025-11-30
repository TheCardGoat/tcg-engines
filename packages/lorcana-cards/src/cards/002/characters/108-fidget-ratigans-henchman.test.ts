import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { fidgetRatigansHenchman } from "./108-fidget-ratigans-henchman";

describe("Fidget - Ratigan's Henchman", () => {
  it.skip("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [fidgetRatigansHenchman],
    });

    const cardUnderTest = testEngine.getCardModel(fidgetRatigansHenchman);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
