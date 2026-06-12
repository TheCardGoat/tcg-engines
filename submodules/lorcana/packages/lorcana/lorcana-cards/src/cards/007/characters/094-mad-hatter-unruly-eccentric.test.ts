import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { madHatterUnrulyEccentric } from "./094-mad-hatter-unruly-eccentric";

const challengeTarget = createMockCharacter({
  id: "mad-hatter-target",
  name: "Challenge Target",
  cost: 2,
  strength: 1,
  willpower: 5,
});

const damagedAttacker = createMockCharacter({
  id: "mad-hatter-damaged-attacker",
  name: "Damaged Attacker",
  cost: 3,
  strength: 2,
  willpower: 4,
});

const undamagedAttacker = createMockCharacter({
  id: "mad-hatter-undamaged-attacker",
  name: "Undamaged Attacker",
  cost: 3,
  strength: 2,
  willpower: 4,
});

describe("Mad Hatter - Unruly Eccentric", () => {
  describe("UNBIRTHDAY PRESENT - Whenever a damaged character challenges another character, you may draw a card.", () => {
    it("triggers when your damaged character challenges", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: madHatterUnrulyEccentric, isDrying: false },
            { card: damagedAttacker, isDrying: false, damage: 1 },
          ],
          deck: 3,
        },
        {
          play: [{ card: challengeTarget, exerted: true }],
          deck: 3,
        },
      );

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;

      expect(
        testEngine.asPlayerOne().challenge(damagedAttacker, challengeTarget),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(madHatterUnrulyEccentric, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      const handAfter = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;
      expect(handAfter).toBe(handBefore + 1);
    });

    it("triggers when opponent's damaged character challenges", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: madHatterUnrulyEccentric, isDrying: false },
            { card: challengeTarget, exerted: true },
          ],
          deck: 3,
        },
        {
          play: [{ card: damagedAttacker, isDrying: false, damage: 1 }],
          deck: 3,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;

      expect(
        testEngine.asPlayerTwo().challenge(damagedAttacker, challengeTarget),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(madHatterUnrulyEccentric, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      const handAfter = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;
      expect(handAfter).toBe(handBefore + 1);
    });

    it("does NOT trigger when an undamaged character challenges", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: madHatterUnrulyEccentric, isDrying: false },
            { card: undamagedAttacker, isDrying: false },
          ],
          deck: 3,
        },
        {
          play: [{ card: challengeTarget, exerted: true }],
          deck: 3,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(undamagedAttacker, challengeTarget),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("triggers when Mad Hatter himself is damaged and challenges", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: madHatterUnrulyEccentric, isDrying: false, damage: 1 }],
          deck: 3,
        },
        {
          play: [{ card: challengeTarget, exerted: true }],
          deck: 3,
        },
      );

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;

      expect(
        testEngine.asPlayerOne().challenge(madHatterUnrulyEccentric, challengeTarget),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(madHatterUnrulyEccentric, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      const handAfter = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;
      expect(handAfter).toBe(handBefore + 1);
    });
  });
});
