import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { plutoDeterminedDefender } from "./017-pluto-determined-defender";

describe("Pluto - Determined Defender", () => {
  describe("Shift 5", () => {
    it("has the Shift keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [plutoDeterminedDefender],
      });

      expect(testEngine.hasKeyword(plutoDeterminedDefender, "Shift")).toBe(true);
    });
  });

  describe("Bodyguard", () => {
    it("has the Bodyguard keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [plutoDeterminedDefender],
      });

      expect(testEngine.hasKeyword(plutoDeterminedDefender, "Bodyguard")).toBe(true);
    });
  });

  describe("GUARD DOG - At the start of your turn, remove up to 3 damage from this character.", () => {
    it("removes up to 3 damage from Pluto at the start of your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [{ card: plutoDeterminedDefender, damage: 3, isDrying: false }], deck: 2 },
        { deck: 2 },
      );

      expect(testEngine.asPlayerOne().getDamage(plutoDeterminedDefender)).toBe(3);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(plutoDeterminedDefender),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(plutoDeterminedDefender)).toBe(0);
    });

    it("removes only up to 3 damage when Pluto has more than 3 damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [{ card: plutoDeterminedDefender, damage: 5, isDrying: false }], deck: 2 },
        { deck: 2 },
      );

      expect(testEngine.asPlayerOne().getDamage(plutoDeterminedDefender)).toBe(5);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(plutoDeterminedDefender),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(plutoDeterminedDefender)).toBe(2);
    });

    it("does not trigger on the opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [{ card: plutoDeterminedDefender, damage: 3, isDrying: false }], deck: 2 },
        { deck: 2 },
      );

      expect(testEngine.asPlayerOne().getDamage(plutoDeterminedDefender)).toBe(3);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // At the start of player two's turn, Pluto's ability should NOT trigger
      expect(testEngine.asPlayerOne().getDamage(plutoDeterminedDefender)).toBe(3);
    });
  });
});
