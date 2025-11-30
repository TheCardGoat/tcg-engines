import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { herculesUnwaveringDemigod } from "./180-hercules-unwavering-demigod";

describe("Hercules - Unwavering Demigod", () => {
  it("should have Challenger 2 ability", () => {
    const testEngine = new TestEngine({
      play: [herculesUnwaveringDemigod],
    });
    const cardUnderTest = testEngine.getCardModel(herculesUnwaveringDemigod);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
