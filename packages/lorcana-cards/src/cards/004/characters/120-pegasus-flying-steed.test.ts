import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { pegasusFlyingSteed } from "./120-pegasus-flying-steed";

describe("Pegasus - Flying Steed", () => {
  it.skip("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [pegasusFlyingSteed],
    });

    const cardUnderTest = testEngine.getCardModel(pegasusFlyingSteed);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
