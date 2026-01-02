import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { skippyEnergeticRabbit } from "./087-skippy-energetic-rabbit";

describe("Skippy - Energetic Rabbit", () => {
  it("should have Ward ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [skippyEnergeticRabbit],
    });

    const cardUnderTest = testEngine.getCardModel(skippyEnergeticRabbit);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});
