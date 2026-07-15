import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { jafarKeeperOfSecrets } from "./044-jafar-keeper-of-secrets";

const handCard1 = createMockCharacter({
  id: "jafar-kos-hand-1",
  name: "Hand Card 1",
  cost: 1,
});

const handCard2 = createMockCharacter({
  id: "jafar-kos-hand-2",
  name: "Hand Card 2",
  cost: 1,
});

const handCard3 = createMockCharacter({
  id: "jafar-kos-hand-3",
  name: "Hand Card 3",
  cost: 1,
});

describe("Jafar - Keeper of Secrets", () => {
  describe("HIDDEN WONDERS: This character gets +1 {S} for each card in your hand.", () => {
    it("has 0 strength when controller has no cards in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [jafarKeeperOfSecrets],
          hand: [],
        },
        { deck: 1 },
      );

      expect(testEngine.asServer().getCardStrength(jafarKeeperOfSecrets)).toBe(0);
      expect(testEngine.asPlayerOne().getCardStrength(jafarKeeperOfSecrets)).toBe(0);
    });

    it("has 1 strength when controller has 1 card in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [jafarKeeperOfSecrets],
          hand: [handCard1],
        },
        { deck: 1 },
      );

      expect(testEngine.asServer().getCardStrength(jafarKeeperOfSecrets)).toBe(1);
      expect(testEngine.asPlayerOne().getCardStrength(jafarKeeperOfSecrets)).toBe(1);
    });

    it("has 2 strength when controller has 2 cards in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [jafarKeeperOfSecrets],
          hand: [handCard1, handCard2],
        },
        { deck: 1 },
      );

      expect(testEngine.asServer().getCardStrength(jafarKeeperOfSecrets)).toBe(2);
    });

    it("has 3 strength when controller has 3 cards in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [jafarKeeperOfSecrets],
          hand: [handCard1, handCard2, handCard3],
        },
        { deck: 1 },
      );

      expect(testEngine.asServer().getCardStrength(jafarKeeperOfSecrets)).toBe(3);
    });

    it("opponent's hand cards do not affect strength", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [jafarKeeperOfSecrets],
          hand: [],
        },
        {
          hand: [handCard1, handCard2, handCard3],
          deck: 1,
        },
      );

      expect(testEngine.asServer().getCardStrength(jafarKeeperOfSecrets)).toBe(0);
    });
  });
});
