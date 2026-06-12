import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { weightSet } from "./204-weight-set";

const strongCharacter = createMockCharacter({
  id: "weight-set-strong-char",
  name: "Strong Character",
  cost: 3,
  strength: 5,
});

const weakCharacter = createMockCharacter({
  id: "weight-set-weak-char",
  name: "Weak Character",
  cost: 2,
  strength: 2,
});

describe("Weight Set", () => {
  describe("TRAINING — Whenever you play a character with 4 {S} or more, you may pay 1 {I} to draw a card.", () => {
    it("triggers when playing a character with 4 or more strength", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [strongCharacter],
        inkwell: strongCharacter.cost + 1,
        play: [weightSet],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(strongCharacter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("draws a card when the optional pay 1 is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [strongCharacter],
        inkwell: strongCharacter.cost + 1,
        play: [weightSet],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(strongCharacter)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(testEngine.asPlayerOne().resolvePendingByCard(weightSet)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1, deck: 1 });
    });

    it("does not draw a card when the optional is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [strongCharacter],
        inkwell: strongCharacter.cost + 1,
        play: [weightSet],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(strongCharacter)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(weightSet, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 0, deck: 2 });
    });

    it("does not trigger when playing a character with fewer than 4 strength", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [weakCharacter],
        inkwell: weakCharacter.cost,
        play: [weightSet],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(weakCharacter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 0, deck: 2 });
    });

    it("does not trigger when opponent plays a character with 4 or more strength", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [weightSet], deck: 2 },
        { hand: [strongCharacter], inkwell: strongCharacter.cost },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().playCard(strongCharacter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
