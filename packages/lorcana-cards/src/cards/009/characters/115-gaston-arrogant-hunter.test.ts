import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { gastonArrogantHunter } from "./115-gaston-arrogant-hunter";

describe("Gaston - Arrogant Hunter", () => {
  it.skip("should have Reckless ability", () => {
    const testEngine = new TestEngine({
      play: [gastonArrogantHunter],
    });

    const cardUnderTest = testEngine.getCardModel(gastonArrogantHunter);
    expect(cardUnderTest.hasReckless()).toBe(true);
  });
});
