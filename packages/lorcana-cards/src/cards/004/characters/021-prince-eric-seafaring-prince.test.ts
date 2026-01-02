import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { princeEricSeafaringPrince } from "./021-prince-eric-seafaring-prince";

describe("Prince Eric - Seafaring Prince", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [princeEricSeafaringPrince],
    });

    const cardUnderTest = testEngine.getCardModel(princeEricSeafaringPrince);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
