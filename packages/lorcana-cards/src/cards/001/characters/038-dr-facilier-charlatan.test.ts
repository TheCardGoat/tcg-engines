import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { DrFacilierCharlatan } from "./038-dr-facilier-charlatan";

describe("Dr. Facilier - Charlatan", () => {
  it("should have Challenger 2 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [DrFacilierCharlatan],
    });

    const cardUnderTest = testEngine.getCardModel(DrFacilierCharlatan);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
