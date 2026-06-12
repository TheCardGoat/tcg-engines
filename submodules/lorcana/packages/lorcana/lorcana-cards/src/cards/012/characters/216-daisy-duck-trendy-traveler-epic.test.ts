import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { daisyDuckTrendyTravelerEpic } from "./216-daisy-duck-trendy-traveler-epic";

const anotherCharacter = createMockCharacter({
  id: "daisy-epic-ally",
  name: "Ally",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const readyTarget = createMockCharacter({
  id: "daisy-epic-ready-target",
  name: "Ready Target",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Daisy Duck - Trendy Traveler (Epic)", () => {
  describe("BREAK IS OVER - Whenever this character quests, if you played a character this turn, you may ready another chosen character. If you do, they can't quest for the rest of this turn.", () => {
    it("readies a chosen other character and applies cant-quest when questing after playing another character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [anotherCharacter],
          play: [
            { card: daisyDuckTrendyTravelerEpic, isDrying: false },
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
      expect(testEngine.asPlayerOne().quest(daisyDuckTrendyTravelerEpic)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(daisyDuckTrendyTravelerEpic, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [readyTargetId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(readyTargetId)).toBe(false);
      expect(testEngine.hasRestriction(readyTarget, "cant-quest")).toBe(true);
    });

    it("does not trigger when no character was played this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: daisyDuckTrendyTravelerEpic, isDrying: false },
            { card: readyTarget, exerted: true },
          ],
          deck: 3,
        },
        {
          deck: 3,
        },
      );

      const readyTargetId = testEngine.findCardInstanceId(readyTarget, "play", "player_one");

      expect(testEngine.asPlayerOne().quest(daisyDuckTrendyTravelerEpic)).toBeSuccessfulCommand();

      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        expect(
          testEngine
            .asPlayerOne()
            .resolvePendingByCard(daisyDuckTrendyTravelerEpic, { resolveOptional: true }),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerOne().isExerted(readyTargetId)).toBe(true);
      expect(testEngine.hasRestriction(readyTarget, "cant-quest")).toBe(false);
    });

    it("can decline the optional ability even if the condition is met", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [anotherCharacter],
          play: [
            { card: daisyDuckTrendyTravelerEpic, isDrying: false },
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
      expect(testEngine.asPlayerOne().quest(daisyDuckTrendyTravelerEpic)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(daisyDuckTrendyTravelerEpic, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(readyTargetId)).toBe(true);
      expect(testEngine.hasRestriction(readyTarget, "cant-quest")).toBe(false);
    });
  });
});
