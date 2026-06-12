import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { simbaAdventurousSuccessor } from "./125-simba-adventurous-successor";

const ally = createMockCharacter({
  id: "simba-adventurous-successor-ally",
  name: "Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const opponent = createMockCharacter({
  id: "simba-adventurous-successor-opponent",
  name: "Opponent Character",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Simba - Adventurous Successor", () => {
  describe("I LAUGH IN THE FACE OF DANGER - When you play this character, chosen character gets +2 {S} this turn.", () => {
    it("gives +2 strength to a chosen ally when Simba is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [simbaAdventurousSuccessor],
        inkwell: simbaAdventurousSuccessor.cost,
        play: [ally],
        deck: 1,
      });

      const strengthBefore = testEngine.asPlayerOne().getCardStrength(ally);

      expect(testEngine.asPlayerOne().playCard(simbaAdventurousSuccessor)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(simbaAdventurousSuccessor, { targets: [ally] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(ally)).toBe(strengthBefore + 2);
    });

    it("gives +2 strength to Simba himself when targeted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [simbaAdventurousSuccessor],
        inkwell: simbaAdventurousSuccessor.cost,
        deck: 1,
      });

      expect(testEngine.asPlayerOne().playCard(simbaAdventurousSuccessor)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(simbaAdventurousSuccessor, {
          targets: [simbaAdventurousSuccessor],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(simbaAdventurousSuccessor)).toBe(
        simbaAdventurousSuccessor.strength + 2,
      );
    });

    it("strength bonus expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [simbaAdventurousSuccessor],
          inkwell: simbaAdventurousSuccessor.cost,
          play: [ally],
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      const strengthBefore = testEngine.asPlayerOne().getCardStrength(ally);

      expect(testEngine.asPlayerOne().playCard(simbaAdventurousSuccessor)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(simbaAdventurousSuccessor, { targets: [ally] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(ally)).toBe(strengthBefore + 2);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(ally)).toBe(strengthBefore);
    });

    it("can target an opponent's character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [simbaAdventurousSuccessor],
          inkwell: simbaAdventurousSuccessor.cost,
          deck: 1,
        },
        {
          play: [opponent],
          deck: 1,
        },
      );

      const strengthBefore = testEngine.asPlayerTwo().getCardStrength(opponent);

      expect(testEngine.asPlayerOne().playCard(simbaAdventurousSuccessor)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(simbaAdventurousSuccessor, { targets: [opponent] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(opponent)).toBe(strengthBefore + 2);
    });
  });
});
