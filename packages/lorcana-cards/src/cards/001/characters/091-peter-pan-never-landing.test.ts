import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { peterPanNeverLanding } from "./091-peter-pan-never-landing";

describe("Peter Pan - Never Landing", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [peterPanNeverLanding],
    });

    const cardUnderTest = testEngine.getCardModel(peterPanNeverLanding);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
