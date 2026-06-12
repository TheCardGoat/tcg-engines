import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { daisyDuckTrendyTraveler } from "./115-daisy-duck-trendy-traveler";

const anotherCharacter = createMockCharacter({
  id: "daisy-ally",
  name: "Ally",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const readyTarget = createMockCharacter({
  id: "daisy-ready-target",
  name: "Ready Target",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Daisy Duck - Trendy Traveler", () => {
  describe("BREAK IS OVER - Whenever this character quests, if you played a character this turn, you may ready another chosen character. If you do, they can't quest for the rest of this turn.", () => {
    it("readies a chosen other character and applies cant-quest when questing after playing another character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [anotherCharacter],
          play: [
            { card: daisyDuckTrendyTraveler, isDrying: false },
            { card: readyTarget, exerted: true },
          ],
          inkwell: anotherCharacter.cost,
          deck: 3,
        },
        {
          deck: 3,
        },
      );

      const readyTargetId = testEngine.findCardInstanceId(readyTarget, "play", "player_one");

      expect(testEngine.asPlayerOne().isExerted(readyTargetId)).toBe(true);

      expect(testEngine.asPlayerOne().playCard(anotherCharacter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().quest(daisyDuckTrendyTraveler)).toBeSuccessfulCommand();

      // BREAK IS OVER should be pending in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

      // Accept the optional ability
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(daisyDuckTrendyTraveler, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Choose the exerted target to ready
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [readyTargetId] }),
      ).toBeSuccessfulCommand();

      // The chosen character should be readied
      expect(testEngine.asPlayerOne().isExerted(readyTargetId)).toBe(false);

      // The chosen character should have the cant-quest restriction for this turn
      expect(testEngine.hasRestriction(readyTarget, "cant-quest")).toBe(true);
    });

    it("does not trigger when no character was played this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: daisyDuckTrendyTraveler, isDrying: false },
            { card: readyTarget, exerted: true },
          ],
          deck: 3,
        },
        {
          deck: 3,
        },
      );

      const readyTargetId = testEngine.findCardInstanceId(readyTarget, "play", "player_one");

      expect(testEngine.asPlayerOne().quest(daisyDuckTrendyTraveler)).toBeSuccessfulCommand();

      // The trigger enters the bag; resolving it should be a no-op since the
      // condition is evaluated at resolution and "no character played this turn".
      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        expect(
          testEngine
            .asPlayerOne()
            .resolvePendingByCard(daisyDuckTrendyTraveler, { resolveOptional: true }),
        ).toBeSuccessfulCommand();
      }

      // Target should remain exerted and have no cant-quest restriction applied.
      expect(testEngine.asPlayerOne().isExerted(readyTargetId)).toBe(true);
      expect(testEngine.hasRestriction(readyTarget, "cant-quest")).toBe(false);
    });

    it("can decline the optional ability even if the condition is met", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [anotherCharacter],
          play: [
            { card: daisyDuckTrendyTraveler, isDrying: false },
            { card: readyTarget, exerted: true },
          ],
          inkwell: anotherCharacter.cost,
          deck: 3,
        },
        {
          deck: 3,
        },
      );

      const readyTargetId = testEngine.findCardInstanceId(readyTarget, "play", "player_one");

      expect(testEngine.asPlayerOne().playCard(anotherCharacter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().quest(daisyDuckTrendyTraveler)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

      // Decline the optional ability.
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(daisyDuckTrendyTraveler, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // The target should remain exerted and untouched.
      expect(testEngine.asPlayerOne().isExerted(readyTargetId)).toBe(true);
      expect(testEngine.hasRestriction(readyTarget, "cant-quest")).toBe(false);
    });
  });
});
