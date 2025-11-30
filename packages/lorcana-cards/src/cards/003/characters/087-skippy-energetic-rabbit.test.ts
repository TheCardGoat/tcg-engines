import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { skippyEnergeticRabbit } from "./087-skippy-energetic-rabbit";

describe("Skippy - Energetic Rabbit", () => {
  it("should have Ward ability", () => {
    const testEngine = new TestEngine({
      play: [skippyEnergeticRabbit],
    });
    const cardUnderTest = testEngine.getCardModel(skippyEnergeticRabbit);
    expect(cardUnderTest.hasWard).toBe(true);
  });
});
