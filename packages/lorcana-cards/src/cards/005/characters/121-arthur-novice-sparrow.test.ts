import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { arthurNoviceSparrow } from "./121-arthur-novice-sparrow";

describe("Arthur - Novice Sparrow", () => {
  it("should have Reckless ability", () => {
    const testEngine = new TestEngine({
      play: [arthurNoviceSparrow],
    });
    const cardUnderTest = testEngine.getCardModel(arthurNoviceSparrow);
    expect(cardUnderTest.hasReckless).toBe(true);
  });
});
