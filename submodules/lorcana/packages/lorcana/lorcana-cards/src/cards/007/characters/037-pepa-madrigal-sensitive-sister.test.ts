import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { pepaMadrigalSensitiveSister } from "./037-pepa-madrigal-sensitive-sister";

const singer = createMockCharacter({
  id: "pepa-singer",
  name: "Singer",
  cost: 3,
});

const singer2 = createMockCharacter({
  id: "pepa-singer-2",
  name: "Singer Two",
  cost: 3,
});

const songToSing = createMockSong({
  id: "pepa-test-song",
  name: "Test Song",
  cost: 1,
  text: "A test song.",
  abilities: [],
});

const singTogetherSong = createMockSong({
  id: "pepa-sing-together-song",
  name: "Sing Together Song",
  cost: 5,
  text: "A sing together song.",
  abilities: [
    {
      id: "pepa-st-keyword",
      type: "keyword",
      keyword: "SingTogether",
      value: 5,
    },
  ],
});

describe("Pepa Madrigal - Sensitive Sister", () => {
  describe("CLEAR SKIES, CLEAR SKIES - Whenever one or more of your characters sings a song, gain 1 lore.", () => {
    it("Singing a song gains 1 lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [songToSing],
        inkwell: songToSing.cost,
        play: [
          { card: pepaMadrigalSensitiveSister, isDrying: false },
          { card: singer, isDrying: false },
        ],
      });

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);

      expect(testEngine.asPlayerOne().singSong(songToSing, singer)).toBeSuccessfulCommand();

      // The triggered ability should fire and gain 1 lore
      // Check if there's a bag to resolve (for optional effects) or auto-resolved
      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(pepaMadrigalSensitiveSister),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
    });

    it("Casting a song (playing normally) does NOT gain lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [songToSing],
        inkwell: songToSing.cost,
        play: [{ card: pepaMadrigalSensitiveSister, isDrying: false }],
      });

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);

      // Play the song normally (cast, not sing)
      expect(testEngine.asPlayerOne().playCard(songToSing)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
    });

    it("regression: triggers only once per song when using Sing Together with multiple singers", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [singTogetherSong],
        play: [
          { card: pepaMadrigalSensitiveSister, isDrying: false },
          { card: singer, isDrying: false },
          { card: singer2, isDrying: false },
        ],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);

      // Use Sing Together with two singers
      expect(
        testEngine.asPlayerOne().playSongTogether(singTogetherSong, [singer, singer2]),
      ).toBeSuccessfulCommand();

      // Resolve any bag effects from the trigger
      const bagCount = testEngine.asPlayerOne().getBagCount();
      for (let i = 0; i < bagCount; i++) {
        const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
        if (bagEffect) {
          testEngine.asPlayerOne().resolvePendingByCard(pepaMadrigalSensitiveSister);
        }
      }

      // Should gain exactly 1 lore (once per song), not 2 (once per singer)
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
    });
  });
});
