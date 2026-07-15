import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { johnSilverSternCaptain } from "./194-john-silver-stern-captain";

const readyOpponent = createMockCharacter({
  id: "john-silver-ready-opponent",
  name: "Ready Opponent",
  cost: 3,
  strength: 2,
  willpower: 5,
});

const anotherReadyOpponent = createMockCharacter({
  id: "john-silver-ready-opponent-2",
  name: "Ready Opponent 2",
  cost: 2,
  strength: 1,
  willpower: 4,
});

describe("John Silver - Stern Captain", () => {
  describe("Shift 5", () => {
    it("has the Shift keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [johnSilverSternCaptain] },
        {},
      );

      expect(testEngine.asPlayerOne().hasKeyword(johnSilverSternCaptain, "Shift")).toBe(true);
    });
  });

  describe("Resist +2", () => {
    it("has the Resist keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [johnSilverSternCaptain] },
        {},
      );

      expect(testEngine.asPlayerOne().hasKeyword(johnSilverSternCaptain, "Resist")).toBe(true);
    });
  });

  describe("DON'T JUST SIT THERE! - At the start of your turn, deal 1 damage to each opposing ready character.", () => {
    it("deals 1 damage to each opposing ready character at the start of your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [johnSilverSternCaptain] },
        { play: [readyOpponent, anotherReadyOpponent] },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(johnSilverSternCaptain),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(readyOpponent)).toBe(1);
      expect(testEngine.asPlayerTwo().getDamage(anotherReadyOpponent)).toBe(1);
    });

    it("deals exactly 1 damage (not more) to each opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [johnSilverSternCaptain] },
        { play: [readyOpponent] },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(johnSilverSternCaptain),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(readyOpponent)).toBe(1);
    });

    it("does not deal damage to your own characters", () => {
      const ownCharacter = createMockCharacter({
        id: "john-silver-own",
        name: "Own Character",
        cost: 2,
        willpower: 3,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [johnSilverSternCaptain, ownCharacter] },
        { play: [readyOpponent] },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(johnSilverSternCaptain),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(ownCharacter)).toBe(0);
      expect(testEngine.asPlayerTwo().getDamage(readyOpponent)).toBe(1);
    });

    it("triggers at the start of John Silver's controller's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [readyOpponent] },
        { play: [johnSilverSternCaptain] },
      );

      // Player one passes - it's now player two's turn (John Silver's controller's turn)
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // At start of player two's turn, John Silver should trigger
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(johnSilverSternCaptain),
      ).toBeSuccessfulCommand();

      // Player one's readyOpponent should take 1 damage
      expect(testEngine.asPlayerOne().getDamage(readyOpponent)).toBe(1);
    });
  });
});
