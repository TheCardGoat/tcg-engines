import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { goofyFlyingGoof } from "./123-goofy-flying-goof";

describe("Goofy - Flying Goof", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [goofyFlyingGoof],
    });

    const cardUnderTest = testEngine.getCardModel(goofyFlyingGoof);
    expect(cardUnderTest.hasRush).toBe(true);
  });

  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [goofyFlyingGoof],
    });

    const cardUnderTest = testEngine.getCardModel(goofyFlyingGoof);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
