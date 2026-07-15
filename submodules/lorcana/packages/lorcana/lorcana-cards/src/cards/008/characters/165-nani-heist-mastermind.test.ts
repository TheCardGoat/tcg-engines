import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { naniHeistMastermind } from "./165-nani-heist-mastermind";
import { liloCausingAnUproar } from "./137-lilo-causing-an-uproar";

const nonLiloCharacter = createMockCharacter({
  id: "nani-test-non-lilo",
  name: "Some Other Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const attackerCharacter = createMockCharacter({
  id: "nani-test-attacker",
  name: "Attacker",
  cost: 3,
  strength: 4,
  willpower: 5,
});

describe("Nani - Heist Mastermind", () => {
  describe("STICK TO THE PLAN - {E} - Another chosen character gains Resist +2 this turn.", () => {
    it("grants Resist +2 to another chosen character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [naniHeistMastermind, nonLiloCharacter],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      const result = testEngine.asPlayerOne().activateAbility(naniHeistMastermind, {
        targets: [nonLiloCharacter],
      });

      expect(result).toBeSuccessfulCommand();

      // Nani should be exerted after using the ability
      expect(testEngine.asPlayerOne().isExerted(naniHeistMastermind)).toBe(true);

      // Target should have Resist
      expect(testEngine.asPlayerOne().hasKeyword(nonLiloCharacter, "Resist")).toBe(true);
      expect(testEngine.asPlayerOne().getKeywordValue(nonLiloCharacter, "Resist")).toBe(2);
    });

    it("Resist +2 reduces damage from a challenge by 2 (on the same turn)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [naniHeistMastermind, { card: nonLiloCharacter, isDrying: false }],
          deck: 2,
        },
        {
          play: [{ card: attackerCharacter, exerted: true }],
          deck: 2,
        },
      );

      // Activate ability to grant Resist +2 to nonLiloCharacter this turn
      const result = testEngine.asPlayerOne().activateAbility(naniHeistMastermind, {
        targets: [nonLiloCharacter],
      });
      expect(result).toBeSuccessfulCommand();

      // On the same turn, nonLiloCharacter (with Resist +2) challenges the exerted opposing character
      // attackerCharacter has strength 4 — counterattack damage is 4-2=2 (Resist reduces by 2)
      expect(
        testEngine.asPlayerOne().challenge(nonLiloCharacter, attackerCharacter),
      ).toBeSuccessfulCommand();

      // nonLiloCharacter has willpower 3 and took 2 damage (4 - 2 Resist) — still alive
      expect(testEngine.asPlayerOne().getDamage(nonLiloCharacter)).toBe(2);
    });
  });

  describe("IT'S UP TO YOU, LILO - Your characters named Lilo gain Support.", () => {
    it("grants Support to characters named Lilo", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [naniHeistMastermind, liloCausingAnUproar],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().hasKeyword(liloCausingAnUproar, "Support")).toBe(true);
    });

    it("does not grant Support to characters not named Lilo", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [naniHeistMastermind, nonLiloCharacter],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().hasKeyword(nonLiloCharacter, "Support")).toBe(false);
    });

    it("does not grant Support to Nani herself", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [naniHeistMastermind],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().hasKeyword(naniHeistMastermind, "Support")).toBe(false);
    });
  });
});
