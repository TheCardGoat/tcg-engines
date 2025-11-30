import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { hermesHarriedMessenger } from "./112-hermes-harried-messenger";

describe("Hermes - Harried Messenger", () => {
  it.skip("should have Rush ability", () => {
    const testEngine = new TestEngine({
      play: [hermesHarriedMessenger],
    });

    const cardUnderTest = testEngine.getCardModel(hermesHarriedMessenger);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
