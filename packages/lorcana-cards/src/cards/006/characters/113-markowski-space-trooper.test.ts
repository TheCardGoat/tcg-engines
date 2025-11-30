import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { markowskiSpaceTrooper } from "./113-markowski-space-trooper";

describe("Markowski - Space Trooper", () => {
  it("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [markowskiSpaceTrooper],
    });
    const cardUnderTest = testEngine.getCardModel(markowskiSpaceTrooper);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
