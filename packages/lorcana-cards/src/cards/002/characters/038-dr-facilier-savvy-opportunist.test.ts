import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { drFacilierSavvyOpportunist } from "./038-dr-facilier-savvy-opportunist";

describe("Dr. Facilier - Savvy Opportunist", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [drFacilierSavvyOpportunist],
    });

    const cardUnderTest = testEngine.getCardModel(drFacilierSavvyOpportunist);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
