import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { rajahGhostlyTiger } from "./062-rajah-ghostly-tiger";

describe("Rajah - Ghostly Tiger", () => {
  it("should have Vanish ability", () => {
    const testEngine = new TestEngine({
      play: [rajahGhostlyTiger],
    });
    const cardUnderTest = testEngine.getCardModel(rajahGhostlyTiger);
    expect(cardUnderTest.hasVanish).toBe(true);
  });
});
