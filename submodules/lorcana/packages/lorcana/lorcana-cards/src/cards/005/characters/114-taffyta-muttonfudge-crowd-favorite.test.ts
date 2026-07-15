import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { taffytaMuttonfudgeCrowdFavorite } from "./114-taffyta-muttonfudge-crowd-favorite";

const mockLocation = createMockLocation({
  id: "taffyta-test-location",
  name: "Test Location",
  cost: 2,
});

describe("Taffyta Muttonfudge - Crowd Favorite", () => {
  describe("SHOWSTOPPER - When you play this character, if you have a location in play, each opponent loses 1 lore.", () => {
    it("reduces each opponent lore by 1 when played with a location in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: taffytaMuttonfudgeCrowdFavorite.cost,
          hand: [taffytaMuttonfudgeCrowdFavorite],
          play: [mockLocation],
        },
        {
          lore: 5,
        },
      );

      expect(testEngine.getLore(PLAYER_TWO)).toBe(5);

      expect(
        testEngine.asPlayerOne().playCard(taffytaMuttonfudgeCrowdFavorite),
      ).toBeSuccessfulCommand();

      // Resolve triggered ability (SHOWSTOPPER)
      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(taffytaMuttonfudgeCrowdFavorite),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.getLore(PLAYER_TWO)).toBe(4);
    });

    it("does not reduce opponent lore when played without a location in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: taffytaMuttonfudgeCrowdFavorite.cost,
          hand: [taffytaMuttonfudgeCrowdFavorite],
        },
        {
          lore: 5,
        },
      );

      expect(testEngine.getLore(PLAYER_TWO)).toBe(5);

      expect(
        testEngine.asPlayerOne().playCard(taffytaMuttonfudgeCrowdFavorite),
      ).toBeSuccessfulCommand();

      // No bag effects should be present (condition was not met)
      if (testEngine.asPlayerOne().getBagCount() > 0) {
        const effects = testEngine.asPlayerOne().getBagEffects();
        if (effects.length > 0) {
          testEngine.asPlayerOne().resolvePendingByCard(taffytaMuttonfudgeCrowdFavorite);
        }
      }

      expect(testEngine.getLore(PLAYER_TWO)).toBe(5);
    });
  });
});
