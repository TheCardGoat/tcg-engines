import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { elsaGlovesOff } from "./048-elsa-gloves-off";

describe("Elsa - Gloves Off", () => {
  it("should have Challenger 3 ability", () => {
    const testEngine = new TestEngine({
      play: [elsaGlovesOff],
    });
    const cardUnderTest = testEngine.getCardModel(elsaGlovesOff);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
