import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { arthurNoviceSparrow } from "./121-arthur-novice-sparrow";

describe("Arthur - Novice Sparrow", () => {
  it("should have Reckless ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [arthurNoviceSparrow],
    });

    const cardUnderTest = testEngine.getCardModel(arthurNoviceSparrow);
    expect(cardUnderTest.hasReckless()).toBe(true);
  });
});
