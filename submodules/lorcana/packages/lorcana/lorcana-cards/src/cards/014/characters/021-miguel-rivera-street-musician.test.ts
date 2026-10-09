import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockSong,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { miguelRiveraStreetMusician } from "./021-miguel-rivera-street-musician";

const songCard = createMockSong({
  id: "miguel-sm-song",
  name: "Some Song",
  cost: 2,
  text: "A song.",
});

const actionCard = createMockAction({
  id: "miguel-sm-action",
  name: "Some Action",
  cost: 2,
  text: "An action.",
});

const singableSong = createMockSong({
  id: "miguel-sm-singable-song",
  name: "Singable Song",
  cost: 3,
  text: "A song costing 3.",
});

function loreOf(
  testEngine: ReturnType<typeof LorcanaMultiplayerTestEngine.createWithFixture>,
): number {
  const id = testEngine.findCardInstanceId(miguelRiveraStreetMusician, "play");
  return testEngine.asServer().getCard(id).lore ?? 0;
}

describe("Miguel Rivera - Street Musician", () => {
  it("gets +1 {L} and gains Singer 3 while you have a song card in your discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [miguelRiveraStreetMusician],
      discard: [songCard],
      deck: 6,
    });

    expect(loreOf(testEngine)).toBe((miguelRiveraStreetMusician.lore ?? 0) + 1);
    expect(testEngine.hasKeyword(miguelRiveraStreetMusician, "Singer")).toBe(true);

    // Singer 3: can sing a song with cost 3.
    const singingEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [singableSong],
      play: [miguelRiveraStreetMusician],
      discard: [songCard],
    });
    expect(
      singingEngine.asPlayerOne().singSong(singableSong, miguelRiveraStreetMusician),
    ).toBeSuccessfulCommand();
  });

  it("has neither bonus with only non-song cards in your discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [miguelRiveraStreetMusician],
      discard: [actionCard],
      deck: 6,
    });

    expect(loreOf(testEngine)).toBe(miguelRiveraStreetMusician.lore);
    expect(testEngine.hasKeyword(miguelRiveraStreetMusician, "Singer")).toBe(false);
  });

  it("cannot sing a cost-3 song without a song card in your discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [singableSong],
      play: [miguelRiveraStreetMusician],
      deck: 6,
    });

    expect(
      testEngine.asPlayerOne().singSong(singableSong, miguelRiveraStreetMusician).success,
    ).toBe(false);
    expect(testEngine.asPlayerOne().getCardZone(singableSong)).toBe("hand");
  });
  it("quests for two lore even with multiple songs and cannot sing above Singer 3", () => {
    const expensiveSong = createMockSong({
      id: "miguel-four-song",
      name: "Four Song",
      cost: 4,
      text: "A song.",
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [miguelRiveraStreetMusician],
      discard: [songCard, singableSong],
      hand: [expensiveSong],
      deck: 6,
    });
    expect(
      engine.asPlayerOne().singSong(expensiveSong, miguelRiveraStreetMusician),
    ).not.toBeSuccessfulCommand();
    expect(engine.asPlayerOne().quest(miguelRiveraStreetMusician)).toBeSuccessfulCommand();
    expect(engine.getLore("player_one")).toBe(2);
  });

  it("does not gain either bonus from an opponent's discard", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [miguelRiveraStreetMusician],
        hand: [singableSong],
        deck: 6,
      },
      { discard: [songCard], deck: 6 },
    );
    expect(
      engine.asPlayerOne().singSong(singableSong, miguelRiveraStreetMusician),
    ).not.toBeSuccessfulCommand();
    expect(engine.asPlayerOne().quest(miguelRiveraStreetMusician)).toBeSuccessfulCommand();
    expect(engine.getLore("player_one")).toBe(1);
  });

  it("loses both bonuses as soon as the last song leaves discard", () => {
    const returnSong = createMockAction({
      id: "miguel-return-song",
      name: "Return Song",
      cost: 1,
      text: "Return a song.",
      abilities: [
        {
          type: "action",
          effect: {
            type: "return-to-hand",
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["discard"],
              cardTypes: ["action"],
              filters: [{ type: "is-song" }],
            },
          },
        },
      ],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [miguelRiveraStreetMusician],
      discard: [songCard],
      hand: [returnSong, singableSong],
      inkwell: 1,
      deck: 6,
    });
    expect(
      engine.asPlayerOne().playCard(returnSong, { targets: [songCard] }),
    ).toBeSuccessfulCommand();
    expect(engine.hasKeyword(miguelRiveraStreetMusician, "Singer")).toBe(false);
    expect(
      engine.asPlayerOne().singSong(singableSong, miguelRiveraStreetMusician),
    ).not.toBeSuccessfulCommand();
    expect(engine.asPlayerOne().quest(miguelRiveraStreetMusician)).toBeSuccessfulCommand();
    expect(engine.getLore("player_one")).toBe(1);
  });
  it.each([1, 2, 3])(
    "sings a cost-%s song with an actual effect without spending ink",
    (cost: number) => {
      const song = createMockSong({
        id: "miguel-reward-song-" + cost,
        name: "Reward Song",
        cost,
        text: "Gain 1 lore.",
        abilities: [
          { type: "action", effect: { type: "gain-lore", amount: 1, target: "CONTROLLER" } },
        ],
      });
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [song],
        play: [miguelRiveraStreetMusician],
        discard: [songCard],
        inkwell: 2,
        deck: 6,
      });
      expect(game.asPlayerOne().singSong(song, miguelRiveraStreetMusician)).toBeSuccessfulCommand();
      expect(game.getLore(PLAYER_ONE)).toBe(1);
      expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(2);
      expect(game.asPlayerOne().getCardZone(song)).toBe("discard");
      expect(game.asPlayerOne().isExerted(miguelRiveraStreetMusician)).toBe(true);
      expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
    },
  );

  it("gains both bonuses immediately when the first paid song enters discard", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [songCard],
      play: [miguelRiveraStreetMusician],
      inkwell: 2,
      deck: 6,
    });
    expect(game.asPlayerOne().getCard(miguelRiveraStreetMusician).lore).toBe(1);
    expect(game.hasKeyword(miguelRiveraStreetMusician, "Singer")).toBe(false);
    expect(game.asPlayerOne().playCard(songCard)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCard(miguelRiveraStreetMusician).lore).toBe(2);
    expect(game.hasKeyword(miguelRiveraStreetMusician, "Singer")).toBe(true);
    expect(game.asPlayerOne().quest(miguelRiveraStreetMusician)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(2);
  });

  it("Player Two quests for the bonus from their own discard", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 6 },
      { play: [miguelRiveraStreetMusician], discard: [songCard], deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCard(miguelRiveraStreetMusician).lore).toBe(2);
    expect(game.asPlayerTwo().quest(miguelRiveraStreetMusician)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_TWO)).toBe(2);
    expect(game.getLore(PLAYER_ONE)).toBe(0);
  });
});
