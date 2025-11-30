import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { eeyoreOverstuffedDonkey } from "./183-eeyore-overstuffed-donkey";

describe("Eeyore - Overstuffed Donkey", () => {
  it.skip("should have Resist 1 ability", () => {
    const testEngine = new TestEngine({
      play: [eeyoreOverstuffedDonkey],
    });

    const cardUnderTest = testEngine.getCardModel(eeyoreOverstuffedDonkey);
    expect(cardUnderTest.hasResist).toBe(true);
  });
});
