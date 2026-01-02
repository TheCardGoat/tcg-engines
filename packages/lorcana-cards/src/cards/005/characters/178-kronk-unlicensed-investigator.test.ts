import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { kronkUnlicensedInvestigator } from "./178-kronk-unlicensed-investigator";

describe("Kronk - Unlicensed Investigator", () => {
  it("should have Challenger 1 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [kronkUnlicensedInvestigator],
    });

    const cardUnderTest = testEngine.getCardModel(kronkUnlicensedInvestigator);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
