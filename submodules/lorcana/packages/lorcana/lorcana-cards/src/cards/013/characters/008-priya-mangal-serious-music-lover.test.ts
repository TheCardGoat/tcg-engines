import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { priyaMangalSeriousMusicLover } from "./008-priya-mangal-serious-music-lover";

const discardedSong = createMockSong({
  id: "priya-serious-music-lover-song",
  name: "Discarded Song",
  cost: 2,
  text: "A test song.",
});

const discardedAction = createMockAction({
  id: "priya-serious-music-lover-action",
  name: "Discarded Action",
  cost: 2,
});

describe("Priya Mangal - Serious Music Lover", () => {
  it("gains 1 lore when played with a song card in your discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [priyaMangalSeriousMusicLover],
      inkwell: priyaMangalSeriousMusicLover.cost,
      discard: [discardedSong],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(priyaMangalSeriousMusicLover)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(1);
  });

  it("does not gain lore when your discard has no song", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [priyaMangalSeriousMusicLover],
      inkwell: priyaMangalSeriousMusicLover.cost,
      discard: [discardedAction],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(priyaMangalSeriousMusicLover)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(0);
  });
});
