import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { violetParrSuperResilient } from "./176-violet-parr-super-resilient";

const drawnCard = createMockCharacter({
  id: "violet-parr-super-resilient-drawn-card",
  name: "Drawn Card",
  cost: 1,
});

const discardedCard = createMockCharacter({
  id: "violet-parr-super-resilient-discarded-card",
  name: "Discarded Card",
  cost: 1,
});

describe("Violet Parr - Super Resilient", () => {
  it("may draw and discard when you play Violet herself", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [violetParrSuperResilient, discardedCard],
      deck: [drawnCard],
      inkwell: violetParrSuperResilient.cost,
    });

    expect(testEngine.asPlayerOne().playCard(violetParrSuperResilient)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(violetParrSuperResilient, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(violetParrSuperResilient, {
        targets: [discardedCard],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(discardedCard)).toBe("discard");
  });
});
