import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { grabYourSword, stitchNewDog } from "@tcg/lorcana-cards/cards/001";

const friendlyChar1 = createMockCharacter({
  id: "all-target-friendly-1",
  name: "Friendly One",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
});

const friendlyChar2 = createMockCharacter({
  id: "all-target-friendly-2",
  name: "Friendly Two",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
});

const enemyChar1 = createMockCharacter({
  id: "all-target-enemy-1",
  name: "Enemy One",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
});

const enemyChar2 = createMockCharacter({
  id: "all-target-enemy-2",
  name: "Enemy Two",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
});

describe("Targeting: 'All' Target Selection", () => {
  describe("Grab Your Sword - Deal 2 damage to each opposing character (all enemy targeting)", () => {
    it("should target all opposing characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [grabYourSword],
          inkwell: grabYourSword.cost,
          play: [{ card: stitchNewDog, isDrying: false }],
        },
        {
          play: [enemyChar1, enemyChar2],
        },
      );

      expect(testEngine.asPlayerOne().playCard(grabYourSword)).toBeSuccessfulCommand();

      // Both enemy characters should take 2 damage
      expect(testEngine.asPlayerTwo().getDamage(enemyChar1)).toBe(2);
      expect(testEngine.asPlayerTwo().getDamage(enemyChar2)).toBe(2);
    });

    it("should NOT target friendly characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [grabYourSword],
          inkwell: grabYourSword.cost,
          play: [{ card: stitchNewDog, isDrying: false }, friendlyChar1],
        },
        {
          play: [enemyChar1],
        },
      );

      expect(testEngine.asPlayerOne().playCard(grabYourSword)).toBeSuccessfulCommand();

      // Friendly character should NOT take damage
      expect(testEngine.asPlayerOne().getDamage(friendlyChar1)).toBe(0);
      expect(testEngine.asPlayerOne().getDamage(stitchNewDog)).toBe(0);
      // Enemy should take damage
      expect(testEngine.asPlayerTwo().getDamage(enemyChar1)).toBe(2);
    });

    it("should handle empty opposing board gracefully", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [grabYourSword],
          inkwell: grabYourSword.cost,
          play: [{ card: stitchNewDog, isDrying: false }],
        },
        {},
      );

      // No opposing characters - should still succeed but do nothing
      expect(testEngine.asPlayerOne().playCard(grabYourSword)).toBeSuccessfulCommand();
    });

    it("should deal damage independently to each character", () => {
      const fragileEnemy = createMockCharacter({
        id: "all-target-fragile-enemy",
        name: "Fragile Enemy",
        cost: 1,
        strength: 1,
        willpower: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [grabYourSword],
          inkwell: grabYourSword.cost,
          play: [{ card: stitchNewDog, isDrying: false }],
        },
        {
          play: [fragileEnemy, enemyChar1],
        },
      );

      expect(testEngine.asPlayerOne().playCard(grabYourSword)).toBeSuccessfulCommand();

      // Fragile enemy (1 wp) should be banished by 2 damage
      expect(testEngine.asPlayerTwo().getCardZone(fragileEnemy)).toBe("discard");
      // Tough enemy (4 wp) should survive with 2 damage
      expect(testEngine.asPlayerTwo().getDamage(enemyChar1)).toBe(2);
      expect(testEngine.asPlayerTwo().getCardZone(enemyChar1)).toBe("play");
    });
  });
});
