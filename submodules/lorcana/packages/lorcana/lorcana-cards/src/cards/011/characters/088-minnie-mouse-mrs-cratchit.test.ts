import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { goofyKnightForADay } from "../../002/characters/180-goofy-knight-for-a-day";
import { simbaKingInTheMaking } from "../../010/characters/020-simba-king-in-the-making";
import { minnieMouseMrsCratchit } from "./088-minnie-mouse-mrs-cratchit";

describe("Minnie Mouse - Mrs. Cratchit", () => {
  describe("Ward - Opponents can't choose this character except to challenge", () => {
    it("should have Ward ability", () => {
      const testEngine = new LorcanaTestEngine({
        play: [minnieMouseMrsCratchit],
      });

      const cardUnderTest = testEngine.getCardModel(minnieMouseMrsCratchit);
      expect(cardUnderTest.hasWard()).toBe(true);
    });
  });

  describe("A MOTHER'S LOVE - When you play this character, you may put the top card of your deck facedown under one of your characters or locations with Boost. If you do, draw a card.", () => {
    it("should allow putting top card of deck under a character with Boost and draw a card when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: minnieMouseMrsCratchit.cost,
        hand: [minnieMouseMrsCratchit],
        deck: 5,
        play: [simbaKingInTheMaking], // Has Boost 3 ability
      });

      const deckBefore = testEngine.asPlayerOne().getCardsInZone("deck", PLAYER_ONE).count;
      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;
      const cardsUnderBefore = testEngine.asPlayerOne().getCardsUnderCount(simbaKingInTheMaking);
      expect(cardsUnderBefore).toBe(0);

      expect(testEngine.asPlayerOne().playCard(minnieMouseMrsCratchit)).toBeSuccessfulCommand();

      // A MOTHER'S LOVE triggers as an optional ability
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        // Accept the optional ability
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(minnieMouseMrsCratchit),
        ).toBeSuccessfulCommand();
        // Select Simba as the target
        const pendingEffect = testEngine.asPlayerOne().getPendingEffects();
        if (pendingEffect.length > 0) {
          expect(
            testEngine.asPlayerOne().resolveNextPending({ targets: [simbaKingInTheMaking] }),
          ).toBeSuccessfulCommand();
        }
      }

      // Verify card was put under Simba
      expect(testEngine.asPlayerOne().getCardsUnderCount(simbaKingInTheMaking)).toBe(1);

      // Verify that a card was drawn (If you do, draw a card)
      // Hand before had: minnieMouseMrsCratchit (1). After playing: 0 - 1 played + 1 drawn = 0
      const handAfter = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;
      expect(handAfter).toBe(handBefore - 1 + 1); // -1 played + 1 drawn
    });

    it("should be optional - can decline the trigger and not draw a card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: minnieMouseMrsCratchit.cost,
        hand: [minnieMouseMrsCratchit],
        deck: 5,
        play: [simbaKingInTheMaking],
      });

      const cardsUnderBefore = testEngine.asPlayerOne().getCardsUnderCount(simbaKingInTheMaking);
      expect(cardsUnderBefore).toBe(0);

      const deckBefore = testEngine.asPlayerOne().getCardsInZone("deck", PLAYER_ONE).count;

      expect(testEngine.asPlayerOne().playCard(minnieMouseMrsCratchit)).toBeSuccessfulCommand();

      // Decline the optional ability
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        expect(
          testEngine
            .asPlayerOne()
            .resolvePendingByCard(minnieMouseMrsCratchit, { resolveOptional: false }),
        ).toBeSuccessfulCommand();
      }

      // No card should be put under Simba
      expect(testEngine.asPlayerOne().getCardsUnderCount(simbaKingInTheMaking)).toBe(0);
      // Deck should be unchanged
      expect(testEngine.asPlayerOne().getCardsInZone("deck", PLAYER_ONE).count).toBe(deckBefore);
    });

    it("should NOT put a card under when no characters or locations with Boost in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: minnieMouseMrsCratchit.cost,
        hand: [minnieMouseMrsCratchit],
        deck: 5,
        play: [goofyKnightForADay], // No Boost ability
      });

      const deckBefore = testEngine.asPlayerOne().getCardsInZone("deck", PLAYER_ONE).count;

      expect(testEngine.asPlayerOne().playCard(minnieMouseMrsCratchit)).toBeSuccessfulCommand();

      // The trigger fires but declining the optional leaves no cards under and no draw
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        // Decline the optional - no valid targets for Boost characters/locations
        expect(
          testEngine
            .asPlayerOne()
            .resolvePendingByCard(minnieMouseMrsCratchit, { resolveOptional: false }),
        ).toBeSuccessfulCommand();
      }

      // Deck should be unchanged (no card was placed under anything)
      expect(testEngine.asPlayerOne().getCardsInZone("deck", PLAYER_ONE).count).toBe(deckBefore);
      expect(testEngine.asPlayerOne().getCardZone(minnieMouseMrsCratchit)).toBe("play");
    });
  });
});
