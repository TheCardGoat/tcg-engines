import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { moanaChosenByTheOcean } from "./117-moana-chosen-by-the-ocean";
import { teKTheBurningOne } from "./126-te-k-the-burning-one";
import { teKHeartless } from "./192-te-k-heartless";

const nonTeKaCharacter = createMockCharacter({
  id: "moana-test-non-teka",
  name: "Maui",
  version: "Hero to All",
  cost: 4,
  strength: 3,
  willpower: 5,
  lore: 1,
});

describe("Moana - Chosen by the Ocean", () => {
  describe("THIS IS NOT WHO YOU ARE - When you play this character, you may banish chosen character named Te Kā.", () => {
    it("banishes Te Kā - The Burning One", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [moanaChosenByTheOcean],
          inkwell: moanaChosenByTheOcean.cost,
        },
        {
          play: [teKTheBurningOne],
        },
      );

      expect(testEngine.asPlayerOne().playCard(moanaChosenByTheOcean)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(moanaChosenByTheOcean),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [teKTheBurningOne] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(teKTheBurningOne)).toBe("discard");
    });

    it("banishes Te Kā - Heartless", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [moanaChosenByTheOcean],
          inkwell: moanaChosenByTheOcean.cost,
        },
        {
          play: [teKHeartless],
        },
      );

      expect(testEngine.asPlayerOne().playCard(moanaChosenByTheOcean)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(moanaChosenByTheOcean),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [teKHeartless] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(teKHeartless)).toBe("discard");
    });

    it("does not allow targeting a non-Te Kā character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [moanaChosenByTheOcean],
          inkwell: moanaChosenByTheOcean.cost,
        },
        {
          play: [nonTeKaCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(moanaChosenByTheOcean)).toBeSuccessfulCommand();

      // With no valid Te Kā targets, the bag should auto-resolve
      // and the non-Te Kā character should remain in play
      expect(testEngine.asPlayerTwo().getCardZone(nonTeKaCharacter)).toBe("play");
    });

    it("cannot target non-Te Kā character even when Te Kā is also in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [moanaChosenByTheOcean],
          inkwell: moanaChosenByTheOcean.cost,
        },
        {
          play: [nonTeKaCharacter, teKTheBurningOne],
        },
      );

      expect(testEngine.asPlayerOne().playCard(moanaChosenByTheOcean)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(moanaChosenByTheOcean),
      ).toBeSuccessfulCommand();

      // Targeting the non-Te Kā character should fail
      const result = testEngine.asPlayerOne().resolveNextPending({ targets: [nonTeKaCharacter] });
      expect(result).not.toBeSuccessfulCommand();
    });

    it("ability is optional - can decline to banish", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [moanaChosenByTheOcean],
          inkwell: moanaChosenByTheOcean.cost,
        },
        {
          play: [teKTheBurningOne],
        },
      );

      expect(testEngine.asPlayerOne().playCard(moanaChosenByTheOcean)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(moanaChosenByTheOcean, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(teKTheBurningOne)).toBe("play");
    });
  });
});
