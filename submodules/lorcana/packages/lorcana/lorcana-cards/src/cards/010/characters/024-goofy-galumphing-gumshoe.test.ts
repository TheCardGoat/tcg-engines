import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { goofyGalumphingGumshoe } from "./024-goofy-galumphing-gumshoe";

const opposingCharacterOne = createMockCharacter({
  id: "goofy-gumshoe-opponent-1",
  name: "Opponent One",
  cost: 2,
  strength: 4,
  willpower: 4,
});

const opposingCharacterTwo = createMockCharacter({
  id: "goofy-gumshoe-opponent-2",
  name: "Opponent Two",
  cost: 3,
  strength: 2,
  willpower: 5,
});

describe("Goofy - Galumphing Gumshoe", () => {
  describe("HOT PURSUIT - When you play this character and whenever he quests, each opposing character gets -1 {S} until the start of your next turn.", () => {
    it("reduces each opposing character's strength when Goofy is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [goofyGalumphingGumshoe],
          inkwell: goofyGalumphingGumshoe.cost,
        },
        {
          play: [opposingCharacterOne, opposingCharacterTwo],
        },
      );

      expect(testEngine.asPlayerOne().playCard(goofyGalumphingGumshoe)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacterOne)).toBe(
        opposingCharacterOne.strength - 1,
      );
      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacterTwo)).toBe(
        opposingCharacterTwo.strength - 1,
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacterOne)).toBe(
        opposingCharacterOne.strength - 1,
      );
      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacterTwo)).toBe(
        opposingCharacterTwo.strength - 1,
      );

      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacterOne)).toBe(
        opposingCharacterOne.strength,
      );
      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacterTwo)).toBe(
        opposingCharacterTwo.strength,
      );
    });

    it("reduces each opposing character's strength whenever Goofy quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [goofyGalumphingGumshoe],
        },
        {
          play: [opposingCharacterOne, opposingCharacterTwo],
        },
      );

      expect(testEngine.asPlayerOne().quest(goofyGalumphingGumshoe)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacterOne)).toBe(
        opposingCharacterOne.strength - 1,
      );
      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacterTwo)).toBe(
        opposingCharacterTwo.strength - 1,
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacterOne)).toBe(
        opposingCharacterOne.strength - 1,
      );
      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacterTwo)).toBe(
        opposingCharacterTwo.strength - 1,
      );

      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacterOne)).toBe(
        opposingCharacterOne.strength,
      );
      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacterTwo)).toBe(
        opposingCharacterTwo.strength,
      );
    });
  });

  it("regression: strength reduction is temporary, not permanent - stacks correctly across turns", () => {
    // Bug: Goofy's HOT PURSUIT was reducing strength permanently instead of until next turn.
    // After the effect expires, strength should return to base value.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [goofyGalumphingGumshoe],
        deck: 5,
      },
      {
        play: [opposingCharacterOne],
        deck: 5,
      },
    );

    // Quest Goofy - reduces opposing strength by 1 until start of next turn
    expect(testEngine.asPlayerOne().quest(goofyGalumphingGumshoe)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacterOne)).toBe(
      opposingCharacterOne.strength - 1,
    );

    // Pass both turns - effect should expire
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    // Strength should be back to normal
    expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacterOne)).toBe(
      opposingCharacterOne.strength,
    );

    // The strength should NOT be permanently reduced (bug was double-counting)
    expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacterOne)).not.toBe(
      opposingCharacterOne.strength - 2,
    );
  });
});
