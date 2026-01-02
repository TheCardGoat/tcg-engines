import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { pegasusFlyingSteed } from "./120-pegasus-flying-steed";

describe("Pegasus - Flying Steed", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [pegasusFlyingSteed],
    });

    const cardUnderTest = testEngine.getCardModel(pegasusFlyingSteed);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
