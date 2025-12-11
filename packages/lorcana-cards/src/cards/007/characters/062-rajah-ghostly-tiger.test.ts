import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { rajahGhostlyTiger } from "./062-rajah-ghostly-tiger";

describe("Rajah - Ghostly Tiger", () => {
  it("should have Vanish ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [rajahGhostlyTiger],
    });

    const cardUnderTest = testEngine.getCardModel(rajahGhostlyTiger);
    expect(cardUnderTest.hasVanish).toBe(true);
  });
});
