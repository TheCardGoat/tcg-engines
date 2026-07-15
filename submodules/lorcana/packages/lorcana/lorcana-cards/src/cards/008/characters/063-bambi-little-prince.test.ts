import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { bambiLittlePrince } from "./063-bambi-little-prince";

const opponentCharacter = createMockCharacter({
  id: "bambi-test-opponent-char",
  name: "Opponent Character",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Bambi - Little Prince", () => {
  describe("SAY HELLO — When you play this character, gain 1 lore.", () => {
    it("gains 1 lore when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [bambiLittlePrince],
        inkwell: bambiLittlePrince.cost,
        deck: 2,
      });

      const loreBefore = testEngine.getLore(PLAYER_ONE);
      expect(testEngine.asPlayerOne().playCard(bambiLittlePrince)).toBeSuccessfulCommand();

      // Resolve any pending bag effects (gain-lore is mandatory and targetless)
      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        for (let i = 0; i < bagCount; i++) {
          const effects = testEngine.asPlayerOne().getBagEffects();
          if (effects.length > 0) {
            testEngine.asPlayerOne().resolvePendingByCard(bambiLittlePrince);
          }
        }
      }

      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 1);
    });
  });

  describe("KIND OF BASHFUL — When an opponent plays a character, return this character to your hand.", () => {
    it("returns Bambi to hand when opponent plays a character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [bambiLittlePrince],
          deck: 2,
        },
        {
          hand: [opponentCharacter],
          inkwell: opponentCharacter.cost,
          deck: 2,
        },
      );

      // Pass to player 2's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Opponent plays a character
      expect(testEngine.asPlayerTwo().playCard(opponentCharacter)).toBeSuccessfulCommand();

      // KIND OF BASHFUL should trigger - resolve it
      // The trigger is on player 1's card, so player 1 resolves it
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThanOrEqual(1);

      const bashfulEffect = bagEffects[0];
      expect(bashfulEffect).toBeDefined();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(bambiLittlePrince),
      ).toBeSuccessfulCommand();

      // Bambi should be back in player 1's hand
      expect(testEngine.asPlayerOne().getCardZone(bambiLittlePrince)).toBe("hand");
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
        play: [bambiLittlePrince],
        hand: [ownCharacter],
        inkwell: ownCharacter.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(ownCharacter)).toBeSuccessfulCommand();

      // Resolve any bag effects from playing our own character
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      // None of these should be KIND OF BASHFUL return-to-hand for Bambi
      for (const effect of bagEffects) {
        testEngine.asPlayerOne().resolvePendingByCard(bambiLittlePrince);
      }

      // Bambi should still be in play
      expect(testEngine.asPlayerOne().getCardZone(bambiLittlePrince)).toBe("play");
    });

    it("SAY HELLO triggers again when Bambi is replayed after being returned", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [bambiLittlePrince],
          inkwell: bambiLittlePrince.cost,
          deck: 5,
        },
        {
          hand: [opponentCharacter],
          inkwell: opponentCharacter.cost,
          deck: 5,
        },
      );

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      // Pass to player 2's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Opponent plays a character, triggering KIND OF BASHFUL
      expect(testEngine.asPlayerTwo().playCard(opponentCharacter)).toBeSuccessfulCommand();

      // Resolve KIND OF BASHFUL
      const bashfulEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bashfulEffects.length).toBeGreaterThanOrEqual(1);
      testEngine.asPlayerOne().resolvePendingByCard(bambiLittlePrince);

      expect(testEngine.asPlayerOne().getCardZone(bambiLittlePrince)).toBe("hand");

      // It's still player 2's turn after the trigger resolves, so they pass back to player 1.
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Play Bambi again - SAY HELLO should trigger
      expect(testEngine.asPlayerOne().playCard(bambiLittlePrince)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        for (const effect of bagEffects) {
          testEngine.asPlayerOne().resolvePendingByCard(bambiLittlePrince);
        }
      }

      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 1);
    });
  });
});
