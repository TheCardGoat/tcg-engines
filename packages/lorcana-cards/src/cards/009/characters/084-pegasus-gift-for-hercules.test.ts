import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { pegasusGiftForHercules } from "./084-pegasus-gift-for-hercules";

describe("Pegasus - Gift for Hercules", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine(
      {},
      {},
      {
        play: [pegasusGiftForHercules],
      },
    );

    const cardUnderTest = testEngine.getCardModel(pegasusGiftForHercules);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
