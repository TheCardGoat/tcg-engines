import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { minnieMouseStylishSurfer } from "./113-minnie-mouse-stylish-surfer";

describe("Minnie Mouse - Stylish Surfer", () => {
  it("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [minnieMouseStylishSurfer],
    });
    const cardUnderTest = testEngine.getCardModel(minnieMouseStylishSurfer);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
