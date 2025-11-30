import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { skippyEnergeticRabbit } from "./087-skippy-energetic-rabbit";

describe("Skippy - Energetic Rabbit", () => {
  it.skip("should have Ward ability", () => {
    const testEngine = new TestEngine({
      play: [skippyEnergeticRabbit],
    });

    const cardUnderTest = testEngine.getCardModel(skippyEnergeticRabbit);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});
