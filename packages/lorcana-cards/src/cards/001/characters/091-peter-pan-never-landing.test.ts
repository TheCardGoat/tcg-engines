import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { peterPanneverLanding } from "./091-peter-pan-never-landing";

describe("Peter Pan - Never Landing", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [peterPanneverLanding],
    });

    const cardUnderTest = testEngine.getCardModel(peterPanneverLanding);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
