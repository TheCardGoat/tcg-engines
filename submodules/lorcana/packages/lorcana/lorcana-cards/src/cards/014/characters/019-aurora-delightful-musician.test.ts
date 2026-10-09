import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockSong,
  createMockCharacter,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { auroraDelightfulMusician } from "./019-aurora-delightful-musician";

const cheapSong = createMockSong({
  id: "aurora-cheap-song",
  name: "Cheap Song",
  cost: 2,
  text: "A song costing 2.",
});

const expensiveSong = createMockSong({
  id: "aurora-expensive-song",
  name: "Expensive Song",
  cost: 5,
  text: "A song costing 5.",
});

describe("Aurora - Delightful Musician", () => {
  it("returns a song card with cost 3 or less from your discard to hand when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cheapSong, auroraDelightfulMusician],
      inkwell: cheapSong.cost + auroraDelightfulMusician.cost,
      deck: 6,
    });

    // Play the song first so it lands in the discard this turn.
    expect(testEngine.asPlayerOne().playCard(cheapSong)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(cheapSong)).toBe("discard");

    expect(testEngine.asPlayerOne().playCard(auroraDelightfulMusician)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(auroraDelightfulMusician, {
        targets: [cheapSong],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(cheapSong)).toBe("hand");
  });

  it("cannot return a song with cost greater than 3", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [auroraDelightfulMusician],
      inkwell: auroraDelightfulMusician.cost,
      discard: [expensiveSong],
      deck: 6,
    });

    expect(testEngine.asPlayerOne().playCard(auroraDelightfulMusician)).toBeSuccessfulCommand();

    // The only discarded song costs 5, so MELODIC REFRAIN auto-resolves
    // without a return and the expensive song stays in the discard.
    expect(testEngine.asPlayerOne().getPendingEffects().length).toBe(0);
    expect(testEngine.asPlayerOne().getCardZone(expensiveSong)).toBe("discard");
  });

  it("gains 1 lore at end of turn if you played a song this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [cheapSong],
        inkwell: cheapSong.cost,
        play: [auroraDelightfulMusician],
        deck: 6,
      },
      { deck: 6 },
    );

    const loreBefore = testEngine.getLore("player_one");
    expect(testEngine.asPlayerOne().playCard(cheapSong)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.getLore("player_one")).toBe(loreBefore + 1);
  });

  it("does not gain lore at end of turn if you played no song this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [auroraDelightfulMusician],
        deck: 6,
      },
      { deck: 6 },
    );

    const loreBefore = testEngine.getLore("player_one");
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.getLore("player_one")).toBe(loreBefore);
  });

  it("does not return a song that was already in discard before this turn", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [auroraDelightfulMusician],
      inkwell: auroraDelightfulMusician.cost,
      discard: [cheapSong],
      deck: 6,
    });
    expect(engine.asPlayerOne().playCard(auroraDelightfulMusician)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getBagCount()).toBe(0);
    expect(engine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(engine.asPlayerOne().getCardZone(cheapSong)).toBe("discard");
  });

  it.each([3, 4])(
    "checks a song played this turn at the printed cost boundary: %i",
    (cost: number) => {
      const song = createMockSong({
        id: `aurora-boundary-${cost}`,
        name: "Boundary Song",
        cost,
        text: "A song.",
      });
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [song, auroraDelightfulMusician],
        inkwell: cost + auroraDelightfulMusician.cost,
        deck: 6,
      });
      expect(engine.asPlayerOne().playCard(song)).toBeSuccessfulCommand();
      expect(engine.asPlayerOne().playCard(auroraDelightfulMusician)).toBeSuccessfulCommand();
      if (cost === 3) {
        expect(
          engine.asPlayerOne().resolvePendingByCard(auroraDelightfulMusician, { targets: [song] }),
        ).toBeSuccessfulCommand();
        expect(engine.asPlayerOne().getCardZone(song)).toBe("hand");
      } else {
        expect(engine.asPlayerOne().getBagCount()).toBe(0);
        expect(engine.asPlayerOne().getCardZone(song)).toBe("discard");
      }
    },
  );

  it("does not return an ordinary action played this turn", () => {
    const action = createMockAction({ id: "aurora-action", name: "Ordinary Action", cost: 1 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [action, auroraDelightfulMusician],
      inkwell: 1 + auroraDelightfulMusician.cost,
      deck: 6,
    });
    expect(engine.asPlayerOne().playCard(action)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().playCard(auroraDelightfulMusician)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getBagCount()).toBe(0);
    expect(engine.asPlayerOne().getCardZone(action)).toBe("discard");
  });

  it("does not return a song played on the previous turn", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [cheapSong, auroraDelightfulMusician],
        inkwell: cheapSong.cost + auroraDelightfulMusician.cost,
        deck: 6,
      },
      { deck: 6 },
    );
    expect(engine.asPlayerOne().playCard(cheapSong)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().playCard(auroraDelightfulMusician)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getBagCount()).toBe(0);
    expect(engine.asPlayerOne().getCardZone(cheapSong)).toBe("discard");
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.getLore("player_one")).toBe(0);
  });

  it("gains only one lore after multiple songs and none at the opponent's turn end", () => {
    const secondSong = createMockSong({
      id: "aurora-second-song",
      name: "Second Song",
      cost: 2,
      text: "A song.",
    });
    const opposingSong = createMockSong({
      id: "aurora-opposing-song",
      name: "Opposing Song",
      cost: 2,
      text: "A song.",
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [auroraDelightfulMusician],
        hand: [cheapSong, secondSong],
        inkwell: 4,
        deck: 6,
      },
      { hand: [opposingSong], inkwell: 2, deck: 6 },
    );
    expect(engine.asPlayerOne().playCard(cheapSong)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().playCard(secondSong)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.getLore("player_one")).toBe(1);
    expect(engine.asPlayerTwo().playCard(opposingSong)).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.getLore("player_one")).toBe(1);
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.getLore("player_one")).toBe(1);
  });
  it("returns a sung song and rewards a song played before Aurora entered", () => {
    const singer = createMockCharacter({ id: "aurora-singer", name: "Singer", cost: 3 });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [cheapSong, auroraDelightfulMusician], play: [singer], inkwell: 3, deck: 6 },
      { deck: 6 },
    );
    expect(game.asPlayerOne().singSong(cheapSong, singer)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(3);
    expect(game.asPlayerOne().playCard(auroraDelightfulMusician)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(auroraDelightfulMusician, { targets: [cheapSong] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(cheapSong)).toBe("hand");
    expect(game.getLore(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(1);
    expect(game.asPlayerOne().getBagCount()).toBe(0);
  });

  it("Player Two returns their own song and gains only their own end-turn lore", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [auroraDelightfulMusician], discard: [expensiveSong], deck: 6 },
      { hand: [cheapSong, auroraDelightfulMusician], inkwell: 5, deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(cheapSong)).toBeSuccessfulCommand();
    expect(
      game
        .asPlayerTwo()
        .playCard(game.findCardInstanceId(auroraDelightfulMusician, "hand", PLAYER_TWO)),
    ).toBeSuccessfulCommand();
    const auroraId = game.findCardInstanceId(auroraDelightfulMusician, "play", PLAYER_TWO);
    expect(
      game.asPlayerTwo().resolvePendingByCard(auroraId, { targets: [cheapSong] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(cheapSong)).toBe("hand");
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_TWO)).toBe(1);
    expect(game.getLore(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
    expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  });
  it("Player Two can replay a returned cost-three song and each Aurora gains only one end-turn lore", () => {
    const song = createMockSong({
      id: "aurora-repeated-three",
      name: "Repeated Song",
      cost: 3,
      text: "A song.",
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [auroraDelightfulMusician], deck: 6 },
      {
        hand: [song, auroraDelightfulMusician, auroraDelightfulMusician],
        discard: [song],
        inkwell: 12,
        deck: 6,
      },
    );
    const oldSong = game.findCardInstanceId(song, "discard", PLAYER_TWO);
    const playedSong = game.findCardInstanceId(song, "hand", PLAYER_TWO);
    const sources = game
      .getCardInstanceIdsInZone("hand", PLAYER_TWO)
      .filter((id) => id !== playedSong);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(sources).toHaveLength(2);
    for (const source of sources) {
      expect(game.asPlayerTwo().playCard(playedSong)).toBeSuccessfulCommand();
      expect(game.asPlayerTwo().playCard(source)).toBeSuccessfulCommand();
      expect(
        game.asPlayerTwo().resolvePendingByCard(source, { targets: [oldSong] }),
      ).not.toBeSuccessfulCommand();
      expect(
        game.asPlayerTwo().resolvePendingByCard(source, { targets: [playedSong] }),
      ).toBeSuccessfulCommand();
      expect(game.asPlayerTwo().getCardZone(playedSong)).toBe("hand");
    }
    expect(game.asPlayerTwo().getCardZone(oldSong)).toBe("discard");
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getBagCount()).toBe(2);
    expect(game.asPlayerTwo().resolvePendingByCard(sources[0])).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_TWO)).toBe(2);
    expect(game.getLore(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
    expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_TWO)).toBe(2);
  });
});
