import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { aladdinIntrepidCommander } from "./119-aladdin-intrepid-commander";

const ally = createMockCharacter({
  id: "aladdin-test-ally",
  name: "Test Ally",
  cost: 1,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const ally2 = createMockCharacter({
  id: "aladdin-test-ally-2",
  name: "Test Ally Two",
  cost: 1,
  strength: 4,
  willpower: 2,
  lore: 1,
});

describe("Aladdin - Intrepid Commander", () => {
  describe("Shift 2", () => {
    it("has Shift keyword", () => {
      expect(aladdinIntrepidCommander.abilities).toHaveLength(2);
      const shiftAbility = aladdinIntrepidCommander.abilities![0] as {
        type: string;
        keyword: string;
        cost: { ink: number };
      };
      expect(shiftAbility.type).toBe("keyword");
      expect(shiftAbility.keyword).toBe("Shift");
      expect(shiftAbility.cost).toEqual({ ink: 2 });
    });
  });

  describe("REMEMBER YOUR TRAINING - When you play this character, your characters get +2 {S} this turn.", () => {
    it("gives all your characters +2 strength when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [aladdinIntrepidCommander],
        inkwell: aladdinIntrepidCommander.cost,
        play: [ally, ally2],
        deck: 5,
      });

      // Base strengths before playing Aladdin
      expect(testEngine.asPlayerOne().getCardStrength(ally)).toBe(2);
      expect(testEngine.asPlayerOne().getCardStrength(ally2)).toBe(4);

      expect(testEngine.asPlayerOne().playCard(aladdinIntrepidCommander)).toBeSuccessfulCommand();

      // All your characters should have +2 strength
      expect(testEngine.asPlayerOne().getCardStrength(ally)).toBe(4);
      expect(testEngine.asPlayerOne().getCardStrength(ally2)).toBe(6);
      // Aladdin himself should also get the buff (he's in play when the trigger resolves)
      expect(testEngine.asPlayerOne().getCardStrength(aladdinIntrepidCommander)).toBe(3);
    });

    it("strength buff expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [aladdinIntrepidCommander],
        inkwell: aladdinIntrepidCommander.cost,
        play: [ally],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(aladdinIntrepidCommander)).toBeSuccessfulCommand();

      // Buff is active this turn
      expect(testEngine.asPlayerOne().getCardStrength(ally)).toBe(4);

      // Pass both players' turns
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Buff should have expired
      expect(testEngine.asPlayerOne().getCardStrength(ally)).toBe(2);
      expect(testEngine.asPlayerOne().getCardStrength(aladdinIntrepidCommander)).toBe(1);
    });

    it("does not affect opponent's characters", () => {
      const opponentCharacter = createMockCharacter({
        id: "aladdin-test-opponent",
        name: "Opponent Character",
        cost: 1,
        strength: 3,
        willpower: 3,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [aladdinIntrepidCommander],
          inkwell: aladdinIntrepidCommander.cost,
          deck: 5,
        },
        {
          play: [opponentCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(aladdinIntrepidCommander)).toBeSuccessfulCommand();

      // Opponent's character should NOT be buffed
      expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter)).toBe(3);
    });
  });
});
