import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { scarShamelessFirebrand } from "./123-scar-shameless-firebrand";

const oneCostCharacter = createMockCharacter({
  id: "scar-sf-1-cost",
  name: "One Cost Character",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const twoCostCharacter = createMockCharacter({
  id: "scar-sf-2-cost",
  name: "Two Cost Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const threeCostCharacter = createMockCharacter({
  id: "scar-sf-3-cost",
  name: "Three Cost Character",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
});

const fourCostCharacter = createMockCharacter({
  id: "scar-sf-4-cost",
  name: "Four Cost Character",
  cost: 4,
  strength: 4,
  willpower: 5,
  lore: 2,
});

describe("Scar - Shameless Firebrand", () => {
  it("has Shift keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [scarShamelessFirebrand],
    });

    expect(testEngine.asPlayerOne().hasKeyword(scarShamelessFirebrand, "Shift")).toBe(true);
  });

  describe("ROUSING SPEECH — When you play this character, ready your characters with cost 3 or less. They can't quest for the rest of this turn.", () => {
    it("readies all characters with cost 3 or less and applies cant-quest restriction", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [scarShamelessFirebrand],
        inkwell: scarShamelessFirebrand.cost,
        play: [
          { card: oneCostCharacter, exerted: true },
          { card: twoCostCharacter, exerted: true },
          { card: threeCostCharacter, exerted: true },
        ],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(scarShamelessFirebrand)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(oneCostCharacter)).toBe(false);
      expect(testEngine.asPlayerOne().isExerted(twoCostCharacter)).toBe(false);
      expect(testEngine.asPlayerOne().isExerted(threeCostCharacter)).toBe(false);

      expect(testEngine.asPlayerOne()).toHaveRestriction({
        card: oneCostCharacter,
        restriction: "cant-quest",
      });
      expect(testEngine.asPlayerOne()).toHaveRestriction({
        card: twoCostCharacter,
        restriction: "cant-quest",
      });
      expect(testEngine.asPlayerOne()).toHaveRestriction({
        card: threeCostCharacter,
        restriction: "cant-quest",
      });
    });

    it("does not ready characters with cost greater than 3", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [scarShamelessFirebrand],
        inkwell: scarShamelessFirebrand.cost,
        play: [{ card: fourCostCharacter, exerted: true }],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(scarShamelessFirebrand)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(fourCostCharacter)).toBe(true);
      expect(testEngine.asPlayerOne()).not.toHaveRestriction({
        card: fourCostCharacter,
        restriction: "cant-quest",
      });
    });

    it("cant-quest restriction expires at the end of the turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [scarShamelessFirebrand],
          inkwell: scarShamelessFirebrand.cost,
          play: [{ card: oneCostCharacter, exerted: true }],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(scarShamelessFirebrand)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveRestriction({
        card: oneCostCharacter,
        restriction: "cant-quest",
      });

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).not.toHaveRestriction({
        card: oneCostCharacter,
        restriction: "cant-quest",
      });
    });

    it("does not affect opponent's characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [scarShamelessFirebrand],
          inkwell: scarShamelessFirebrand.cost,
          deck: 2,
        },
        {
          play: [{ card: oneCostCharacter, exerted: true }],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(scarShamelessFirebrand)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().isExerted(oneCostCharacter)).toBe(true);
      expect(testEngine.asPlayerTwo()).not.toHaveRestriction({
        card: oneCostCharacter,
        restriction: "cant-quest",
      });
    });
  });
});
