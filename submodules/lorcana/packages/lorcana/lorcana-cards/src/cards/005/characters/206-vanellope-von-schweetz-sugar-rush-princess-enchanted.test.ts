import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { vanellopeVonSchweetzSugarRushPrincessEnchanted } from "./206-vanellope-von-schweetz-sugar-rush-princess-enchanted";

const princessAlly = createMockCharacter({
  id: "vanellope-enchanted-princess-ally",
  name: "Princess Ally",
  cost: 2,
  strength: 2,
  willpower: 2,
  classifications: ["Storyborn", "Hero", "Princess"],
});

const nonPrincessAlly = createMockCharacter({
  id: "vanellope-enchanted-non-princess",
  name: "Non Princess Ally",
  cost: 2,
  strength: 2,
  willpower: 2,
  classifications: ["Storyborn", "Hero"],
});

const opponentCharacterA = createMockCharacter({
  id: "vanellope-enchanted-opponent-a",
  name: "Opponent A",
  cost: 3,
  strength: 3,
  willpower: 3,
});

const opponentCharacterB = createMockCharacter({
  id: "vanellope-enchanted-opponent-b",
  name: "Opponent B",
  cost: 2,
  strength: 2,
  willpower: 2,
});

describe("Vanellope von Schweetz - Sugar Rush Princess (Enchanted)", () => {
  it("should have Shift 2 keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [vanellopeVonSchweetzSugarRushPrincessEnchanted],
      deck: 1,
    });

    expect(testEngine.hasKeyword(vanellopeVonSchweetzSugarRushPrincessEnchanted, "Shift")).toBe(
      true,
    );
  });

  describe("I HEREBY DECREE - Whenever you play another Princess character, all opposing characters get -1 {S} until the start of your next turn.", () => {
    it("reduces all opposing characters' strength by 1 when a Princess character is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [vanellopeVonSchweetzSugarRushPrincessEnchanted],
          hand: [princessAlly],
          inkwell: princessAlly.cost,
          deck: 1,
        },
        {
          play: [opponentCharacterA, opponentCharacterB],
        },
      );

      expect(testEngine.asPlayerOne().getCardStrength(opponentCharacterA)).toBe(
        opponentCharacterA.strength,
      );
      expect(testEngine.asPlayerOne().getCardStrength(opponentCharacterB)).toBe(
        opponentCharacterB.strength,
      );

      expect(testEngine.asPlayerOne().playCard(princessAlly)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(opponentCharacterA)).toBe(
        opponentCharacterA.strength - 1,
      );
      expect(testEngine.asPlayerOne().getCardStrength(opponentCharacterB)).toBe(
        opponentCharacterB.strength - 1,
      );
    });

    it("does NOT trigger when playing a non-Princess character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [vanellopeVonSchweetzSugarRushPrincessEnchanted],
          hand: [nonPrincessAlly],
          inkwell: nonPrincessAlly.cost,
          deck: 1,
        },
        {
          play: [opponentCharacterA],
        },
      );

      expect(testEngine.asPlayerOne().playCard(nonPrincessAlly)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(opponentCharacterA)).toBe(
        opponentCharacterA.strength,
      );
    });

    it("strength reduction expires at start of your next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [vanellopeVonSchweetzSugarRushPrincessEnchanted],
          hand: [princessAlly],
          inkwell: princessAlly.cost,
          deck: 1,
        },
        {
          play: [opponentCharacterA],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(princessAlly)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacterA)).toBe(
        opponentCharacterA.strength - 1,
      );

      // Pass to opponent's turn - reduction should still be active
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacterA)).toBe(
        opponentCharacterA.strength - 1,
      );

      // Pass back to our turn - reduction should expire
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacterA)).toBe(
        opponentCharacterA.strength,
      );
    });

    it("does NOT trigger when Vanellope herself is played (excludeSelf)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [vanellopeVonSchweetzSugarRushPrincessEnchanted],
          inkwell: vanellopeVonSchweetzSugarRushPrincessEnchanted.cost,
          deck: 1,
        },
        {
          play: [opponentCharacterA],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(vanellopeVonSchweetzSugarRushPrincessEnchanted),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(opponentCharacterA)).toBe(
        opponentCharacterA.strength,
      );
    });
  });
});
