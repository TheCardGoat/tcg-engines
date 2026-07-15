import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { eeyoreOverstuffedDonkey } from "./172-eeyore-overstuffed-donkey";

describe("Eeyore - Overstuffed Donkey", () => {
  it("should have Resist ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [eeyoreOverstuffedDonkey],
    });

    const cardUnderTest = testEngine.getCardModel(eeyoreOverstuffedDonkey);
    expect(cardUnderTest.hasResist).toBe(true);
  });
});
