import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockAction } from "@tcg/lorcana-engine/testing";
import { mulanEnemyOfEntanglement } from "./115-mulan-enemy-of-entanglement";

const action1 = createMockAction({
  id: "mulan-test-action-1",
  name: "Test Action One",
  cost: 1,
  text: "A test action.",
});

const action2 = createMockAction({
  id: "mulan-test-action-2",
  name: "Test Action Two",
  cost: 1,
  text: "Another test action.",
});

const action3 = createMockAction({
  id: "mulan-test-action-3",
  name: "Test Action Three",
  cost: 1,
  text: "Yet another test action.",
});

describe("Mulan - Enemy of Entanglement", () => {
  describe("TIME TO SHINE — Whenever you play an action, this character gets +2 {S} this turn.", () => {
    it("gains +2 strength when you play an action", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mulanEnemyOfEntanglement],
        hand: [action1],
        inkwell: action1.cost,
      });

      const baseStrength = mulanEnemyOfEntanglement.strength;
      expect(testEngine.asPlayerOne().getCardStrength(mulanEnemyOfEntanglement)).toBe(baseStrength);

      expect(testEngine.asPlayerOne().playCard(action1)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(mulanEnemyOfEntanglement)).toBe(
        baseStrength + 2,
      );
    });

    it("stacks +2 strength for each action played in the same turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mulanEnemyOfEntanglement],
        hand: [action1, action2, action3],
        inkwell: action1.cost + action2.cost + action3.cost,
      });

      const baseStrength = mulanEnemyOfEntanglement.strength;

      expect(testEngine.asPlayerOne().playCard(action1)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardStrength(mulanEnemyOfEntanglement)).toBe(
        baseStrength + 2,
      );

      expect(testEngine.asPlayerOne().playCard(action2)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardStrength(mulanEnemyOfEntanglement)).toBe(
        baseStrength + 4,
      );

      expect(testEngine.asPlayerOne().playCard(action3)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardStrength(mulanEnemyOfEntanglement)).toBe(
        baseStrength + 6,
      );
    });

    it("strength bonus expires at the end of the turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mulanEnemyOfEntanglement],
          hand: [action1],
          inkwell: action1.cost,
          deck: 1,
        },
        { deck: 1 },
      );

      const baseStrength = mulanEnemyOfEntanglement.strength;

      expect(testEngine.asPlayerOne().playCard(action1)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardStrength(mulanEnemyOfEntanglement)).toBe(
        baseStrength + 2,
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(mulanEnemyOfEntanglement)).toBe(baseStrength);
    });
  });
});
