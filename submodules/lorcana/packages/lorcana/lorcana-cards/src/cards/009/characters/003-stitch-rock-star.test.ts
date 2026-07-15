import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { liloMakingAWish, stitchNewDog } from "../../001";
import { liloEscapeArtist } from "../../006";
import { stitchRockStar } from "./003-stitch-rock-star";

describe("Stitch - Rock Star (Set 9 reprint)", () => {
  describe("ADORING FANS — Whenever you play a character with cost 2 or less, you may exert them to draw a card.", () => {
    it("exerts played characters and draws cards for each", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 2,
          inkwell: stitchNewDog.cost + liloMakingAWish.cost,
          hand: [stitchNewDog, liloMakingAWish],
          play: [stitchRockStar],
        },
        { deck: 2 },
      );

      // Play first cheap character
      expect(testEngine.asPlayerOne().playCard(stitchNewDog)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().resolvePendingByCard(stitchRockStar)).toBeSuccessfulCommand();

      expect(testEngine.isExerted(stitchNewDog)).toBe(true);
      expect(testEngine.asPlayerOne().getCardsInZone("deck", PLAYER_ONE).count).toBe(1);

      // Play second cheap character
      expect(testEngine.asPlayerOne().playCard(liloMakingAWish)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().resolvePendingByCard(stitchRockStar)).toBeSuccessfulCommand();

      expect(testEngine.isExerted(liloMakingAWish)).toBe(true);
      expect(testEngine.asPlayerOne().getCardsInZone("deck", PLAYER_ONE).count).toBe(0);
    });

    it("does not exert or draw when the optional is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 2,
          inkwell: stitchNewDog.cost + liloMakingAWish.cost,
          hand: [stitchNewDog, liloMakingAWish],
          play: [stitchRockStar],
        },
        { deck: 2 },
      );

      // Play first cheap character, decline
      expect(testEngine.asPlayerOne().playCard(stitchNewDog)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(stitchRockStar, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(stitchNewDog)).toBe(false);
      expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
        expect.objectContaining({ deck: 2, hand: 1, play: 2 }),
      );

      // Play second cheap character, decline
      expect(testEngine.asPlayerOne().playCard(liloMakingAWish)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(stitchRockStar, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(liloMakingAWish)).toBe(false);
      expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
        expect.objectContaining({ deck: 2, hand: 0, play: 3 }),
      );
    });
  });

  it("regression: with two copies in play, only one draws when a cheap character is exerted (exert cost can only be paid once)", () => {
    const cheapCharacter = createMockCharacter({
      id: "stitch-rock-star-cheap-char",
      name: "Cheap Character",
      cost: 1,
      strength: 1,
      willpower: 1,
      lore: 1,
    });

    // Create a second copy of Stitch - Rock Star with a different instance
    const stitchRockStarCopy: typeof stitchRockStar = {
      ...stitchRockStar,
    };

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 5,
        inkwell: cheapCharacter.cost,
        hand: [cheapCharacter],
        play: [stitchRockStar, stitchRockStarCopy],
      },
      { deck: 2 },
    );
    const stitchIds = testEngine
      .getCardInstanceIdsInZone("play", PLAYER_ONE)
      .filter((cardId) => testEngine.getCardDefinitionId(cardId) === stitchRockStar.id);
    expect(stitchIds).toHaveLength(2);
    const [firstStitchId, secondStitchId] = stitchIds;

    const initialDeckCount = testEngine.asPlayerOne().getZonesCardCount().deck;

    // Play the cheap character - both Stitch triggers fire
    expect(testEngine.asPlayerOne().playCard(cheapCharacter)).toBeSuccessfulCommand();

    // There should be 2 bag effects (one from each Stitch)
    const bagEffects = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffects).toHaveLength(2);

    // Accept the first trigger by bag ID - exerts the cheap character and draws
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(firstStitchId!, { resolveOptional: true }),
    ).toBeSuccessfulCommand();

    // The cheap character should now be exerted
    expect(testEngine.isExerted(cheapCharacter)).toBe(true);

    // The second trigger should fizzle or fail because the character is already exerted
    // (exert cost cannot be paid again)
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(secondStitchId!, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    // Only 1 card should have been drawn total (not 2)
    const finalDeckCount = testEngine.asPlayerOne().getZonesCardCount().deck;
    expect(finalDeckCount).toBe(initialDeckCount - 1);
  });

  describe("Interaction with Lilo Escape Artist", () => {
    it("should NOT draw a card when Lilo enters play already exerted from discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          discard: [liloEscapeArtist],
          inkwell: liloEscapeArtist.cost,
          play: [stitchRockStar],
          deck: [stitchNewDog, stitchNewDog],
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      const initialDeckCount = testEngine.asPlayerOne().getZonesCardCount().deck;
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(liloEscapeArtist, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(liloEscapeArtist)).toBe("play");
      expect(testEngine.isExerted(liloEscapeArtist)).toBe(true);
      expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(initialDeckCount);
    });
  });
});
