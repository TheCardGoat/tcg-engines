import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { aladdinPrinceAli } from "./092-aladdin-prince-ali";

describe("Aladdin - Prince Ali", () => {
  it.skip("should have Ward ability", () => {
    const testEngine = new TestEngine({
      play: [aladdinPrinceAli],
    });

    const cardUnderTest = testEngine.getCardModel(aladdinPrinceAli);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});
