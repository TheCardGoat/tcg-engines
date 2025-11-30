import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { tukTukWreckingBall } from "./128-tuk-tuk-wrecking-ball";

describe("Tuk Tuk - Wrecking Ball", () => {
  it.skip("should have Reckless ability", () => {
    const testEngine = new TestEngine({
      play: [tukTukWreckingBall],
    });

    const cardUnderTest = testEngine.getCardModel(tukTukWreckingBall);
    expect(cardUnderTest.hasReckless()).toBe(true);
  });
});
