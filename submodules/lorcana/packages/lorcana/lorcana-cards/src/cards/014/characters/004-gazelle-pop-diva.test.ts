// CR 2.2.0: 3.2.2.1, 5.1.1.2, 5.4.4.2 and 8.11.1. Singer does not bypass drying or exertion costs.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { gazellePopDiva } from "./004-gazelle-pop-diva";

const affordableSong = createMockSong({
  id: "gazelle-affordable-song",
  name: "Affordable Song",
  cost: 4,
  text: "A song costing 4.",
  abilities: [{ type: "action", effect: { type: "gain-lore", amount: 1, target: "CONTROLLER" } }],
});

const tooExpensiveSong = createMockSong({
  id: "gazelle-expensive-song",
  name: "Expensive Song",
  cost: 5,
  text: "A song costing 5.",
  abilities: [{ type: "action", effect: { type: "gain-lore", amount: 1, target: "CONTROLLER" } }],
});

describe("Gazelle - Pop Diva", () => {
  for (const cost of [1, 2, 3, 4]) {
    it(`sings a cost-${cost} song without spending ink`, () => {
      const chosenSong = { ...affordableSong, id: `gazelle-song-${cost}`, cost };
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [chosenSong],
        inkwell: 5,
        deck: 6,
        play: [{ card: gazellePopDiva, isDrying: false }],
      });

      expect(testEngine.asPlayerOne().singSong(chosenSong, gazellePopDiva)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(chosenSong)).toBe("discard");
      expect(testEngine.asPlayerOne().isExerted(gazellePopDiva)).toBe(true);
      expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
      expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(5);
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    });
  }

  it("cannot sing a song with cost 5", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [tooExpensiveSong],
      inkwell: 5,
      deck: 6,
      play: [{ card: gazellePopDiva, isDrying: false }],
    });

    expect(testEngine.asPlayerOne().singSong(tooExpensiveSong, gazellePopDiva).success).toBe(false);
    expect(testEngine.asPlayerOne().getCardZone(tooExpensiveSong)).toBe("hand");
    expect(testEngine.asPlayerOne().isExerted(gazellePopDiva)).toBe(false);
    expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(5);
    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
  });

  for (const state of [{ isDrying: true }, { isDrying: false, exerted: true }]) {
    it(`cannot sing while ${state.isDrying ? "drying" : "exerted"}`, () => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [affordableSong],
        play: [{ card: gazellePopDiva, ...state }],
        deck: 6,
      });
      expect(game.asPlayerOne().singSong(affordableSong, gazellePopDiva).success).toBe(false);
      expect(game.asPlayerOne().getCardZone(affordableSong)).toBe("hand");
      expect(game.getLore(PLAYER_ONE)).toBe(0);
    });
  }
  it("sings for Player Two after a natural turn change", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 6 },
      { hand: [affordableSong], play: [gazellePopDiva], inkwell: 2, deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().singSong(affordableSong, gazellePopDiva)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().isExerted(gazellePopDiva)).toBe(true);
    expect(game.asPlayerTwo().getCardZone(affordableSong)).toBe("discard");
    expect(game.getLore(PLAYER_TWO)).toBe(1);
    expect(game.getLore(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(2);
  });
});

it("a newly played Player Two Gazelle cannot sing until its next own turn", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { deck: 6 },
    { hand: [gazellePopDiva, affordableSong], inkwell: 2, deck: 6 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(gazellePopDiva)).toBeSuccessfulCommand();
  const songId = game.findCardInstanceId(affordableSong, "hand", PLAYER_TWO);
  expect(game.asPlayerTwo().singSong(songId, gazellePopDiva)).not.toBeSuccessfulCommand();
  expect(game.asServer().getCard(songId).zone).toBe("hand");
  expect(game.asPlayerTwo().isExerted(gazellePopDiva)).toBe(false);
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(game.getLore(PLAYER_TWO)).toBe(0);
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().singSong(songId, gazellePopDiva)).toBeSuccessfulCommand();
  expect(game.asServer().getCard(songId).zone).toBe("discard");
  expect(game.asPlayerTwo().isExerted(gazellePopDiva)).toBe(true);
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(2);
  expect(game.getLore(PLAYER_TWO)).toBe(1);
  expect(game.getLore(PLAYER_ONE)).toBe(0);
});

it("Player Two uses each exact copy once and cannot use an opposing or exerted Singer", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [gazellePopDiva], deck: 6 },
    {
      hand: [affordableSong, affordableSong],
      play: [gazellePopDiva, gazellePopDiva],
      inkwell: 5,
      deck: 6,
    },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const songs = game
    .getCardInstanceIdsInZone("hand", PLAYER_TWO)
    .filter((id) => game.asServer().getCardDefinitionByInstanceId(id).id === affordableSong.id);
  const singers = game.getCardInstanceIdsInZone("play", PLAYER_TWO);
  const opposingSinger = game.getCardInstanceIdsInZone("play", PLAYER_ONE)[0];
  expect(game.asPlayerTwo().singSong(songs[0], singers[0])).toBeSuccessfulCommand();
  expect(game.asServer().getCard(songs[0]).zone).toBe("discard");
  expect(game.asPlayerTwo().singSong(songs[1], singers[0])).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().singSong(songs[1], opposingSinger)).not.toBeSuccessfulCommand();
  expect(game.asServer().getCard(songs[1]).zone).toBe("hand");
  expect(game.asPlayerTwo().isExerted(singers[1])).toBe(false);
  expect(game.asPlayerOne().isExerted(opposingSinger)).toBe(false);
  expect(game.getLore(PLAYER_TWO)).toBe(1);
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(5);
  expect(game.asPlayerTwo().singSong(songs[1], singers[1])).toBeSuccessfulCommand();
  expect(game.asServer().getCard(songs[1]).zone).toBe("discard");
  expect(game.asPlayerTwo().isExerted(singers[0])).toBe(true);
  expect(game.asPlayerTwo().isExerted(singers[1])).toBe(true);
  expect(game.getLore(PLAYER_TWO)).toBe(2);
  expect(game.getLore(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(5);
  expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
});
