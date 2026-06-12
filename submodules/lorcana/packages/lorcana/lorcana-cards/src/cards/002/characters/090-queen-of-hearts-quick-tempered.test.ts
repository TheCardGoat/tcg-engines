import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { queenOfHeartsQuicktempered } from "./090-queen-of-hearts-quick-tempered";

const damagedOpponent = createMockCharacter({
  id: "qoh-qt-damaged-opponent",
  name: "Damaged Opponent",
  cost: 2,
  strength: 1,
  willpower: 5,
});

const undamagedOpponent = createMockCharacter({
  id: "qoh-qt-undamaged-opponent",
  name: "Undamaged Opponent",
  cost: 2,
  strength: 1,
  willpower: 5,
});

describe("Queen of Hearts - Quick-Tempered", () => {
  it("is not marked as missing implementation or tests", () => {
    expect(queenOfHeartsQuicktempered.missingImplementation).toBeUndefined();
    expect(queenOfHeartsQuicktempered.missingTests).toBeUndefined();
  });

  describe("ROYAL RAGE — When you play this character, deal 1 damage to chosen damaged opposing character.", () => {
    it("deals 1 damage to a chosen damaged opposing character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [queenOfHeartsQuicktempered],
          inkwell: queenOfHeartsQuicktempered.cost,
          deck: 1,
        },
        {
          play: [{ card: damagedOpponent, damage: 1 }],
          deck: 1,
        },
      );

      // Verify the target starts with 1 damage
      expect(testEngine.asPlayerTwo().getDamage(damagedOpponent)).toBe(1);

      // Play Queen of Hearts — the trigger fires, needing a target resolution
      expect(testEngine.asPlayerOne().playCard(queenOfHeartsQuicktempered)).toBeSuccessfulCommand();

      // Triggered ability should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Resolve the triggered ability with the damaged opponent as target
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(queenOfHeartsQuicktempered, {
          targets: [damagedOpponent],
        }),
      ).toBeSuccessfulCommand();

      // Target should now have 2 damage (1 existing + 1 from Royal Rage)
      expect(testEngine.asPlayerTwo().getDamage(damagedOpponent)).toBe(2);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("cannot target an undamaged opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [queenOfHeartsQuicktempered],
          inkwell: queenOfHeartsQuicktempered.cost,
          deck: 1,
        },
        {
          play: [{ card: damagedOpponent, damage: 1 }, undamagedOpponent],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(queenOfHeartsQuicktempered)).toBeSuccessfulCommand();

      // Triggered ability should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Attempt to target an undamaged character — should fail
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(queenOfHeartsQuicktempered, {
          targets: [undamagedOpponent],
        }).success,
      ).toBe(false);

      // Undamaged target should still have no damage
      expect(testEngine.asPlayerTwo().getDamage(undamagedOpponent)).toBe(0);
    });

    it("does not trigger if there are no damaged opposing characters to target", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [queenOfHeartsQuicktempered],
          inkwell: queenOfHeartsQuicktempered.cost,
          deck: 1,
        },
        {
          play: [undamagedOpponent],
          deck: 1,
        },
      );

      // Play Queen of Hearts when no damaged opposing characters are in play
      expect(testEngine.asPlayerOne().playCard(queenOfHeartsQuicktempered)).toBeSuccessfulCommand();

      // No bag effect since there are no valid targets
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("does not affect own characters", () => {
      const ownCharacter = createMockCharacter({
        id: "qoh-qt-own-damaged",
        name: "Own Damaged Character",
        cost: 2,
        strength: 1,
        willpower: 5,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [queenOfHeartsQuicktempered],
          play: [{ card: ownCharacter, damage: 1 }],
          inkwell: queenOfHeartsQuicktempered.cost,
          deck: 1,
        },
        {
          play: [{ card: damagedOpponent, damage: 1 }],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(queenOfHeartsQuicktempered)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Resolve targeting the opponent's damaged character
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(queenOfHeartsQuicktempered, {
          targets: [damagedOpponent],
        }),
      ).toBeSuccessfulCommand();

      // Own character should not have gained additional damage
      expect(testEngine.asPlayerOne().getDamage(ownCharacter)).toBe(1);
      expect(testEngine.asPlayerTwo().getDamage(damagedOpponent)).toBe(2);
    });
  });
});
