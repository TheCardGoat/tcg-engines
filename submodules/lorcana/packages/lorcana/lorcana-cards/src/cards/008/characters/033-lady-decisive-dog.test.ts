import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { ladyMissParkAvenue } from "../../007/characters/028-lady-miss-park-avenue";
import { ladyDecisiveDog } from "./033-lady-decisive-dog";
import { liloMakingAWish } from "../../001";
import { stitchCarefreeSnowboarder } from "../../011";

const cheapCharacter = createMockCharacter({
  id: "lady-test-char-a",
  name: "Cheap Character A",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const cheapCharacterB = createMockCharacter({
  id: "lady-test-char-b",
  name: "Cheap Character B",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const cheapCharacterC = createMockCharacter({
  id: "lady-test-char-c",
  name: "Cheap Character C",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Lady - Decisive Dog", () => {
  describe("PACK OF HER OWN — Whenever you play a character, this character gets +1 {S} this turn", () => {
    it("gains +1 strength when you play a character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [ladyDecisiveDog],
        hand: [cheapCharacter],
        inkwell: 1,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardStrength(ladyDecisiveDog)).toBe(0);

      expect(testEngine.asPlayerOne().playCard(cheapCharacter)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(ladyDecisiveDog)).toBe(1);
    });

    it("does NOT trigger when Lady herself is played (she is not yet in play)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [ladyDecisiveDog, liloMakingAWish, stitchCarefreeSnowboarder],
        inkwell: ladyDecisiveDog.cost + liloMakingAWish.cost + stitchCarefreeSnowboarder.cost,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(liloMakingAWish)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(stitchCarefreeSnowboarder)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(ladyDecisiveDog)).toBeSuccessfulCommand();

      // Base strength is 0 — her own play must not trigger PACK OF HER OWN
      expect(testEngine.asPlayerOne().getCardStrength(ladyDecisiveDog)).toBe(0);
    });

    it("stacks: gains +3 strength when 3 characters are played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [ladyDecisiveDog],
        hand: [cheapCharacter, cheapCharacterB, cheapCharacterC],
        inkwell: 3,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(cheapCharacter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(cheapCharacterB)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(cheapCharacterC)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(ladyDecisiveDog)).toBe(3);
    });

    it("strength bonus expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [ladyDecisiveDog],
          hand: [cheapCharacter],
          inkwell: 1,
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(cheapCharacter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardStrength(ladyDecisiveDog)).toBe(1);

      // End player one's turn, then player two's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Back to player one — strength should have reset
      expect(testEngine.asPlayerOne().getCardStrength(ladyDecisiveDog)).toBe(0);
    });
  });

  describe("TAKE THE LEAD — While this character has 3 {S} or more, she gets +2 {L}", () => {
    it("does not grant lore bonus when strength is below 3", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [ladyDecisiveDog],
        hand: [cheapCharacter, cheapCharacterB],
        inkwell: 2,
        deck: 5,
      });

      // Play 2 characters: +2 strength, still below 3
      expect(testEngine.asPlayerOne().playCard(cheapCharacter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(cheapCharacterB)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(ladyDecisiveDog)).toBe(2);
      expect(testEngine.asPlayerOne().getCardLore(ladyDecisiveDog)).toBe(1);
    });

    it("grants +2 lore when strength reaches 3", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [ladyDecisiveDog],
        hand: [cheapCharacter, cheapCharacterB, cheapCharacterC],
        inkwell: 3,
        deck: 5,
      });

      // Play 3 characters: +3 strength, meets threshold
      expect(testEngine.asPlayerOne().playCard(cheapCharacter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(cheapCharacterB)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(cheapCharacterC)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(ladyDecisiveDog)).toBe(3);
      expect(testEngine.asPlayerOne().getCardLore(ladyDecisiveDog)).toBe(3); // 1 base + 2 bonus
    });

    it("lore bonus deactivates when strength buff expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [ladyDecisiveDog],
          hand: [cheapCharacter, cheapCharacterB, cheapCharacterC],
          inkwell: 3,
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(cheapCharacter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(cheapCharacterB)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(cheapCharacterC)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(ladyDecisiveDog)).toBe(3);

      // End turn cycle
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Strength reset to 0, lore should drop back to 1
      expect(testEngine.asPlayerOne().getCardStrength(ladyDecisiveDog)).toBe(0);
      expect(testEngine.asPlayerOne().getCardLore(ladyDecisiveDog)).toBe(1);
    });
  });

  describe("Shift interaction — continuous effects transfer to the new top card", () => {
    it("shifting onto Lady preserves strength buffs on the new card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [ladyDecisiveDog],
        hand: [cheapCharacter, cheapCharacterB, cheapCharacterC, ladyMissParkAvenue],
        inkwell: 8,
        deck: 5,
      });

      // Play 3 characters to give Lady +3 strength and +2 lore (TAKE THE LEAD kicks in)
      expect(testEngine.asPlayerOne().playCard(cheapCharacter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(cheapCharacterB)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(cheapCharacterC)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(ladyDecisiveDog)).toBe(3);
      expect(testEngine.asPlayerOne().getCardLore(ladyDecisiveDog)).toBe(3);

      // Shift Lady - Miss Park Avenue onto Lady - Decisive Dog
      const shiftTarget = testEngine.findCardInstanceId(ladyDecisiveDog, "play", PLAYER_ONE);
      expect(
        testEngine.asPlayerOne().playCard(ladyMissParkAvenue, {
          cost: { cost: "shift", shiftTarget },
        }),
      ).toBeSuccessfulCommand();

      // After shift: Miss Park Avenue (strength 4) should inherit the +3 strength buff
      // giving her 4 + 3 = 7 strength
      expect(testEngine.asPlayerOne().getCardStrength(ladyMissParkAvenue)).toBe(
        ladyMissParkAvenue.strength + 3,
      );

      // Miss Park Avenue does not have TAKE THE LEAD, so her lore should be her base (2)
      expect(testEngine.asPlayerOne().getCardLore(ladyMissParkAvenue)).toBe(
        ladyMissParkAvenue.lore,
      );
    });
  });
});
