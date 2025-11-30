import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { rollyHungryPup } from "./021-rolly-hungry-pup";

describe("Rolly - Hungry Pup", () => {
  it.skip("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [rollyHungryPup],
    });

    const cardUnderTest = testEngine.getCardModel(rollyHungryPup);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
