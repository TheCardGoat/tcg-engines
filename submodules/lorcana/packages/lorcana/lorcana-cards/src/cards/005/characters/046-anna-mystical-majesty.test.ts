import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { annaMysticalMajesty } from "./046-anna-mystical-majesty";

const opponentCharacter1 = createMockCharacter({
  id: "anna-test-opponent-1",
  name: "Opponent Character 1",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const opponentCharacter2 = createMockCharacter({
  id: "anna-test-opponent-2",
  name: "Opponent Character 2",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
});

const ownCharacter = createMockCharacter({
  id: "anna-test-own-character",
  name: "Own Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Anna - Mystical Majesty", () => {
  it("has Shift 4 keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [annaMysticalMajesty],
    });

    expect(testEngine.hasKeyword(annaMysticalMajesty, "Shift")).toBe(true);
  });

  describe("EXCEPTIONAL POWER - When you play this character, exert all opposing characters.", () => {
    it("exerts all opposing characters when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [annaMysticalMajesty],
          inkwell: annaMysticalMajesty.cost,
          deck: 5,
        },
        {
          play: [opponentCharacter1, opponentCharacter2],
        },
      );

      expect(testEngine.asPlayerOne().playCard(annaMysticalMajesty)).toBeSuccessfulCommand();

      // selector: "all" should auto-resolve without requiring bag interaction
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Both opposing characters should be exerted
      expect(testEngine.isExerted(opponentCharacter1)).toBe(true);
      expect(testEngine.isExerted(opponentCharacter2)).toBe(true);
    });

    it("does not exert own characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [annaMysticalMajesty],
          play: [ownCharacter],
          inkwell: annaMysticalMajesty.cost,
          deck: 5,
        },
        {
          play: [opponentCharacter1],
        },
      );

      expect(testEngine.asPlayerOne().playCard(annaMysticalMajesty)).toBeSuccessfulCommand();

      // Opposing character should be exerted
      expect(testEngine.isExerted(opponentCharacter1)).toBe(true);
      // Own character should NOT be exerted
      expect(testEngine.isExerted(ownCharacter)).toBe(false);
    });

    it("does nothing when opponent has no characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [annaMysticalMajesty],
          inkwell: annaMysticalMajesty.cost,
          deck: 5,
        },
        {},
      );

      expect(testEngine.asPlayerOne().playCard(annaMysticalMajesty)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(annaMysticalMajesty)).toBe("play");
    });
  });
});
