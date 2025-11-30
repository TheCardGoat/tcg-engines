import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { ratiganCriminalMastermind } from "./091-ratigan-criminal-mastermind";

describe("Ratigan - Criminal Mastermind", () => {
  it("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [ratiganCriminalMastermind],
    });
    const cardUnderTest = testEngine.getCardModel(ratiganCriminalMastermind);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
