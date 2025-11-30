import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { kaaSecretiveSnake } from "./212-kaa-secretive-snake";

describe("Kaa - Secretive Snake", () => {
  it.skip("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [kaaSecretiveSnake],
    });

    const cardUnderTest = testEngine.getCardModel(kaaSecretiveSnake);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
