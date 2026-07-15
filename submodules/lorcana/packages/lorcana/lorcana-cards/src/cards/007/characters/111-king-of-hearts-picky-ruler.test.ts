import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { kingOfHeartsPickyRuler } from "./111-king-of-hearts-picky-ruler";

const damagedAttacker = createMockCharacter({
  id: "king-picky-damaged-attacker",
  name: "Damaged Attacker",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
});

const undamagedAttacker = createMockCharacter({
  id: "king-picky-undamaged-attacker",
  name: "Undamaged Attacker",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
});

const friendlyCharacter = createMockCharacter({
  id: "king-picky-friendly",
  name: "Friendly Character",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
});

describe("King of Hearts - Picky Ruler", () => {
  describe("OBJECTIONABLE STATE - Damaged characters can't challenge your characters.", () => {
    it("a damaged opposing character cannot challenge the King of Hearts' controller's characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [kingOfHeartsPickyRuler, { card: friendlyCharacter, exerted: true }],
          deck: 5,
        },
        {
          play: [{ card: damagedAttacker, isDrying: false, damage: 1 }],
          deck: 5,
        },
      );

      // Pass to player two's turn so they can act
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Damaged attacker should NOT be able to challenge the friendly character
      expect(
        testEngine.asPlayerTwo().challenge(damagedAttacker, friendlyCharacter),
      ).not.toBeSuccessfulCommand();
    });

    it("an undamaged opposing character can still challenge the King of Hearts' controller's characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [kingOfHeartsPickyRuler, { card: friendlyCharacter, exerted: true }],
          deck: 5,
        },
        {
          play: [{ card: undamagedAttacker, isDrying: false }],
          deck: 5,
        },
      );

      // Pass to player two's turn so they can act
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Undamaged attacker SHOULD be able to challenge
      expect(
        testEngine.asPlayerTwo().challenge(undamagedAttacker, friendlyCharacter),
      ).toBeSuccessfulCommand();
    });

    it("a damaged opposing character cannot challenge the King of Hearts himself", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: kingOfHeartsPickyRuler, exerted: true }],
          deck: 5,
        },
        {
          play: [{ card: damagedAttacker, isDrying: false, damage: 1 }],
          deck: 5,
        },
      );

      // Pass to player two's turn so they can act
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Damaged attacker should NOT be able to challenge the King of Hearts himself
      expect(
        testEngine.asPlayerTwo().challenge(damagedAttacker, kingOfHeartsPickyRuler),
      ).not.toBeSuccessfulCommand();
    });

    it("restriction does not apply when King of Hearts is not in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: friendlyCharacter, exerted: true }],
          deck: 5,
        },
        {
          play: [{ card: damagedAttacker, isDrying: false, damage: 1 }],
          deck: 5,
        },
      );

      // Pass to player two's turn so they can act
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Without King of Hearts in play, damaged attacker CAN challenge
      expect(
        testEngine.asPlayerTwo().challenge(damagedAttacker, friendlyCharacter),
      ).toBeSuccessfulCommand();
    });
  });
});
