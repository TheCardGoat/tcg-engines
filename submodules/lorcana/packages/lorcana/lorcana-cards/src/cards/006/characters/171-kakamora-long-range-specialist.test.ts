import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { kakamoraLongrangeSpecialist } from "./171-kakamora-long-range-specialist";
import { mrSmeeSteadfastMate } from "./175-mr-smee-steadfast-mate";

const opponentCharacter = createMockCharacter({
  id: "kakamora-test-opponent-char",
  name: "Opponent Character",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
});

const mockLocation = createMockLocation({
  id: "kakamora-test-location",
  name: "Mock Location",
  cost: 2,
  willpower: 5,
});

describe("Kakamora - Long-Range Specialist", () => {
  describe("A LITTLE HELP - When you play this character, if you have another Pirate character in play, you may deal 1 damage to chosen character or location.", () => {
    it("deals 1 damage to chosen character when another Pirate is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [kakamoraLongrangeSpecialist],
          play: [mrSmeeSteadfastMate],
          inkwell: kakamoraLongrangeSpecialist.cost,
          deck: 1,
        },
        {
          play: [opponentCharacter],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(kakamoraLongrangeSpecialist),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(kakamoraLongrangeSpecialist, {
          resolveOptional: true,
          targets: [opponentCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(opponentCharacter)).toBe(1);
    });

    it("deals 1 damage to chosen location when another Pirate is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [kakamoraLongrangeSpecialist],
          play: [mrSmeeSteadfastMate],
          inkwell: kakamoraLongrangeSpecialist.cost,
          deck: 1,
        },
        {
          play: [mockLocation],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(kakamoraLongrangeSpecialist),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(kakamoraLongrangeSpecialist, {
          resolveOptional: true,
          targets: [mockLocation],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(mockLocation)).toBe(1);
    });

    it("does not trigger when no other Pirate is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [kakamoraLongrangeSpecialist],
          inkwell: kakamoraLongrangeSpecialist.cost,
          deck: 1,
        },
        {
          play: [opponentCharacter],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(kakamoraLongrangeSpecialist),
      ).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getDamage(opponentCharacter)).toBe(0);
    });

    it("can decline the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [kakamoraLongrangeSpecialist],
          play: [mrSmeeSteadfastMate],
          inkwell: kakamoraLongrangeSpecialist.cost,
          deck: 1,
        },
        {
          play: [opponentCharacter],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(kakamoraLongrangeSpecialist),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(kakamoraLongrangeSpecialist, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(opponentCharacter)).toBe(0);
    });
  });
});
