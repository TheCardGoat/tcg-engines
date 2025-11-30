import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { pegasusGiftForHercules } from "./084-pegasus-gift-for-hercules";

describe("Pegasus - Gift for Hercules", () => {
  it.skip("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [pegasusGiftForHercules],
    });

    const cardUnderTest = testEngine.getCardModel(pegasusGiftForHercules);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
