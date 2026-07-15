import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockItem } from "@tcg/lorcana-engine/testing";
import { vincenzoSantoriniOnTheRun } from "./124-vincenzo-santorini-on-the-run";

const opposingItem = createMockItem({
  id: "vincenzo-opposing-item",
  name: "Opposing Item",
  cost: 2,
});

const alliedItem = createMockItem({
  id: "vincenzo-allied-item",
  name: "Allied Item",
  cost: 2,
});

describe("Vincenzo Santorini - On the Run", () => {
  it("has Evasive keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: vincenzoSantoriniOnTheRun, isDrying: false }],
      deck: 5,
    });

    expect(testEngine.asPlayerOne().hasKeyword(vincenzoSantoriniOnTheRun, "Evasive")).toBe(true);
  });

  describe("NEUTRALIZE — Opposing items can't ready at the start of their players' turns.", () => {
    it("prevents an opposing exerted item from readying at the start of its controller's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: vincenzoSantoriniOnTheRun, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: opposingItem, exerted: true, isDrying: false }],
          deck: 5,
        },
      );

      // Start: P1's turn — opposing item is exerted.
      expect(testEngine.asPlayerTwo().isExerted(opposingItem)).toBe(true);

      // Pass to P2 — at start of their turn, the opposing item must NOT ready.
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().isExerted(opposingItem)).toBe(true);
    });

    it("does not prevent Vincenzo's controller's own items from readying", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: vincenzoSantoriniOnTheRun, isDrying: false },
            { card: alliedItem, exerted: true, isDrying: false },
          ],
          deck: 5,
        },
        { deck: 5 },
      );

      // P1 passes, P2 passes — back to P1's turn; allied item should ready.
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(alliedItem)).toBe(false);
    });

    it("readies an opposing item normally when Vincenzo is not in play", () => {
      // Control: without Vincenzo, the opposing item should ready naturally.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { deck: 5 },
        {
          play: [{ card: opposingItem, exerted: true, isDrying: false }],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().isExerted(opposingItem)).toBe(false);
    });
  });
});
