import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { beastThickskinned } from "./176-beast-thick-skinned";

describe("Beast - Thick-Skinned", () => {
  it("should have Resist 1 ability", () => {
    const testEngine = new LorcanaTestEngine(
      {},
      {},
      {
        play: [beastThickskinned],
      },
    );

    const cardUnderTest = testEngine.getCardModel(beastThickskinned);
    expect(cardUnderTest.hasResist).toBe(true);
  });
});
