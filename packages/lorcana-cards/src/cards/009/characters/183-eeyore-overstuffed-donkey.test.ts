import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { eeyoreOverstuffedDonkey } from "./183-eeyore-overstuffed-donkey";

describe("Eeyore - Overstuffed Donkey", () => {
  it("should have Resist 1 ability", () => {
    const testEngine = new TestEngine({
      play: [eeyoreOverstuffedDonkey],
    });
    const cardUnderTest = testEngine.getCardModel(eeyoreOverstuffedDonkey);
    expect(cardUnderTest.hasResist).toBe(true);
  });
});
