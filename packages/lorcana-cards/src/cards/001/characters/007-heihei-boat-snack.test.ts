import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { HeiheiBoatSnack } from "./007-heihei-boat-snack";

describe("HeiHei - Boat Snack", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [HeiheiBoatSnack],
    });

    const cardUnderTest = testEngine.getCardModel(HeiheiBoatSnack);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
