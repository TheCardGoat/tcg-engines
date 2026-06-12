import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { merlinSquirrel } from "./054-merlin-squirrel";

const topCard = createMockCharacter({ id: "merlin-top-card", name: "Top Card", cost: 1 });
const secondCard = createMockCharacter({ id: "merlin-second-card", name: "Second Card", cost: 2 });

const anotherCharacter = createMockCharacter({
  id: "merlin-another-character",
  name: "Another Character",
  cost: 2,
  strength: 2,
  willpower: 2,
});

describe("Merlin - Squirrel", () => {
  it("LOOK BEFORE YOU LEAP - triggers when Merlin leaves play (is banished)", () => {
    const banishingCharacter = createMockCharacter({
      id: "merlin-banisher",
      name: "Banishing Character",
      cost: 2,
      strength: 5,
      willpower: 3,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: merlinSquirrel, exerted: true }],
        deck: [topCard, secondCard],
      },
      {
        play: [banishingCharacter],
        deck: 2,
      },
    );

    // Pass turn so player two can challenge
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Challenge Merlin with the opponent's strong character
    expect(
      testEngine.asPlayerTwo().challenge(banishingCharacter, merlinSquirrel),
    ).toBeSuccessfulCommand();

    // Merlin should be banished
    expect(testEngine.asPlayerOne().getCardZone(merlinSquirrel)).toBe("discard");

    // Merlin's leave-play trigger should fire
    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
  });

  it("LOOK BEFORE YOU LEAP - does NOT trigger when another character leaves play", () => {
    const strongBanisher = createMockCharacter({
      id: "merlin-strong-banisher",
      name: "Strong Banisher",
      cost: 3,
      strength: 5,
      willpower: 4,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [merlinSquirrel, { card: anotherCharacter, exerted: true }],
        deck: [topCard, secondCard],
      },
      {
        play: [strongBanisher],
        deck: 2,
      },
    );

    // Pass turn so player two can challenge
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Challenge anotherCharacter (not Merlin) — anotherCharacter has 2 willpower, strongBanisher has 5 strength
    expect(
      testEngine.asPlayerTwo().challenge(strongBanisher, anotherCharacter),
    ).toBeSuccessfulCommand();

    // anotherCharacter should be banished (2 willpower vs 5 strength)
    expect(testEngine.asPlayerOne().getCardZone(anotherCharacter)).toBe("discard");

    // Merlin's LOOK BEFORE YOU LEAP should NOT trigger
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("LOOK BEFORE YOU LEAP - looks at top card and can put it on bottom when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [merlinSquirrel],
      inkwell: merlinSquirrel.cost,
      deck: [topCard, secondCard],
    });

    expect(testEngine.asPlayerOne().playCard(merlinSquirrel)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(merlinSquirrel)).toBe("play");

    // Resolve the triggered scry ability via bag
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(testEngine.asPlayerOne().resolvePendingByCard(merlinSquirrel)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "deck-top", cards: [] },
          { zone: "deck-bottom", cards: [secondCard] },
        ],
      }),
    ).toBeSuccessfulCommand();

    // Verify order: topCard on top, secondCard on bottom
    const deckIds = testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE);
    expect(deckIds).toEqual([secondCard.id, topCard.id]);
  });
});
