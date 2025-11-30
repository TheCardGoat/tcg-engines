import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { gastonBaritoneBully } from "./008-gaston-baritone-bully";

describe("Gaston - Baritone Bully", () => {
  it("should have Singer 5 ability", () => {
    const testEngine = new LorcanaTestEngine(
      {},
      {},
      {
        play: [gastonBaritoneBully],
      },
    );

    const cardUnderTest = testEngine.getCardModel(gastonBaritoneBully);
    expect(cardUnderTest.hasSinger()).toBe(true);
  });
});
