import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { minnieMouseStylishSurfer } from "./113-minnie-mouse-stylish-surfer";

describe("Minnie Mouse - Stylish Surfer", () => {
  it.skip("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [minnieMouseStylishSurfer],
    });

    const cardUnderTest = testEngine.getCardModel(minnieMouseStylishSurfer);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
