import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { elsaGlovesOff } from "./048-elsa-gloves-off";

describe("Elsa - Gloves Off", () => {
  it("should have Challenger 3 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [elsaGlovesOff],
    });

    const cardUnderTest = testEngine.getCardModel(elsaGlovesOff);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
