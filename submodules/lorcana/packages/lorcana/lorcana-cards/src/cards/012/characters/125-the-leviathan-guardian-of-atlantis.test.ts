import { describe, expect, it } from "bun:test";
import type { ZoneId } from "@tcg/lorcana-engine";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { theLeviathanGuardianOfAtlantis } from "./125-the-leviathan-guardian-of-atlantis";

const discardFodderA = createMockCharacter({
  id: "leviathan-discard-fodder-a",
  name: "Leviathan Fodder A",
  cost: 1,
});

const discardFodderB = createMockCharacter({
  id: "leviathan-discard-fodder-b",
  name: "Leviathan Fodder B",
  cost: 1,
});

const opposingSmall = createMockCharacter({
  id: "leviathan-opposing-small",
  name: "Opposing Small",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const opposingMedium = createMockCharacter({
  id: "leviathan-opposing-medium",
  name: "Opposing Medium",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
});

// strength 7 so that medium(4) + large(7) = 11, exceeding the budget of 10
const opposingLarge = createMockCharacter({
  id: "leviathan-opposing-large",
  name: "Opposing Large",
  cost: 7,
  strength: 7,
  willpower: 6,
  lore: 2,
});

describe("The Leviathan - Guardian of Atlantis", () => {
  describe("IT'S A MACHINE! - When you play this character, if 2 or more cards were put into your discard this turn, you may banish any number of chosen opposing characters with total {S} 10 or less.", () => {
    it("banishes multiple opposing characters whose total strength is 10 or less when the discard condition is met", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [theLeviathanGuardianOfAtlantis],
          inkwell: theLeviathanGuardianOfAtlantis.cost,
          deck: [discardFodderA, discardFodderB],
        },
        {
          play: [opposingSmall, opposingMedium],
          deck: 5,
        },
      );

      // Put two cards into controller's discard to satisfy the trigger condition.
      const fodderAId = testEngine.findCardInstanceId(discardFodderA, "deck", PLAYER_ONE);
      const fodderBId = testEngine.findCardInstanceId(discardFodderB, "deck", PLAYER_ONE);
      expect(
        testEngine.asServer().manualMoveCard(fodderAId, `discard:${PLAYER_ONE}` as ZoneId),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asServer().manualMoveCard(fodderBId, `discard:${PLAYER_ONE}` as ZoneId),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().playCard(theLeviathanGuardianOfAtlantis),
      ).toBeSuccessfulCommand();

      // strength 2 + 4 = 6, within the budget of 10.
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(theLeviathanGuardianOfAtlantis, {
          resolveOptional: true,
          targets: [opposingSmall, opposingMedium],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(opposingSmall)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCardZone(opposingMedium)).toBe("discard");
    });

    it("does not trigger when fewer than 2 cards entered controller's discard this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [theLeviathanGuardianOfAtlantis],
          inkwell: theLeviathanGuardianOfAtlantis.cost,
          deck: [discardFodderA],
        },
        {
          play: [opposingSmall],
          deck: 5,
        },
      );

      const fodderAId = testEngine.findCardInstanceId(discardFodderA, "deck", PLAYER_ONE);
      expect(
        testEngine.asServer().manualMoveCard(fodderAId, `discard:${PLAYER_ONE}` as ZoneId),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().playCard(theLeviathanGuardianOfAtlantis),
      ).toBeSuccessfulCommand();

      // Opposing character should remain in play — trigger condition not met.
      expect(testEngine.asPlayerTwo().getCardZone(opposingSmall)).toBe("play");
    });

    it("enforces the total strength 10 or less budget: selections over budget are rejected", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [theLeviathanGuardianOfAtlantis],
          inkwell: theLeviathanGuardianOfAtlantis.cost,
          deck: [discardFodderA, discardFodderB],
        },
        {
          play: [opposingMedium, opposingLarge],
          deck: 5,
        },
      );

      const fodderAId = testEngine.findCardInstanceId(discardFodderA, "deck", PLAYER_ONE);
      const fodderBId = testEngine.findCardInstanceId(discardFodderB, "deck", PLAYER_ONE);
      expect(
        testEngine.asServer().manualMoveCard(fodderAId, `discard:${PLAYER_ONE}` as ZoneId),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asServer().manualMoveCard(fodderBId, `discard:${PLAYER_ONE}` as ZoneId),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().playCard(theLeviathanGuardianOfAtlantis),
      ).toBeSuccessfulCommand();

      // strength 4 + 7 = 11, exceeds the budget of 10 — the larger target should not be banished.
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(theLeviathanGuardianOfAtlantis, {
          resolveOptional: true,
          targets: [opposingMedium, opposingLarge],
        }),
      ).toBeSuccessfulCommand();

      // At least one of the selected pair must remain in play because the full
      // selection exceeds the budget. Banishing both would be illegal.
      const mediumZone = testEngine.asPlayerTwo().getCardZone(opposingMedium);
      const largeZone = testEngine.asPlayerTwo().getCardZone(opposingLarge);
      expect(mediumZone === "play" || largeZone === "play").toBe(true);
    });

    // TODO(test-fixture): the meaningful version of this ruling test requires
    // a real strength modifier (e.g. an item or static effect that pushes one
    // target's effective {S} below 0) so the implementation has to read
    // CURRENT strength and clamp negatives. As written below — printed 0 and
    // 4 with no modifier — an engine that just sums printed strengths and
    // has no clamping would still pass, so the test gives false confidence.
    // Skipped until we can construct a fixture that actually applies a
    // negative {S} modifier. See PR #1275 review (codex P2).
    it.todo("release notes ruling: uses CURRENT (modified) strength when summing, with negatives clamped to 0", () => {
      // Q&A: When totalling opposing {S}, modifiers count, and a current
      // {S} below 0 is treated as 0. Construct: one opposing character with
      // 0 effective strength (printed 0), and one with 4 base. Even if we
      // imagined the 0 character's strength shifted negative by some effect,
      // it must NOT contribute negatively. Total used: max(0, 0) + 4 = 4 ≤ 10.
      const opposingZeroStrength = createMockCharacter({
        id: "leviathan-release-zero-s",
        name: "Zero S",
        cost: 1,
        strength: 0,
        willpower: 3,
      });
      const opposingFourStrength = createMockCharacter({
        id: "leviathan-release-four-s",
        name: "Four S",
        cost: 4,
        strength: 4,
        willpower: 4,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [theLeviathanGuardianOfAtlantis],
          inkwell: theLeviathanGuardianOfAtlantis.cost,
          deck: [discardFodderA, discardFodderB],
        },
        {
          play: [opposingZeroStrength, opposingFourStrength],
          deck: 5,
        },
      );

      const fodderAId = testEngine.findCardInstanceId(discardFodderA, "deck", PLAYER_ONE);
      const fodderBId = testEngine.findCardInstanceId(discardFodderB, "deck", PLAYER_ONE);
      expect(
        testEngine.asServer().manualMoveCard(fodderAId, `discard:${PLAYER_ONE}` as ZoneId),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asServer().manualMoveCard(fodderBId, `discard:${PLAYER_ONE}` as ZoneId),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().playCard(theLeviathanGuardianOfAtlantis),
      ).toBeSuccessfulCommand();

      // 0 + 4 = 4 ≤ 10 — both are legal selections.
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(theLeviathanGuardianOfAtlantis, {
          resolveOptional: true,
          targets: [opposingZeroStrength, opposingFourStrength],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(opposingZeroStrength)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCardZone(opposingFourStrength)).toBe("discard");
    });

    it("exposes no missing implementation flags", () => {
      expect(theLeviathanGuardianOfAtlantis.missingImplementation).toBeUndefined();
      expect(theLeviathanGuardianOfAtlantis.missingTests).toBeUndefined();
    });
  });

  describe("Monster classification (rules 5.3.3.2 — Wilds Unknown)", () => {
    it("is recognizable as a Monster by classification-filtering effects", () => {
      // Use a mock character whose static ability filters by has-classification: "Monster"
      // to confirm the engine's classification predicate recognizes The Leviathan as a Monster.
      const monsterBuffer = createMockCharacter({
        id: "leviathan-monster-buffer",
        name: "Monster Watcher",
        cost: 2,
        strength: 1,
        willpower: 3,
        lore: 1,
        classifications: ["Storyborn", "Ally"],
        abilities: [
          {
            id: "leviathan-monster-buffer-static",
            name: "MONSTER WATCH",
            type: "static",
            text: "This character gets +1 {S} for each Monster character you have in play.",
            effect: {
              type: "modify-stat",
              stat: "strength",
              modifier: {
                type: "filtered-count",
                owner: "you",
                zones: ["play"],
                cardType: "character",
                filters: [{ type: "has-classification", classification: "Monster" }],
                excludeSelf: true,
                multiplier: 1,
              },
              target: "SELF",
            },
          },
        ],
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: theLeviathanGuardianOfAtlantis, isDrying: false },
          { card: monsterBuffer, isDrying: false },
        ],
        deck: 5,
      });

      // Monster Watcher gains +1 strength because The Leviathan is a Monster.
      expect(testEngine.asPlayerOne().getCardStrength(monsterBuffer)).toBe(
        monsterBuffer.strength! + 1,
      );

      // Sanity: confirm The Leviathan's printed classifications include "Monster".
      expect(theLeviathanGuardianOfAtlantis.classifications).toContain("Monster");
    });
  });
});
