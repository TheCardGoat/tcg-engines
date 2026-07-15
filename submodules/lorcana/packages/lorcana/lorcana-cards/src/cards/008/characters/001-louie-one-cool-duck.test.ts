import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { louieOneCoolDuck } from "./001-louie-one-cool-duck";

describe("Louie - One Cool Duck", () => {
  describe("SPRING THE TRAP - While this character is being challenged, the challenging character gets -1 {S}.", () => {
    it("applies -1 strength to the challenging character when Louie is being challenged", () => {
      // Louie: 2 base strength, 3 willpower. Attacker has 4 strength.
      // With SPRING THE TRAP: Attacker has 3 effective strength (4-1).
      // Louie takes 3 damage (willpower 3, is banished).
      // Attacker takes 2 damage (Louie's base strength).
      const attacker = createMockCharacter({
        id: "louie-test-attacker",
        name: "Test Attacker",
        cost: 3,
        strength: 4,
        willpower: 5,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [attacker],
        },
        {
          play: [{ card: louieOneCoolDuck, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(attacker, louieOneCoolDuck),
      ).toBeSuccessfulCommand();

      // Louie should be banished (3 damage to 3 willpower)
      expect(testEngine.asPlayerTwo().getCardZone(louieOneCoolDuck)).toBe("discard");

      // Attacker should have received 2 damage (Louie's base strength)
      expect(testEngine.asPlayerOne().getDamage(attacker)).toBe(2);
    });

    it("does not apply -1 strength when Louie is the challenger (not being challenged)", () => {
      // Louie is the attacker here - SPRING THE TRAP should not apply
      const exertedDefender = createMockCharacter({
        id: "louie-test-defender",
        name: "Test Defender",
        cost: 3,
        strength: 1,
        willpower: 3,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [louieOneCoolDuck],
        },
        {
          play: [{ card: exertedDefender, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(louieOneCoolDuck, exertedDefender),
      ).toBeSuccessfulCommand();

      // Defender should take 2 damage (Louie's base strength, no modifier)
      expect(testEngine.asPlayerOne().getDamage(exertedDefender)).toBe(2);
    });

    it("attacker with 1 strength deals 0 damage when challenging Louie", () => {
      const weakAttacker = createMockCharacter({
        id: "louie-test-weak-attacker",
        name: "Weak Attacker",
        cost: 1,
        strength: 1,
        willpower: 3,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [weakAttacker],
        },
        {
          play: [{ card: louieOneCoolDuck, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(weakAttacker, louieOneCoolDuck),
      ).toBeSuccessfulCommand();

      // Louie should take 0 damage (1 strength - 1 from SPRING THE TRAP = 0)
      // and remain in play (not banished)
      expect(testEngine.asPlayerTwo().getDamage(louieOneCoolDuck)).toBe(0);
      expect(testEngine.asPlayerTwo().getCardZone(louieOneCoolDuck)).toBe("play");
    });
  });
});
