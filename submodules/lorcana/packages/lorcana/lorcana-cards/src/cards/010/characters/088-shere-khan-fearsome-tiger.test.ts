import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { shereKhanFearsomeTiger } from "./088-shere-khan-fearsome-tiger";

const akelaForestRunner = createMockCharacter({
  id: "sk-akela",
  name: "Akela, Forest Runner",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const diabloWatchfulRaven = createMockCharacter({
  id: "sk-diablo",
  name: "Diablo, Watchful Raven",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
});

describe("Shere Khan - Fearsome Tiger", () => {
  describe("Evasive", () => {
    it("has Evasive keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [shereKhanFearsomeTiger],
      });

      expect(testEngine.asPlayerOne().hasKeyword(shereKhanFearsomeTiger, "Evasive")).toBe(true);
    });
  });

  describe("ON THE HUNT - Whenever this character quests, banish chosen opposing damaged character. Then, you may put 1 damage counter on another chosen character.", () => {
    it("banishes a chosen opposing damaged character and optionally puts 1 damage counter on another chosen character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: shereKhanFearsomeTiger, isDrying: false }],
          deck: 2,
        },
        {
          play: [{ card: akelaForestRunner, damage: 1 }, diabloWatchfulRaven],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().quest(shereKhanFearsomeTiger)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(shereKhanFearsomeTiger, {
          targets: [akelaForestRunner],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(akelaForestRunner)).toBe("discard");

      const pendingEffects = testEngine.asPlayerOne().getPendingEffects();
      if (pendingEffects.length > 0) {
        expect(
          testEngine.asPlayerOne().resolveNextPending({
            targets: [diabloWatchfulRaven],
          }),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerOne().getDamage(diabloWatchfulRaven)).toBe(1);
    });

    it("allows declining the optional second damage effect", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: shereKhanFearsomeTiger, isDrying: false }],
          deck: 2,
        },
        {
          play: [{ card: akelaForestRunner, damage: 1 }],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().quest(shereKhanFearsomeTiger)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(shereKhanFearsomeTiger, {
          targets: [akelaForestRunner],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(akelaForestRunner)).toBe("discard");

      // The optional "may put 1 damage" should be declinable when opponent has
      // no characters left — player should not be forced to damage their own.
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(shereKhanFearsomeTiger, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(shereKhanFearsomeTiger)).toBe(0);
      // Declining the optional should drain the bag entry cleanly and leave
      // no stale pending prompts.
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    });

    it("second effect should activate even if no opposing damaged characters to banish", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: shereKhanFearsomeTiger, isDrying: false }],
          deck: 2,
        },
        {
          play: [akelaForestRunner, diabloWatchfulRaven],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().quest(shereKhanFearsomeTiger)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(shereKhanFearsomeTiger),
      ).toBeSuccessfulCommand();

      const pendingEffects = testEngine.asPlayerOne().getPendingEffects();
      if (pendingEffects.length > 0) {
        expect(
          testEngine.asPlayerOne().resolveNextPending({
            targets: [diabloWatchfulRaven],
          }),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerOne().getDamage(diabloWatchfulRaven)).toBe(1);
    });
  });
});
