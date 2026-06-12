import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { genieMainAttraction } from "./049-genie-main-attraction";

const opponentCharacter = createMockCharacter({
  id: "genie-ma-opp-char",
  name: "Opponent Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Genie - Main Attraction", () => {
  describe("PHENOMENAL SHOWMAN - While this character is exerted, opposing characters can't ready at the start of their turn.", () => {
    it("while exerted, opposing characters can't ready at start of their turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: genieMainAttraction, exerted: true }],
          deck: 3,
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
          deck: 3,
        },
      );

      // Opponent's character is exerted; Genie is also exerted (restriction is active)
      expect(testEngine.isExerted(opponentCharacter)).toBe(true);

      // P1 passes turn — P2's turn starts; opposing chars should NOT ready because Genie is exerted
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.isExerted(opponentCharacter)).toBe(true);
    });

    it("opposing characters can ready normally when Genie is not exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [genieMainAttraction],
          deck: 3,
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
          deck: 3,
        },
      );

      // Genie is NOT exerted — restriction is inactive
      expect(testEngine.isExerted(opponentCharacter)).toBe(true);

      // P1 passes turn — P2's turn starts; opposing char should ready normally
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.isExerted(opponentCharacter)).toBe(false);
    });

    it("restriction is removed when Genie readies", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: genieMainAttraction, exerted: true }],
          deck: 3,
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
          deck: 3,
        },
      );

      // P1 passes — P2's turn: opponent can't ready (Genie is exerted)
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.isExerted(opponentCharacter)).toBe(true);

      // P2 passes — P1's turn: Genie readies, so restriction lifts
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.isExerted(genieMainAttraction)).toBe(false);

      // P1 passes again — P2's turn: now Genie is not exerted, opponent can ready
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.isExerted(opponentCharacter)).toBe(false);
    });
  });
});
