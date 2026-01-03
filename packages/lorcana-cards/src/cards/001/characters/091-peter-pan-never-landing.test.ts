import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { PeterPanNeverLanding } from "./091-peter-pan-never-landing";

describe("Peter Pan - Never Landing", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [PeterPanNeverLanding],
    });

    const cardUnderTest = testEngine.getCardModel(PeterPanNeverLanding);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
