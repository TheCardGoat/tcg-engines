import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { hermesHarriedMessenger } from "./112-hermes-harried-messenger";

describe("Hermes - Harried Messenger", () => {
  it("should have Rush ability", () => {
    const testEngine = new TestEngine({
      play: [hermesHarriedMessenger],
    });
    const cardUnderTest = testEngine.getCardModel(hermesHarriedMessenger);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
