import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockAction } from "@tcg/lorcana-engine/testing";
import { ladyTremaineSinisterSocialite } from "./124-lady-tremaine-sinister-socialite";

const actionInDiscard = createMockAction({
  id: "lt-ss-action-discard",
  name: "Test Action",
  cost: 4,
  text: "A test action",
});

const expensiveActionInDiscard = createMockAction({
  id: "lt-ss-expensive-action",
  name: "Expensive Action",
  cost: 6,
  text: "An expensive action",
});

describe("Lady Tremaine - Sinister Socialite", () => {
  describe("Boost 2", () => {
    it("has Boost keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [ladyTremaineSinisterSocialite],
      });

      expect(testEngine.hasKeyword(ladyTremaineSinisterSocialite, "Boost")).toBe(true);
    });

    it("puts a card under Lady Tremaine when Boost is activated", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 3,
        deck: 3,
        play: [ladyTremaineSinisterSocialite],
      });

      expect(testEngine.getCardsUnder(ladyTremaineSinisterSocialite)).toHaveLength(0);

      expect(
        testEngine
          .asPlayerOne()
          .activateAbility(ladyTremaineSinisterSocialite, { ability: "Boost" }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getCardsUnder(ladyTremaineSinisterSocialite)).toHaveLength(1);
    });
  });

  describe("EXPEDIENT SCHEMES - Whenever this character quests, if you've put a card under her this turn, you may play an action with cost 5 or less from your discard for free, then put that action card on the bottom of your deck instead of into your discard.", () => {
    it("does not trigger when questing without boosting this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: ladyTremaineSinisterSocialite, isDrying: false }],
        discard: [actionInDiscard],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().quest(ladyTremaineSinisterSocialite)).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Action card should still be in discard (condition failed - no boost this turn)
      expect(testEngine.asPlayerOne().getCardZone(actionInDiscard)).toBe("discard");
    });

    it("triggers when questing after boosting this turn and plays action from discard for free", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 3,
        deck: 3,
        play: [{ card: ladyTremaineSinisterSocialite, isDrying: false }],
        discard: [actionInDiscard],
      });

      // Activate Boost to put a card under Lady Tremaine
      expect(
        testEngine
          .asPlayerOne()
          .activateAbility(ladyTremaineSinisterSocialite, { ability: "Boost" }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getCardsUnder(ladyTremaineSinisterSocialite)).toHaveLength(1);

      // Quest - should trigger EXPEDIENT SCHEMES
      expect(testEngine.asPlayerOne().quest(ladyTremaineSinisterSocialite)).toBeSuccessfulCommand();

      // Should have triggered optional ability in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

      // Accept the optional and select the action card to play from discard
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(ladyTremaineSinisterSocialite, {
          resolveOptional: true,
          targets: [actionInDiscard],
        }),
      ).toBeSuccessfulCommand();

      // After being played, the action card should be on the bottom of deck (not in discard)
      // The replacement effect redirects the zone-change from discard to deck bottom
      expect(testEngine.asPlayerOne().getCardZone(actionInDiscard)).toBe("deck");
    });

    it("can decline the optional effect when condition is met", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 3,
        deck: 3,
        play: [{ card: ladyTremaineSinisterSocialite, isDrying: false }],
        discard: [actionInDiscard],
      });

      // Activate Boost
      expect(
        testEngine
          .asPlayerOne()
          .activateAbility(ladyTremaineSinisterSocialite, { ability: "Boost" }),
      ).toBeSuccessfulCommand();

      // Quest
      expect(testEngine.asPlayerOne().quest(ladyTremaineSinisterSocialite)).toBeSuccessfulCommand();

      // Decline the optional
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(ladyTremaineSinisterSocialite, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Action card should remain in discard
      expect(testEngine.asPlayerOne().getCardZone(actionInDiscard)).toBe("discard");
    });

    it("does not play an action with cost > 5 from discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 3,
        deck: 3,
        play: [{ card: ladyTremaineSinisterSocialite, isDrying: false }],
        discard: [expensiveActionInDiscard],
      });

      // Activate Boost
      expect(
        testEngine
          .asPlayerOne()
          .activateAbility(ladyTremaineSinisterSocialite, { ability: "Boost" }),
      ).toBeSuccessfulCommand();

      // Quest
      expect(testEngine.asPlayerOne().quest(ladyTremaineSinisterSocialite)).toBeSuccessfulCommand();

      // The optional bag effect may fire, but the expensive action is not eligible
      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        expect(
          testEngine
            .asPlayerOne()
            .resolvePendingByCard(ladyTremaineSinisterSocialite, { resolveOptional: true }),
        ).toBeSuccessfulCommand();
      }

      // Expensive action should remain in discard (not eligible - cost > 5)
      expect(testEngine.asPlayerOne().getCardZone(expensiveActionInDiscard)).toBe("discard");
    });
  });
});
