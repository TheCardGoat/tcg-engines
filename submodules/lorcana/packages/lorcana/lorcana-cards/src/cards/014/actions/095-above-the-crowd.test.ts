// CR 6.6.1: current strength includes modifiers; CR 8.15.1: opposing Ward cannot be chosen.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  PLAYER_ONE,
  createMockItem,
  createMockLocation,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { distract } from "../../003/actions/159-distract";
import { improvise } from "../../002/actions/099-improvise";
import { aboveTheCrowd } from "./095-above-the-crowd";

const weakEnemy = createMockCharacter({
  id: "above-crowd-weak",
  name: "Weak Performer",
  cost: 2,
  strength: 3,
  willpower: 5,
});

const strongEnemy = createMockCharacter({
  id: "above-crowd-strong",
  name: "Headliner",
  cost: 6,
  strength: 6,
  willpower: 8,
});

describe("Above the Crowd", () => {
  it("puts a chosen opposing character with 3 strength or less on the bottom of their deck", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [aboveTheCrowd],
        inkwell: aboveTheCrowd.cost,
      },
      {
        play: [weakEnemy],
        deck: [strongEnemy],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(aboveTheCrowd, { targets: [weakEnemy] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(weakEnemy)).toBe("deck");
    expect(testEngine.asPlayerTwo().getZonesCardCount().deck).toBe(2);
  });

  it("can't target an opposing character with more than 3 strength", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [aboveTheCrowd],
        inkwell: aboveTheCrowd.cost,
      },
      {
        play: [strongEnemy],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(aboveTheCrowd, { targets: [strongEnemy] }),
    ).not.toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(strongEnemy)).toBe("play");
  });
});

it("puts the target below every existing deck card without changing your deck", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [aboveTheCrowd], inkwell: 5, deck: 6 },
    { play: [weakEnemy], deck: 6 },
  );
  const before = game.getCardInstanceIdsInZone("deck", PLAYER_TWO);
  const own = game.getCardInstanceIdsInZone("deck", PLAYER_ONE);
  const target = game.findCardInstanceId(weakEnemy, "play", PLAYER_TWO);
  expect(game.asPlayerOne().playCard(aboveTheCrowd, { targets: [target] })).toBeSuccessfulCommand();
  expect(game.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual([target, ...before]);
  expect(game.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(own);
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne().getCardZone(aboveTheCrowd)).toBe("discard");
});

it("can put a zero-strength damaged exerted character into an empty deck", () => {
  const zero = createMockCharacter({
    id: "crowd-zero",
    name: "Zero",
    cost: 1,
    strength: 0,
    willpower: 5,
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [aboveTheCrowd], inkwell: 5 },
    { play: [{ card: zero, damage: 1, exerted: true }], deck: [] },
  );
  const id = game.findCardInstanceId(zero, "play", PLAYER_TWO);
  expect(game.asPlayerOne().playCard(aboveTheCrowd, { targets: [id] })).toBeSuccessfulCommand();
  expect(game.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual([id]);
});

it("rejects own characters, opposing Ward, items, locations, wrong zones and multiple targets before payment", () => {
  const ward = createMockCharacter({
    id: "crowd-ward",
    name: "Ward",
    cost: 1,
    strength: 1,
    abilities: [{ type: "keyword", keyword: "Ward" }],
  });
  const item = createMockItem({ id: "crowd-item", name: "Item", cost: 1 });
  const location = createMockLocation({ id: "crowd-location", name: "Location", cost: 1 });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [aboveTheCrowd], inkwell: 5, play: [weakEnemy] },
    {
      play: [weakEnemy, strongEnemy, ward, item, location],
      hand: [weakEnemy],
      discard: [weakEnemy],
      deck: 6,
    },
  );
  const own = game.findCardInstanceId(weakEnemy, "play", PLAYER_ONE);
  const legal = game.findCardInstanceId(weakEnemy, "play", PLAYER_TWO);
  const before = game.getCardInstanceIdsInZone("deck", PLAYER_TWO);
  for (const targets of [
    [own],
    [ward],
    [item],
    [location],
    [game.findCardInstanceId(weakEnemy, "hand", PLAYER_TWO)],
    [game.findCardInstanceId(weakEnemy, "discard", PLAYER_TWO)],
    [legal, strongEnemy],
  ]) {
    expect(game.asPlayerOne().playCard(aboveTheCrowd, { targets })).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(5);
    expect(game.asPlayerOne().getCardZone(aboveTheCrowd)).toBe("hand");
    expect(game.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual(before);
  }
  expect(game.asPlayerOne().playCard(aboveTheCrowd, { targets: [legal] })).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(legal)).toBe("deck");
});

it("accepts printed strength five reduced to three", () => {
  const enemy = createMockCharacter({ id: "crowd-five", name: "Five", cost: 1, strength: 5 });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [distract, aboveTheCrowd], inkwell: 7 },
    { play: [enemy], deck: 6 },
  );
  expect(game.asPlayerOne().playCard(distract, { targets: [enemy] })).toBeSuccessfulCommand();
  expect(game.asPlayerOne().playCard(aboveTheCrowd, { targets: [enemy] })).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(enemy)).toBe("deck");
});

it("rejects printed strength three increased to four", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [improvise, aboveTheCrowd], inkwell: 6, deck: 6 },
    { play: [weakEnemy], deck: 6 },
  );
  expect(game.asPlayerOne().playCard(improvise, { targets: [weakEnemy] })).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().playCard(aboveTheCrowd, { targets: [weakEnemy] }),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(5);
  expect(game.asPlayerTwo().getCardZone(weakEnemy)).toBe("play");
});

it("can be sung by a ready cost-five character with zero ink", () => {
  const singer = createMockCharacter({ id: "crowd-singer", name: "Singer", cost: 5 });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [aboveTheCrowd], play: [singer] },
    { play: [weakEnemy], deck: 6 },
  );
  const id = game.findCardInstanceId(singer, "play", PLAYER_ONE);
  expect(
    game
      .asPlayerOne()
      .playCard(aboveTheCrowd, { cost: { cost: "sing", singer: id }, targets: [weakEnemy] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().isExerted(singer)).toBe(true);
  expect(game.asPlayerTwo().getCardZone(weakEnemy)).toBe("deck");
});

it("rejects undercosted, drying and exerted singers without moving the target", () => {
  for (const [cost, isDrying, exerted] of [
    [4, false, false],
    [5, true, false],
    [5, false, true],
  ] as const) {
    const singer = createMockCharacter({
      id: `crowd-bad-singer-${cost}-${isDrying}-${exerted}`,
      name: "Singer",
      cost,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [aboveTheCrowd], play: [{ card: singer, isDrying, exerted }] },
      { play: [weakEnemy], deck: 6 },
    );
    const id = game.findCardInstanceId(singer, "play", PLAYER_ONE);
    expect(
      game
        .asPlayerOne()
        .playCard(aboveTheCrowd, { cost: { cost: "sing", singer: id }, targets: [weakEnemy] }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(aboveTheCrowd)).toBe("hand");
    expect(game.asPlayerTwo().getCardZone(weakEnemy)).toBe("play");
    expect(game.asPlayerOne().isExerted(singer)).toBe(exerted);
  }
});

it("requires five ink and can instead use five saved drops", () => {
  const poor = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [aboveTheCrowd], inkwell: 4 },
    { play: [weakEnemy] },
  );
  expect(
    poor.asPlayerOne().playCard(aboveTheCrowd, { targets: [weakEnemy] }),
  ).not.toBeSuccessfulCommand();
  expect(poor.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(4);
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [aboveTheCrowd], inkDrops: 5 },
    { play: [weakEnemy] },
  );
  expect(
    game.asPlayerOne().playCard(aboveTheCrowd, { targets: [weakEnemy], inkDrops: 5 }),
  ).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerTwo().getCardZone(weakEnemy)).toBe("deck");
});

it("can be played with no legal opposing target and does not move an own character", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [aboveTheCrowd], play: [weakEnemy], inkwell: 5 },
    { play: [strongEnemy], deck: 6 },
  );
  expect(game.asPlayerOne().playCard(aboveTheCrowd)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(weakEnemy)).toBe("play");
  expect(game.asPlayerTwo().getCardZone(strongEnemy)).toBe("play");
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
});

it("is inkable", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({ hand: [aboveTheCrowd] });
  expect(game.asPlayerOne().ink(aboveTheCrowd)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(aboveTheCrowd)).toBe("inkwell");
});

it("player two bottoms the opposing copy in its owner's deck using only their drops", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [weakEnemy], deck: 6, inkDrops: 2 },
    { hand: [aboveTheCrowd], play: [weakEnemy], deck: 6, inkDrops: 5 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const target = game.findCardInstanceId(weakEnemy, "play", PLAYER_ONE);
  const own = game.findCardInstanceId(weakEnemy, "play", PLAYER_TWO);
  const targetDeck = game.getCardInstanceIdsInZone("deck", PLAYER_ONE);
  const ownDeck = game.getCardInstanceIdsInZone("deck", PLAYER_TWO);
  expect(
    game.asPlayerTwo().playCard(aboveTheCrowd, { targets: [own], inkDrops: 5 }),
  ).not.toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(5);
  expect(
    game.asPlayerTwo().playCard(aboveTheCrowd, { targets: [target], inkDrops: 5 }),
  ).toBeSuccessfulCommand();
  expect(game.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual([target, ...targetDeck]);
  expect(game.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual(ownDeck);
  expect(game.asPlayerTwo().getCardZone(own)).toBe("play");
  expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
});

it("Player Two rejects a boosted opposing copy then accepts its reduced current Strength", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [weakEnemy], inkDrops: 2, deck: 6 },
    {
      play: [weakEnemy],
      hand: [improvise, distract, aboveTheCrowd],
      inkwell: 3,
      inkDrops: 5,
      deck: 6,
    },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const target = game.findCardInstanceId(weakEnemy, "play", PLAYER_ONE)!;
  const own = game.findCardInstanceId(weakEnemy, "play", PLAYER_TWO)!;
  const originalDeck = game.getCardInstanceIdsInZone("deck", PLAYER_ONE);
  expect(game.asPlayerTwo().playCard(improvise, { targets: [target] })).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardStrength(target)).toBe(4);
  expect(
    game.asPlayerTwo().playCard(aboveTheCrowd, { targets: [target], inkDrops: 5 }),
  ).not.toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(5);
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(2);
  expect(game.asPlayerTwo().getCardZone(aboveTheCrowd)).toBe("hand");
  expect(game.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(originalDeck);
  expect(game.asPlayerTwo().playCard(distract, { targets: [target] })).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardStrength(target)).toBe(2);
  expect(
    game.asPlayerTwo().playCard(aboveTheCrowd, { targets: [target], inkDrops: 5 }),
  ).toBeSuccessfulCommand();
  expect(game.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual([target, ...originalDeck]);
  expect(game.asPlayerTwo().getCardZone(own)).toBe("play");
  expect(game.asPlayerTwo().getCardStrength(own)).toBe(3);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
});
