import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { drFaciliercharlatan } from "./038-dr-facilier-charlatan";

describe("Dr. Facilier - Charlatan", () => {
  it("should have Challenger 2 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [drFaciliercharlatan],
    });

    const cardUnderTest = testEngine.getCardModel(drFaciliercharlatan);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
