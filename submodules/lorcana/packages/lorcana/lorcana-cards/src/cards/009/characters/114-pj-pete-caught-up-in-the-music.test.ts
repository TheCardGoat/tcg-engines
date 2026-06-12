import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { pjPeteCaughtUpInTheMusic } from "./114-pj-pete-caught-up-in-the-music";

const testSong = createMockSong({
  id: "pj-pete-test-song",
  name: "P.J. Pete Test Song",
  cost: 2,
  text: "A test song.",
});

const nonSongAction = createMockAction({
  id: "pj-pete-non-song-action",
  name: "P.J. Pete Non-Song Action",
  cost: 1,
  text: "Do nothing.",
});

describe("P.J. Pete - Caught Up in the Music", () => {
  describe("SHOUT OUT LOUD! - Whenever you play a song, this character gets +2 {S} this turn.", () => {
    it("gets +2 strength this turn when a song is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: pjPeteCaughtUpInTheMusic, isDrying: false }],
        hand: [testSong],
        inkwell: testSong.cost,
        deck: 2,
      });

      const initialStrength = testEngine.asPlayerOne().getCardStrength(pjPeteCaughtUpInTheMusic);
      expect(initialStrength).toBe(pjPeteCaughtUpInTheMusic.strength);

      expect(testEngine.asPlayerOne().playCard(testSong)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(pjPeteCaughtUpInTheMusic)).toBe(
        pjPeteCaughtUpInTheMusic.strength + 2,
      );
    });

    it("does NOT trigger when playing a non-song action", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: pjPeteCaughtUpInTheMusic, isDrying: false }],
        hand: [nonSongAction],
        inkwell: nonSongAction.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(nonSongAction)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(pjPeteCaughtUpInTheMusic)).toBe(
        pjPeteCaughtUpInTheMusic.strength,
      );
    });
  });
});
