// CR 6.5.3-6.5.6: check existing damage before the event; replace three with five once.
// CR 8.8.1-8.8.2: Resist reduces the resulting damage; zero deals no damage.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
  createMockCharacter,
  createMockItem,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { edgarBalthazarLongsufferingButler } from "../characters/173-edgar-balthazar-long-suffering-butler";
import { wasabiFutureThinker } from "../characters/139-wasabi-future-thinker";
import { airDrop } from "./094-air-drop";

const freshTarget = createMockCharacter({
  id: "air-drop-fresh",
  name: "Fresh Target",
  cost: 3,
  strength: 1,
  willpower: 9,
});

const damagedTarget = createMockCharacter({
  id: "air-drop-damaged",
  name: "Damaged Target",
  cost: 3,
  strength: 1,
  willpower: 9,
});

describe("Air Drop", () => {
  it("deals 3 damage to an undamaged chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [airDrop],
        inkwell: airDrop.cost,
      },
      {
        play: [freshTarget],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(airDrop, { targets: [freshTarget] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveDamage({ card: freshTarget, value: 3 });
  });

  it("deals 5 damage instead when the chosen character already has damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [airDrop],
        inkwell: airDrop.cost,
      },
      {
        play: [{ card: damagedTarget, damage: 1 }],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(airDrop, { targets: [damagedTarget] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveDamage({ card: damagedTarget, value: 6 });
  });
});

it("can damage your own chosen character", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [airDrop],
    play: [freshTarget],
    inkwell: 4,
  });
  expect(game.asPlayerOne().playCard(airDrop, { targets: [freshTarget] })).toBeSuccessfulCommand();
  expect(game.asPlayerOne()).toHaveDamage({ card: freshTarget, value: 3 });
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne().getCardZone(airDrop)).toBe("discard");
});

it("rejects opposing Ward but permits your own Ward", () => {
  const ward = createMockCharacter({
    id: "air-ward",
    name: "Ward",
    cost: 1,
    willpower: 9,
    abilities: [{ type: "keyword", keyword: "Ward" }],
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [airDrop], play: [ward], inkwell: 4 },
    { play: [ward] },
  );
  const own = game.findCardInstanceId(ward, "play", PLAYER_ONE);
  const enemy = game.findCardInstanceId(ward, "play", PLAYER_TWO);
  expect(game.asPlayerOne().playCard(airDrop, { targets: [enemy] })).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(4);
  expect(game.asPlayerOne().getCardZone(airDrop)).toBe("hand");
  expect(game.asPlayerOne().playCard(airDrop, { targets: [own] })).toBeSuccessfulCommand();
  expect(game.asPlayerOne()).toHaveDamage({ card: own, value: 3 });
});

for (const initial of [0, 1]) {
  it(`reduces the ${initial ? "five" : "three"} damage event with Resist +2`, () => {
    const resist = createMockCharacter({
      id: `air-resist-${initial}`,
      name: "Resist",
      cost: 1,
      willpower: 9,
      abilities: [{ type: "keyword", keyword: "Resist", value: 2 }],
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [airDrop], inkwell: 4 },
      { play: [{ card: resist, damage: initial }] },
    );
    expect(game.asPlayerOne().playCard(airDrop, { targets: [resist] })).toBeSuccessfulCommand();
    expect(game.asPlayerOne()).toHaveDamage({ card: resist, value: initial + (initial ? 3 : 1) });
  });
}

it("a fully resisted first hit does not make the next hit deal five", () => {
  const resist = createMockCharacter({
    id: "air-resist-zero",
    name: "Resist",
    cost: 1,
    willpower: 9,
    abilities: [{ type: "keyword", keyword: "Resist", value: 3 }],
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [airDrop, airDrop], inkwell: 8 },
    { play: [resist] },
  );
  for (let i = 0; i < 2; i++) {
    expect(game.asPlayerOne().playCard(airDrop, { targets: [resist] })).toBeSuccessfulCommand();
    expect(game.asPlayerOne()).toHaveDamage({ card: resist, value: 0 });
  }
});

it("a second play sees the first hit's damage and deals five rather than eight", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [airDrop, airDrop], inkwell: 8 },
    { play: [freshTarget] },
  );
  expect(game.asPlayerOne().playCard(airDrop, { targets: [freshTarget] })).toBeSuccessfulCommand();
  expect(game.asPlayerOne()).toHaveDamage({ card: freshTarget, value: 3 });
  expect(game.asPlayerOne().playCard(airDrop, { targets: [freshTarget] })).toBeSuccessfulCommand();
  expect(game.asPlayerOne()).toHaveDamage({ card: freshTarget, value: 8 });
  expect(game.asPlayerOne().getCardZone(freshTarget)).toBe("play");
});

for (const initial of [0, 1]) {
  it(`banishes a character at the ${initial ? "five" : "three"}-damage lethal threshold`, () => {
    const victim = createMockCharacter({
      id: `air-lethal-${initial}`,
      name: "Victim",
      cost: 1,
      willpower: initial ? 6 : 3,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [airDrop], inkwell: 4 },
      { play: [{ card: victim, damage: initial }] },
    );
    expect(game.asPlayerOne().playCard(airDrop, { targets: [victim] })).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(victim)).toBe("discard");
  });
}

it("rejects items, locations, out-of-play cards and multiple targets before payment", () => {
  const item = createMockItem({ id: "air-item", name: "Item", cost: 1 });
  const location = createMockLocation({ id: "air-location", name: "Location", cost: 1 });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [airDrop, damagedTarget], discard: [damagedTarget], inkwell: 4 },
    { play: [freshTarget, damagedTarget, item, location] },
  );
  for (const targets of [
    [item],
    [location],
    [game.findCardInstanceId(damagedTarget, "hand", PLAYER_ONE)],
    [game.findCardInstanceId(damagedTarget, "discard", PLAYER_ONE)],
    [freshTarget, damagedTarget],
  ]) {
    expect(game.asPlayerOne().playCard(airDrop, { targets })).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(4);
    expect(game.asPlayerOne().getCardZone(airDrop)).toBe("hand");
    expect(game.asPlayerOne()).toHaveDamage({ card: freshTarget, value: 0 });
  }
  expect(game.asPlayerOne().playCard(airDrop, { targets: [freshTarget] })).toBeSuccessfulCommand();
  expect(game.asPlayerOne()).toHaveDamage({ card: freshTarget, value: 3 });
});

it("requires four ink and can pay entirely with saved drops", () => {
  const poor = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [airDrop], inkwell: 3 },
    { play: [freshTarget] },
  );
  expect(
    poor.asPlayerOne().playCard(airDrop, { targets: [freshTarget] }),
  ).not.toBeSuccessfulCommand();
  expect(poor.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(3);
  expect(poor.asPlayerOne()).toHaveDamage({ card: freshTarget, value: 0 });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [airDrop], inkDrops: 4 },
    { play: [freshTarget] },
  );
  expect(
    game.asPlayerOne().playCard(airDrop, { targets: [freshTarget], inkDrops: 4 }),
  ).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne()).toHaveDamage({ card: freshTarget, value: 3 });
});

it("checks current damage after healing rather than prior damage history", () => {
  const heal = createMockAction({
    id: "air-heal",
    name: "Heal",
    cost: 1,
    abilities: [
      { type: "action", effect: { type: "remove-damage", amount: 1, target: "CHOSEN_CHARACTER" } },
    ],
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [heal, airDrop],
    play: [{ card: freshTarget, damage: 1 }],
    inkwell: 5,
  });
  expect(game.asPlayerOne().playCard(heal, { targets: [freshTarget] })).toBeSuccessfulCommand();
  expect(game.asPlayerOne()).toHaveDamage({ card: freshTarget, value: 0 });
  expect(game.asPlayerOne().playCard(airDrop, { targets: [freshTarget] })).toBeSuccessfulCommand();
  expect(game.asPlayerOne()).toHaveDamage({ card: freshTarget, value: 3 });
});

it("can play with no legal character and resolves without damage", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({ hand: [airDrop], inkwell: 4 });
  expect(game.asPlayerOne().playCard(airDrop)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne().getCardZone(airDrop)).toBe("discard");
  expect(game.asPlayerOne().getBagCount()).toBe(0);
});

it("can be put into the inkwell", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({ hand: [airDrop] });
  expect(game.asPlayerOne().ink(airDrop)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(airDrop)).toBe("inkwell");
});

for (const initial of [0, 1]) {
  it(`player two pays saved drops and applies ${initial ? 5 : 3} damage to the selected opposing copy`, () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: freshTarget, damage: initial }], inkDrops: 2, deck: 6 },
      { hand: [airDrop], play: [freshTarget], inkDrops: 4, deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const enemy = game.findCardInstanceId(freshTarget, "play", PLAYER_ONE);
    const own = game.findCardInstanceId(freshTarget, "play", PLAYER_TWO);
    expect(
      game.asPlayerTwo().playCard(airDrop, { targets: [enemy], inkDrops: 4 }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne()).toHaveDamage({ card: enemy, value: initial ? 6 : 3 });
    expect(game.asPlayerTwo()).toHaveDamage({ card: own, value: 0 });
    expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(game.asPlayerTwo().getCardZone(airDrop)).toBe("discard");
  });
}

it("Player Two fully prevents repeated three-damage hits with real stacked Resist", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [edgarBalthazarLongsufferingButler], inkDrops: 2, deck: 6 },
    {
      play: [edgarBalthazarLongsufferingButler],
      hand: [wasabiFutureThinker, airDrop, airDrop],
      inkwell: 4,
      inkDrops: 9,
      deck: 6,
    },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const own = game.findCardInstanceId(edgarBalthazarLongsufferingButler, "play", PLAYER_TWO)!;
  const enemy = game.findCardInstanceId(edgarBalthazarLongsufferingButler, "play", PLAYER_ONE)!;
  expect(game.asPlayerTwo().playCard(wasabiFutureThinker, { inkDrops: 1 })).toBeSuccessfulCommand();
  expect(game.asPlayerTwo()).toHaveKeyword({ card: own, keyword: "Resist", value: 3 });
  for (const remaining of [4, 0]) {
    const action = game.findCardInstanceId(airDrop, "hand", PLAYER_TWO)!;
    expect(
      game.asPlayerTwo().playCard(action, { targets: [own], inkDrops: 4 }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo()).toHaveDamage({ card: own, value: 0 });
    expect(game.asPlayerTwo()).toHaveKeyword({ card: own, keyword: "Resist", value: 3 });
    expect(game.getInkDrops(PLAYER_TWO)).toBe(remaining);
  }
  expect(game.asPlayerOne()).toHaveDamage({ card: enemy, value: 0 });
  expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
});

it("Player Two pays saved drops with only opposing Ward and resolves without damage", () => {
  const ward = createMockCharacter({
    id: "air-only-ward",
    name: "Only Ward",
    cost: 1,
    willpower: 9,
    abilities: [{ type: "keyword", keyword: "Ward" }],
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [ward], inkDrops: 2, deck: 6 },
    { hand: [airDrop], inkDrops: 4, deck: 6 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(airDrop, { inkDrops: 4 })).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
  expect(game.asPlayerOne()).toHaveDamage({ card: ward, value: 0 });
  expect(game.asPlayerTwo().getCardZone(airDrop)).toBe("discard");
  expect(game.asPlayerTwo().getBagCount()).toBe(0);
});
