import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { ratiganCriminalMastermind } from "./091-ratigan-criminal-mastermind";

describe("Ratigan - Criminal Mastermind", () => {
  it.skip("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [ratiganCriminalMastermind],
    });

    const cardUnderTest = testEngine.getCardModel(ratiganCriminalMastermind);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
