import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { flotsamSlipperyAsAnEel } from "./071-flotsam-slippery-as-an-eel";

describe("Flotsam - Slippery as an Eel", () => {
  it("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [flotsamSlipperyAsAnEel],
    });
    const cardUnderTest = testEngine.getCardModel(flotsamSlipperyAsAnEel);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
