import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { mirabelMadrigalMusicallyTalented } from "./035-mirabel-madrigal-musically-talented";

const songInDiscard = createMockSong({
  id: "mirabel-mt-song-discard",
  name: "Test Song In Discard",
  cost: 2,
  text: "A test song card",
});

const expensiveSong = createMockSong({
  id: "mirabel-mt-expensive-song",
  name: "Expensive Song",
  cost: 5,
  text: "An expensive test song card",
});

const nonSongCharacter = createMockCharacter({
  id: "mirabel-mt-non-song",
  name: "Non Song Card",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Mirabel Madrigal - Musically Talented", () => {
  describe("Shift 4", () => {
    it("has Shift keyword", () => {
      const testEngine = new LorcanaTestEngine({
        play: [mirabelMadrigalMusicallyTalented],
      });

      const cardUnderTest = testEngine.getCardModel(mirabelMadrigalMusicallyTalented);
      expect(cardUnderTest.hasShift()).toBe(true);
    });
  });

  describe("HER OWN SPECIAL GIFT - Whenever this character quests, you may return a song card with cost 3 or less from your discard to your hand.", () => {
    it("returns a song card with cost 3 or less from discard to hand when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mirabelMadrigalMusicallyTalented, exerted: false }],
          discard: [songInDiscard],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().quest(mirabelMadrigalMusicallyTalented),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(mirabelMadrigalMusicallyTalented),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          resolveOptional: true,
          targets: [songInDiscard],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(songInDiscard)).toBe("hand");
    });

    it("does not allow returning songs with cost greater than 3", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mirabelMadrigalMusicallyTalented, exerted: false }],
          discard: [expensiveSong],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().quest(mirabelMadrigalMusicallyTalented),
      ).toBeSuccessfulCommand();
      // No bag effect should appear since there are no valid targets
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("does not allow returning non-song cards", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mirabelMadrigalMusicallyTalented, exerted: false }],
          discard: [nonSongCharacter],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().quest(mirabelMadrigalMusicallyTalented),
      ).toBeSuccessfulCommand();
      // No bag effect should appear since there are no valid song targets
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("ability is optional - declining does not return anything", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mirabelMadrigalMusicallyTalented, exerted: false }],
          discard: [songInDiscard],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().quest(mirabelMadrigalMusicallyTalented),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mirabelMadrigalMusicallyTalented, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(songInDiscard)).toBe("discard");
    });
  });
});
