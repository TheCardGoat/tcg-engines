import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockAction } from "@tcg/lorcana-engine/testing";
import { tiggerOneOfAKind } from "./127-tigger-one-of-a-kind";

const action1 = createMockAction({
  id: "tigger-test-action-1",
  name: "Test Action One",
  cost: 1,
  text: "A test action.",
});

const action2 = createMockAction({
  id: "tigger-test-action-2",
  name: "Test Action Two",
  cost: 1,
  text: "Another test action.",
});

describe("Tigger - One of a Kind", () => {
  describe("ENERGETIC — Whenever you play an action, this character gets +2 {S} this turn.", () => {
    it("gains +2 strength when you play an action", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [tiggerOneOfAKind],
        hand: [action1],
        inkwell: action1.cost,
      });

      const baseStrength = tiggerOneOfAKind.strength;
      expect(testEngine.asPlayerOne().getCardStrength(tiggerOneOfAKind)).toBe(baseStrength);

      expect(testEngine.asPlayerOne().playCard(action1)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(tiggerOneOfAKind)).toBe(baseStrength + 2);
    });

    it("stacks +2 strength for each action played in the same turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [tiggerOneOfAKind],
        hand: [action1, action2],
        inkwell: action1.cost + action2.cost,
      });

      const baseStrength = tiggerOneOfAKind.strength;

      expect(testEngine.asPlayerOne().playCard(action1)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardStrength(tiggerOneOfAKind)).toBe(baseStrength + 2);

      expect(testEngine.asPlayerOne().playCard(action2)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardStrength(tiggerOneOfAKind)).toBe(baseStrength + 4);
    });

    it("strength bonus expires at the end of the turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [tiggerOneOfAKind],
          hand: [action1],
          inkwell: action1.cost,
          deck: 1,
        },
        { deck: 1 },
      );

      const baseStrength = tiggerOneOfAKind.strength;

      expect(testEngine.asPlayerOne().playCard(action1)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardStrength(tiggerOneOfAKind)).toBe(baseStrength + 2);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(tiggerOneOfAKind)).toBe(baseStrength);
    });
  });
});
