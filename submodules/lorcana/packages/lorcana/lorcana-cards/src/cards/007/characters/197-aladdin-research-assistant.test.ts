import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  CANONICAL_PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { aladdinResearchAssistant } from "./197-aladdin-research-assistant";

// Ally character with cost 3 or less (should be playable for free via HELPING HAND)
const allyCharacterCost3 = createMockCharacter({
  id: "aladdin-test-ally-cost3",
  name: "Ally Friend",
  cost: 3,
  strength: 3,
  willpower: 3,
  classifications: ["Storyborn", "Ally"],
});

// Ally character with cost 4 (should NOT be playable for free via HELPING HAND)
const allyCharacterCost4 = createMockCharacter({
  id: "aladdin-test-ally-cost4",
  name: "Expensive Ally",
  cost: 4,
  strength: 2,
  willpower: 2,
  classifications: ["Storyborn", "Ally"],
});

// Non-Ally character with cost 2 (should NOT be playable for free via HELPING HAND)
const nonAllyCharacterCost2 = createMockCharacter({
  id: "aladdin-test-non-ally-cost2",
  name: "Non-Ally Hero",
  cost: 2,
  strength: 2,
  willpower: 2,
  classifications: ["Storyborn", "Hero"],
});

// Non-Ally character for PUT IN THE EFFORT test
const nonAllyCharacter = createMockCharacter({
  id: "aladdin-test-non-ally",
  name: "Non-Ally Character",
  cost: 2,
  strength: 3,
  willpower: 3,
  classifications: ["Storyborn", "Hero"],
});

describe("Aladdin - Research Assistant", () => {
  describe("HELPING HAND - Whenever this character quests, you may play an Ally character with cost 3 or less for free.", () => {
    it("should play an Ally character of cost 3 or less for free when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: aladdinResearchAssistant, isDrying: false }],
        hand: [allyCharacterCost3],
        inkwell: 7,
        deck: 1,
      });

      // Quest with Aladdin
      expect(testEngine.asPlayerOne().quest(aladdinResearchAssistant)).toBeSuccessfulCommand();

      // HELPING HAND triggers (optional)
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      // Accept the optional effect and choose the Ally character
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(aladdinResearchAssistant, {
          resolveOptional: true,
          targets: [allyCharacterCost3],
        }),
      ).toBeSuccessfulCommand();

      // The ally should be in play
      expect(testEngine.asPlayerOne().getCardZone(allyCharacterCost3)).toBe("play");

      // Ink should not have been spent (played for free)
      expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(7);
    });

    it("should not play an Ally character of cost 4 or more for free", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: aladdinResearchAssistant, isDrying: false }],
        hand: [allyCharacterCost4],
        inkwell: 7,
        deck: 1,
      });

      // Quest with Aladdin
      expect(testEngine.asPlayerOne().quest(aladdinResearchAssistant)).toBeSuccessfulCommand();

      // HELPING HAND triggers but the Ally cost 4 does not match the cost restriction
      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(aladdinResearchAssistant, {
            resolveOptional: true,
            targets: [allyCharacterCost4],
          }),
        ).toBeSuccessfulCommand();
      }

      // The expensive ally should still be in hand (not played for free)
      expect(testEngine.asPlayerOne().getCardZone(allyCharacterCost4)).toBe("hand");
    });

    it("should not play a non-Ally character for free even if cost 3 or less", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: aladdinResearchAssistant, isDrying: false }],
        hand: [nonAllyCharacterCost2],
        inkwell: 7,
        deck: 1,
      });

      // Quest with Aladdin
      expect(testEngine.asPlayerOne().quest(aladdinResearchAssistant)).toBeSuccessfulCommand();

      // HELPING HAND auto-skips — no Ally in hand to play, so no player decision needed
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Non-Ally should still be in hand
      expect(testEngine.asPlayerOne().getCardZone(nonAllyCharacterCost2)).toBe("hand");
    });

    it("should allow declining the optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: aladdinResearchAssistant, isDrying: false }],
        hand: [allyCharacterCost3],
        inkwell: 7,
        deck: 1,
      });

      expect(testEngine.asPlayerOne().quest(aladdinResearchAssistant)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(aladdinResearchAssistant, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // Ally should still be in hand
      expect(testEngine.asPlayerOne().getCardZone(allyCharacterCost3)).toBe("hand");
    });
  });

  describe("PUT IN THE EFFORT - While this character is exerted, your Ally characters get +1 {S}.", () => {
    it("should give +1 Strength to Ally characters while exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: aladdinResearchAssistant, exerted: true }, allyCharacterCost3],
        deck: 1,
      });

      // Ally character should have +1 strength from PUT IN THE EFFORT
      expect(testEngine.asPlayerOne().getCardStrength(allyCharacterCost3)).toBe(
        allyCharacterCost3.strength + 1,
      );
    });

    it("should not give +1 Strength to non-Ally characters while exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: aladdinResearchAssistant, exerted: true }, nonAllyCharacter],
        deck: 1,
      });

      // Non-Ally character should NOT get the bonus
      expect(testEngine.asPlayerOne().getCardStrength(nonAllyCharacter)).toBe(
        nonAllyCharacter.strength,
      );
    });

    it("should not give +1 Strength to Ally characters when not exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [aladdinResearchAssistant, allyCharacterCost3],
        deck: 1,
      });

      // Ally should have base strength when Aladdin is not exerted
      expect(testEngine.asPlayerOne().getCardStrength(allyCharacterCost3)).toBe(
        allyCharacterCost3.strength,
      );
    });

    it("should not buff Aladdin himself", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: aladdinResearchAssistant, exerted: true }],
        deck: 1,
      });

      // Aladdin is not an Ally (he is Storyborn/Hero), so he should not buff himself
      expect(testEngine.asPlayerOne().getCardStrength(aladdinResearchAssistant)).toBe(
        aladdinResearchAssistant.strength,
      );
    });
  });
});
