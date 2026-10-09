import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { doItAgain } from "../../001/actions/094-do-it-again";
import { maxGoofKaraokeStar } from "./089-max-goof-karaoke-star";

const songCard = createMockSong({
  id: "max-karaoke-song",
  name: "Karaoke Anthem",
  cost: 2,
  text: "Draw a card.",
});

const plainCard = createMockCharacter({
  id: "max-karaoke-plain",
  name: "Plain Backup",
  cost: 2,
});

const drawnA = createMockCharacter({
  id: "max-karaoke-drawn-a",
  name: "Drawn A",
  cost: 1,
});

const drawnB = createMockCharacter({
  id: "max-karaoke-drawn-b",
  name: "Drawn B",
  cost: 1,
});

describe("Max Goof - Karaoke Star", () => {
  it("SWEET REMIX lets you discard a song to draw 2 cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [maxGoofKaraokeStar, songCard],
      deck: [drawnA, drawnB],
      inkwell: maxGoofKaraokeStar.cost,
    });

    expect(testEngine.asPlayerOne().playCard(maxGoofKaraokeStar)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(maxGoofKaraokeStar, {
        resolveOptional: true,
        targets: [songCard],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(songCard)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(drawnA)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(drawnB)).toBe("hand");
  });

  it("SWEET REMIX can be declined", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [maxGoofKaraokeStar, songCard],
      deck: [drawnA, drawnB],
      inkwell: maxGoofKaraokeStar.cost,
    });

    expect(testEngine.asPlayerOne().playCard(maxGoofKaraokeStar)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(maxGoofKaraokeStar, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(songCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(drawnA)).toBe("deck");
  });

  it("SWEET REMIX cannot discard a non-song card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [maxGoofKaraokeStar, plainCard, songCard],
      deck: [drawnA, drawnB],
      inkwell: maxGoofKaraokeStar.cost,
    });

    expect(testEngine.asPlayerOne().playCard(maxGoofKaraokeStar)).toBeSuccessfulCommand();

    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(maxGoofKaraokeStar, { resolveOptional: true, targets: [plainCard] }),
    ).not.toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(maxGoofKaraokeStar, { resolveOptional: true, targets: [songCard] }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(songCard)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(plainCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(drawnA)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(drawnB)).toBe("hand");
  });

  it("BRAND-NEW PLAYLIST gives +3 {L} with 5 or more songs in your discard", () => {
    const songs = [1, 2, 3, 4, 5].map((n) =>
      createMockSong({
        id: `max-karaoke-discard-${n}`,
        name: `Discard Song ${n}`,
        cost: 1,
        text: "Test song.",
      }),
    );
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [maxGoofKaraokeStar],
      discard: songs,
      deck: 6,
    });

    expect(testEngine.getCard(maxGoofKaraokeStar).lore).toBe(maxGoofKaraokeStar.lore + 3);
  });

  it("BRAND-NEW PLAYLIST does nothing with fewer than 5 songs in your discard", () => {
    const songs = [1, 2, 3, 4].map((n) =>
      createMockSong({
        id: `max-karaoke-few-${n}`,
        name: `Few Song ${n}`,
        cost: 1,
        text: "Test song.",
      }),
    );
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [maxGoofKaraokeStar],
      discard: songs,
      deck: 6,
    });

    expect(testEngine.getCard(maxGoofKaraokeStar).lore).toBe(maxGoofKaraokeStar.lore);
    expect(testEngine.getCardInstanceIdsInZone("discard", PLAYER_ONE)).toHaveLength(4);
  });
});

it("rejects opposing, out-of-zone and multiple songs before discarding or drawing", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      hand: [maxGoofKaraokeStar, songCard, songCard],
      discard: [songCard],
      inkwell: 3,
      deck: [drawnA, drawnB],
    },
    { hand: [songCard], deck: 6 },
  );
  expect(game.asPlayerOne().playCard(maxGoofKaraokeStar)).toBeSuccessfulCommand();
  const own = game.getCardInstanceIdsInZone("hand", PLAYER_ONE);
  const discard = game.getCardInstanceIdsInZone("discard", PLAYER_ONE)[0]!;
  const enemy = game.getCardInstanceIdsInZone("hand", PLAYER_TWO)[0]!;
  for (const targets of [[enemy], [discard], own]) {
    expect(
      game
        .asPlayerOne()
        .resolvePendingByCard(maxGoofKaraokeStar, { resolveOptional: true, targets }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getZonesCardCount().hand).toBe(2);
    expect(game.asPlayerOne().getZonesCardCount().deck).toBe(2);
    expect(game.asPlayerOne().getZonesCardCount().discard).toBe(1);
  }
});
it("accepting with no song draws nothing and preserves other hand cards", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [maxGoofKaraokeStar, plainCard],
    inkwell: 3,
    deck: [drawnA, drawnB],
  });
  expect(game.asPlayerOne().playCard(maxGoofKaraokeStar)).toBeSuccessfulCommand();
  if (game.asPlayerOne().getBagCount() > 0)
    expect(
      game.asPlayerOne().resolvePendingByCard(maxGoofKaraokeStar, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getZonesCardCount().deck).toBe(2);
  expect(game.asPlayerOne().getCardZone(plainCard)).toBe("hand");
});
for (const count of [0, 1]) {
  it("discards before attempting two draws with a deck of " + count, () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [maxGoofKaraokeStar, songCard], inkwell: 3, deck: count ? [drawnA] : [] },
      { deck: 6 },
    );
    expect(game.asPlayerOne().playCard(maxGoofKaraokeStar)).toBeSuccessfulCommand();
    expect(
      game
        .asPlayerOne()
        .resolvePendingByCard(maxGoofKaraokeStar, { resolveOptional: true, targets: [songCard] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(songCard)).toBe("discard");
    expect(game.asPlayerOne().getZonesCardCount().hand).toBe(count);
    expect(game.asPlayerOne().getZonesCardCount().deck).toBe(0);
    expect(game.asServer().isGameOver()).toBe(false);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asServer().getWinner()).toBe(PLAYER_TWO);
  });
}
it("checks only your discard songs and grants exactly three with six songs", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      play: [maxGoofKaraokeStar],
      discard: [plainCard, plainCard, plainCard, plainCard, plainCard],
      hand: [songCard],
      deck: 6,
    },
    { discard: [songCard, songCard, songCard, songCard, songCard, songCard], deck: 6 },
  );
  expect(game.getCard(maxGoofKaraokeStar).lore).toBe(1);
  const six = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [maxGoofKaraokeStar],
    discard: [songCard, songCard, songCard, songCard, songCard, songCard],
    deck: 6,
  });
  expect(six.asPlayerOne().quest(maxGoofKaraokeStar)).toBeSuccessfulCommand();
  expect(six.getLore(PLAYER_ONE)).toBe(4);
  expect(six.asPlayerOne().getBagCount()).toBe(0);
});
it("discarding the fifth song updates all Max copies and returning it removes both bonuses", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [maxGoofKaraokeStar],
    hand: [maxGoofKaraokeStar, songCard, doItAgain],
    discard: [songCard, songCard, songCard, songCard],
    inkwell: 6,
    deck: [drawnA, drawnB],
  });
  const oldMax = game.findCardInstanceId(maxGoofKaraokeStar, "play", PLAYER_ONE);
  const newMax = game.findCardInstanceId(maxGoofKaraokeStar, "hand", PLAYER_ONE);
  const song = game.findCardInstanceId(songCard, "hand", PLAYER_ONE);
  expect(game.asPlayerOne().playCard(newMax)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolvePendingByCard(newMax, { resolveOptional: true, targets: [song] }),
  ).toBeSuccessfulCommand();
  expect(game.getCard(oldMax).lore).toBe(4);
  expect(game.getCard(newMax).lore).toBe(4);
  expect(game.asPlayerOne().playCard(doItAgain, { targets: [song] })).toBeSuccessfulCommand();
  expect(game.getCard(oldMax).lore).toBe(1);
  expect(game.getCard(newMax).lore).toBe(1);
});
it("each played copy can accept or decline and publishes discards but hides draws", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [maxGoofKaraokeStar, maxGoofKaraokeStar, songCard],
    inkwell: 6,
    deck: [drawnA, drawnB],
  });
  const copies = game.getCardInstanceIdsInZone("hand", PLAYER_ONE).slice(0, 2);
  const song = game.findCardInstanceId(songCard, "hand", PLAYER_ONE);
  const drawn = game.getCardInstanceIdsInZone("deck", PLAYER_ONE);
  expect(game.asPlayerOne().playCard(copies[0]!)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolvePendingByCard(copies[0]!, { resolveOptional: true, targets: [song] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().playCard(copies[1]!)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolvePendingByCard(copies[1]!, { resolveOptional: false }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getZonesCardCount().hand).toBe(2);
  const log = JSON.stringify(
    game
      .getServerEngine()
      .getRuntime()
      .getMoveLogHistory()
      .flatMap((entry) => entry.public),
  );
  expect(log).toContain(song);
  for (const id of drawn) expect(log).not.toContain(id);
});

it("player two discards their fifth song and draws without revealing cards", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [maxGoofKaraokeStar], hand: [songCard], deck: 6 },
    {
      hand: [maxGoofKaraokeStar, songCard],
      discard: [songCard, songCard, songCard, songCard],
      inkwell: 3,
      deck: [drawnA, drawnB, plainCard],
    },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const max = game.findCardInstanceId(maxGoofKaraokeStar, "hand", PLAYER_TWO);
  const otherMax = game.findCardInstanceId(maxGoofKaraokeStar, "play", PLAYER_ONE);
  const song = game.findCardInstanceId(songCard, "hand", PLAYER_TWO);
  const otherSong = game.findCardInstanceId(songCard, "hand", PLAYER_ONE);
  const drawn = game.getCardInstanceIdsInZone("deck", PLAYER_TWO);
  expect(game.asPlayerTwo().playCard(max)).toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().resolvePendingByCard(max, { resolveOptional: true, targets: [otherSong] }),
  ).not.toBeSuccessfulCommand();
  expect(game.getCard(max).lore).toBe(1);
  expect(game.asPlayerTwo().getBagCount()).toBe(1);
  expect(
    game.asPlayerTwo().resolvePendingByCard(max, { resolveOptional: true, targets: [song] }),
  ).toBeSuccessfulCommand();
  expect(game.getCard(max).lore).toBe(4);
  expect(game.getCard(otherMax).lore).toBe(1);
  expect(game.asPlayerOne().getCardZone(otherSong)).toBe("hand");
  expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(3);
  for (const id of drawn) expect(game.asPlayerTwo().getCardZone(id)).toBe("hand");
  const log = JSON.stringify(
    game
      .getServerEngine()
      .getRuntime()
      .getMoveLogHistory()
      .flatMap((entry) => entry.public),
  );
  expect(log).toContain(song);
  for (const id of drawn) expect(log).not.toContain(id);
});
