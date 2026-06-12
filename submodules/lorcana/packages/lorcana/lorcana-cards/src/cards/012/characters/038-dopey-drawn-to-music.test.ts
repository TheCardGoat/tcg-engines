import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { dopeyDrawnToMusic } from "./038-dopey-drawn-to-music";

const firstSong = createMockSong({
  id: "dopey-first-song",
  name: "Dopey First Song",
  cost: 2,
  text: "A test song.",
});

const secondSong = createMockSong({
  id: "dopey-second-song",
  name: "Dopey Second Song",
  cost: 2,
  text: "Another test song.",
});

const nonSongAction = createMockAction({
  id: "dopey-non-song-action",
  name: "Dopey Non-Song Action",
  cost: 1,
  text: "Do nothing.",
});

describe("Dopey - Drawn to Music", () => {
  describe("Tongue-Tied - This character can't {E} to sing songs.", () => {
    it("cannot be used as a singer for a song", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [firstSong],
        play: [{ card: dopeyDrawnToMusic, isDrying: false }],
      });

      // Dopey has cost 6, song costs 2 — he would normally qualify as a singer
      const result = testEngine.asPlayerOne().singSong(firstSong, dopeyDrawnToMusic);

      expect(result.success).toBe(false);
    });

    it("does not appear as an available singer for songs", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [firstSong],
        play: [{ card: dopeyDrawnToMusic, isDrying: false }],
      });

      const moves = testEngine.asPlayerOne().getAvailableMoves();
      const singMove = moves.find((m) => m.moveId === "singCard");

      expect(singMove).toBeUndefined();
    });
  });

  describe("Distant Melody - Once during your turn, whenever you play a song, this character gets +1 {L} this turn.", () => {
    it("has base lore of 2 when no songs have been played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [dopeyDrawnToMusic],
      });

      expect(testEngine.asPlayerOne().getCardLore(dopeyDrawnToMusic)).toBe(2);
    });

    it("gains +1 lore this turn when you play a song", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: dopeyDrawnToMusic, isDrying: false }],
        hand: [firstSong],
        inkwell: firstSong.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().getCardLore(dopeyDrawnToMusic)).toBe(dopeyDrawnToMusic.lore);

      expect(testEngine.asPlayerOne().playCard(firstSong)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(dopeyDrawnToMusic)).toBe(
        dopeyDrawnToMusic.lore + 1,
      );
    });

    it("only triggers once per turn even when multiple songs are played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: dopeyDrawnToMusic, isDrying: false }],
        hand: [firstSong, secondSong],
        inkwell: firstSong.cost + secondSong.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(firstSong)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardLore(dopeyDrawnToMusic)).toBe(
        dopeyDrawnToMusic.lore + 1,
      );

      expect(testEngine.asPlayerOne().playCard(secondSong)).toBeSuccessfulCommand();
      // Still only +1, not +2
      expect(testEngine.asPlayerOne().getCardLore(dopeyDrawnToMusic)).toBe(
        dopeyDrawnToMusic.lore + 1,
      );
    });

    it("does NOT trigger when playing a non-song action", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: dopeyDrawnToMusic, isDrying: false }],
        hand: [nonSongAction],
        inkwell: nonSongAction.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(nonSongAction)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(dopeyDrawnToMusic)).toBe(dopeyDrawnToMusic.lore);
    });

    it("lore bonus lasts only until end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: dopeyDrawnToMusic, isDrying: false }],
        hand: [firstSong],
        inkwell: firstSong.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(firstSong)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardLore(dopeyDrawnToMusic)).toBe(
        dopeyDrawnToMusic.lore + 1,
      );

      testEngine.asServer().passTurn();
      testEngine.asServer().passTurn();

      expect(testEngine.asPlayerOne().getCardLore(dopeyDrawnToMusic)).toBe(dopeyDrawnToMusic.lore);
    });
  });
});
