import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { gastonArrogantHunter } from "./115-gaston-arrogant-hunter";

describe("Gaston - Arrogant Hunter", () => {
  it("should have Reckless ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [gastonArrogantHunter],
    });

    const cardUnderTest = testEngine.getCardModel(gastonArrogantHunter);
    expect(cardUnderTest.hasReckless()).toBe(true);
  });
});
