import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { noiAcrobaticBaby } from "./119-noi-acrobatic-baby";

const testAction = createMockAction({
  id: "noi-test-action",
  name: "Test Action",
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

const opponentCharacter = createMockCharacter({
  id: "noi-test-opponent",
  name: "Opponent Defender",
  cost: 3,
  strength: 3,
  willpower: 5,
  lore: 1,
});

describe("Noi - Acrobatic Baby", () => {
  describe("FANCY FOOTWORK - Whenever you play an action, this character takes no damage from challenges this turn.", () => {
    it("gains takes-no-damage-from-challenges when you play an action", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [noiAcrobaticBaby],
        hand: [testAction],
        inkwell: testAction.cost,
        deck: 2,
      });

      expect(
        testEngine
          .asPlayerOne()
          .hasTemporaryAbility(noiAcrobaticBaby, "takes-no-damage-from-challenges"),
      ).toBe(false);

      expect(
        testEngine.asPlayerOne().playCard(testAction, { preventAutoResolveTriggeredEffects: true }),
      ).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(noiAcrobaticBaby),
      ).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .hasTemporaryAbility(noiAcrobaticBaby, "takes-no-damage-from-challenges"),
      ).toBe(true);
    });

    it("takes no damage when challenging an opponent after playing an action", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: noiAcrobaticBaby, isDrying: false }],
          hand: [testAction],
          inkwell: testAction.cost,
          deck: 2,
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
          deck: 1,
        },
      );

      // Play an action to trigger Fancy Footwork
      expect(
        testEngine.asPlayerOne().playCard(testAction, { preventAutoResolveTriggeredEffects: true }),
      ).toBeSuccessfulCommand();
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(noiAcrobaticBaby),
      ).toBeSuccessfulCommand();

      // Challenge with Noi - she should take no damage
      expect(
        testEngine.asPlayerOne().challenge(noiAcrobaticBaby, opponentCharacter),
      ).toBeSuccessfulCommand();

      // Noi should take no damage from the challenge
      expect(testEngine.asPlayerOne()).toHaveDamage({
        card: noiAcrobaticBaby,
        value: 0,
      });

      // Opponent should still take damage from Noi
      expect(testEngine.asPlayerTwo()).toHaveDamage({
        card: opponentCharacter,
        value: noiAcrobaticBaby.strength,
      });
    });

    it("takes normal damage when challenging without playing an action first", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: noiAcrobaticBaby, isDrying: false }],
          deck: 2,
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
          deck: 1,
        },
      );

      // Challenge without playing an action first
      expect(
        testEngine.asPlayerOne().challenge(noiAcrobaticBaby, opponentCharacter),
      ).toBeSuccessfulCommand();

      // Noi should take normal damage from the opponent's strength
      expect(testEngine.asPlayerOne()).toHaveDamage({
        card: noiAcrobaticBaby,
        value: opponentCharacter.strength,
      });
    });

    it("protection expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [noiAcrobaticBaby],
        hand: [testAction],
        inkwell: testAction.cost,
        deck: 2,
      });

      // Play an action to trigger Fancy Footwork
      expect(
        testEngine.asPlayerOne().playCard(testAction, { preventAutoResolveTriggeredEffects: true }),
      ).toBeSuccessfulCommand();
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(noiAcrobaticBaby),
      ).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .hasTemporaryAbility(noiAcrobaticBaby, "takes-no-damage-from-challenges"),
      ).toBe(true);

      // End turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .hasTemporaryAbility(noiAcrobaticBaby, "takes-no-damage-from-challenges"),
      ).toBe(false);
    });
  });
});
