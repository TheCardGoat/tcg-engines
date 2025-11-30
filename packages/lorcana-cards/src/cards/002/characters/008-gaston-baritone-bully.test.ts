import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { gastonBaritoneBully } from "./008-gaston-baritone-bully";

describe("Gaston - Baritone Bully", () => {
  it.skip("should have Singer 5 ability", () => {
    const testEngine = new TestEngine({
      play: [gastonBaritoneBully],
    });

    const cardUnderTest = testEngine.getCardModel(gastonBaritoneBully);
    expect(cardUnderTest.hasSinger()).toBe(true);
  });
});
