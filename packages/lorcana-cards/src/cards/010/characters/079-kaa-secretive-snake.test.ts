import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { kaaSecretiveSnake } from "./079-kaa-secretive-snake";

describe("Kaa - Secretive Snake", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [kaaSecretiveSnake],
    });

    const cardUnderTest = testEngine.getCardModel(kaaSecretiveSnake);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
