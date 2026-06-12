import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { aladdinOnTheEdgeOfAdventure } from "./081-aladdin-on-the-edge-of-adventure";

const cheapAction = createMockSong({
  id: "aladdin-test-action",
  name: "Test Action",
  cost: 1,
  text: "Test action card",
});

const secondAction = createMockSong({
  id: "aladdin-test-action-2",
  name: "Second Action",
  cost: 1,
  text: "Second test action card",
});

const nonEvasiveChallenger = createMockCharacter({
  id: "aladdin-test-challenger",
  name: "Non Evasive Challenger",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Aladdin - On the Edge of Adventure", () => {
  describe("QUICK ON HIS FEET - Whenever you play an action, this character gains Evasive until the start of your next turn", () => {
    it("should trigger when an action is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [aladdinOnTheEdgeOfAdventure],
        hand: [cheapAction],
        inkwell: cheapAction.cost,
        deck: 5,
      });

      // Before playing action: no Evasive
      expect(testEngine.hasKeyword(aladdinOnTheEdgeOfAdventure, "Evasive")).toBe(false);

      expect(testEngine.asPlayerOne().playCard(cheapAction)).toBeSuccessfulCommand();

      // Resolve any bag effects from the trigger
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        testEngine.asPlayerOne().resolveOnlyBag();
      }

      // After playing action: should have Evasive
      expect(testEngine.hasKeyword(aladdinOnTheEdgeOfAdventure, "Evasive")).toBe(true);
    });

    it("should keep Evasive during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [aladdinOnTheEdgeOfAdventure],
          hand: [cheapAction],
          inkwell: cheapAction.cost,
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(cheapAction)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        testEngine.asPlayerOne().resolveOnlyBag();
      }

      // Pass to opponent's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Should still have Evasive during opponent's turn
      expect(testEngine.hasKeyword(aladdinOnTheEdgeOfAdventure, "Evasive")).toBe(true);
    });

    it("should lose Evasive at the start of your next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [aladdinOnTheEdgeOfAdventure],
          hand: [cheapAction],
          inkwell: cheapAction.cost,
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(cheapAction)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        testEngine.asPlayerOne().resolveOnlyBag();
      }

      // Pass both turns
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // At start of next turn: Evasive should be gone
      expect(testEngine.hasKeyword(aladdinOnTheEdgeOfAdventure, "Evasive")).toBe(false);
    });

    it("should prevent non-Evasive characters from challenging Aladdin", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: aladdinOnTheEdgeOfAdventure, exerted: true }],
          hand: [cheapAction],
          inkwell: cheapAction.cost,
          deck: 5,
        },
        {
          play: [nonEvasiveChallenger],
          deck: 5,
        },
      );

      // Play action to gain Evasive
      expect(testEngine.asPlayerOne().playCard(cheapAction)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        testEngine.asPlayerOne().resolveOnlyBag();
      }

      // Pass to opponent's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Non-Evasive character should not be able to challenge Aladdin
      expect(
        testEngine.asPlayerTwo().canChallenge(nonEvasiveChallenger, aladdinOnTheEdgeOfAdventure),
      ).toBe(false);
    });

    it("should trigger each time an action is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [aladdinOnTheEdgeOfAdventure],
        hand: [cheapAction, secondAction],
        inkwell: cheapAction.cost + secondAction.cost,
        deck: 5,
      });

      // Play first action
      expect(testEngine.asPlayerOne().playCard(cheapAction)).toBeSuccessfulCommand();
      const bag1 = testEngine.asPlayerOne().getBagEffects();
      if (bag1.length > 0) {
        testEngine.asPlayerOne().resolveOnlyBag();
      }

      expect(testEngine.hasKeyword(aladdinOnTheEdgeOfAdventure, "Evasive")).toBe(true);

      // Play second action
      expect(testEngine.asPlayerOne().playCard(secondAction)).toBeSuccessfulCommand();
      const bag2 = testEngine.asPlayerOne().getBagEffects();
      if (bag2.length > 0) {
        testEngine.asPlayerOne().resolveOnlyBag();
      }

      // Still has Evasive
      expect(testEngine.hasKeyword(aladdinOnTheEdgeOfAdventure, "Evasive")).toBe(true);
    });
  });
});
