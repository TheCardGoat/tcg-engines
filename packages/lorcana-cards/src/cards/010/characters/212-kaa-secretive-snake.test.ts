import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { kaaSecretiveSnake } from "./212-kaa-secretive-snake";

describe("Kaa - Secretive Snake", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [kaaSecretiveSnake],
    });

    const cardUnderTest = testEngine.getCardModel(kaaSecretiveSnake);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
