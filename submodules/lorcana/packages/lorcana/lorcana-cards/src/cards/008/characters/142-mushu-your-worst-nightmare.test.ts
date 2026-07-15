import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mushuYourWorstNightmare } from "./142-mushu-your-worst-nightmare";

const anotherCharacter = createMockCharacter({
  id: "mushu-test-another-char",
  name: "Another Character",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

const opponentCharacter = createMockCharacter({
  id: "mushu-test-opponent-char",
  name: "Opponent Character",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Mushu - Your Worst Nightmare", () => {
  it("has Shift 4 keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [mushuYourWorstNightmare],
    });

    expect(testEngine.hasKeyword(mushuYourWorstNightmare, "Shift")).toBe(true);
  });

  describe("ALL FIRED UP - Whenever you play another character, they gain Rush, Reckless, and Evasive this turn.", () => {
    it("grants Rush, Reckless, and Evasive to another character played this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mushuYourWorstNightmare],
        hand: [anotherCharacter],
        inkwell: anotherCharacter.cost,
      });

      expect(testEngine.hasKeyword(anotherCharacter, "Rush")).toBe(false);
      expect(testEngine.hasKeyword(anotherCharacter, "Reckless")).toBe(false);
      expect(testEngine.hasKeyword(anotherCharacter, "Evasive")).toBe(false);

      expect(testEngine.asPlayerOne().playCard(anotherCharacter)).toBeSuccessfulCommand();

      expect(testEngine.hasKeyword(anotherCharacter, "Rush")).toBe(true);
      expect(testEngine.hasKeyword(anotherCharacter, "Reckless")).toBe(true);
      expect(testEngine.hasKeyword(anotherCharacter, "Evasive")).toBe(true);
    });

    it("keywords expire at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mushuYourWorstNightmare],
          hand: [anotherCharacter],
          inkwell: anotherCharacter.cost,
        },
        {},
      );

      expect(testEngine.asPlayerOne().playCard(anotherCharacter)).toBeSuccessfulCommand();

      expect(testEngine.hasKeyword(anotherCharacter, "Rush")).toBe(true);
      expect(testEngine.hasKeyword(anotherCharacter, "Reckless")).toBe(true);
      expect(testEngine.hasKeyword(anotherCharacter, "Evasive")).toBe(true);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.hasKeyword(anotherCharacter, "Rush")).toBe(false);
      expect(testEngine.hasKeyword(anotherCharacter, "Reckless")).toBe(false);
      expect(testEngine.hasKeyword(anotherCharacter, "Evasive")).toBe(false);
    });

    it("does NOT trigger when Mushu itself is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mushuYourWorstNightmare],
        inkwell: mushuYourWorstNightmare.cost,
      });

      expect(testEngine.asPlayerOne().playCard(mushuYourWorstNightmare)).toBeSuccessfulCommand();

      expect(testEngine.hasKeyword(mushuYourWorstNightmare, "Rush")).toBe(false);
      expect(testEngine.hasKeyword(mushuYourWorstNightmare, "Reckless")).toBe(false);
      expect(testEngine.hasKeyword(mushuYourWorstNightmare, "Evasive")).toBe(false);
    });

    it("does NOT trigger when opponent plays a character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mushuYourWorstNightmare],
        },
        {
          hand: [opponentCharacter],
          inkwell: opponentCharacter.cost,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().playCard(opponentCharacter)).toBeSuccessfulCommand();

      expect(testEngine.hasKeyword(opponentCharacter, "Rush")).toBe(false);
      expect(testEngine.hasKeyword(opponentCharacter, "Reckless")).toBe(false);
      expect(testEngine.hasKeyword(opponentCharacter, "Evasive")).toBe(false);
    });

    it("does NOT grant keywords to Mushu itself (excludeSelf)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mushuYourWorstNightmare],
        hand: [anotherCharacter],
        inkwell: anotherCharacter.cost,
      });

      expect(testEngine.asPlayerOne().playCard(anotherCharacter)).toBeSuccessfulCommand();

      // Mushu should not have gained any keywords
      expect(testEngine.hasKeyword(mushuYourWorstNightmare, "Rush")).toBe(false);
      expect(testEngine.hasKeyword(mushuYourWorstNightmare, "Evasive")).toBe(false);
      expect(testEngine.hasKeyword(mushuYourWorstNightmare, "Reckless")).toBe(false);
    });
  });
});
