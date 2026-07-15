import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { enchantressUnexpectedJudge } from "./080-enchantress-unexpected-judge";

// Enchantress - Unexpected Judge: 2 cost, 1 strength, 1 willpower, 2 lore
// TRUE FORM: While being challenged, this character gets +2 {S}.

const attacker = createMockCharacter({
  id: "enchantress-test-attacker",
  name: "Test Attacker",
  cost: 2,
  strength: 2,
  willpower: 5,
  lore: 1,
});

describe("Enchantress - Unexpected Judge", () => {
  it("is not marked as missing implementation or tests", () => {
    expect(enchantressUnexpectedJudge.missingImplementation).toBeUndefined();
    expect(enchantressUnexpectedJudge.missingTests).toBeUndefined();
  });

  describe("TRUE FORM — While being challenged, this character gets +2 {S}.", () => {
    it("deals 3 damage when defending (1 base strength + 2 TRUE FORM bonus)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: enchantressUnexpectedJudge, exerted: true }],
          deck: 1,
        },
        {
          play: [attacker],
          deck: 1,
        },
      );

      // Pass player one's turn so player two can act
      expect(testEngine.asPlayerOne().passTurn().success).toBe(true);

      const preview = testEngine
        .asPlayerTwo()
        .previewChallenge(attacker, enchantressUnexpectedJudge);

      // Enchantress base strength 1 + TRUE FORM +2 = 3 damage dealt to attacker
      expect(preview?.defenderDamageDealt).toBe(3);
    });
  });
});
