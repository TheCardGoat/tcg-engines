// CR 2.2.0: 8.12.2-8.12.3 Sing Together and each participating singer trigger.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockSong,
  createMockAction,
} from "@tcg/lorcana-engine/testing";
import { singer } from "../../../helpers/abilities/singer";
import { miguelRiveraPromisingMusician } from "./010-miguel-rivera-promising-musician";

const backupSinger = createMockCharacter({
  id: "miguel-pm-backup-singer",
  name: "Backup Singer",
  cost: 2,
  abilities: [singer(3)],
});

const singTogetherSong = createMockSong({
  id: "miguel-pm-sing-together-song",
  name: "Sing Together Song",
  cost: 5,
  text: "A Sing Together song.",
  abilities: [{ type: "keyword", keyword: "SingTogether", value: 5 }],
});

const ordinarySong = createMockSong({
  id: "miguel-pm-ordinary-song",
  name: "Ordinary Song",
  cost: 2,
  text: "A song without Sing Together.",
});

describe("Miguel Rivera - Promising Musician", () => {
  it("gains 1 lore whenever this character sings a song", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [singTogetherSong],
      play: [{ card: miguelRiveraPromisingMusician, isDrying: false }, backupSinger],
      deck: 6,
    });

    const loreBefore = testEngine.getLore("player_one");
    expect(
      testEngine
        .asPlayerOne()
        .playSongTogether(singTogetherSong, [miguelRiveraPromisingMusician, backupSinger]),
    ).toBeSuccessfulCommand();

    expect(testEngine.getLore("player_one")).toBe(loreBefore + 1);
  });

  it("does not gain lore when another character sings without him", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [ordinarySong],
      play: [{ card: miguelRiveraPromisingMusician, isDrying: false }, backupSinger],
      deck: 6,
    });

    const loreBefore = testEngine.getLore("player_one");
    expect(testEngine.asPlayerOne().singSong(ordinarySong, backupSinger)).toBeSuccessfulCommand();

    expect(testEngine.getLore("player_one")).toBe(loreBefore);
  });

  it("gains lore when singing alone, and again on a later turn", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [ordinarySong, ordinarySong], play: [miguelRiveraPromisingMusician], deck: 3 },
      { deck: 3 },
    );
    expect(
      engine.asPlayerOne().singSong(ordinarySong, miguelRiveraPromisingMusician),
    ).toBeSuccessfulCommand();
    expect(engine.getLore("player_one")).toBe(1);
    expect(engine.asPlayerOne().isExerted(miguelRiveraPromisingMusician)).toBe(true);
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().singSong(ordinarySong, miguelRiveraPromisingMusician),
    ).toBeSuccessfulCommand();
    expect(engine.getLore("player_one")).toBe(2);
  });

  it("does not gain lore when paying ink for a song", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [ordinarySong],
      play: [miguelRiveraPromisingMusician],
      inkwell: 2,
      deck: 3,
    });
    expect(engine.asPlayerOne().playCard(ordinarySong)).toBeSuccessfulCommand();
    expect(engine.getLore("player_one")).toBe(0);
    expect(engine.asPlayerOne().isExerted(miguelRiveraPromisingMusician)).toBe(false);
  });

  it("resolves the song and Crowd Pleaser once for Player Two only", () => {
    const rewardingSong = createMockSong({
      id: "miguel-p2-reward-song",
      name: "Reward Song",
      cost: 2,
      text: "Gain 2 lore.",
      abilities: [
        { type: "action", effect: { type: "gain-lore", amount: 2, target: "CONTROLLER" } },
      ],
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [miguelRiveraPromisingMusician], deck: 6 },
      { hand: [rewardingSong], play: [miguelRiveraPromisingMusician], inkwell: 2, deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      game
        .asPlayerTwo()
        .singSong(
          rewardingSong,
          game.findCardInstanceId(miguelRiveraPromisingMusician, "play", PLAYER_TWO),
        ),
    ).toBeSuccessfulCommand();
    expect(game.getLore("player_two")).toBe(3);
    expect(game.getLore("player_one")).toBe(0);
    expect(
      game
        .asPlayerTwo()
        .isExerted(game.findCardInstanceId(miguelRiveraPromisingMusician, "play", PLAYER_TWO)),
    ).toBe(true);
    expect(game.asPlayerTwo().getCardZone(rewardingSong)).toBe("discard");
    expect(game.asPlayerTwo().getAvailableInk("player_two")).toBe(2);
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
    expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  });
});

it("Player Two rewards exact participating Miguel copies and repeats after readying in the same turn", () => {
  const ready = createMockAction({
    id: "miguel-ready",
    name: "Ready Miguel",
    cost: 0,
    abilities: [{ type: "action", effect: { type: "ready", target: "CHOSEN_CHARACTER" } }],
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [miguelRiveraPromisingMusician], deck: 6 },
    {
      hand: [singTogetherSong, singTogetherSong, ordinarySong, ready],
      play: [
        miguelRiveraPromisingMusician,
        miguelRiveraPromisingMusician,
        miguelRiveraPromisingMusician,
        backupSinger,
        backupSinger,
      ],
      inkwell: 5,
      deck: 6,
    },
  );
  const miguels = game
    .getCardInstanceIdsInZone("play", PLAYER_TWO)
    .filter(
      (id) =>
        game.asServer().getCardDefinitionByInstanceId(id).id === miguelRiveraPromisingMusician.id,
    );
  const backups = game
    .getCardInstanceIdsInZone("play", PLAYER_TWO)
    .filter((id) => game.asServer().getCardDefinitionByInstanceId(id).id === backupSinger.id);
  const songs = game
    .getCardInstanceIdsInZone("hand", PLAYER_TWO)
    .filter((id) => game.asServer().getCardDefinitionByInstanceId(id).id === singTogetherSong.id);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playSongTogether(songs[0], backups)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_TWO)).toBe(0);
  expect(
    game.asPlayerTwo().playSongTogether(songs[1], [miguels[0], miguels[1]]),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getBagCount()).toBe(2);
  expect(game.getLore(PLAYER_TWO)).toBe(0);
  expect(game.asPlayerTwo().resolvePendingByCard(miguels[0])).toBeSuccessfulCommand();
  // Choosing the first trigger lets the engine drain the remaining unambiguous reward.
  expect(game.asPlayerTwo().getBagCount()).toBe(0);
  expect(game.getLore(PLAYER_TWO)).toBe(2);
  expect(game.getLore(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerTwo().isExerted(miguels[0])).toBe(true);
  expect(game.asPlayerTwo().isExerted(miguels[1])).toBe(true);
  expect(game.asPlayerTwo().isExerted(miguels[2])).toBe(false);
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(5);
  for (const song of songs) expect(game.asServer().getCard(song).zone).toBe("discard");
  expect(game.asPlayerTwo().singSong(ordinarySong, miguels[0])).not.toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_TWO)).toBe(2);
  expect(game.asPlayerTwo().getCardZone(ordinarySong)).toBe("hand");
  expect(game.asPlayerTwo().playCard(ready, { targets: [miguels[0]] })).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().singSong(ordinarySong, miguels[0])).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_TWO)).toBe(3);
  expect(game.getLore(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(5);
  expect(game.asPlayerTwo().getBagCount()).toBe(0);
  expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
});
