import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { mickeyMousebraveLittleTailor } from "./115-mickey-mouse-brave-little-tailor";

describe("Mickey Mouse - Brave Little Tailor", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [mickeyMousebraveLittleTailor],
    });

    const cardUnderTest = testEngine.getCardModel(mickeyMousebraveLittleTailor);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
