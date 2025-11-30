import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { arthurNoviceSparrow } from "./121-arthur-novice-sparrow";

describe("Arthur - Novice Sparrow", () => {
  it.skip("should have Reckless ability", () => {
    const testEngine = new TestEngine({
      play: [arthurNoviceSparrow],
    });

    const cardUnderTest = testEngine.getCardModel(arthurNoviceSparrow);
    expect(cardUnderTest.hasReckless()).toBe(true);
  });
});
