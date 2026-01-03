import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { SimbaProtectiveCub } from "./020-simba-protective-cub";

describe("Simba - Protective Cub", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [SimbaProtectiveCub],
    });

    const cardUnderTest = testEngine.getCardModel(SimbaProtectiveCub);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
