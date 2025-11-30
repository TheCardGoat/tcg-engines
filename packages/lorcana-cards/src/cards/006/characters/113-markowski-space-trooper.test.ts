import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { markowskiSpaceTrooper } from "./113-markowski-space-trooper";

describe("Markowski - Space Trooper", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine(
      {},
      {},
      {
        play: [markowskiSpaceTrooper],
      },
    );

    const cardUnderTest = testEngine.getCardModel(markowskiSpaceTrooper);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
