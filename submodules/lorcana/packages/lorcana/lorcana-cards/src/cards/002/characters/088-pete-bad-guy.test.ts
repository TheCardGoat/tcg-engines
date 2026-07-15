import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockAction } from "@tcg/lorcana-engine/testing";
import { peteBadGuy } from "./088-pete-bad-guy";

const testAction1 = createMockAction({
  id: "pete-bad-guy-test-action-1",
  name: "Test Action 1",
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

const testAction2 = createMockAction({
  id: "pete-bad-guy-test-action-2",
  name: "Test Action 2",
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

describe("Pete - Bad Guy", () => {
  it("has Ward keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [peteBadGuy],
      deck: 1,
    });

    expect(testEngine.hasKeyword(peteBadGuy, "Ward")).toBe(true);
  });

  describe("TAKE THAT! - Whenever you play an action, this character gets +2 {S} this turn.", () => {
    it("gets +2 strength when you play an action", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [peteBadGuy],
        hand: [testAction1],
        inkwell: testAction1.cost,
        deck: 2,
      });

      const strengthBefore = testEngine.asPlayerOne().getCardStrength(peteBadGuy);
      expect(strengthBefore).toBe(peteBadGuy.strength);

      expect(
        testEngine
          .asPlayerOne()
          .playCard(testAction1, { preventAutoResolveTriggeredEffects: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();
      expect(testEngine.asPlayerOne().resolvePendingByCard(peteBadGuy)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(peteBadGuy)).toBe(strengthBefore + 2);
    });

    it("strength boost stacks when multiple actions are played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [peteBadGuy],
        hand: [testAction1, testAction2],
        inkwell: testAction1.cost + testAction2.cost,
        deck: 2,
      });

      const strengthBefore = testEngine.asPlayerOne().getCardStrength(peteBadGuy);

      expect(
        testEngine
          .asPlayerOne()
          .playCard(testAction1, { preventAutoResolveTriggeredEffects: true }),
      ).toBeSuccessfulCommand();
      const [bagEffect1] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect1).toBeDefined();
      expect(testEngine.asPlayerOne().resolvePendingByCard(peteBadGuy)).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .playCard(testAction2, { preventAutoResolveTriggeredEffects: true }),
      ).toBeSuccessfulCommand();
      const [bagEffect2] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect2).toBeDefined();
      expect(testEngine.asPlayerOne().resolvePendingByCard(peteBadGuy)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(peteBadGuy)).toBe(strengthBefore + 4);
    });

    it("strength boost expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [peteBadGuy],
        hand: [testAction1],
        inkwell: testAction1.cost,
        deck: 2,
      });

      const strengthBefore = testEngine.asPlayerOne().getCardStrength(peteBadGuy);

      expect(
        testEngine
          .asPlayerOne()
          .playCard(testAction1, { preventAutoResolveTriggeredEffects: true }),
      ).toBeSuccessfulCommand();
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();
      expect(testEngine.asPlayerOne().resolvePendingByCard(peteBadGuy)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(peteBadGuy)).toBe(strengthBefore + 2);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(peteBadGuy)).toBe(strengthBefore);
    });
  });

  describe("WHO'S NEXT? - While this character has 7 {S} or more, he gets +2 {L}.", () => {
    it("does not give +2 lore when strength is below 7", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [peteBadGuy],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().getCardLore(peteBadGuy)).toBe(peteBadGuy.lore);
    });

    it("gives +2 lore when strength reaches 7 or more via TAKE THAT!", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [peteBadGuy],
        hand: [testAction1, testAction2],
        inkwell: testAction1.cost + testAction2.cost,
        deck: 2,
      });

      // Base: 3 strength, 2 lore
      expect(testEngine.asPlayerOne().getCardStrength(peteBadGuy)).toBe(3);
      expect(testEngine.asPlayerOne().getCardLore(peteBadGuy)).toBe(2);

      // Play first action: 3 + 2 = 5 strength, still below 7
      expect(
        testEngine
          .asPlayerOne()
          .playCard(testAction1, { preventAutoResolveTriggeredEffects: true }),
      ).toBeSuccessfulCommand();
      const [bagEffect1] = testEngine.asPlayerOne().getBagEffects();
      expect(testEngine.asPlayerOne().resolvePendingByCard(peteBadGuy)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(peteBadGuy)).toBe(5);
      expect(testEngine.asPlayerOne().getCardLore(peteBadGuy)).toBe(2);

      // Play second action: 5 + 2 = 7 strength, triggers WHO'S NEXT?
      expect(
        testEngine
          .asPlayerOne()
          .playCard(testAction2, { preventAutoResolveTriggeredEffects: true }),
      ).toBeSuccessfulCommand();
      const [bagEffect2] = testEngine.asPlayerOne().getBagEffects();
      expect(testEngine.asPlayerOne().resolvePendingByCard(peteBadGuy)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(peteBadGuy)).toBe(7);
      expect(testEngine.asPlayerOne().getCardLore(peteBadGuy)).toBe(4); // 2 base + 2 from WHO'S NEXT?
    });

    it("lore bonus goes away when strength drops below 7 at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [peteBadGuy],
        hand: [testAction1, testAction2],
        inkwell: testAction1.cost + testAction2.cost,
        deck: 2,
      });

      // Play both actions to get to 7 strength
      expect(
        testEngine
          .asPlayerOne()
          .playCard(testAction1, { preventAutoResolveTriggeredEffects: true }),
      ).toBeSuccessfulCommand();
      const [bagEffect1] = testEngine.asPlayerOne().getBagEffects();
      expect(testEngine.asPlayerOne().resolvePendingByCard(peteBadGuy)).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .playCard(testAction2, { preventAutoResolveTriggeredEffects: true }),
      ).toBeSuccessfulCommand();
      const [bagEffect2] = testEngine.asPlayerOne().getBagEffects();
      expect(testEngine.asPlayerOne().resolvePendingByCard(peteBadGuy)).toBeSuccessfulCommand();

      // Strength is 7, lore is 4
      expect(testEngine.asPlayerOne().getCardStrength(peteBadGuy)).toBe(7);
      expect(testEngine.asPlayerOne().getCardLore(peteBadGuy)).toBe(4);

      // End turn - strength boost expires, strength drops back to 3
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(peteBadGuy)).toBe(3);
      expect(testEngine.asPlayerOne().getCardLore(peteBadGuy)).toBe(2); // back to base
    });
  });
});
