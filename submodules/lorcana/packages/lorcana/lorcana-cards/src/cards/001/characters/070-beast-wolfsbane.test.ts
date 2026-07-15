import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { beastWolfsbane } from "./070-beast-wolfsbane";

const damagedOpponent = createMockCharacter({
  id: "beast-test-damaged-opponent",
  name: "Damaged Opponent",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
});

const anotherDamagedOpponent = createMockCharacter({
  id: "beast-test-damaged-opponent-2",
  name: "Another Damaged Opponent",
  cost: 3,
  strength: 3,
  willpower: 5,
  lore: 1,
});

const undamagedOpponent = createMockCharacter({
  id: "beast-test-undamaged-opponent",
  name: "Undamaged Opponent",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
});

const ownDamagedCharacter = createMockCharacter({
  id: "beast-test-own-damaged",
  name: "Own Damaged Character",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
});

describe("Beast - Wolfsbane", () => {
  describe("Rush", () => {
    it("has Rush keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [beastWolfsbane],
      });

      expect(testEngine.hasKeyword(beastWolfsbane, "Rush")).toBe(true);
    });
  });

  describe("ROAR - When you play this character, exert all opposing damaged characters", () => {
    it("exerts all opposing damaged characters when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [beastWolfsbane],
          inkwell: beastWolfsbane.cost,
          deck: 5,
        },
        {
          play: [
            { card: damagedOpponent, damage: 1 },
            { card: anotherDamagedOpponent, damage: 2 },
            undamagedOpponent,
          ],
        },
      );

      expect(testEngine.asPlayerOne().playCard(beastWolfsbane)).toBeSuccessfulCommand();

      // selector: "all" should auto-resolve without requiring bag interaction
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Both damaged opposing characters should be exerted
      expect(testEngine.isExerted(damagedOpponent)).toBe(true);
      expect(testEngine.isExerted(anotherDamagedOpponent)).toBe(true);
      // Undamaged opponent should not be exerted
      expect(testEngine.isExerted(undamagedOpponent)).toBe(false);
    });

    it("does not exert own damaged characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [beastWolfsbane],
          play: [{ card: ownDamagedCharacter, damage: 1 }],
          inkwell: beastWolfsbane.cost,
          deck: 5,
        },
        {
          play: [{ card: damagedOpponent, damage: 1 }],
        },
      );

      expect(testEngine.asPlayerOne().playCard(beastWolfsbane)).toBeSuccessfulCommand();

      // Opposing damaged character should be exerted
      expect(testEngine.isExerted(damagedOpponent)).toBe(true);
      // Own damaged character should NOT be exerted (targets opposing only)
      expect(testEngine.isExerted(ownDamagedCharacter)).toBe(false);
    });

    it("does nothing when no opposing damaged characters exist", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [beastWolfsbane],
          inkwell: beastWolfsbane.cost,
          deck: 5,
        },
        {
          play: [undamagedOpponent],
        },
      );

      expect(testEngine.asPlayerOne().playCard(beastWolfsbane)).toBeSuccessfulCommand();

      // Card should still be played successfully
      expect(testEngine.asPlayerOne().getCardZone(beastWolfsbane)).toBe("play");
      // Undamaged opponent should not be exerted
      expect(testEngine.isExerted(undamagedOpponent)).toBe(false);
    });

    it("does nothing when opponent has no characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [beastWolfsbane],
          inkwell: beastWolfsbane.cost,
          deck: 5,
        },
        {},
      );

      expect(testEngine.asPlayerOne().playCard(beastWolfsbane)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(beastWolfsbane)).toBe("play");
    });
  });
});
