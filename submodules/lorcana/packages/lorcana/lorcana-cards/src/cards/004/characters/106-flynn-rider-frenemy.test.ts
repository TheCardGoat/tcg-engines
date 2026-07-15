import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { flynnRiderFrenemy } from "./106-flynn-rider-frenemy";

const strongAlly = createMockCharacter({
  id: "flynn-strong-ally",
  name: "Strong Ally",
  cost: 4,
  strength: 5,
  willpower: 5,
  lore: 1,
});

const equalOpponent = createMockCharacter({
  id: "flynn-equal-opponent",
  name: "Equal Opponent",
  cost: 4,
  strength: 5,
  willpower: 5,
  lore: 1,
});

const weakerOpponent = createMockCharacter({
  id: "flynn-weaker-opponent",
  name: "Weaker Opponent",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Flynn Rider - Frenemy", () => {
  describe("NARROW ADVANTAGE - At the start of your turn, if you have a character in play with more {S} than each opposing character, gain 3 lore.", () => {
    it("gains 3 lore when your strongest character is stronger than every opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [flynnRiderFrenemy, strongAlly],
          deck: 2,
        },
        {
          play: [weakerOpponent],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(flynnRiderFrenemy),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(3);
      expect(testEngine.asPlayerOne().getLore(PLAYER_TWO)).toBe(0);
    });

    it("does not gain lore when the strongest characters are tied", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [flynnRiderFrenemy],
          deck: 2,
        },
        {
          play: [equalOpponent],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(flynnRiderFrenemy),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
      expect(testEngine.asPlayerOne().getLore(PLAYER_TWO)).toBe(0);
    });

    it("gains 3 lore when you have a character in play and the opponent has none", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [flynnRiderFrenemy],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(flynnRiderFrenemy),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(3);
    });
  });
});
