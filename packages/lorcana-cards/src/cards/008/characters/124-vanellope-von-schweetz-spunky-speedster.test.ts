import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { vanellopeVonSchweetzSpunkySpeedster } from "./124-vanellope-von-schweetz-spunky-speedster";

describe("Vanellope Von Schweetz - Spunky Speedster", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [vanellopeVonSchweetzSpunkySpeedster],
    });

    const cardUnderTest = testEngine.getCardModel(vanellopeVonSchweetzSpunkySpeedster);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
