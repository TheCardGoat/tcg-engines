import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { rajahGhostlyTiger } from "./062-rajah-ghostly-tiger";

describe("Rajah - Ghostly Tiger", () => {
  it.skip("should have Vanish ability", () => {
    const testEngine = new TestEngine({
      play: [rajahGhostlyTiger],
    });

    const cardUnderTest = testEngine.getCardModel(rajahGhostlyTiger);
    expect(cardUnderTest.hasVanish).toBe(true);
  });
});
