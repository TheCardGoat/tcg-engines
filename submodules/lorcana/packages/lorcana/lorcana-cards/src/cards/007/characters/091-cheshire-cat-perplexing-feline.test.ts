import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { cheshireCatPerplexingFeline } from "./091-cheshire-cat-perplexing-feline";

const damagedOpponent = createMockCharacter({
  id: "cheshire-test-damaged-opponent",
  name: "Damaged Opponent",
  cost: 2,
  strength: 2,
  willpower: 6,
  lore: 1,
});

const undamagedOpponent = createMockCharacter({
  id: "cheshire-test-undamaged-opponent",
  name: "Undamaged Opponent",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
});

const ownDamagedCharacter = createMockCharacter({
  id: "cheshire-test-own-damaged",
  name: "Own Damaged Character",
  cost: 2,
  strength: 2,
  willpower: 6,
  lore: 1,
});

describe("Cheshire Cat - Perplexing Feline", () => {
  describe("MAD GRIN - When you play this character, you may deal 2 damage to chosen damaged character.", () => {
    it("deals 2 damage to a chosen damaged opposing character when played and accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [cheshireCatPerplexingFeline],
          inkwell: cheshireCatPerplexingFeline.cost,
        },
        {
          play: [{ card: damagedOpponent, damage: 1 }],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(cheshireCatPerplexingFeline),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(cheshireCatPerplexingFeline, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [damagedOpponent] }),
      ).toBeSuccessfulCommand();

      // Should have dealt 2 damage (1 pre-existing + 2 from ability = 3)
      expect(testEngine.asPlayerTwo().getDamage(damagedOpponent)).toBe(3);
    });

    it("can target own damaged characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [cheshireCatPerplexingFeline],
        play: [{ card: ownDamagedCharacter, damage: 1 }],
        inkwell: cheshireCatPerplexingFeline.cost,
      });

      expect(
        testEngine.asPlayerOne().playCard(cheshireCatPerplexingFeline),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(cheshireCatPerplexingFeline, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [ownDamagedCharacter] }),
      ).toBeSuccessfulCommand();

      // Should have dealt 2 damage (1 pre-existing + 2 from ability = 3)
      expect(testEngine.asPlayerOne().getDamage(ownDamagedCharacter)).toBe(3);
    });

    it("does not deal damage when the optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [cheshireCatPerplexingFeline],
          inkwell: cheshireCatPerplexingFeline.cost,
        },
        {
          play: [{ card: damagedOpponent, damage: 1 }],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(cheshireCatPerplexingFeline),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(cheshireCatPerplexingFeline, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Damage should remain at 1 (pre-existing only)
      expect(testEngine.asPlayerTwo().getDamage(damagedOpponent)).toBe(1);
    });

    it("cannot target undamaged characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [cheshireCatPerplexingFeline],
          inkwell: cheshireCatPerplexingFeline.cost,
        },
        {
          play: [undamagedOpponent],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(cheshireCatPerplexingFeline),
      ).toBeSuccessfulCommand();

      // With no valid targets (no damaged characters), the ability should auto-resolve
      // The undamaged character should have 0 damage
      expect(testEngine.asPlayerTwo().getDamage(undamagedOpponent)).toBe(0);
    });

    it("plays successfully even with no characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [cheshireCatPerplexingFeline],
        inkwell: cheshireCatPerplexingFeline.cost,
      });

      expect(
        testEngine.asPlayerOne().playCard(cheshireCatPerplexingFeline),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(cheshireCatPerplexingFeline)).toBe("play");
    });
  });
});
