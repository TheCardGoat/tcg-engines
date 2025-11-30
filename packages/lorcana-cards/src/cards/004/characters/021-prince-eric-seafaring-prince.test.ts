import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { princeEricSeafaringPrince } from "./021-prince-eric-seafaring-prince";

describe("Prince Eric - Seafaring Prince", () => {
  it.skip("should have Bodyguard ability", () => {
    const testEngine = new TestEngine({
      play: [princeEricSeafaringPrince],
    });

    const cardUnderTest = testEngine.getCardModel(princeEricSeafaringPrince);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
