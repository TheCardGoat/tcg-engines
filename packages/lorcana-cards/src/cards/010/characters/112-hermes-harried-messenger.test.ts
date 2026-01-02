import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { hermesHarriedMessenger } from "./112-hermes-harried-messenger";

describe("Hermes - Harried Messenger", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [hermesHarriedMessenger],
    });

    const cardUnderTest = testEngine.getCardModel(hermesHarriedMessenger);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
