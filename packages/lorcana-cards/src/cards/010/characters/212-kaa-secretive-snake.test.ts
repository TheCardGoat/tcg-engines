import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { kaaSecretiveSnake } from "./212-kaa-secretive-snake";

describe("Kaa - Secretive Snake", () => {
  it("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [kaaSecretiveSnake],
    });
    const cardUnderTest = testEngine.getCardModel(kaaSecretiveSnake);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
