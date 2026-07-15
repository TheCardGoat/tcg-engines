import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { nickWildeSoggyFox } from "./148-nick-wilde-soggy-fox";

const supportCharacter = createMockCharacter({
  id: "nick-test-support",
  name: "Support Buddy",
  cost: 2,
  strength: 2,
  willpower: 3,
  abilities: [
    {
      id: "nick-test-support-1",
      keyword: "Support",
      type: "keyword",
      text: "Support",
    },
  ],
});

const vanillaCharacter = createMockCharacter({
  id: "nick-test-vanilla",
  name: "Vanilla Buddy",
  cost: 1,
  strength: 1,
  willpower: 2,
});

describe("Nick Wilde - Soggy Fox", () => {
  describe("NICE TO HAVE A PARTNER - While you have another character with Support in play, this character gets +2 {S}.", () => {
    it("gets +2 strength while another character with Support is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [nickWildeSoggyFox, supportCharacter],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().getCardStrength(nickWildeSoggyFox)).toBe(
        nickWildeSoggyFox.strength + 2,
      );
    });

    it("does NOT get +2 strength when no character with Support is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [nickWildeSoggyFox],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().getCardStrength(nickWildeSoggyFox)).toBe(
        nickWildeSoggyFox.strength,
      );
    });

    it("does NOT get +2 strength when only a vanilla character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [nickWildeSoggyFox, vanillaCharacter],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().getCardStrength(nickWildeSoggyFox)).toBe(
        nickWildeSoggyFox.strength,
      );
    });

    it("loses the +2 strength buff when the Support character leaves play", () => {
      const opponent = createMockCharacter({
        id: "nick-test-opp",
        name: "Strong Opponent",
        cost: 5,
        strength: 10,
        willpower: 5,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [nickWildeSoggyFox, { card: supportCharacter, exerted: true }],
          deck: 3,
        },
        {
          play: [opponent],
          deck: 1,
        },
      );

      // Verify buff is active
      expect(testEngine.asPlayerOne().getCardStrength(nickWildeSoggyFox)).toBe(
        nickWildeSoggyFox.strength + 2,
      );

      // Pass turn so opponent can challenge
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Opponent banishes the support character
      expect(
        testEngine.asPlayerTwo().challenge(opponent, supportCharacter),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(supportCharacter)).toBe("discard");

      // Buff should be gone
      expect(testEngine.asPlayerOne().getCardStrength(nickWildeSoggyFox)).toBe(
        nickWildeSoggyFox.strength,
      );
    });
  });
});
