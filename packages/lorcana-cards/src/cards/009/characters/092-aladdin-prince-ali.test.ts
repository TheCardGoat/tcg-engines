import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { aladdinPrinceAli } from "./092-aladdin-prince-ali";

describe("Aladdin - Prince Ali", () => {
  it("should have Ward ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [aladdinPrinceAli],
    });

    const cardUnderTest = testEngine.getCardModel(aladdinPrinceAli);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});
