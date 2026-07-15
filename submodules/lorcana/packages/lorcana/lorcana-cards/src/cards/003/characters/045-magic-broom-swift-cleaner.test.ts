import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { magicBroomSwiftCleaner } from "./045-magic-broom-swift-cleaner";
import { magicBroomBucketBrigade } from "../../001/characters/047-magic-broom-bucket-brigade";

const nonBroomCard = createMockCharacter({
  id: "non-broom-card",
  name: "Non Broom Card",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Magic Broom - Swift Cleaner", () => {
  describe("Rush", () => {
    it("should have Rush keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [magicBroomSwiftCleaner],
      });

      expect(testEngine.asPlayerOne().hasKeyword(magicBroomSwiftCleaner, "Rush")).toBe(true);
    });
  });

  describe("CLEAN THIS, CLEAN THAT - When you play this character, you may shuffle all Broom cards from your discard into your deck.", () => {
    it("should shuffle all Broom cards from own discard into own deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [magicBroomSwiftCleaner],
        inkwell: magicBroomSwiftCleaner.cost,
        discard: [magicBroomBucketBrigade, magicBroomBucketBrigade, nonBroomCard],
        deck: 5,
      });

      const initialDeckCount = testEngine.asPlayerOne().getZonesCardCount("player_one").deck;
      const initialDiscardCount = testEngine.asPlayerOne().getZonesCardCount("player_one").discard;

      expect(testEngine.asPlayerOne().playCard(magicBroomSwiftCleaner)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(magicBroomSwiftCleaner, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(magicBroomBucketBrigade)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(nonBroomCard)).toBe("discard");
      expect(testEngine.asPlayerOne().getZonesCardCount("player_one").deck).toBe(
        initialDeckCount + 2,
      );
      expect(testEngine.asPlayerOne().getZonesCardCount("player_one").discard).toBe(
        initialDiscardCount - 2,
      );
    });

    it("should not affect opponent's discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [magicBroomSwiftCleaner],
          inkwell: magicBroomSwiftCleaner.cost,
          deck: 5,
        },
        {
          discard: [magicBroomBucketBrigade, nonBroomCard],
          deck: 5,
        },
      );

      const initialOpponentDeckCount = testEngine
        .asPlayerTwo()
        .getZonesCardCount("player_two").deck;
      const initialOpponentDiscardCount = testEngine
        .asPlayerTwo()
        .getZonesCardCount("player_two").discard;

      expect(testEngine.asPlayerOne().playCard(magicBroomSwiftCleaner)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(magicBroomSwiftCleaner, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(magicBroomBucketBrigade)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCardZone(nonBroomCard)).toBe("discard");
      expect(testEngine.asPlayerTwo().getZonesCardCount("player_two").deck).toBe(
        initialOpponentDeckCount,
      );
      expect(testEngine.asPlayerTwo().getZonesCardCount("player_two").discard).toBe(
        initialOpponentDiscardCount,
      );
    });

    it("should be optional - player can decline the ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [magicBroomSwiftCleaner],
        inkwell: magicBroomSwiftCleaner.cost,
        discard: [magicBroomBucketBrigade, nonBroomCard],
        deck: 5,
      });

      const initialDeckCount = testEngine.asPlayerOne().getZonesCardCount("player_one").deck;
      const initialDiscardCount = testEngine.asPlayerOne().getZonesCardCount("player_one").discard;

      expect(testEngine.asPlayerOne().playCard(magicBroomSwiftCleaner)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(magicBroomSwiftCleaner, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(magicBroomBucketBrigade)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(nonBroomCard)).toBe("discard");
      expect(testEngine.asPlayerOne().getZonesCardCount("player_one").deck).toBe(initialDeckCount);
      expect(testEngine.asPlayerOne().getZonesCardCount("player_one").discard).toBe(
        initialDiscardCount,
      );
    });

    it("should do nothing when no Broom cards are in discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [magicBroomSwiftCleaner],
        inkwell: magicBroomSwiftCleaner.cost,
        discard: [nonBroomCard, nonBroomCard],
        deck: 5,
      });

      const initialDeckCount = testEngine.asPlayerOne().getZonesCardCount("player_one").deck;
      const initialDiscardCount = testEngine.asPlayerOne().getZonesCardCount("player_one").discard;

      expect(testEngine.asPlayerOne().playCard(magicBroomSwiftCleaner)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(magicBroomSwiftCleaner, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getZonesCardCount("player_one").deck).toBe(initialDeckCount);
      expect(testEngine.asPlayerOne().getZonesCardCount("player_one").discard).toBe(
        initialDiscardCount,
      );
    });
  });
});
