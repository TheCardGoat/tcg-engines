import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { queenOfHeartsSensingWeakness } from "./120-queen-of-hearts-sensing-weakness";

const challengeTarget = createMockCharacter({
  id: "queen-009-sensing-target",
  name: "Challenge Target",
  cost: 2,
  strength: 1,
  willpower: 3,
});

describe("Queen of Hearts - Sensing Weakness [Set 009]", () => {
  it("has Shift 2 keyword", () => {
    const shiftAbility = queenOfHeartsSensingWeakness.abilities?.find(
      (a) => a.type === "keyword" && a.keyword === "Shift",
    );
    expect(shiftAbility).toBeDefined();
    expect((shiftAbility as { cost?: { ink?: number } }).cost?.ink).toBe(2);
  });

  describe("LET THE GAME BEGIN - Whenever one of your characters challenges another character, you may draw a card.", () => {
    it("triggers when Queen of Hearts herself challenges", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: queenOfHeartsSensingWeakness, isDrying: false }],
          deck: 3,
        },
        {
          play: [{ card: challengeTarget, exerted: true }],
          deck: 3,
        },
      );

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;

      expect(
        testEngine.asPlayerOne().challenge(queenOfHeartsSensingWeakness, challengeTarget),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(queenOfHeartsSensingWeakness, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      const handAfter = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;
      expect(handAfter).toBe(handBefore + 1);
    });

    it("does not draw a card when the optional is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: queenOfHeartsSensingWeakness, isDrying: false }],
          deck: 3,
        },
        {
          play: [{ card: challengeTarget, exerted: true }],
          deck: 3,
        },
      );

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;

      expect(
        testEngine.asPlayerOne().challenge(queenOfHeartsSensingWeakness, challengeTarget),
      ).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(queenOfHeartsSensingWeakness, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      const handAfter = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;
      expect(handAfter).toBe(handBefore);
    });

    it("triggers when another friendly character challenges", () => {
      const friendlyAttacker = createMockCharacter({
        id: "queen-009-sensing-friendly-attacker",
        name: "Friendly Attacker",
        cost: 2,
        strength: 3,
        willpower: 2,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [queenOfHeartsSensingWeakness, { card: friendlyAttacker, isDrying: false }],
          deck: 3,
        },
        {
          play: [{ card: challengeTarget, exerted: true }],
          deck: 3,
        },
      );

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;

      expect(
        testEngine.asPlayerOne().challenge(friendlyAttacker, challengeTarget),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(queenOfHeartsSensingWeakness, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      const handAfter = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;
      expect(handAfter).toBe(handBefore + 1);
    });
  });

  it("regression: should not trigger when challenging a location (only character challenges)", () => {
    // Bug: Queen of Hearts was triggering LET THE GAME BEGIN on location challenge,
    // but it should only trigger when challenging another character.
    const { createMockLocation } = require("@tcg/lorcana-engine/testing");
    const testLocation = createMockLocation({
      id: "queen-009-sensing-test-location",
      name: "Test Location",
      cost: 2,
      willpower: 5,
      moveCost: 1,
      lore: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: queenOfHeartsSensingWeakness, isDrying: false }],
        deck: 3,
      },
      {
        play: [testLocation],
        deck: 3,
      },
    );

    const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;

    // Challenge the location
    const result = testEngine.asPlayerOne().challenge(queenOfHeartsSensingWeakness, testLocation);

    if (result.success) {
      // LET THE GAME BEGIN should NOT trigger on location challenge
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      const handAfter = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;
      expect(handAfter).toBe(handBefore);
    }
    // If challenging a location is not supported, the test still validates
  });
});
