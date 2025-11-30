import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { robinHoodEyeForDetail } from "./170-robin-hood-eye-for-detail";

describe("Robin Hood - Eye for Detail", () => {
  it("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [robinHoodEyeForDetail],
    });
    const cardUnderTest = testEngine.getCardModel(robinHoodEyeForDetail);
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
