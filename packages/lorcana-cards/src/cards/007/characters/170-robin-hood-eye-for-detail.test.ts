import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { robinHoodEyeForDetail } from "./170-robin-hood-eye-for-detail";

describe("Robin Hood - Eye for Detail", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine(
      {},
      {},
      {
        play: [robinHoodEyeForDetail],
      },
    );

    const cardUnderTest = testEngine.getCardModel(robinHoodEyeForDetail);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
