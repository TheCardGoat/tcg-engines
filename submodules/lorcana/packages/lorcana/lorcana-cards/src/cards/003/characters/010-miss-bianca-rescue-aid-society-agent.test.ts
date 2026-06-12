import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { missBiancaRescueAidSocietyAgent } from "./010-miss-bianca-rescue-aid-society-agent";

describe("Miss Bianca - Rescue Aid Society Agent", () => {
  it("Singer 4", () => {
    const testEngine = new LorcanaTestEngine({
      play: [missBiancaRescueAidSocietyAgent],
    });

    const cardUnderTest = testEngine.getCardModel(missBiancaRescueAidSocietyAgent);
    expect(cardUnderTest.hasSinger()).toBe(true);
    expect(cardUnderTest.singerCost).toBe(4);
  });
});
