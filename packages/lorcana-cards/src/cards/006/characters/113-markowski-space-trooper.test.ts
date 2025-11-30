import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { markowskiSpaceTrooper } from "./113-markowski-space-trooper";

describe("Markowski - Space Trooper", () => {
  it.skip("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [markowskiSpaceTrooper],
    });

    const cardUnderTest = testEngine.getCardModel(markowskiSpaceTrooper);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
