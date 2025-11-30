import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { beastThickskinned } from "./176-beast-thick-skinned";

describe("Beast - Thick-Skinned", () => {
  it("should have Resist 1 ability", () => {
    const testEngine = new TestEngine({
      play: [beastThickskinned],
    });
    const cardUnderTest = testEngine.getCardModel(beastThickskinned);
    expect(cardUnderTest.hasResist).toBe(true);
  });
});
