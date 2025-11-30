import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { stitchLittleRocket } from "./125-stitch-little-rocket";

describe("Stitch - Little Rocket", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine(
      {},
      {},
      {
        play: [stitchLittleRocket],
      },
    );

    const cardUnderTest = testEngine.getCardModel(stitchLittleRocket);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
