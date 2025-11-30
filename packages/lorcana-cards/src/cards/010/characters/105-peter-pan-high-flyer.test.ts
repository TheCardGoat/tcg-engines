import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { peterPanHighFlyer } from "./105-peter-pan-high-flyer";

describe("Peter Pan - High Flyer", () => {
  it("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [peterPanHighFlyer],
    });
    const cardUnderTest = testEngine.getCardModel(peterPanHighFlyer);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
