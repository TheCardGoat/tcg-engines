import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { tinkerBellInsistentFairy } from "./136-tinker-bell-insistent-fairy";
import { lumiereFieryFriend } from "../../009/characters/121-lumiere-fiery-friend";

const strongCharacter = createMockCharacter({
  id: "tinker-bell-strong-char",
  name: "Strong Character",
  cost: 5,
  strength: 5,
  willpower: 5,
});

const weakCharacter = createMockCharacter({
  id: "tinker-bell-weak-char",
  name: "Weak Character",
  cost: 3,
  strength: 4,
  willpower: 3,
});

describe("Tinker Bell - Insistent Fairy", () => {
  it("Evasive keyword is present", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [tinkerBellInsistentFairy],
        deck: 2,
      },
      { deck: 2 },
    );

    expect(testEngine.asPlayerOne()).toHaveKeyword({
      card: tinkerBellInsistentFairy,
      keyword: "Evasive",
    });
  });

  describe("PAY ATTENTION — Whenever you play a character with 5 {S} or more, you may exert them to gain 2 lore.", () => {
    it("triggers when playing a character with 5 or more strength, exerts them and gains 2 lore when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [strongCharacter],
          inkwell: strongCharacter.cost,
          play: [tinkerBellInsistentFairy],
          deck: 2,
        },
        { deck: 2 },
      );

      const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().playCard(strongCharacter)).toBeSuccessfulCommand();

      // PAY ATTENTION should have triggered
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept the optional effect
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(tinkerBellInsistentFairy),
      ).toBeSuccessfulCommand();

      // The played character should be exerted
      expect(testEngine.isExerted(strongCharacter)).toBe(true);

      // Controller should have gained 2 lore
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(loreBefore + 2);
    });

    it("does not trigger when playing a character with less than 5 strength", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [weakCharacter],
          inkwell: weakCharacter.cost,
          play: [tinkerBellInsistentFairy],
          deck: 2,
        },
        { deck: 2 },
      );

      const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().playCard(weakCharacter)).toBeSuccessfulCommand();

      // PAY ATTENTION should NOT trigger
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // No lore gained
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(loreBefore);
    });

    it("does not exert or gain lore when the optional is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [strongCharacter],
          inkwell: strongCharacter.cost,
          play: [tinkerBellInsistentFairy],
          deck: 2,
        },
        { deck: 2 },
      );

      const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().playCard(strongCharacter)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Decline
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(tinkerBellInsistentFairy, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Played character should still be ready
      expect(testEngine.isExerted(strongCharacter)).toBe(false);

      // No lore gained
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(loreBefore);
    });

    it("triggers twice when two Tinker Bells are in play and both trigger independently", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [strongCharacter],
          inkwell: strongCharacter.cost,
          play: [tinkerBellInsistentFairy, tinkerBellInsistentFairy],
          deck: 2,
        },
        { deck: 2 },
      );

      const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().playCard(strongCharacter)).toBeSuccessfulCommand();

      // Two Tinker Bells means two bag items
      expect(testEngine.asPlayerOne().getBagCount()).toBe(2);

      // Accept first trigger by bag id
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolveBag(bagEffects[0]!.id, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Character is exerted after first trigger; accept second trigger
      const bagEffects2 = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolveBag(bagEffects2[0]!.id, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Each Tinker Bell triggers independently for 2 lore each = 4 total
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(loreBefore + 4);
    });
  });

  describe("regression: static abilities stacking for play-cost reduction", () => {
    it("Lumiere + Tinker Bell: Lumiere's +1 strength stacks correctly and PAY ATTENTION triggers for characters reaching 5+ strength", () => {
      // A character with base 4 strength should reach 5 with Lumiere's +1 buff
      const fourStrengthCharacter = createMockCharacter({
        id: "tinker-bell-four-str",
        name: "Four Strength Character",
        cost: 4,
        strength: 4,
        willpower: 4,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [fourStrengthCharacter],
          inkwell: fourStrengthCharacter.cost,
          play: [tinkerBellInsistentFairy, lumiereFieryFriend],
          deck: 2,
        },
        { deck: 2 },
      );

      // Lumiere gives +1 strength to other characters
      // So fourStrengthCharacter (base 4) should get +1 = 5 when played
      // This should trigger Tinker Bell's PAY ATTENTION (5+ strength)

      const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().playCard(fourStrengthCharacter)).toBeSuccessfulCommand();

      // After Lumiere's static buff, the character has 5 strength
      expect(testEngine.asPlayerOne().getCardStrength(fourStrengthCharacter)).toBe(5);

      // PAY ATTENTION should have triggered
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept the optional effect
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(tinkerBellInsistentFairy),
      ).toBeSuccessfulCommand();

      // Should gain 2 lore
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(loreBefore + 2);
    });
  });
});
