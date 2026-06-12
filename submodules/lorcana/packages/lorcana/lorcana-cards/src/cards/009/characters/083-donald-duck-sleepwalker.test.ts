import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockAction } from "@tcg/lorcana-engine/testing";
import { donaldDuckSleepwalker } from "./083-donald-duck-sleepwalker";

const someAction = createMockAction({
  id: "donald-sleepwalker-test-action",
  name: "Some Action",
  cost: 1,
  text: "Gain 1 lore.",
  abilities: [
    {
      type: "action",
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "gain-lore",
      },
    },
  ],
});

const secondAction = createMockAction({
  id: "donald-sleepwalker-test-action-2",
  name: "Another Action",
  cost: 1,
  text: "Gain 1 lore.",
  abilities: [
    {
      type: "action",
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "gain-lore",
      },
    },
  ],
});

describe("Donald Duck - Sleepwalker (Set 9)", () => {
  describe("STARTLED AWAKE - Whenever you play an action, this character gets +2 {S} this turn.", () => {
    it("gets +2 strength when you play an action", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [donaldDuckSleepwalker],
        hand: [someAction],
        inkwell: someAction.cost,
        deck: 2,
      });

      const strengthBefore = testEngine.asPlayerOne().getCardStrength(donaldDuckSleepwalker);
      expect(strengthBefore).toBe(donaldDuckSleepwalker.strength);

      expect(
        testEngine.asPlayerOne().playCard(someAction, { preventAutoResolveTriggeredEffects: true }),
      ).toBeSuccessfulCommand();

      // The triggered ability should go into the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(donaldDuckSleepwalker),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(donaldDuckSleepwalker)).toBe(
        strengthBefore + 2,
      );
    });

    it("strength boost expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [donaldDuckSleepwalker],
        hand: [someAction],
        inkwell: someAction.cost,
        deck: 2,
      });

      const strengthBefore = testEngine.asPlayerOne().getCardStrength(donaldDuckSleepwalker);

      expect(
        testEngine.asPlayerOne().playCard(someAction, { preventAutoResolveTriggeredEffects: true }),
      ).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(donaldDuckSleepwalker),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(donaldDuckSleepwalker)).toBe(
        strengthBefore + 2,
      );

      // After P1's turn ends and P2's turn ends, the boost should expire
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(donaldDuckSleepwalker)).toBe(strengthBefore);
    });

    it("stacks when multiple actions are played in the same turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [donaldDuckSleepwalker],
        hand: [someAction, secondAction],
        inkwell: someAction.cost + secondAction.cost,
        deck: 2,
      });

      const strengthBefore = testEngine.asPlayerOne().getCardStrength(donaldDuckSleepwalker);

      expect(
        testEngine.asPlayerOne().playCard(someAction, { preventAutoResolveTriggeredEffects: true }),
      ).toBeSuccessfulCommand();

      const [bagEffect1] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect1).toBeDefined();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(donaldDuckSleepwalker),
      ).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .playCard(secondAction, { preventAutoResolveTriggeredEffects: true }),
      ).toBeSuccessfulCommand();

      const [bagEffect2] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect2).toBeDefined();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(donaldDuckSleepwalker),
      ).toBeSuccessfulCommand();

      // Should have +4 strength (2 per action, 2 actions played)
      expect(testEngine.asPlayerOne().getCardStrength(donaldDuckSleepwalker)).toBe(
        strengthBefore + 4,
      );
    });

    it("does not trigger when opponent plays an action", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [donaldDuckSleepwalker],
          deck: 2,
        },
        {
          hand: [someAction],
          inkwell: someAction.cost,
          deck: 2,
        },
      );

      const strengthBefore = testEngine.asPlayerOne().getCardStrength(donaldDuckSleepwalker);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerTwo().playCard(someAction, { preventAutoResolveTriggeredEffects: true }),
      ).toBeSuccessfulCommand();

      // STARTLED AWAKE should NOT trigger for opponent's action
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCardStrength(donaldDuckSleepwalker)).toBe(strengthBefore);
    });
  });
});
