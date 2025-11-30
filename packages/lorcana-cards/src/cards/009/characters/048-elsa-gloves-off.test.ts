import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { elsaGlovesOff } from "./048-elsa-gloves-off";

describe("Elsa - Gloves Off", () => {
  it.skip("should have Challenger 3 ability", () => {
    const testEngine = new TestEngine({
      play: [elsaGlovesOff],
    });

    const cardUnderTest = testEngine.getCardModel(elsaGlovesOff);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
