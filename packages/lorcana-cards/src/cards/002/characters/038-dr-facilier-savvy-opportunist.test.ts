import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { drFacilierSavvyOpportunist } from "./038-dr-facilier-savvy-opportunist";

describe("Dr. Facilier - Savvy Opportunist", () => {
  it("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [drFacilierSavvyOpportunist],
    });
    const cardUnderTest = testEngine.getCardModel(drFacilierSavvyOpportunist);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
