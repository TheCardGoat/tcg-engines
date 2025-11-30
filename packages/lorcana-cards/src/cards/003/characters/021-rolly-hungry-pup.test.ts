import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { rollyHungryPup } from "./021-rolly-hungry-pup";

describe("Rolly - Hungry Pup", () => {
  it("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [rollyHungryPup],
    });
    const cardUnderTest = testEngine.getCardModel(rollyHungryPup);
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
