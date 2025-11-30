import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { herculesUnwaveringDemigod } from "./180-hercules-unwavering-demigod";

describe("Hercules - Unwavering Demigod", () => {
  it.skip("should have Challenger 2 ability", () => {
    const testEngine = new TestEngine({
      play: [herculesUnwaveringDemigod],
    });

    const cardUnderTest = testEngine.getCardModel(herculesUnwaveringDemigod);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
