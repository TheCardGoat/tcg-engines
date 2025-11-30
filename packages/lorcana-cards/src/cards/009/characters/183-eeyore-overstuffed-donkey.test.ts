import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { eeyoreOverstuffedDonkey } from "./183-eeyore-overstuffed-donkey";

describe("Eeyore - Overstuffed Donkey", () => {
  it("should have Resist 1 ability", () => {
    const testEngine = new LorcanaTestEngine(
      {},
      {},
      {
        play: [eeyoreOverstuffedDonkey],
      },
    );

    const cardUnderTest = testEngine.getCardModel(eeyoreOverstuffedDonkey);
    expect(cardUnderTest.hasResist).toBe(true);
  });
});
