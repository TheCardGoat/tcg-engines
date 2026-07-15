import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { floraGoodFairy } from "./075-flora-good-fairy";

const attacker = createMockCharacter({
  id: "flora-test-attacker",
  name: "Test Attacker",
  cost: 3,
  strength: 3,
  willpower: 5,
  lore: 1,
});

describe("Flora - Good Fairy", () => {
  describe("FIDDLE FADDLE - While being challenged, this character gets +2 {S}.", () => {
    it("gains +2 strength while being challenged, dealing more damage to the attacker", () => {
      // Flora: 2 base strength, 4 willpower. Attacker has 3 strength.
      // Without FIDDLE FADDLE: Flora takes 3 damage (willpower 4, survives), Attacker takes 2 damage.
      // With FIDDLE FADDLE: Flora has 4 effective strength (2+2), deals 4 damage to attacker.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [attacker],
        },
        {
          play: [{ card: floraGoodFairy, exerted: true }],
        },
      );

      expect(testEngine.asPlayerOne().challenge(attacker, floraGoodFairy)).toBeSuccessfulCommand();

      // Attacker should have received 4 damage (Flora's 2 base + 2 FIDDLE FADDLE bonus)
      expect(testEngine.asPlayerOne().getDamage(attacker)).toBe(4);
    });

    it("does not have +2 strength outside of a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [attacker],
        },
        {
          play: [{ card: floraGoodFairy, exerted: true }],
        },
      );

      // Before any challenge, Flora should have base strength 2
      const floraCard = testEngine.asPlayerTwo().getCard(floraGoodFairy);
      expect(floraCard.strength).toBe(2);
    });
  });
});
