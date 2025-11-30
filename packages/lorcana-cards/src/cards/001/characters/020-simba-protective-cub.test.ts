import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { simbaProtectiveCub } from "./020-simba-protective-cub";

describe("Simba - Protective Cub", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine(
      {},
      {},
      {
        play: [simbaProtectiveCub],
      },
    );

    const cardUnderTest = testEngine.getCardModel(simbaProtectiveCub);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
