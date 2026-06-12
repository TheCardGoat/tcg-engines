import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { sunglasses } from "./202-sunglasses";

const drawnCard = createMockCharacter({
  id: "sunglasses-drawn-card",
  name: "Drawn Card",
  cost: 1,
});

const discardedCard = createMockCharacter({
  id: "sunglasses-discarded-card",
  name: "Discarded Card",
  cost: 1,
});

describe("Sunglasses", () => {
  it("draws a card, then makes you choose and discard a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [drawnCard],
      hand: [discardedCard],
      play: [sunglasses],
    });
    const discardId = testEngine.findCardInstanceId(discardedCard, "hand", "p1");

    expect(testEngine.asPlayerOne().activateAbility(sunglasses)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [discardId],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(discardedCard)).toBe("discard");
  });
});
