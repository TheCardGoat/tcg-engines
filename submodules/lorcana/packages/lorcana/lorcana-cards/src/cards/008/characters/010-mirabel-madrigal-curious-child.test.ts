import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { mirabelMadrigalCuriousChild } from "./010-mirabel-madrigal-curious-child";

const testSong = createMockSong({
  id: "mirabel-test-song",
  name: "Mirabel Test Song",
  cost: 2,
  text: "A song for testing reveal.",
});

describe("Mirabel Madrigal - Curious Child", () => {
  describe("YOU ARE A WONDER - When you play this character, you may reveal a song card in your hand to gain 1 lore.", () => {
    it("gains 1 lore when you reveal a song card from your hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [testSong, mirabelMadrigalCuriousChild],
        inkwell: mirabelMadrigalCuriousChild.cost,
        deck: 1,
      });

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().playCard(mirabelMadrigalCuriousChild),
      ).toBeSuccessfulCommand();

      const bagCount = testEngine.asPlayerOne().getBagCount();
      expect(bagCount).toBeGreaterThan(0);

      // Accept the optional ability and reveal the song
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(mirabelMadrigalCuriousChild, {
          resolveOptional: true,
          targets: [testSong],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 1);
      // The song should still be in hand (reveal, not discard)
      expect(testEngine.asPlayerOne().getCardZone(testSong)).toBe("hand");
    });

    it("does not gain lore when the optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [testSong, mirabelMadrigalCuriousChild],
        inkwell: mirabelMadrigalCuriousChild.cost,
        deck: 1,
      });

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().playCard(mirabelMadrigalCuriousChild),
      ).toBeSuccessfulCommand();

      // Decline the optional ability
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mirabelMadrigalCuriousChild, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore);
    });

    it("does not gain lore when no song card is in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mirabelMadrigalCuriousChild],
        inkwell: mirabelMadrigalCuriousChild.cost,
        deck: 1,
      });

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().playCard(mirabelMadrigalCuriousChild),
      ).toBeSuccessfulCommand();

      // Even if we try to accept, there's no song to reveal so the ability should auto-resolve with no effect
      // The bag might not even appear, or it might auto-resolve
      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        expect(
          testEngine
            .asPlayerOne()
            .resolvePendingByCard(mirabelMadrigalCuriousChild, { resolveOptional: true }),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore);
    });
  });
});
