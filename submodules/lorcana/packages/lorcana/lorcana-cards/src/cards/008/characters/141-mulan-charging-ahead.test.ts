import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mulanChargingAhead } from "./141-mulan-charging-ahead";

const opponentCharacter = createMockCharacter({
  id: "mulan-test-opponent",
  name: "Opponent Character",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
});

describe("Mulan - Charging Ahead", () => {
  describe("Reckless", () => {
    it("has the Reckless keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mulanChargingAhead],
      });

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: mulanChargingAhead,
        keyword: "Reckless",
      });
    });
  });

  describe("BURST OF SPEED - During your turn, this character gains Evasive.", () => {
    it("has Evasive during your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mulanChargingAhead],
          deck: 1,
        },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: mulanChargingAhead,
        keyword: "Evasive",
      });
    });

    it("does not have Evasive during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mulanChargingAhead],
          deck: 1,
        },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).not.toHaveKeyword({
        card: mulanChargingAhead,
        keyword: "Evasive",
      });
    });
  });

  describe("LONG RANGE - This character can challenge ready characters.", () => {
    it("can challenge a ready character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mulanChargingAhead, isDrying: false }],
          deck: 1,
        },
        {
          play: [opponentCharacter],
          deck: 1,
        },
      );

      // Opponent character is ready (not exerted), Mulan should still be able to challenge it
      expect(testEngine.asPlayerOne().isExerted(opponentCharacter)).toBe(false);
      expect(
        testEngine.asPlayerOne().challenge(mulanChargingAhead, opponentCharacter),
      ).toBeSuccessfulCommand();
    });
  });
});
