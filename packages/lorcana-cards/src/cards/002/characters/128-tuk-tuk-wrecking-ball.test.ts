import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { tukTukWreckingBall } from "./128-tuk-tuk-wrecking-ball";

describe("Tuk Tuk - Wrecking Ball", () => {
  it("should have Reckless ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [tukTukWreckingBall],
    });

    const cardUnderTest = testEngine.getCardModel(tukTukWreckingBall);
    expect(cardUnderTest.hasReckless()).toBe(true);
  });
});
