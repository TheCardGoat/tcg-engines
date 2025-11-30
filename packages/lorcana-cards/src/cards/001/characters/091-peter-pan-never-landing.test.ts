import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { peterPanNeverLanding } from "./091-peter-pan-never-landing";

describe("Peter Pan - Never Landing", () => {
  it("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [peterPanNeverLanding],
    });
    const cardUnderTest = testEngine.getCardModel(peterPanNeverLanding);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
