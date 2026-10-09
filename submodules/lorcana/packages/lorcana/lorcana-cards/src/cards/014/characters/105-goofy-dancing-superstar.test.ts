// CR 2.2.0: 4.4 (quest), 6.2 (triggers), 8.10.1–8.10.6 (Shift), 8.11.1 (Singer).
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
  createMockSong,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { singer } from "../../../helpers/abilities/singer";
import { goofyDancingSuperstar } from "./105-goofy-dancing-superstar";
import { goofyKnowsTheBand } from "./022-goofy-knows-the-band";
import { hctorRiveraStreetMusician } from "./117-hector-rivera-street-musician";

const singerAlly = createMockCharacter({
  id: "groove-singer-ally",
  name: "Backup Singer",
  cost: 3,
  lore: 2,
  abilities: [singer(2)],
});

const plainAlly = createMockCharacter({
  id: "groove-plain-ally",
  name: "Quiet Dancer",
  cost: 2,
  lore: 2,
});

describe("Goofy - Dancing Superstar", () => {
  it("IN THE GROOVE gives your other characters with Singer +1 {L} when he quests", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [goofyDancingSuperstar, singerAlly, plainAlly],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().quest(goofyDancingSuperstar)).toBeSuccessfulCommand();

    expect(testEngine.getCard(singerAlly).lore).toBe(3);
    expect(testEngine.getCard(plainAlly).lore).toBe(2);
    expect(testEngine.getCard(goofyDancingSuperstar).lore).toBe(2);
    expect(testEngine.getLore(PLAYER_ONE)).toBe(2);
  });

  it("the +1 {L} lasts only for the turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [goofyDancingSuperstar, singerAlly, plainAlly],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().quest(goofyDancingSuperstar)).toBeSuccessfulCommand();
    expect(testEngine.getCard(singerAlly).lore).toBe(3);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.getCard(singerAlly).lore).toBe(2);
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.getCard(singerAlly).lore).toBe(2);
  });

  it("questing without other Singer characters grants no boosts", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [goofyDancingSuperstar, plainAlly],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().quest(goofyDancingSuperstar)).toBeSuccessfulCommand();

    expect(testEngine.getCard(plainAlly).lore).toBe(2);
    expect(testEngine.getCard(goofyDancingSuperstar).lore).toBe(goofyDancingSuperstar.lore);
  });

  it("a singer shifted onto a same-name base still boosts other singers, whose quest pays the boosted lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [goofyKnowsTheBand, hctorRiveraStreetMusician],
      hand: [goofyDancingSuperstar],
      inkwell: 10,
      deck: 2,
    });

    const shiftTarget = testEngine.findCardInstanceId(goofyKnowsTheBand, "play", PLAYER_ONE);
    expect(
      testEngine.asPlayerOne().playCard(goofyDancingSuperstar, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().quest(goofyDancingSuperstar)).toBeSuccessfulCommand();
    expect(testEngine.getCard(hctorRiveraStreetMusician).lore).toBe(
      hctorRiveraStreetMusician.lore + 1,
    );

    // The boosted singer's own quest grants base 1 + 1 from IN THE GROOVE.
    expect(testEngine.asPlayerOne().quest(hctorRiveraStreetMusician)).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(goofyDancingSuperstar.lore + 2);
  });
});

const songSix = createMockSong({ id: "groove-song-six", name: "Six Ink Song", cost: 6, text: "" });
const songSeven = createMockSong({
  id: "groove-song-seven",
  name: "Seven Ink Song",
  cost: 7,
  text: "",
});
const baseGoofy = createMockCharacter({ id: "groove-base-goofy", name: "Goofy", cost: 1 });

it("Singer 6 sings a cost-six song at zero ink without triggering the quest bonus", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [goofyDancingSuperstar, singerAlly],
    hand: [songSix],
    deck: 6,
  });
  expect(game.asPlayerOne().singSong(songSix, goofyDancingSuperstar)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(songSix)).toBe("discard");
  expect(game.asPlayerOne().isExerted(goofyDancingSuperstar)).toBe(true);
  expect(game.asPlayerOne().getCard(singerAlly)?.lore).toBe(2);
  expect(game.getLore(PLAYER_ONE)).toBe(0);
});

it("rejects a cost-seven song and a second sing without consuming the legal first sing", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [goofyDancingSuperstar],
    hand: [songSix, songSeven],
    deck: 6,
  });
  expect(game.asPlayerOne().singSong(songSeven, goofyDancingSuperstar)).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().isExerted(goofyDancingSuperstar)).toBe(false);
  expect(game.asPlayerOne().singSong(songSix, goofyDancingSuperstar)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().singSong(songSeven, goofyDancingSuperstar)).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(songSeven)).toBe("hand");
});

it("excludes opposing Singers and pays the boosted lore when a friendly Singer quests", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [goofyDancingSuperstar, singerAlly, plainAlly], deck: 6 },
    { play: [singerAlly], deck: 6 },
  );
  const enemy = game.findCardInstanceId(singerAlly, "play", PLAYER_TWO);
  const ally = game.findCardInstanceId(singerAlly, "play", PLAYER_ONE);
  expect(game.asPlayerOne().quest(goofyDancingSuperstar)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCard(enemy)?.lore).toBe(2);
  expect(game.asPlayerOne().quest(ally)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(5);
});

it("two copies boost other copies and stack on a common Singer without retroactive lore", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [goofyDancingSuperstar, goofyDancingSuperstar, singerAlly],
    deck: 6,
  });
  const copies = game.getCardInstanceIdsInZone("play", PLAYER_ONE).slice(0, 2);
  expect(game.asPlayerOne().quest(copies[0]!)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(2);
  expect(game.asPlayerOne().getCard(copies[0]!)?.lore).toBe(2);
  expect(game.asPlayerOne().getCard(copies[1]!)?.lore).toBe(3);
  expect(game.asPlayerOne().quest(copies[1]!)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(5);
  expect(game.asPlayerOne().getCard(copies[0]!)?.lore).toBe(3);
  expect(game.asPlayerOne().getCard(singerAlly)?.lore).toBe(4);
  expect(game.asPlayerOne().quest(singerAlly)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(9);
});

it("a Singer played after the quest is not included in the resolved bonus", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [goofyDancingSuperstar],
    hand: [singerAlly],
    inkwell: 3,
    deck: 6,
  });
  expect(game.asPlayerOne().quest(goofyDancingSuperstar)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().playCard(singerAlly)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCard(singerAlly)?.lore).toBe(2);
});

it("the resolved quest bonus lasts through source removal and expires at the turn end", () => {
  const remove = createMockAction({
    id: "groove-remove",
    name: "Remove Performer",
    cost: 1,
    abilities: [{ type: "action", effect: { type: "banish", target: "CHOSEN_CHARACTER" } }],
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [goofyDancingSuperstar, singerAlly], hand: [remove], inkwell: 1, deck: 6 },
    { deck: 6 },
  );
  expect(game.asPlayerOne().quest(goofyDancingSuperstar)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().playCard(remove, { targets: [goofyDancingSuperstar] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(goofyDancingSuperstar)).toBe("discard");
  expect(game.asPlayerOne().getCard(singerAlly)?.lore).toBe(3);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCard(singerAlly)?.lore).toBe(2);
});

it("every successful quest can trigger and a rejected repeated quest adds no bonus", () => {
  const ready = createMockAction({
    id: "groove-ready",
    name: "Ready Performer",
    cost: 0,
    abilities: [{ type: "action", effect: { type: "ready", target: "CHOSEN_CHARACTER" } }],
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [goofyDancingSuperstar, singerAlly],
    hand: [ready],
    deck: 6,
  });
  expect(game.asPlayerOne().quest(goofyDancingSuperstar)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().quest(goofyDancingSuperstar)).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCard(singerAlly)?.lore).toBe(3);
  expect(
    game.asPlayerOne().playCard(ready, { targets: [goofyDancingSuperstar] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().quest(goofyDancingSuperstar)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCard(singerAlly)?.lore).toBe(4);
  expect(game.getLore(PLAYER_ONE)).toBe(4);
});

it("Shift pays exactly three ink and inherits exertion and damage from an own Goofy", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [{ card: baseGoofy, exerted: true, damage: 1 }],
    hand: [goofyDancingSuperstar],
    inkwell: 3,
    deck: 6,
  });
  const shiftTarget = game.findCardInstanceId(baseGoofy, "play", PLAYER_ONE);
  expect(
    game.asPlayerOne().playCard(goofyDancingSuperstar, { cost: { cost: "shift", shiftTarget } }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne().isExerted(goofyDancingSuperstar)).toBe(true);
  expect(game.asPlayerOne()).toHaveDamage({ card: goofyDancingSuperstar, value: 1 });
  expect(game.asPlayerOne().quest(goofyDancingSuperstar)).not.toBeSuccessfulCommand();
});

it("rejects wrong-name and opposing Shift bases without payment before a valid retry", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [plainAlly, baseGoofy], hand: [goofyDancingSuperstar], inkwell: 3, deck: 6 },
    { play: [baseGoofy], deck: 6 },
  );
  for (const shiftTarget of [
    game.findCardInstanceId(plainAlly, "play", PLAYER_ONE),
    game.findCardInstanceId(baseGoofy, "play", PLAYER_TWO),
  ]) {
    expect(
      game.asPlayerOne().playCard(goofyDancingSuperstar, { cost: { cost: "shift", shiftTarget } }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(3);
  }
  const shiftTarget = game.findCardInstanceId(baseGoofy, "play", PLAYER_ONE);
  expect(
    game.asPlayerOne().playCard(goofyDancingSuperstar, { cost: { cost: "shift", shiftTarget } }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().quest(goofyDancingSuperstar)).toBeSuccessfulCommand();
});

it("cannot Shift with only two ink", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [baseGoofy],
    hand: [goofyDancingSuperstar],
    inkwell: 2,
    deck: 6,
  });
  const shiftTarget = game.findCardInstanceId(baseGoofy, "play", PLAYER_ONE);
  expect(
    game.asPlayerOne().playCard(goofyDancingSuperstar, { cost: { cost: "shift", shiftTarget } }),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(2);
});

it("a Goofy shifted onto a drying base cannot quest or sing", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [baseGoofy, goofyDancingSuperstar, songSix],
    inkwell: 4,
    deck: 6,
  });
  expect(game.asPlayerOne().playCard(baseGoofy)).toBeSuccessfulCommand();
  const shiftTarget = game.findCardInstanceId(baseGoofy, "play", PLAYER_ONE);
  expect(
    game.asPlayerOne().playCard(goofyDancingSuperstar, { cost: { cost: "shift", shiftTarget } }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().quest(goofyDancingSuperstar)).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().singSong(songSix, goofyDancingSuperstar)).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(songSix)).toBe("hand");
});

it("ordinary play costs five ink and leaves Goofy drying without a quest bonus", () => {
  const insufficient = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [goofyDancingSuperstar],
    inkwell: 4,
    deck: 6,
  });
  expect(insufficient.asPlayerOne().playCard(goofyDancingSuperstar)).not.toBeSuccessfulCommand();
  expect(insufficient.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(4);
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [singerAlly],
    hand: [goofyDancingSuperstar, songSix],
    inkwell: 5,
    deck: 6,
  });
  expect(game.asPlayerOne().playCard(goofyDancingSuperstar)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne().getCard(goofyDancingSuperstar)?.strength).toBe(5);
  expect(game.asPlayerOne().getCard(goofyDancingSuperstar)?.willpower).toBe(4);
  expect(game.asPlayerOne().getCard(singerAlly)?.lore).toBe(2);
  expect(game.asPlayerOne().quest(goofyDancingSuperstar)).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().singSong(songSix, goofyDancingSuperstar)).not.toBeSuccessfulCommand();
});

it("player two shifts onto their own Goofy and boosts only their other Singer until turn end", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [baseGoofy, singerAlly], inkwell: 3, deck: 6 },
    {
      play: [baseGoofy, singerAlly, plainAlly],
      hand: [goofyDancingSuperstar],
      inkwell: 3,
      deck: 6,
    },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const enemyBase = game.findCardInstanceId(baseGoofy, "play", PLAYER_ONE);
  const ownBase = game.findCardInstanceId(baseGoofy, "play", PLAYER_TWO);
  const enemySinger = game.findCardInstanceId(singerAlly, "play", PLAYER_ONE);
  const ownSinger = game.findCardInstanceId(singerAlly, "play", PLAYER_TWO);
  expect(
    game
      .asPlayerTwo()
      .playCard(goofyDancingSuperstar, { cost: { cost: "shift", shiftTarget: enemyBase } }),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(3);
  expect(
    game
      .asPlayerTwo()
      .playCard(goofyDancingSuperstar, { cost: { cost: "shift", shiftTarget: ownBase } }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(3);
  expect(game.asPlayerTwo().quest(goofyDancingSuperstar)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCard(ownSinger)?.lore).toBe(3);
  expect(game.asPlayerTwo().getCard(enemySinger)?.lore).toBe(2);
  expect(game.asPlayerTwo().getCard(plainAlly)?.lore).toBe(2);
  expect(game.asPlayerTwo().getCard(goofyDancingSuperstar)?.lore).toBe(2);
  expect(game.asPlayerTwo().quest(ownSinger)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_TWO)).toBe(5);
  expect(game.getLore(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCard(ownSinger)?.lore).toBe(2);
});

it("player two repeats the quest, excludes a late Singer and keeps prior boosts after source removal", () => {
  const ready = createMockAction({
    id: "groove-p2-ready",
    name: "Ready Again",
    cost: 3,
    abilities: [{ type: "action", effect: { type: "ready", target: "CHOSEN_CHARACTER" } }],
  });
  const remove = createMockAction({
    id: "groove-p2-remove",
    name: "Remove Goofy",
    cost: 5,
    abilities: [{ type: "action", effect: { type: "banish", target: "CHOSEN_CHARACTER" } }],
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [singerAlly], deck: 6, lore: 5 },
    {
      play: [goofyDancingSuperstar, singerAlly, plainAlly],
      hand: [ready, remove, singerAlly],
      inkwell: 11,
      inkDrops: 3,
      deck: 6,
    },
  );
  const performer = game.findCardInstanceId(goofyDancingSuperstar, "play", PLAYER_TWO)!;
  const existing = game.findCardInstanceId(singerAlly, "play", PLAYER_TWO)!;
  const late = game.findCardInstanceId(singerAlly, "hand", PLAYER_TWO)!;
  const enemy = game.findCardInstanceId(singerAlly, "play", PLAYER_ONE)!;
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().quest(performer)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().quest(performer)).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCard(existing)?.lore).toBe(3);
  expect(game.asPlayerTwo().playCard(ready, { targets: [performer] })).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().quest(performer)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCard(existing)?.lore).toBe(4);
  expect(game.asPlayerTwo().playCard(late)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCard(late)?.lore).toBe(2);
  expect(game.asPlayerTwo().playCard(remove, { targets: [performer] })).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(performer)).toBe("discard");
  expect(game.asPlayerTwo().getCard(existing)?.lore).toBe(4);
  expect(game.asPlayerTwo().getCard(late)?.lore).toBe(2);
  expect(game.asPlayerOne().getCard(enemy)?.lore).toBe(2);
  expect(game.asPlayerTwo().getCard(plainAlly)?.lore).toBe(2);
  expect(game.asPlayerTwo().quest(existing)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_TWO)).toBe(8);
  expect(game.getLore(PLAYER_ONE)).toBe(5);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(3);
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCard(existing)?.lore).toBe(2);
  expect(game.asPlayerOne().getCard(late)?.lore).toBe(2);
});

it("player two pays Shift three with two bank ink and one drop, then rejects seven but sings six", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [baseGoofy], inkDrops: 4, deck: 6 },
    {
      play: [{ card: baseGoofy, damage: 1 }, singerAlly],
      hand: [goofyDancingSuperstar, songSix, songSeven],
      inkwell: 2,
      inkDrops: 1,
      deck: 6,
    },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const ownBase = game.findCardInstanceId(baseGoofy, "play", PLAYER_TWO)!;
  const ownSinger = game.findCardInstanceId(singerAlly, "play", PLAYER_TWO)!;
  expect(
    game
      .asPlayerTwo()
      .playCard(goofyDancingSuperstar, { cost: { cost: "shift", shiftTarget: ownBase } }),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(2);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
  expect(
    game.asPlayerTwo().playCard(goofyDancingSuperstar, {
      inkDrops: 1,
      cost: { cost: "shift", shiftTarget: ownBase },
    }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo()).toHaveDamage({ card: goofyDancingSuperstar, value: 1 });
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(4);
  expect(game.asPlayerTwo().singSong(songSeven, goofyDancingSuperstar)).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().isExerted(goofyDancingSuperstar)).toBe(false);
  expect(game.asPlayerTwo().singSong(songSix, goofyDancingSuperstar)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(songSeven)).toBe("hand");
  expect(game.asPlayerTwo().getCardZone(songSix)).toBe("discard");
  expect(game.asPlayerTwo().isExerted(goofyDancingSuperstar)).toBe(true);
  expect(game.asPlayerTwo().getCard(ownSinger)?.lore).toBe(2);
  expect(game.getLore(PLAYER_TWO)).toBe(0);
});
