import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { basilSecretInformer } from "./093-basil-secret-informer";

const damagedOpponent = createMockCharacter({
  id: "damaged-opp",
  name: "Damaged Opponent",
  cost: 3,
  strength: 4,
  willpower: 5,
  lore: 1,
});

const undamagedOpponent = createMockCharacter({
  id: "undamaged-opp",
  name: "Undamaged Opponent",
  cost: 3,
  strength: 4,
  willpower: 5,
  lore: 1,
});

describe("Basil - Secret Informer", () => {
  describe("DRAW THEM OUT — Whenever this character quests, opposing damaged characters gain Reckless during their next turn.", () => {
    it("should give Reckless to damaged opposing characters when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [basilSecretInformer],
          inkwell: 10,
          deck: 3,
        },
        {
          play: [damagedOpponent, undamagedOpponent],
          deck: 3,
        },
      );

      // Deal damage to one opponent character
      expect(testEngine.asServer().manualSetDamage(damagedOpponent, 2)).toBeSuccessfulCommand();

      // Neither should have Reckless before questing
      expect(testEngine.hasKeyword(damagedOpponent, "Reckless")).toBe(false);
      expect(testEngine.hasKeyword(undamagedOpponent, "Reckless")).toBe(false);

      // Quest with Basil — the triggered ability auto-resolves since it targets "all"
      expect(testEngine.asPlayerOne().quest(basilSecretInformer)).toBeSuccessfulCommand();

      // During player one's turn, the opposing characters should NOT have Reckless yet
      // (duration is "their-next-turn" which starts on opponent's next turn)
      expect(testEngine.hasKeyword(damagedOpponent, "Reckless")).toBe(false);
      expect(testEngine.hasKeyword(undamagedOpponent, "Reckless")).toBe(false);

      // Pass turn to opponent's next turn
      testEngine.asServer().passTurn();

      // During opponent's next turn, damaged character should have Reckless
      expect(testEngine.hasKeyword(damagedOpponent, "Reckless")).toBe(true);
      // Undamaged character should NOT have Reckless
      expect(testEngine.hasKeyword(undamagedOpponent, "Reckless")).toBe(false);
    });

    it("Reckless expires after the opponent's turn", () => {
      // Use a setup where the opponent has no valid challenge targets
      // so they can pass their turn despite Reckless
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [basilSecretInformer],
          inkwell: 10,
          deck: 3,
        },
        {
          play: [damagedOpponent],
          deck: 3,
        },
      );

      // Deal damage to opponent character
      expect(testEngine.asServer().manualSetDamage(damagedOpponent, 2)).toBeSuccessfulCommand();

      // Quest with Basil
      expect(testEngine.asPlayerOne().quest(basilSecretInformer)).toBeSuccessfulCommand();

      // Pass turn to opponent's next turn
      testEngine.asServer().passTurn();

      // Reckless is active during opponent's turn
      expect(testEngine.hasKeyword(damagedOpponent, "Reckless")).toBe(true);

      // Opponent must challenge due to Reckless — challenge Basil (who is exerted from questing)
      expect(
        testEngine.asPlayerTwo().challenge(damagedOpponent, basilSecretInformer),
      ).toBeSuccessfulCommand();

      // Now opponent can pass
      testEngine.asServer().passTurn();

      // Reckless should be gone after opponent's turn
      expect(testEngine.hasKeyword(damagedOpponent, "Reckless")).toBe(false);
    });

    it("should NOT give Reckless to undamaged opposing characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [basilSecretInformer],
          inkwell: 10,
          deck: 3,
        },
        {
          play: [undamagedOpponent],
          deck: 3,
        },
      );

      // Quest with Basil (no damaged opponents)
      expect(testEngine.asPlayerOne().quest(basilSecretInformer)).toBeSuccessfulCommand();

      // Pass to opponent's turn
      testEngine.asServer().passTurn();

      // Undamaged opponent should NOT have Reckless
      expect(testEngine.hasKeyword(undamagedOpponent, "Reckless")).toBe(false);
    });
  });
});
