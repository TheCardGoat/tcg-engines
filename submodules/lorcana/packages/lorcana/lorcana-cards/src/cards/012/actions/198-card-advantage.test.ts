import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { cardAdvantage } from "./198-card-advantage";

const attacker = createMockCharacter({
  id: "card-advantage-attacker",
  name: "Card Advantage Attacker",
  cost: 2,
  strength: 5,
  willpower: 3,
});

const defender = createMockCharacter({
  id: "card-advantage-defender",
  name: "Card Advantage Defender",
  cost: 2,
  strength: 2,
  willpower: 2,
});

describe("Card Advantage", () => {
  it("draws 2 cards when an opposing character was banished in a challenge this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 5,
        inkwell: cardAdvantage.cost,
        hand: [cardAdvantage],
        play: [attacker],
      },
      {
        play: [{ card: defender, exerted: true }],
      },
    );

    const handBefore = testEngine.asPlayerOne().getZonesCardCount().hand;

    expect(testEngine.asPlayerOne().challenge(attacker, defender)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(defender)).toBe("discard");

    expect(testEngine.asPlayerOne().playCard(cardAdvantage)).toBeSuccessfulCommand();

    // Hand before: had cardAdvantage. After playing it (discarded) and drawing 2 = handBefore - 1 + 2
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(handBefore - 1 + 2);
  });

  it("does not draw cards when no opposing character was banished in a challenge this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 5,
        inkwell: cardAdvantage.cost,
        hand: [cardAdvantage],
      },
      {
        play: [defender],
      },
    );

    const handBefore = testEngine.asPlayerOne().getZonesCardCount().hand;

    expect(testEngine.asPlayerOne().playCard(cardAdvantage)).toBeSuccessfulCommand();

    // Action still resolves and is discarded, but no draw happens
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(handBefore - 1);
    expect(testEngine.asPlayerOne().getCardZone(cardAdvantage)).toBe("discard");
    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
  });
});
