import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mrsPottsEnchantedTeapot } from "./052-mrs-potts-enchanted-teapot";

const lumiere = createMockCharacter({
  id: "mrs-potts-test-lumiere",
  name: "Lumiere",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
});

const cogsworth = createMockCharacter({
  id: "mrs-potts-test-cogsworth",
  name: "Cogsworth",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
});

const otherCharacter = createMockCharacter({
  id: "mrs-potts-test-other",
  name: "Other Character",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
});

describe("Mrs. Potts - Enchanted Teapot", () => {
  describe("IT'LL TURN OUT ALL RIGHT - When you play this character, if you have a character named Lumiere or Cogsworth in play, you may draw a card.", () => {
    it("should not trigger when neither Lumiere nor Cogsworth is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mrsPottsEnchantedTeapot],
        inkwell: mrsPottsEnchantedTeapot.cost,
        play: [otherCharacter],
        deck: 5,
      });

      const deckBefore = testEngine.asPlayerOne().getZonesCardCount("player_one").deck;

      expect(testEngine.asPlayerOne().playCard(mrsPottsEnchantedTeapot)).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      // Neither Lumiere nor Cogsworth in play — no card drawn
      expect(testEngine.asPlayerOne().getZonesCardCount("player_one").deck).toBe(deckBefore);
    });

    it("should trigger when Lumiere is in play and draw a card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mrsPottsEnchantedTeapot],
        inkwell: mrsPottsEnchantedTeapot.cost,
        play: [lumiere],
        deck: 5,
      });

      const initialHandCount = testEngine.asPlayerOne().getZonesCardCount("player_one").hand;
      const initialDeckCount = testEngine.asPlayerOne().getZonesCardCount("player_one").deck;

      expect(testEngine.asPlayerOne().playCard(mrsPottsEnchantedTeapot)).toBeSuccessfulCommand();

      // Triggered ability should be on the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

      // Accept the optional draw
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mrsPottsEnchantedTeapot, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Hand: was initialHandCount (including Mrs. Potts), -1 for playing Mrs. Potts, +1 draw
      expect(testEngine.asPlayerOne().getZonesCardCount("player_one").hand).toBe(
        initialHandCount - 1 + 1,
      );
      // Deck: -1 for draw
      expect(testEngine.asPlayerOne().getZonesCardCount("player_one").deck).toBe(
        initialDeckCount - 1,
      );
    });

    it("should trigger when Cogsworth is in play and draw a card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mrsPottsEnchantedTeapot],
        inkwell: mrsPottsEnchantedTeapot.cost,
        play: [cogsworth],
        deck: 5,
      });

      const initialDeckCount = testEngine.asPlayerOne().getZonesCardCount("player_one").deck;

      expect(testEngine.asPlayerOne().playCard(mrsPottsEnchantedTeapot)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mrsPottsEnchantedTeapot, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getZonesCardCount("player_one").deck).toBe(
        initialDeckCount - 1,
      );
    });

    it("should be optional - player can decline the draw", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mrsPottsEnchantedTeapot],
        inkwell: mrsPottsEnchantedTeapot.cost,
        play: [lumiere],
        deck: 5,
      });

      const initialDeckCount = testEngine.asPlayerOne().getZonesCardCount("player_one").deck;

      expect(testEngine.asPlayerOne().playCard(mrsPottsEnchantedTeapot)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

      // Decline the optional ability
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mrsPottsEnchantedTeapot, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Deck should be unchanged
      expect(testEngine.asPlayerOne().getZonesCardCount("player_one").deck).toBe(initialDeckCount);
    });
  });
});
