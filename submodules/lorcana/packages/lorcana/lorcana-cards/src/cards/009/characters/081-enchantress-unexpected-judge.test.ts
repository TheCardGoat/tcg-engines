import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { enchantressUnexpectedJudge } from "./081-enchantress-unexpected-judge";

const attacker = createMockCharacter({
  id: "enchantress009-test-attacker",
  name: "Test Attacker",
  cost: 3,
  strength: 3,
  willpower: 5,
  lore: 1,
});

describe("Enchantress - Unexpected Judge (set 009)", () => {
  describe("TRUE FORM - While being challenged, this character gets +2 strength", () => {
    it("gains +2 strength while being challenged, surviving an attack it would otherwise lose", () => {
      // Enchantress: 1 base strength, 1 willpower. Attacker has 3 strength.
      // Without TRUE FORM: Enchantress takes 3 damage (willpower 1), is banished.
      // With TRUE FORM: Enchantress has 3 effective strength (1+2), deals 3 damage to attacker.
      // Attacker has 5 willpower, takes 3 damage, survives.
      // Enchantress has 1 willpower, takes 3 damage, is banished.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [attacker],
        },
        {
          play: [{ card: enchantressUnexpectedJudge, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(attacker, enchantressUnexpectedJudge),
      ).toBeSuccessfulCommand();

      // Attacker should have received 3 damage (Enchantress's 1 base + 2 TRUE FORM bonus)
      expect(testEngine.asPlayerOne().getDamage(attacker)).toBe(3);
    });

    it("does not deal extra damage when it is the challenger (not being challenged)", () => {
      // Enchantress is the attacker here - TRUE FORM should not apply
      // Enchantress base strength 1, defender has willpower 3 - defender takes 1 damage
      const exertedDefender = createMockCharacter({
        id: "enchantress009-test-defender",
        name: "Test Defender",
        cost: 3,
        strength: 1,
        willpower: 3,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [enchantressUnexpectedJudge],
        },
        {
          play: [{ card: exertedDefender, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(enchantressUnexpectedJudge, exertedDefender),
      ).toBeSuccessfulCommand();

      // Defender should only take 1 damage (Enchantress base strength, no TRUE FORM bonus)
      expect(testEngine.asPlayerOne().getDamage(exertedDefender)).toBe(1);
    });
  });
});
