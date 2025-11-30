import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { drFacilierCharlatan } from "./038-dr-facilier-charlatan";

describe("Dr. Facilier - Charlatan", () => {
  it("should have Challenger 2 ability", () => {
    const testEngine = new TestEngine({
      play: [drFacilierCharlatan],
    });
    const cardUnderTest = testEngine.getCardModel(drFacilierCharlatan);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
