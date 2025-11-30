import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { stitchLittleRocket } from "./125-stitch-little-rocket";

describe("Stitch - Little Rocket", () => {
  it("should have Rush ability", () => {
    const testEngine = new TestEngine({
      play: [stitchLittleRocket],
    });
    const cardUnderTest = testEngine.getCardModel(stitchLittleRocket);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
