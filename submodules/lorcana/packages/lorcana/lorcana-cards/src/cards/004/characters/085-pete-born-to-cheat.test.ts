import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { peteBornToCheat } from "./085-pete-born-to-cheat";

// Pete has base strength 2, so he needs strength buffs to reach 5+
// We'll use a mock character with a static +3 strength buff via Support
// For simplicity, we'll just create characters for targets and use engine state manipulation

const weakTarget = createMockCharacter({
  id: "pete-test-weak",
  name: "Weak Target",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const strongTarget = createMockCharacter({
  id: "pete-test-strong",
  name: "Strong Target",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

// A character with Support to buff Pete's strength
const supportCharacter = createMockCharacter({
  id: "pete-test-support",
  name: "Support Character",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
  abilities: [{ id: "pete-test-support-kw", keyword: "Support", type: "keyword" as const }],
});

describe("Pete - Born to Cheat", () => {
  describe("I CLOBBER YOU! - Whenever this character quests while he has 5 {S} or more, return chosen character with 2 {S} or less to their player's hand.", () => {
    it("does NOT trigger when questing without 5+ strength", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: peteBornToCheat, isDrying: false }],
          deck: 2,
        },
        {
          play: [weakTarget],
          deck: 2,
        },
      );

      // Pete has base strength 2, so the ability should NOT trigger
      expect(testEngine.asPlayerOne().quest(peteBornToCheat)).toBeSuccessfulCommand();

      // No bag effect should be created since Pete doesn't meet the 5+ strength condition
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("triggers when questing with 5+ strength and returns a character with 2 or less strength", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: supportCharacter, isDrying: false },
            { card: peteBornToCheat, isDrying: false },
          ],
          deck: 2,
        },
        {
          play: [weakTarget],
          deck: 2,
        },
      );

      // First, use Support to buff Pete: quest with support character, targeting Pete
      expect(testEngine.asPlayerOne().quest(supportCharacter)).toBeSuccessfulCommand();

      // Resolve Support - choose Pete as the target
      const supportBagEffects = testEngine.asPlayerOne().getBagEffects();
      if (supportBagEffects.length > 0) {
        expect(
          testEngine.asPlayerOne().resolveBag(supportBagEffects[0]!.id, {
            targets: [peteBornToCheat],
          }),
        ).toBeSuccessfulCommand();
      }

      // Pete should now have 2 (base) + 3 (Support) = 5 strength
      expect(testEngine.asPlayerOne().getCardStrength(peteBornToCheat)).toBe(5);

      // Now quest with Pete - ability should trigger
      expect(testEngine.asPlayerOne().quest(peteBornToCheat)).toBeSuccessfulCommand();

      // Should have a bag effect for choosing the target to return
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      // Return the weak target to hand
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(peteBornToCheat, {
          targets: [weakTarget],
        }),
      ).toBeSuccessfulCommand();

      // Weak target should be back in hand
      expect(testEngine.asPlayerTwo().getCardZone(weakTarget)).toBe("hand");
    });

    it("cannot target a character with more than 2 strength", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: supportCharacter, isDrying: false },
            { card: peteBornToCheat, isDrying: false },
          ],
          deck: 2,
        },
        {
          play: [strongTarget],
          deck: 2,
        },
      );

      // Use Support to buff Pete to 5 strength
      expect(testEngine.asPlayerOne().quest(supportCharacter)).toBeSuccessfulCommand();

      const supportBagEffects = testEngine.asPlayerOne().getBagEffects();
      if (supportBagEffects.length > 0) {
        expect(
          testEngine.asPlayerOne().resolveBag(supportBagEffects[0]!.id, {
            targets: [peteBornToCheat],
          }),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerOne().getCardStrength(peteBornToCheat)).toBe(5);

      // Quest with Pete
      expect(testEngine.asPlayerOne().quest(peteBornToCheat)).toBeSuccessfulCommand();

      // No valid targets (strongTarget has 3 strength, exceeds 2 limit)
      // So no bag effect should be created
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Strong target should still be in play
      expect(testEngine.asPlayerTwo().getCardZone(strongTarget)).toBe("play");
    });
  });
});
