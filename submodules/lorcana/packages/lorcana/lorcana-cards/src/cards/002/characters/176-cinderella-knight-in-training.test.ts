import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { cinderellaKnightInTraining } from "./176-cinderella-knight-in-training";

const drawnCard = createMockCharacter({
  id: "cinderella-knight-in-training-drawn-card",
  name: "Drawn Card",
  cost: 1,
});

const discardFodder = createMockCharacter({
  id: "cinderella-knight-in-training-discard-fodder",
  name: "Discard Fodder",
  cost: 1,
});

describe("Cinderella - Knight in Training", () => {
  it("lets you draw a card, then choose and discard a card when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [drawnCard],
      hand: [cinderellaKnightInTraining, discardFodder],
      inkwell: cinderellaKnightInTraining.cost,
    });

    expect(testEngine.asPlayerOne().playCard(cinderellaKnightInTraining)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(cinderellaKnightInTraining, { resolveOptional: true }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
      deck: 0,
      discard: 0,
      hand: 2,
      play: 1,
    });

    const discardFodderId = testEngine.findCardInstanceId(discardFodder, "hand", "player_one");
    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [discardFodderId] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
      deck: 0,
      discard: 1,
      hand: 1,
      play: 1,
    });
  });
});
