import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { peterPanHighFlyer } from "./105-peter-pan-high-flyer";

describe("Peter Pan - High Flyer", () => {
  it.skip("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [peterPanHighFlyer],
    });

    const cardUnderTest = testEngine.getCardModel(peterPanHighFlyer);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
