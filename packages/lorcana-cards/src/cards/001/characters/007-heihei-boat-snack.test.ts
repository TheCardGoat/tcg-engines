import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { heiheiBoatSnack } from "./007-heihei-boat-snack";

describe("HeiHei - Boat Snack", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [heiheiBoatSnack],
    });

    const cardUnderTest = testEngine.getCardModel(heiheiBoatSnack);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
