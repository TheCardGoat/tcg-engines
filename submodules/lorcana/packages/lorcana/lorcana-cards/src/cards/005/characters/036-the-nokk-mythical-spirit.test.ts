import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { theNokkMythicalSpirit } from "./036-the-nokk-mythical-spirit";

const damagedFriendly = createMockCharacter({
  id: "nokk-test-damaged-friendly",
  name: "Damaged Friendly",
  cost: 3,
  strength: 2,
  willpower: 8,
});

const opposingCharacter = createMockCharacter({
  id: "nokk-test-opposing",
  name: "Opposing Character",
  cost: 3,
  strength: 2,
  willpower: 8,
});

describe("The Nokk - Mythical Spirit", () => {
  describe("TURNING TIDES - When you play this character, you may move up to 2 damage counters from chosen character to chosen opposing character.", () => {
    it("moves up to 2 damage from chosen character to chosen opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [theNokkMythicalSpirit],
          inkwell: theNokkMythicalSpirit.cost,
          play: [{ card: damagedFriendly, damage: 3 }],
          deck: 2,
        },
        {
          play: [opposingCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(theNokkMythicalSpirit)).toBeSuccessfulCommand();

      // Optional triggered ability fires
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(theNokkMythicalSpirit, {
          resolveOptional: true,
          targets: [damagedFriendly, opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      // Only 2 damage should be moved (up to 2)
      expect(testEngine.asPlayerOne().getDamage(damagedFriendly)).toBe(1);
      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(2);
    });

    it("can be declined (optional)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [theNokkMythicalSpirit],
          inkwell: theNokkMythicalSpirit.cost,
          play: [{ card: damagedFriendly, damage: 3 }],
          deck: 2,
        },
        {
          play: [opposingCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(theNokkMythicalSpirit)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(theNokkMythicalSpirit, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Damage unchanged
      expect(testEngine.asPlayerOne().getDamage(damagedFriendly)).toBe(3);
      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(0);
    });

    it("moves only available damage when source has less than 2", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [theNokkMythicalSpirit],
          inkwell: theNokkMythicalSpirit.cost,
          play: [{ card: damagedFriendly, damage: 1 }],
          deck: 2,
        },
        {
          play: [opposingCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(theNokkMythicalSpirit)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(theNokkMythicalSpirit, {
          resolveOptional: true,
          targets: [damagedFriendly, opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      // Only 1 damage moved (source only had 1)
      expect(testEngine.asPlayerOne().getDamage(damagedFriendly)).toBe(0);
      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(1);
    });
  });
});
