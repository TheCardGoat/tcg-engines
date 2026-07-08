import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { merlinEnvisioningTheFuture } from "./146-merlin-envisioning-the-future";

const bottomDeckCard = createMockCharacter({
  id: "merlin-future-bottom-deck-card",
  name: "Bottom Deck Card",
  cost: 1,
});

const topDeckCard = createMockCharacter({
  id: "merlin-future-top-deck-card",
  name: "Top Deck Card",
  cost: 1,
});

const merlinBanishAttacker = createMockCharacter({
  id: "merlin-future-banish-attacker",
  name: "Banish Attacker",
  cost: 3,
  strength: 4,
  willpower: 4,
});

describe("Merlin - Envisioning the Future", () => {
  it("may draw a card from the bottom of your deck when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [merlinEnvisioningTheFuture],
      inkwell: merlinEnvisioningTheFuture.cost,
      deck: [bottomDeckCard, topDeckCard],
    });

    expect(testEngine.asPlayerOne().playCard(merlinEnvisioningTheFuture)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(merlinEnvisioningTheFuture, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(bottomDeckCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(topDeckCard)).toBe("deck");
  });

  it("goes from discard to the bottom of your deck when banished", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: merlinEnvisioningTheFuture, exerted: true }],
        deck: [topDeckCard],
      },
      {
        play: [merlinBanishAttacker],
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(merlinBanishAttacker, merlinEnvisioningTheFuture),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(merlinEnvisioningTheFuture),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(merlinEnvisioningTheFuture)).toBe("deck");
  });
});
