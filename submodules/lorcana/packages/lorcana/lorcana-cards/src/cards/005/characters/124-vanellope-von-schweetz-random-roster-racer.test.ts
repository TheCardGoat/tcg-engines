import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { vanellopeVonSchweetzRandomRosterRacer } from "./124-vanellope-von-schweetz-random-roster-racer";

describe("Vanellope von Schweetz - Random Roster Racer", () => {
  describe("PIXLEXIA — When you play this character, she gains Evasive until the start of your next turn.", () => {
    it("gains Evasive immediately when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: vanellopeVonSchweetzRandomRosterRacer.cost,
          hand: [vanellopeVonSchweetzRandomRosterRacer],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.hasKeyword(vanellopeVonSchweetzRandomRosterRacer, "Evasive")).toBe(false);

      expect(
        testEngine.asPlayerOne().playCard(vanellopeVonSchweetzRandomRosterRacer),
      ).toBeSuccessfulCommand();

      expect(testEngine.hasKeyword(vanellopeVonSchweetzRandomRosterRacer, "Evasive")).toBe(true);
    });

    it("Evasive persists during opponent's turn and expires at start of controller's next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: vanellopeVonSchweetzRandomRosterRacer.cost,
          hand: [vanellopeVonSchweetzRandomRosterRacer],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(vanellopeVonSchweetzRandomRosterRacer),
      ).toBeSuccessfulCommand();

      // Evasive is active during player one's turn
      expect(testEngine.hasKeyword(vanellopeVonSchweetzRandomRosterRacer, "Evasive")).toBe(true);

      // Pass player one's turn — still active during player two's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.hasKeyword(vanellopeVonSchweetzRandomRosterRacer, "Evasive")).toBe(true);

      // Pass player two's turn — Evasive expires at start of player one's next turn
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.hasKeyword(vanellopeVonSchweetzRandomRosterRacer, "Evasive")).toBe(false);
    });
  });
});
