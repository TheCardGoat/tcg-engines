import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { slushyGlacialGuster } from "./119-slushy-glacial-guster";

describe("Slushy - Glacial Guster", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [slushyGlacialGuster],
    });

    const cardUnderTest = testEngine.getCardModel(slushyGlacialGuster);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
