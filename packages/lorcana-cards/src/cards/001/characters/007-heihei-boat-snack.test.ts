import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { heiheiboatSnack } from "./007-heihei-boat-snack";

describe("HeiHei - Boat Snack", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [heiheiboatSnack],
    });

    const cardUnderTest = testEngine.getCardModel(heiheiboatSnack);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
