import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { flotsamSlipperyAsAnEel } from "./071-flotsam-slippery-as-an-eel";

describe("Flotsam - Slippery as an Eel", () => {
  it.skip("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [flotsamSlipperyAsAnEel],
    });

    const cardUnderTest = testEngine.getCardModel(flotsamSlipperyAsAnEel);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
