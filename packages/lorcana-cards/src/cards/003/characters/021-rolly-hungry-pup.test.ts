import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { rollyHungryPup } from "./021-rolly-hungry-pup";

describe("Rolly - Hungry Pup", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [rollyHungryPup],
    });

    const cardUnderTest = testEngine.getCardModel(rollyHungryPup);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
