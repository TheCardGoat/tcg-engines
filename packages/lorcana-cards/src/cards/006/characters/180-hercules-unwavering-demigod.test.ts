import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { herculesUnwaveringDemigod } from "./180-hercules-unwavering-demigod";

describe("Hercules - Unwavering Demigod", () => {
  it("should have Challenger 2 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [herculesUnwaveringDemigod],
    });

    const cardUnderTest = testEngine.getCardModel(herculesUnwaveringDemigod);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
