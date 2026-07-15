import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { minnieMouseStoryteller } from "./031-minnie-mouse-storyteller";

const allyCharacterA = createMockCharacter({
  id: "minnie-storyteller-ally-a",
  name: "Ally Character A",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const allyCharacterB = createMockCharacter({
  id: "minnie-storyteller-ally-b",
  name: "Ally Character B",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

const allyCharacterC = createMockCharacter({
  id: "minnie-storyteller-ally-c",
  name: "Ally Character C",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

const allyItem = createMockItem({
  id: "minnie-storyteller-item",
  name: "Test Item",
  cost: 2,
});

const opponentCharacter = createMockCharacter({
  id: "minnie-storyteller-opponent",
  name: "Opponent Character",
  cost: 5,
  strength: 8,
  willpower: 5,
  lore: 1,
});

describe("Minnie Mouse - Storyteller", () => {
  describe("GATHER AROUND - Whenever you play a character, this character gets +1 {L} this turn.", () => {
    it("gains +1 lore when a character is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [minnieMouseStoryteller],
          hand: [allyCharacterA],
          inkwell: allyCharacterA.cost,
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().getCardLore(minnieMouseStoryteller)).toBe(0);

      expect(testEngine.asPlayerOne().playCard(allyCharacterA)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(minnieMouseStoryteller)).toBe(1);
    });

    it("stacks lore bonus when multiple characters are played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [minnieMouseStoryteller],
          hand: [allyCharacterA, allyCharacterB],
          inkwell: allyCharacterA.cost + allyCharacterB.cost,
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(allyCharacterA)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardLore(minnieMouseStoryteller)).toBe(1);

      expect(testEngine.asPlayerOne().playCard(allyCharacterB)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardLore(minnieMouseStoryteller)).toBe(2);
    });

    it("does NOT trigger when an item is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [minnieMouseStoryteller],
          hand: [allyCharacterA, allyItem],
          inkwell: allyCharacterA.cost + allyItem.cost,
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(allyCharacterA)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardLore(minnieMouseStoryteller)).toBe(1);

      expect(testEngine.asPlayerOne().playCard(allyItem)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardLore(minnieMouseStoryteller)).toBe(1);
    });
  });

  describe("JUST ONE MORE - Whenever this character quests, chosen opposing character loses {S} equal to this character's {L} until the start of your next turn.", () => {
    it("reduces opposing character strength by Minnie's lore value when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [minnieMouseStoryteller],
          hand: [allyCharacterA, allyCharacterB, allyCharacterC],
          inkwell: allyCharacterA.cost + allyCharacterB.cost + allyCharacterC.cost,
          deck: 2,
        },
        {
          play: [opponentCharacter],
          deck: 2,
        },
      );

      // Play 3 characters to give Minnie +3 lore
      expect(testEngine.asPlayerOne().playCard(allyCharacterA)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(allyCharacterB)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(allyCharacterC)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(minnieMouseStoryteller)).toBe(3);

      // Quest with Minnie
      expect(testEngine.asPlayerOne().quest(minnieMouseStoryteller)).toBeSuccessfulCommand();

      // Before resolving, opponent's strength is unchanged
      expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter)).toBe(
        opponentCharacter.strength,
      );

      // Choose the opposing character for the strength reduction
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(minnieMouseStoryteller, { targets: [opponentCharacter] }),
      ).toBeSuccessfulCommand();

      // Opponent loses strength equal to Minnie's lore (3)
      expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter)).toBe(
        opponentCharacter.strength - 3,
      );
    });

    it("strength reduction persists through opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [minnieMouseStoryteller],
          hand: [allyCharacterA, allyCharacterB, allyCharacterC],
          inkwell: allyCharacterA.cost + allyCharacterB.cost + allyCharacterC.cost,
          deck: 2,
        },
        {
          play: [opponentCharacter],
          deck: 2,
        },
      );

      // Play 3 characters to give Minnie +3 lore
      expect(testEngine.asPlayerOne().playCard(allyCharacterA)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(allyCharacterB)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(allyCharacterC)).toBeSuccessfulCommand();

      // Quest with Minnie
      expect(testEngine.asPlayerOne().quest(minnieMouseStoryteller)).toBeSuccessfulCommand();

      // Choose the opposing character
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(minnieMouseStoryteller, { targets: [opponentCharacter] }),
      ).toBeSuccessfulCommand();

      // Verify reduction applied
      expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter)).toBe(
        opponentCharacter.strength - 3,
      );

      // Pass player one's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // During player two's turn, strength should still be reduced
      expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter)).toBe(
        opponentCharacter.strength - 3,
      );
    });
  });
});
