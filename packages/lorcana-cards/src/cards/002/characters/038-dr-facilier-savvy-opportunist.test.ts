import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { drFacilierSavvyOpportunist } from "./038-dr-facilier-savvy-opportunist";

describe("Dr. Facilier - Savvy Opportunist", () => {
  it.skip("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [drFacilierSavvyOpportunist],
    });

    const cardUnderTest = testEngine.getCardModel(drFacilierSavvyOpportunist);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
