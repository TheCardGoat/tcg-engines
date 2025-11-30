import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { princeEricSeafaringPrince } from "./021-prince-eric-seafaring-prince";

describe("Prince Eric - Seafaring Prince", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new TestEngine({
      play: [princeEricSeafaringPrince],
    });
    const cardUnderTest = testEngine.getCardModel(princeEricSeafaringPrince);
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });
});
