import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  CANONICAL_PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { hueyReliableLeader } from "./003-huey-reliable-leader";

const characterToBenefit = createMockCharacter({
  id: "huey-rl-character-1",
  name: "Character To Benefit",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const secondCharacter = createMockCharacter({
  id: "huey-rl-character-2",
  name: "Second Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Huey - Reliable Leader", () => {
  describe("I KNOW THE WAY — Whenever this character quests, you pay 1 {I} less for the next character you play this turn.", () => {
    it("reduces cost by 1 for the next character played after questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 10,
        play: [{ card: hueyReliableLeader, isDrying: false }],
        hand: [characterToBenefit],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().quest(hueyReliableLeader)).toBeSuccessfulCommand();

      // characterToBenefit costs 3, but with 1 discount it should cost 2
      expect(testEngine.asPlayerOne().playCard(characterToBenefit)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(characterToBenefit)).toBe("play");
      expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(10 - 2);
    });

    it("discount applies to only the NEXT character played this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 10,
        play: [{ card: hueyReliableLeader, isDrying: false }],
        hand: [characterToBenefit, secondCharacter],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().quest(hueyReliableLeader)).toBeSuccessfulCommand();

      // First character gets the discount (cost 3 - 1 = 2)
      expect(testEngine.asPlayerOne().playCard(characterToBenefit)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(10 - 2);

      // Second character does NOT get the discount (full cost 3)
      expect(testEngine.asPlayerOne().playCard(secondCharacter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(10 - 2 - 3);
    });

    it("does not reduce cost if Huey has not quested", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 10,
        play: [hueyReliableLeader],
        hand: [characterToBenefit],
        deck: 3,
      });

      // No quest, so no discount
      const inkBefore = testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE);

      expect(testEngine.asPlayerOne().playCard(characterToBenefit)).toBeSuccessfulCommand();

      // Full cost deducted (3)
      expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(
        inkBefore - characterToBenefit.cost,
      );
    });

    it("discount does not carry over to the next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: 10,
          play: [{ card: hueyReliableLeader, isDrying: false }],
          hand: [characterToBenefit],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().quest(hueyReliableLeader)).toBeSuccessfulCommand();

      // End turn without playing any character
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // On the next turn, refill ink (in fixture it restores available ink)
      // The discount should have expired - playing the character costs full price
      const inkAvailable = testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE);
      expect(testEngine.asPlayerOne().playCard(characterToBenefit)).toBeSuccessfulCommand();

      // Full cost deducted
      expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(
        inkAvailable - characterToBenefit.cost,
      );
    });
  });
});
