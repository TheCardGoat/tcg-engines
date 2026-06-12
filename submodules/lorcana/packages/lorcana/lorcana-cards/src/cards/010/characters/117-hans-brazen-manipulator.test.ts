import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { hansBrazenManipulator } from "./117-hans-brazen-manipulator";

const kingCharacter = createMockCharacter({
  id: "hans-brazen-king-character",
  name: "King Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Hero", "King"],
});

const queenCharacter = createMockCharacter({
  id: "hans-brazen-queen-character",
  name: "Queen Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Hero", "Queen"],
});

const nonRoyalCharacter = createMockCharacter({
  id: "hans-brazen-non-royal-character",
  name: "Non-Royal Character",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const opponentCharacterA = createMockCharacter({
  id: "hans-brazen-opponent-char-a",
  name: "Opponent Character A",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const opponentCharacterB = createMockCharacter({
  id: "hans-brazen-opponent-char-b",
  name: "Opponent Character B",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Hans - Brazen Manipulator", () => {
  describe("JOSTLING FOR POWER - King and Queen characters can't quest.", () => {
    it("prevents a King character from questing while Hans is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [hansBrazenManipulator, { card: kingCharacter, isDrying: false }],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().quest(kingCharacter)).not.toBeSuccessfulCommand();
    });

    it("prevents a Queen character from questing while Hans is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [hansBrazenManipulator, { card: queenCharacter, isDrying: false }],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().quest(queenCharacter)).not.toBeSuccessfulCommand();
    });

    it("does not prevent non-King/Queen characters from questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [hansBrazenManipulator, { card: nonRoyalCharacter, isDrying: false }],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().quest(nonRoyalCharacter)).toBeSuccessfulCommand();
    });
  });

  describe("GROWING INFLUENCE - At the start of your turn, if an opponent has 2 or more ready characters in play, gain 2 lore.", () => {
    it("gains 2 lore at the start of your turn when an opponent has 2+ ready characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [hansBrazenManipulator],
          deck: 2,
        },
        {
          play: [opponentCharacterA, opponentCharacterB],
          deck: 2,
        },
        {
          startingLore: { [PLAYER_ONE]: 0 },
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Resolve any bag effects from the start-of-turn trigger
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      for (const bagEffect of bagEffects) {
        testEngine.asPlayerOne().resolvePendingByCard(hansBrazenManipulator);
      }

      expect(testEngine.getLore(PLAYER_ONE)).toBe(2);
    });

    it("does not gain lore when opponent has fewer than 2 ready characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [hansBrazenManipulator],
          deck: 2,
        },
        {
          play: [opponentCharacterA],
          deck: 2,
        },
        {
          startingLore: { [PLAYER_ONE]: 0 },
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
    });

    it("does not gain lore when opponent has no characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [hansBrazenManipulator],
          deck: 2,
        },
        {
          deck: 2,
        },
        {
          startingLore: { [PLAYER_ONE]: 0 },
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
    });
  });
});
