import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { simbaprotectiveCub } from "./020-simba-protective-cub";

describe("Simba - Protective Cub", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [simbaprotectiveCub],
    });

    const cardUnderTest = testEngine.getCardModel(simbaprotectiveCub);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
