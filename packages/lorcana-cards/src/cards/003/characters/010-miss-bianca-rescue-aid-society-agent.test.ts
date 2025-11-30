import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { missBiancaRescueAidSocietyAgent } from "./010-miss-bianca-rescue-aid-society-agent";

describe("Miss Bianca - Rescue Aid Society Agent", () => {
  it.skip("should have Singer 4 ability", () => {
    const testEngine = new TestEngine({
      play: [missBiancaRescueAidSocietyAgent],
    });

    const cardUnderTest = testEngine.getCardModel(
      missBiancaRescueAidSocietyAgent,
    );
    expect(cardUnderTest.hasSinger()).toBe(true);
  });
});
