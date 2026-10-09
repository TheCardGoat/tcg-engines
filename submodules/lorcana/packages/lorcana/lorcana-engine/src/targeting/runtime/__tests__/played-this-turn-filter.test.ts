import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockSong,
} from "../../../testing";

const song = createMockSong({ id: "current-song", name: "Current Song", cost: 3, text: "A song." });
const oldSong = createMockSong({ id: "old-song", name: "Old Song", cost: 2, text: "A song." });
const expensiveSong = createMockSong({
  id: "expensive-song",
  name: "Expensive Song",
  cost: 4,
  text: "A song.",
});
const returner = createMockCharacter({
  id: "current-turn-returner",
  name: "Returner",
  cost: 1,
  abilities: [
    {
      type: "triggered",
      trigger: { event: "play", on: "SELF", timing: "when" },
      effect: {
        type: "return-to-hand",
        target: {
          selector: "chosen",
          count: 1,
          owner: "you",
          zones: ["discard"],
          cardTypes: ["action"],
          filters: [
            { type: "is-song" },
            { type: "cost-comparison", comparison: "less-or-equal", value: 3 },
            { type: "played-this-turn" },
          ],
        },
      },
    },
  ],
});

describe("played-this-turn selection filter", () => {
  it("allows a played song, while rejecting an older song and an over-cost song", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [song, expensiveSong, returner],
        discard: [oldSong],
        inkwell: 8,
        deck: 3,
      },
      { deck: 3 },
    );
    expect(game.asPlayerOne().playCard(song)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().playCard(expensiveSong)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().playCard(returner)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(returner, { targets: [oldSong] }),
    ).not.toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(returner, { targets: [expensiveSong] }),
    ).not.toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(returner, { targets: [song] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(song)).toBe("hand");
    expect(game.asPlayerOne().getCardZone(oldSong)).toBe("discard");
    expect(game.asPlayerOne().getCardZone(expensiveSong)).toBe("discard");
  });

  it("excludes a song played on the preceding turn", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [song, returner],
        inkwell: 4,
        deck: 3,
      },
      { deck: 3 },
    );
    expect(game.asPlayerOne().playCard(song)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().playCard(returner)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getBagCount()).toBe(0);
    expect(game.asPlayerOne().getCardZone(song)).toBe("discard");
  });

  it("does not offer an in-play character for a discard-only return effect", () => {
    const singer = createMockCharacter({
      id: "discard-singer",
      name: "Singer",
      cost: 1,
      abilities: [{ type: "keyword", keyword: "Singer", value: 2 }],
    });
    const inPlaySinger = createMockCharacter({
      id: "in-play-singer",
      name: "In-play Singer",
      cost: 1,
      abilities: [{ type: "keyword", keyword: "Singer", value: 2 }],
    });
    const singerReturner = createMockCharacter({
      id: "singer-returner",
      name: "Singer Returner",
      cost: 1,
      abilities: [
        {
          type: "triggered",
          trigger: { event: "play", on: "SELF", timing: "when" },
          effect: {
            type: "return-to-hand",
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["discard"],
              cardTypes: ["character"],
              filters: [{ type: "has-keyword", keyword: "Singer" }],
            },
          },
        },
      ],
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [singerReturner],
      play: [inPlaySinger],
      discard: [singer],
      inkwell: 1,
      deck: 3,
    });
    expect(game.asPlayerOne().playCard(singerReturner)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(singerReturner, { targets: [inPlaySinger] }),
    ).not.toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(singerReturner, { targets: [singer] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(inPlaySinger)).toBe("play");
    expect(game.asPlayerOne().getCardZone(singer)).toBe("hand");
  });
});
