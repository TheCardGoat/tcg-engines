import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { gastonArrogantHunter } from "./115-gaston-arrogant-hunter";

describe("Gaston - Arrogant Hunter", () => {
  it("should have Reckless ability", () => {
    const testEngine = new TestEngine({
      play: [gastonArrogantHunter],
    });
    const cardUnderTest = testEngine.getCardModel(gastonArrogantHunter);
    expect(cardUnderTest.hasReckless).toBe(true);
  });
});
