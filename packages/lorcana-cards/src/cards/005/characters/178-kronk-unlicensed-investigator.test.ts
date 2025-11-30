import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { kronkUnlicensedInvestigator } from "./178-kronk-unlicensed-investigator";

describe("Kronk - Unlicensed Investigator", () => {
  it("should have Challenger 1 ability", () => {
    const testEngine = new TestEngine({
      play: [kronkUnlicensedInvestigator],
    });
    const cardUnderTest = testEngine.getCardModel(kronkUnlicensedInvestigator);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
