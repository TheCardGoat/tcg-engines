import { describe, expect, it } from "bun:test";
import { CANONICAL_PLAYER_ONE } from "@tcg/shared/testing";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { olafHappyPassenger } from "./050-olaf-happy-passenger";

const opponentCharacterA = createMockCharacter({
  id: "olaf-opp-char-a",
  name: "Opponent Character A",
  cost: 3,
  strength: 2,
  willpower: 2,
});

const opponentCharacterB = createMockCharacter({
  id: "olaf-opp-char-b",
  name: "Opponent Character B",
  cost: 3,
  strength: 2,
  willpower: 2,
});

describe("Olaf - Happy Passenger (set5-050)", () => {
  describe("CLEAR THE PATH - For each exerted character opponents have in play, you pay 1 {I} less to play this character.", () => {
    it("costs full cost when no opponent characters are exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [olafHappyPassenger],
          inkwell: olafHappyPassenger.cost,
          deck: 2,
        },
        {
          play: [opponentCharacterA],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(olafHappyPassenger)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(olafHappyPassenger)).toBe("play");
      expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(0);
    });

    it("costs 2 less when 2 opponent characters are exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [olafHappyPassenger],
          inkwell: olafHappyPassenger.cost - 2,
          deck: 2,
        },
        {
          play: [
            { card: opponentCharacterA, exerted: true },
            { card: opponentCharacterB, exerted: true },
          ],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(olafHappyPassenger)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(olafHappyPassenger)).toBe("play");
      expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(0);
    });

    it("costs 1 less when 1 of 2 opponent characters is exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [olafHappyPassenger],
          inkwell: olafHappyPassenger.cost - 1,
          deck: 2,
        },
        {
          play: [
            { card: opponentCharacterA, exerted: true },
            { card: opponentCharacterB, exerted: false },
          ],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(olafHappyPassenger)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(olafHappyPassenger)).toBe("play");
      expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(0);
    });

    it("cannot be played when insufficient ink even with cost reduction", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [olafHappyPassenger],
          inkwell: olafHappyPassenger.cost - 3,
          deck: 2,
        },
        {
          play: [
            { card: opponentCharacterA, exerted: true },
            { card: opponentCharacterB, exerted: true },
          ],
          deck: 2,
        },
      );

      const result = testEngine.asPlayerOne().playCard(olafHappyPassenger);
      expect(result).not.toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(olafHappyPassenger)).toBe("hand");
    });
  });
});
