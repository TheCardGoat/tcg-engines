import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { mulanFreeSpirit } from "./010-mulan-free-spirit";

describe("Mulan - Free Spirit", () => {
  it("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [mulanFreeSpirit],
    });
    const cardUnderTest = testEngine.getCardModel(mulanFreeSpirit);
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
