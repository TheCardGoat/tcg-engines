import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { peterPanNeverLanding } from "./091-peter-pan-never-landing";

describe("Peter Pan - Never Landing", () => {
  it.skip("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [peterPanNeverLanding],
    });

    const cardUnderTest = testEngine.getCardModel(peterPanNeverLanding);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
