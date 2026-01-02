import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { peterPanHighFlyer } from "./105-peter-pan-high-flyer";

describe("Peter Pan - High Flyer", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [peterPanHighFlyer],
    });

    const cardUnderTest = testEngine.getCardModel(peterPanHighFlyer);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
