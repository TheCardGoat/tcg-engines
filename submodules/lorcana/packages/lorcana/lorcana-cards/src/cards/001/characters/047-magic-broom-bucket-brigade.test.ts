import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { magicBroomBucketBrigade } from "./047-magic-broom-bucket-brigade";

const discardFodder = createMockCharacter({
  id: "broom-discard-fodder",
  name: "Discard Fodder",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const secondDiscardFodder = createMockCharacter({
  id: "broom-discard-fodder-2",
  name: "Discard Fodder 2",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Magic Broom - Bucket Brigade", () => {
  describe("SWEEP - When you play this character, you may shuffle a card from any discard into its player's deck.", () => {
    it("should shuffle a card from own discard into own deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [magicBroomBucketBrigade],
        inkwell: magicBroomBucketBrigade.cost,
        discard: [discardFodder, secondDiscardFodder],
        deck: 5,
      });

      const discardId = testEngine.findCardInstanceId(discardFodder, "discard", PLAYER_ONE);
      const initialDeckCount = testEngine.asPlayerOne().getZonesCardCount("player_one").deck;
      const initialDiscardCount = testEngine.asPlayerOne().getZonesCardCount("player_one").discard;

      expect(testEngine.asPlayerOne().playCard(magicBroomBucketBrigade)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(magicBroomBucketBrigade, {
          resolveOptional: true,
          targets: [discardId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("deck");
      expect(testEngine.asPlayerOne().getZonesCardCount("player_one").deck).toBe(
        initialDeckCount + 1,
      );
      expect(testEngine.asPlayerOne().getZonesCardCount("player_one").discard).toBe(
        initialDiscardCount - 1,
      );
    });

    it("should shuffle a card from opponent's discard into their deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [magicBroomBucketBrigade],
          inkwell: magicBroomBucketBrigade.cost,
          deck: 5,
        },
        {
          discard: [discardFodder, secondDiscardFodder],
          deck: 5,
        },
      );

      const opponentDiscardId = testEngine.findCardInstanceId(discardFodder, "discard", PLAYER_TWO);
      const initialOpponentDeckCount = testEngine
        .asPlayerTwo()
        .getZonesCardCount("player_two").deck;
      const initialOpponentDiscardCount = testEngine
        .asPlayerTwo()
        .getZonesCardCount("player_two").discard;

      expect(testEngine.asPlayerOne().playCard(magicBroomBucketBrigade)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(magicBroomBucketBrigade, {
          resolveOptional: true,
          targets: [opponentDiscardId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(discardFodder)).toBe("deck");
      expect(testEngine.asPlayerTwo().getZonesCardCount("player_two").deck).toBe(
        initialOpponentDeckCount + 1,
      );
      expect(testEngine.asPlayerTwo().getZonesCardCount("player_two").discard).toBe(
        initialOpponentDiscardCount - 1,
      );
    });

    it("should be optional - player can decline the ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [magicBroomBucketBrigade],
          inkwell: magicBroomBucketBrigade.cost,
          discard: [discardFodder],
          deck: 5,
        },
        {
          discard: [secondDiscardFodder],
          deck: 5,
        },
      );

      const initialPlayerOneDiscardCount = testEngine
        .asPlayerOne()
        .getZonesCardCount("player_one").discard;
      const initialPlayerTwoDiscardCount = testEngine
        .asPlayerTwo()
        .getZonesCardCount("player_two").discard;

      expect(testEngine.asPlayerOne().playCard(magicBroomBucketBrigade)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(magicBroomBucketBrigade, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCardZone(secondDiscardFodder)).toBe("discard");
      expect(testEngine.asPlayerOne().getZonesCardCount("player_one").discard).toBe(
        initialPlayerOneDiscardCount,
      );
      expect(testEngine.asPlayerTwo().getZonesCardCount("player_two").discard).toBe(
        initialPlayerTwoDiscardCount,
      );
    });
  });
});
