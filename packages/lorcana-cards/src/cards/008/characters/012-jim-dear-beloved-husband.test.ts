import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { jimDearBelovedHusband } from "./012-jim-dear-beloved-husband";

describe("Jim Dear - Beloved Husband", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [jimDearBelovedHusband],
    });

    const cardUnderTest = testEngine.getCardModel(jimDearBelovedHusband);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
