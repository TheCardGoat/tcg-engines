import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { basilUndercoverDetective } from "./086-basil-undercover-detective";

const targetCharacter = createMockCharacter({
  id: "basil-test-target",
  name: "Target Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const opponentCharacter = createMockCharacter({
  id: "basil-test-opponent-char",
  name: "Opponent Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const opponentHandCard = createMockCharacter({
  id: "basil-test-opponent-hand",
  name: "Opponent Hand Card",
  cost: 3,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Basil - Undercover Detective", () => {
  describe("INCAPACITATE - When you play this character, you may return chosen character to their player's hand.", () => {
    it("returns a chosen opponent character to their player's hand when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [basilUndercoverDetective],
          inkwell: basilUndercoverDetective.cost,
          deck: 5,
        },
        {
          play: [opponentCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(basilUndercoverDetective)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(basilUndercoverDetective),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          resolveOptional: true,
          targets: [opponentCharacter],
        }),
      ).toBeSuccessfulCommand();

      // Opponent's character should no longer be in play
      expect(testEngine.asPlayerOne().getCardsInZone("play", PLAYER_TWO).count).toBe(0);
      // Opponent's character should be in their hand
      expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_TWO).count).toBe(1);
    });

    it("can return own character to hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [basilUndercoverDetective],
          inkwell: basilUndercoverDetective.cost,
          play: [targetCharacter],
          deck: 5,
        },
        {},
      );

      expect(testEngine.asPlayerOne().playCard(basilUndercoverDetective)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(basilUndercoverDetective),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          resolveOptional: true,
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(targetCharacter)).toBe("hand");
    });
  });

  describe("INTERFERE - Whenever this character quests, chosen opponent discards a card at random.", () => {
    it("forces opponent to discard a card at random when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: basilUndercoverDetective, isDrying: false }],
          deck: 5,
        },
        {
          hand: [opponentHandCard],
        },
      );

      const opponentHandBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_TWO).count;

      expect(testEngine.asPlayerOne().quest(basilUndercoverDetective)).toBeSuccessfulCommand();

      // INTERFERE with EACH_OPPONENT + random auto-resolves (no user choice needed)
      const opponentHandAfter = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_TWO).count;
      expect(opponentHandAfter).toBe(opponentHandBefore - 1);
    });
  });
});
