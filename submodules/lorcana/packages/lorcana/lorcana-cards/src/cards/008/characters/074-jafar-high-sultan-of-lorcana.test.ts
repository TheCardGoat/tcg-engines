import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { jafarHighSultanOfLorcana } from "./074-jafar-high-sultan-of-lorcana";
import { palaceGuardSpectralSentry } from "./045-palace-guard-spectral-sentry";

const nonIllusionCharacter = createMockCharacter({
  id: "jafar-test-non-illusion",
  name: "Non Illusion Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  classifications: ["Storyborn", "Hero"],
});

describe("Jafar - High Sultan of Lorcana", () => {
  describe("DARK POWER - Whenever this character quests, you may draw a card, then choose and discard a card. If an Illusion character card is discarded this way, you may play that character for free.", () => {
    it("draws a card and offers discard when questing, then plays Illusion card for free", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: jafarHighSultanOfLorcana, isDrying: false }],
          hand: [palaceGuardSpectralSentry],
          deck: 5,
        },
        { deck: 2 },
      );

      expect(testEngine.asPlayerOne().quest(jafarHighSultanOfLorcana)).toBeSuccessfulCommand();

      // The triggered ability should be in the bag (optional: draw then discard)
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept the optional ability (draw + discard sequence)
      // After accepting the optional, the engine draws 1 card, then suspends for discard choice
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(jafarHighSultanOfLorcana, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // After accepting, the bag item is consumed. The discard choice is now a pending effect
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);

      // Resolve the pending discard - choose the Illusion character (palaceGuardSpectralSentry)
      const pendingEffect = testEngine.asPlayerOne().getPendingEffects()[0]!;
      const palaceGuardInstanceId = testEngine.findCardInstanceId(
        palaceGuardSpectralSentry,
        "hand",
        "player_one",
      );
      expect(
        testEngine.asPlayerOne().resolveEffect(pendingEffect.id, {
          targets: [palaceGuardInstanceId],
        }),
      ).toBeSuccessfulCommand();

      // Palace Guard is an Illusion character, so should be offered to play for free
      // This appears as a new pending optional-selection effect (not a bag item)
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);

      // Accept playing for free and select the Illusion card from discard
      const playForFreeEffect = testEngine.asPlayerOne().getPendingEffects()[0]!;
      expect(
        testEngine.asPlayerOne().resolveEffect(playForFreeEffect.id, {
          resolveOptional: true,
          targets: [palaceGuardInstanceId],
        }),
      ).toBeSuccessfulCommand();

      // Palace Guard should now be in play
      expect(testEngine.asPlayerOne().getCardZone(palaceGuardSpectralSentry)).toBe("play");
    });

    it("does not offer play-for-free when a non-Illusion character is discarded", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: jafarHighSultanOfLorcana, isDrying: false }],
          hand: [nonIllusionCharacter],
          deck: 5,
        },
        { deck: 2 },
      );

      expect(testEngine.asPlayerOne().quest(jafarHighSultanOfLorcana)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept the optional
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(jafarHighSultanOfLorcana, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Discard choice pending
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);

      // Discard the non-Illusion character
      const pendingEffect = testEngine.asPlayerOne().getPendingEffects()[0]!;
      const nonIllusionInstanceId = testEngine.findCardInstanceId(
        nonIllusionCharacter,
        "hand",
        "player_one",
      );
      expect(
        testEngine.asPlayerOne().resolveEffect(pendingEffect.id, {
          targets: [nonIllusionInstanceId],
        }),
      ).toBeSuccessfulCommand();

      // Non-Illusion character discarded, no play-for-free offered
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
      expect(testEngine.asPlayerOne().getCardZone(nonIllusionCharacter)).toBe("discard");
    });

    it("can decline the optional DARK POWER ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: jafarHighSultanOfLorcana, isDrying: false }],
          hand: [palaceGuardSpectralSentry],
          deck: 5,
        },
        { deck: 2 },
      );

      expect(testEngine.asPlayerOne().quest(jafarHighSultanOfLorcana)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Decline the optional ability
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(jafarHighSultanOfLorcana, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Nothing should happen
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCardZone(palaceGuardSpectralSentry)).toBe("hand");
    });
  });
});
