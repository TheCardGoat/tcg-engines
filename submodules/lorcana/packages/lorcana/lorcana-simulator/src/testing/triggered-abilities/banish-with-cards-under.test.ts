import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import {
  lonelyGrave,
  scroogesCountingHouseEbenezersOffice,
  wreckitRalphRagingWrecker,
} from "@tcg/lorcana-cards/cards/011";

/**
 * BANISH INTERACTIONS WITH CARDS-UNDER
 * Tests for abilities that trigger on banish and use cards-under information
 */
describe("Banish Interactions with Cards-Under", () => {
  describe("GOOFY-001 to GOOFY-004: Goofy - GRAVE OUTCOME", () => {
    it.todo("GOOFY-001: On banish: each opponent discards 1 per card that was under him", () => {});

    it.todo("GOOFY-002: Uses cards-under-count-before-banish (snapshot)", () => {});

    it.todo("GOOFY-003: 0 cards under = no discard", () => {});

    it.todo("GOOFY-004: Works regardless of how banished", () => {});
  });

  describe("RALPH-001 to RALPH-003: Wreck-it Ralph - WHO'S COMIN' WITH ME?", () => {
    it.todo("RALPH-001: On banish: banish all chars with S <= Ralph's in-play strength", () => {});

    it.todo("RALPH-002: Ralph's strength includes cards-under bonus", () => {});

    it.todo("RALPH-003: Uses snapshot at time of banish", () => {});

    it("regression THE-960: uses pre-banish boosted strength when Ralph is banished as an activation cost", () => {
      const fourStrengthTargetA = createMockCharacter({
        id: "the-960-four-strength-target-a",
        name: "THE-960 Target A",
        cost: 4,
        strength: 4,
        willpower: 4,
      });

      const fourStrengthTargetB = createMockCharacter({
        id: "the-960-four-strength-target-b",
        name: "THE-960 Target B",
        cost: 4,
        strength: 4,
        willpower: 4,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 5,
          play: [lonelyGrave, scroogesCountingHouseEbenezersOffice, wreckitRalphRagingWrecker],
          inkwell: 10,
        },
        {
          play: [fourStrengthTargetA, fourStrengthTargetB],
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(wreckitRalphRagingWrecker, { ability: "Boost" }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardStrength(wreckitRalphRagingWrecker)).toBe(4);

      expect(
        testEngine.asPlayerOne().activateAbility(lonelyGrave, {
          costs: {
            banishCharacters: [
              testEngine.findCardInstanceId(wreckitRalphRagingWrecker, "play", PLAYER_ONE),
            ],
          },
          targets: [scroogesCountingHouseEbenezersOffice],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(fourStrengthTargetA)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCardZone(fourStrengthTargetB)).toBe("discard");
    });
  });

  describe("MICKEY-001 to MICKEY-005: Mickey - A GIVING HEART", () => {
    it.todo("MICKEY-001: On banish in challenge: may put cards under to another char/loc", () => {});

    it.todo("MICKEY-002: Effect is optional", () => {});

    it.todo("MICKEY-003: Requires in-challenge restriction", () => {});

    it.todo("MICKEY-004: Requires had-card-under condition", () => {});

    it.todo("MICKEY-005: Cards move (not lost) to new target", () => {});
  });

  describe("Banish & Cards-Under Mechanics", () => {
    it.todo("Cards under are lost when character is banished", () => {});

    it.todo("Character banish triggers snapshot cards-under count at moment of banish", () => {});

    it.todo("Multiple banish-triggered abilities fire in correct order", () => {});

    it.todo("Banish via challenge uses correct cards-under snapshot", () => {});
  });
});
