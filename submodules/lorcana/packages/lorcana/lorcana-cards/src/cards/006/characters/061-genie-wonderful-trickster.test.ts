import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { genieWonderfulTrickster } from "./061-genie-wonderful-trickster";

const playedCard = createMockCharacter({
  id: "genie-wonderful-trickster-played-card",
  name: "Played Card",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const drawnCard = createMockCharacter({
  id: "genie-wonderful-trickster-drawn-card",
  name: "Drawn Card",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const handCardA = createMockCharacter({
  id: "genie-wonderful-trickster-hand-a",
  name: "Hand A",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const handCardB = createMockCharacter({
  id: "genie-wonderful-trickster-hand-b",
  name: "Hand B",
  cost: 1,
  strength: 1,
  willpower: 1,
});

describe("Genie - Wonderful Trickster", () => {
  it("draws a card whenever you play another card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [genieWonderfulTrickster],
      hand: [playedCard],
      inkwell: playedCard.cost,
      deck: [drawnCard],
    });

    expect(testEngine.asPlayerOne().playCard(playedCard)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(playedCard)).toBe("play");
  });

  it("puts all cards in your hand on the bottom of your deck at the end of your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [genieWonderfulTrickster],
      hand: [handCardA, handCardB],
      deck: 5,
    });

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(genieWonderfulTrickster),
    ).toBeSuccessfulCommand();
    expect(testEngine.asServer().getState().G.pendingEffects).toHaveLength(0);

    expect(testEngine.asPlayerOne().getCardZone(handCardA)).toBe("deck");
    expect(testEngine.asPlayerOne().getCardZone(handCardB)).toBe("deck");
    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 0,
        deck: 7,
      }),
    );
  });
});
