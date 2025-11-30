import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { crikeeGoodLuckCharm } from "./142-cri-kee-good-luck-charm";

describe("Cri-Kee - Good Luck Charm", () => {
  it("should have Alert ability", () => {
    const testEngine = new TestEngine({
      play: [crikeeGoodLuckCharm],
    });
    const cardUnderTest = testEngine.getCardModel(crikeeGoodLuckCharm);
    expect(cardUnderTest.hasAlert).toBe(true);
  });
});
