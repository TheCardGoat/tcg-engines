import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { chipRangerLeader } from "../../006/characters/012-chip-ranger-leader";
import { daleExcitedFriend } from "./004-dale-excited-friend";

describe("Dale - Excited Friend", () => {
  it("can be played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [daleExcitedFriend],
      inkwell: daleExcitedFriend.cost,
    });

    expect(testEngine.asPlayerOne().playCard(daleExcitedFriend)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(daleExcitedFriend)).toBe("play");
  });

  describe("LOOK WHAT I FOUND - While you have a character named Chip in play, this character gets +1 {L}.", () => {
    it("should have base lore of 1 when no Chip is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [daleExcitedFriend],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardLore(daleExcitedFriend)).toBe(1);
    });

    it("should have derived lore of 2 when Chip is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [daleExcitedFriend, chipRangerLeader],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardLore(daleExcitedFriend)).toBe(2);
    });

    it("should gain 1 lore when questing without Chip in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [daleExcitedFriend],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(daleExcitedFriend)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore("player_one")).toBe(1);
    });

    it("should gain 2 lore when questing with Chip in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [daleExcitedFriend, chipRangerLeader],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(daleExcitedFriend)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore("player_one")).toBe(2);
    });
  });
});
