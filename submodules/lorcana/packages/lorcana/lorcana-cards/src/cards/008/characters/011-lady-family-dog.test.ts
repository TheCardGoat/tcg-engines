import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { bodyguard } from "../../../helpers/abilities/bodyguard";
import { ladyFamilyDog } from "./011-lady-family-dog";

const cheapCharacter = createMockCharacter({
  id: "lady-test-cheap",
  name: "Cheap Character",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
});

const expensiveCharacter = createMockCharacter({
  id: "lady-test-expensive",
  name: "Expensive Character",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
});

describe("Lady - Family Dog", () => {
  describe("SOMEONE TO CARE FOR - When you play this character, you may play a character with cost 2 or less for free.", () => {
    it("should allow playing a character with cost 2 or less for free from hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [ladyFamilyDog, cheapCharacter],
        inkwell: ladyFamilyDog.cost,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(ladyFamilyDog)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      const bagId = bagEffects[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(ladyFamilyDog, {
          resolveOptional: true,
          targets: [cheapCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(cheapCharacter)).toBe("play");
    });

    it("should advance bag state to target-selection when optional is accepted without targets", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [ladyFamilyDog, cheapCharacter],
        inkwell: ladyFamilyDog.cost,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(ladyFamilyDog)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);
      const bagId = bagEffects[0]!.id;

      // Step 1: Accept the optional without providing targets — should advance (not execute)
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(ladyFamilyDog, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Bag should still be active (advanced, not resolved)
      const stillInBag = testEngine.asPlayerOne().getBagEffects();
      expect(stillInBag.length).toBeGreaterThan(0);

      // Step 2: Now provide the target — should execute and play the card
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(ladyFamilyDog, { targets: [cheapCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(cheapCharacter)).toBe("play");
    });

    it("should let a Bodyguard character entering via free-play choose to enter exerted (R1/R8)", () => {
      const bodyguardChar = createMockCharacter({
        id: "lady-bodyguard",
        name: "David",
        cost: 2,
        strength: 1,
        willpower: 3,
        lore: 1,
        abilities: [bodyguard],
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [ladyFamilyDog, bodyguardChar],
        inkwell: ladyFamilyDog.cost,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(ladyFamilyDog)).toBeSuccessfulCommand();

      // Resolve the free-play optional with the Bodyguard character, opting to
      // enter play exerted.
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(ladyFamilyDog, {
          resolveOptional: true,
          targets: [bodyguardChar],
          enterPlayExerted: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(bodyguardChar)).toBe("play");
      // The free-played Bodyguard must actually be exerted (state-side effect of
      // the player's enterPlayExerted choice).
      expect(testEngine.asPlayerOne().isExerted(bodyguardChar)).toBe(true);
    });

    it("should not allow playing a character with cost greater than 2", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [ladyFamilyDog, expensiveCharacter],
        inkwell: ladyFamilyDog.cost,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(ladyFamilyDog)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        const bagId = bagEffects[0]!.id;
        testEngine.asPlayerOne().resolvePendingByCard(ladyFamilyDog, {
          resolveOptional: true,
          targets: [expensiveCharacter],
        });
      }

      // Expensive character should not have moved to play
      expect(testEngine.asPlayerOne().getCardZone(expensiveCharacter)).not.toBe("play");
    });
  });
});
