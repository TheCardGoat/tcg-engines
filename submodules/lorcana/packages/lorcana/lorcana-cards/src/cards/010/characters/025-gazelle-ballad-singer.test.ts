import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockSong,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { gazelleBalladSinger } from "./025-gazelle-ballad-singer";

const songInDiscard = createMockSong({
  id: "gazelle-bs-song",
  name: "Test Song",
  cost: 3,
  text: "A test song",
});

const nonSongInDiscard = createMockCharacter({
  id: "gazelle-bs-non-song",
  name: "Non Song Character",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Gazelle - Ballad Singer", () => {
  describe("Singer 7", () => {
    it("has Singer 7 keyword", () => {
      const singerAbility = (gazelleBalladSinger.abilities ?? []).find(
        (a) => a.type === "keyword" && a.keyword === "Singer",
      );
      expect(singerAbility).toBeDefined();
      const singerValue =
        singerAbility?.type === "keyword" && "value" in singerAbility
          ? singerAbility.value
          : undefined;
      expect(singerValue).toBe(7);
    });
  });

  describe("CROWD FAVORITE", () => {
    it("puts a song from discard on top of deck when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [gazelleBalladSinger],
        inkwell: gazelleBalladSinger.cost,
        discard: [{ card: songInDiscard }],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().playCard(gazelleBalladSinger)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(gazelleBalladSinger, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [songInDiscard] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(songInDiscard)).toBe("deck");
    });

    it("can decline the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [gazelleBalladSinger],
        inkwell: gazelleBalladSinger.cost,
        discard: [{ card: songInDiscard }],
        deck: 3,
      });

      testEngine.asPlayerOne().playCard(gazelleBalladSinger);

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(gazelleBalladSinger, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Song stays in discard
      expect(testEngine.asPlayerOne().getCardZone(songInDiscard)).toBe("discard");
    });
  });
});
