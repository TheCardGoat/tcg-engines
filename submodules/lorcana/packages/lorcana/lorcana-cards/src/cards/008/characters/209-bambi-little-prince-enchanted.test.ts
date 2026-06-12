import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { bambiLittlePrinceEnchanted } from "./209-bambi-little-prince-enchanted";

const opponentCharacter = createMockCharacter({
  id: "bambi-test-opponent-char",
  name: "Opponent Character",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Bambi - Little Prince (Enchanted)", () => {
  describe("SAY HELLO - When you play this character, gain 1 lore", () => {
    it("gains 1 lore when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [bambiLittlePrinceEnchanted],
        inkwell: bambiLittlePrinceEnchanted.cost,
        deck: 2,
      });

      const loreBefore = testEngine.getLore(PLAYER_ONE);
      expect(testEngine.asPlayerOne().playCard(bambiLittlePrinceEnchanted)).toBeSuccessfulCommand();

      // Resolve any pending bag effects (gain-lore is mandatory and targetless)
      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        for (let i = 0; i < bagCount; i++) {
          const effects = testEngine.asPlayerOne().getBagEffects();
          if (effects.length > 0) {
            testEngine.asPlayerOne().resolvePendingByCard(bambiLittlePrinceEnchanted);
          }
        }
      }

      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 1);
    });
  });

  describe("KIND OF BASHFUL - When an opponent plays a character, return this character to your hand", () => {
    it("returns Bambi to hand when opponent plays a character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [bambiLittlePrinceEnchanted],
          deck: 2,
        },
        {
          hand: [opponentCharacter],
          inkwell: opponentCharacter.cost,
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().getCardZone(bambiLittlePrinceEnchanted)).toBe("play");

      // Opponent plays a character
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().playCard(opponentCharacter)).toBeSuccessfulCommand();

      // Resolve triggered ability (mandatory, no target choice needed since target is SELF)
      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        for (let i = 0; i < bagCount; i++) {
          const effects = testEngine.asPlayerOne().getBagEffects();
          if (effects.length > 0) {
            testEngine.asPlayerOne().resolvePendingByCard(bambiLittlePrinceEnchanted);
          }
        }
      }

      expect(testEngine.asPlayerOne().getCardZone(bambiLittlePrinceEnchanted)).toBe("hand");
      expect(testEngine.asPlayerTwo().getCardZone(opponentCharacter)).toBe("play");
    });

    it("does NOT return Bambi when the controller plays a character", () => {
      const ownCharacter = createMockCharacter({
        id: "bambi-test-own-char",
        name: "Own Character",
        cost: 1,
        strength: 1,
        willpower: 1,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [bambiLittlePrinceEnchanted],
        hand: [ownCharacter],
        inkwell: ownCharacter.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(ownCharacter)).toBeSuccessfulCommand();

      // Bambi should still be in play — KIND OF BASHFUL only triggers on opponent's plays
      expect(testEngine.asPlayerOne().getCardZone(bambiLittlePrinceEnchanted)).toBe("play");
    });
  });
});
