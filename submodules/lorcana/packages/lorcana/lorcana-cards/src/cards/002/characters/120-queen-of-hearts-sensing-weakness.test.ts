import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { queenOfHeartsSensingWeakness } from "./120-queen-of-hearts-sensing-weakness";

const exertedDefender = createMockCharacter({
  id: "queen-sw-defender",
  name: "Defender",
  cost: 3,
  strength: 2,
  willpower: 6,
});

const friendlyAttacker = createMockCharacter({
  id: "queen-sw-friendly-attacker",
  name: "Friendly Attacker",
  cost: 2,
  strength: 2,
  willpower: 4,
});

describe("Queen of Hearts - Sensing Weakness", () => {
  it("has Shift keyword", () => {
    const testEngine = new LorcanaTestEngine({
      play: [queenOfHeartsSensingWeakness],
    });
    const cardModel = testEngine.getCardModel(queenOfHeartsSensingWeakness);
    expect(cardModel.hasShift()).toBe(true);
    expect(cardModel.shiftInkCost).toBe(2);
    expect(queenOfHeartsSensingWeakness.missingTests).toBeUndefined();
    expect(queenOfHeartsSensingWeakness.missingImplementation).toBeUndefined();
  });

  describe("LET THE GAME BEGIN - Whenever one of your characters challenges another character, you may draw a card.", () => {
    it("draws a card when accepted after a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [queenOfHeartsSensingWeakness, { card: friendlyAttacker, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: exertedDefender, exerted: true }],
          deck: 3,
        },
      );

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count;

      expect(
        testEngine.asPlayerOne().challenge(friendlyAttacker, exertedDefender),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(queenOfHeartsSensingWeakness, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      const handAfter = testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count;
      expect(handAfter).toBe(handBefore + 1);
    });

    it("does not draw when ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [queenOfHeartsSensingWeakness, { card: friendlyAttacker, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: exertedDefender, exerted: true }],
          deck: 3,
        },
      );

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count;

      expect(
        testEngine.asPlayerOne().challenge(friendlyAttacker, exertedDefender),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(queenOfHeartsSensingWeakness, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      const handAfter = testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count;
      expect(handAfter).toBe(handBefore);
    });

    it("triggers when Queen of Hearts herself challenges", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: queenOfHeartsSensingWeakness, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: exertedDefender, exerted: true }],
          deck: 3,
        },
      );

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count;

      expect(
        testEngine.asPlayerOne().challenge(queenOfHeartsSensingWeakness, exertedDefender),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(queenOfHeartsSensingWeakness, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      const handAfter = testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count;
      expect(handAfter).toBe(handBefore + 1);
    });

    it("does NOT trigger when opponent's character challenges", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: queenOfHeartsSensingWeakness, exerted: true }],
          deck: 3,
        },
        {
          play: [{ card: friendlyAttacker, isDrying: false }],
          deck: 3,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().challenge(friendlyAttacker, queenOfHeartsSensingWeakness),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
    });

    it("triggers multiple times when multiple of your characters challenge", () => {
      const secondAttacker = createMockCharacter({
        id: "queen-sw-second-attacker",
        name: "Second Attacker",
        cost: 2,
        strength: 1,
        willpower: 4,
      });

      const toughDefender = createMockCharacter({
        id: "queen-sw-tough-defender",
        name: "Tough Defender",
        cost: 3,
        strength: 1,
        willpower: 10,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            queenOfHeartsSensingWeakness,
            { card: friendlyAttacker, isDrying: false },
            { card: secondAttacker, isDrying: false },
          ],
          deck: 5,
        },
        {
          play: [{ card: toughDefender, exerted: true }],
          deck: 3,
        },
      );

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count;

      expect(
        testEngine.asPlayerOne().challenge(friendlyAttacker, toughDefender),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(queenOfHeartsSensingWeakness, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().challenge(secondAttacker, toughDefender),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(queenOfHeartsSensingWeakness, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      const handAfter = testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count;
      expect(handAfter).toBe(handBefore + 2);
    });
  });
});
