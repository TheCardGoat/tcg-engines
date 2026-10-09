// CR 6.4.1 and 8.11.1: a static bonus continuously checks for Singer in play.
import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { singer } from "../../../helpers/abilities/singer";
import { goofyEnthusiasticTourist } from "./111-goofy-enthusiastic-tourist";

const singerFriend = createMockCharacter({
  id: "goofy-tourist-singer-friend",
  name: "Singer Friend",
  cost: 2,
  strength: 0,
  willpower: 1,
  abilities: [singer(2)],
});

const anotherSingerFriend = createMockCharacter({
  id: "goofy-tourist-another-singer",
  name: "Another Singer Friend",
  cost: 2,
  abilities: [singer(3)],
});

const nonSingerFriend = createMockCharacter({
  id: "goofy-tourist-non-singer",
  name: "Non Singer Friend",
  cost: 2,
});

describe("Goofy - Enthusiastic Tourist", () => {
  it("gains the bonus immediately when a Singer is played, without a trigger", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: goofyEnthusiasticTourist, isDrying: false }],
      hand: [singerFriend],
      inkwell: 2,
    });
    expect(game.asPlayerOne().getCardStrength(goofyEnthusiasticTourist)).toBe(0);
    expect(game.asPlayerOne().playCard(singerFriend)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardStrength(goofyEnthusiasticTourist)).toBe(3);
    expect(game.asPlayerOne().getBagEffects()).toHaveLength(0);
  });

  it("deals three combat damage with multiple Singers and only one bonus", () => {
    const defender = createMockCharacter({
      id: "tourist-defender",
      name: "Defender",
      cost: 1,
      strength: 1,
      willpower: 20,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: goofyEnthusiasticTourist, isDrying: false },
          singerFriend,
          anotherSingerFriend,
        ],
      },
      { play: [{ card: defender, exerted: true }] },
    );
    expect(
      game.asPlayerOne().challenge(goofyEnthusiasticTourist, defender),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getDamage(defender)).toBe(3);
    expect(game.asPlayerOne().getDamage(goofyEnthusiasticTourist)).toBe(1);
  });

  it("loses the bonus immediately when the last Singer is banished", () => {
    const defender = createMockCharacter({
      id: "tourist-singer-defender",
      name: "Defender",
      cost: 1,
      strength: 1,
      willpower: 20,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [goofyEnthusiasticTourist, { card: singerFriend, isDrying: false }],
      },
      { play: [{ card: defender, exerted: true }] },
    );
    expect(game.asPlayerOne().getCardStrength(goofyEnthusiasticTourist)).toBe(3);
    expect(game.asPlayerOne().challenge(singerFriend, defender)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(singerFriend)).toBe("discard");
    expect(game.asPlayerOne().getCardStrength(goofyEnthusiasticTourist)).toBe(0);
  });

  it("keeps the bonus when one of two Singers is banished", () => {
    const defender = createMockCharacter({
      id: "tourist-two-singers-defender",
      name: "Defender",
      cost: 1,
      strength: 1,
      willpower: 20,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          goofyEnthusiasticTourist,
          { card: singerFriend, isDrying: false },
          anotherSingerFriend,
        ],
      },
      { play: [{ card: defender, exerted: true }] },
    );
    expect(game.asPlayerOne().challenge(singerFriend, defender)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(singerFriend)).toBe("discard");
    expect(game.asPlayerOne().getCardStrength(goofyEnthusiasticTourist)).toBe(3);
  });

  it("does not count Singers in hand or discard", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [goofyEnthusiasticTourist],
      hand: [singerFriend],
      discard: [anotherSingerFriend],
    });
    expect(game.asPlayerOne().getCardStrength(goofyEnthusiasticTourist)).toBe(0);
  });

  it("counts an exerted Singer even while its ink is drying", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [goofyEnthusiasticTourist, { card: singerFriend, isDrying: true, exerted: true }],
    });
    expect(game.asPlayerOne().getCardStrength(goofyEnthusiasticTourist)).toBe(3);
  });
  it("has base strength without a character with Singer in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [goofyEnthusiasticTourist],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().getCardStrength(goofyEnthusiasticTourist)).toBe(
      goofyEnthusiasticTourist.strength,
    );
  });

  it("does not get +3 strength for a character without Singer", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [goofyEnthusiasticTourist, nonSingerFriend],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().getCardStrength(goofyEnthusiasticTourist)).toBe(
      goofyEnthusiasticTourist.strength,
    );
  });

  it("gets +3 strength while you have a character with Singer in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [goofyEnthusiasticTourist, singerFriend],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().getCardStrength(goofyEnthusiasticTourist)).toBe(
      goofyEnthusiasticTourist.strength + 3,
    );
  });

  it("still only gets +3 strength when multiple Singer characters are in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [goofyEnthusiasticTourist, singerFriend, anotherSingerFriend],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().getCardStrength(goofyEnthusiasticTourist)).toBe(
      goofyEnthusiasticTourist.strength + 3,
    );
  });

  it("does not count an opposing Singer character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [goofyEnthusiasticTourist],
        deck: 2,
      },
      {
        play: [singerFriend],
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().getCardStrength(goofyEnthusiasticTourist)).toBe(
      goofyEnthusiasticTourist.strength,
    );
  });
});

it("player two gains the static bonus on both copies without boosting an opposing Goofy", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [goofyEnthusiasticTourist], deck: 6 },
    {
      play: [goofyEnthusiasticTourist, goofyEnthusiasticTourist],
      hand: [singerFriend],
      inkwell: 2,
      deck: 6,
    },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const ownCopies = game.getCardInstanceIdsInZone("play", "player_two");
  const opposing = game.findCardInstanceId(goofyEnthusiasticTourist, "play", "player_one");
  expect(game.asPlayerTwo().playCard(singerFriend)).toBeSuccessfulCommand();
  for (const copy of ownCopies) expect(game.asPlayerTwo().getCardStrength(copy)).toBe(3);
  expect(game.asPlayerTwo().getCardStrength(opposing)).toBe(0);
  expect(game.asPlayerTwo().getBagCount()).toBe(0);
  for (const copy of ownCopies) expect(game.asPlayerTwo().quest(copy)).toBeSuccessfulCommand();
  expect(game.getLore("player_two")).toBe(goofyEnthusiasticTourist.lore * 2);
  expect(game.getLore("player_one")).toBe(0);
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  for (const copy of ownCopies) expect(game.asPlayerOne().getCardStrength(copy)).toBe(3);
});
