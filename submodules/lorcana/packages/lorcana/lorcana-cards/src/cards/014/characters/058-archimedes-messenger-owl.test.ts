import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockAction,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { archimedesMessengerOwl } from "./058-archimedes-messenger-owl";

const hawk = createMockCharacter({
  id: "owl-test-hawk",
  name: "Tall Hawk",
  cost: 4,
  strength: 5,
  willpower: 5,
});

describe("Archimedes - Messenger Owl", () => {
  it("has Rush and can challenge the turn it is played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [archimedesMessengerOwl],
        inkwell: archimedesMessengerOwl.cost,
        deck: 2,
      },
      {
        play: [{ card: hawk, exerted: true }],
        deck: 2,
      },
    );

    expect(testEngine.hasKeyword(archimedesMessengerOwl, "Rush")).toBe(true);

    expect(testEngine.asPlayerOne().playCard(archimedesMessengerOwl)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().challenge(archimedesMessengerOwl, hawk),
    ).toBeSuccessfulCommand();
  });

  it("gets its controller 1 ink drop when banished in a challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [archimedesMessengerOwl],
        inkwell: archimedesMessengerOwl.cost,
        deck: 2,
      },
      {
        play: [{ card: hawk, exerted: true }],
        deck: 2,
      },
    );

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(testEngine.getInkDrops(PLAYER_TWO)).toBe(0);

    expect(testEngine.asPlayerOne().playCard(archimedesMessengerOwl)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().challenge(archimedesMessengerOwl, hawk),
    ).toBeSuccessfulCommand();

    // 3 {S} < 5 {W}: the Owl is banished by the defender's reply.
    expect(testEngine.asPlayerOne().getCardZone(archimedesMessengerOwl)).toBe("discard");

    // THE INDIGNITY! queues in the bag; resolving it grants the ink drop.
    testEngine.asPlayerOne().resolveAllBagEffects({ maxIterations: 10 });

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(testEngine.getInkDrops(PLAYER_TWO)).toBe(0);
  });
  it("gives the defending controller the drop on the opponent's turn", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [hawk], deck: 3 },
      { play: [{ card: archimedesMessengerOwl, exerted: true }], deck: 3 },
    );
    expect(engine.asPlayerOne().challenge(hawk, archimedesMessengerOwl)).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getCardZone(archimedesMessengerOwl)).toBe("discard");
    expect(
      engine.asPlayerTwo().resolvePendingByCard(archimedesMessengerOwl),
    ).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(1);
  });

  it("does not grant a drop when banished by an action", () => {
    const banish = createMockAction({
      id: "owl-effect-banish",
      name: "Banish",
      cost: 1,
      text: "Banish chosen opposing character.",
      abilities: [
        {
          type: "action",
          effect: {
            type: "banish",
            target: {
              selector: "chosen",
              count: 1,
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
        },
      ],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [banish], inkwell: 1, deck: 3 },
      { play: [archimedesMessengerOwl], deck: 3 },
    );
    expect(
      engine.asPlayerOne().playCard(banish, { targets: [archimedesMessengerOwl] }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getCardZone(archimedesMessengerOwl)).toBe("discard");
    expect(engine.asPlayerOne().getBagCount()).toBe(0);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(0);
  });

  it("does not grant a drop for surviving a challenge", () => {
    const defender = createMockCharacter({
      id: "owl-surviving-challenge",
      cost: 1,
      name: "Defender",
      strength: 1,
      willpower: 5,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [archimedesMessengerOwl], inkwell: 3, deck: 3 },
      { play: [{ card: defender, exerted: true }], deck: 3 },
    );
    expect(engine.asPlayerOne().playCard(archimedesMessengerOwl)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().challenge(archimedesMessengerOwl, defender),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(archimedesMessengerOwl)).toBe("play");
    expect(engine.asPlayerOne().getDamage(archimedesMessengerOwl)).toBe(1);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(0);
  });

  it("Rush does not allow a new Owl to quest or challenge a ready character", () => {
    const song = createMockSong({
      id: "owl-song",
      name: "Song",
      cost: 1,
      text: "Draw a card.",
      abilities: [{ type: "action", effect: { type: "draw", amount: 1, target: "CONTROLLER" } }],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [archimedesMessengerOwl, song], inkwell: 3, deck: 3 },
      { play: [hawk], deck: 3 },
    );
    expect(engine.asPlayerOne().ink(archimedesMessengerOwl)).not.toBeSuccessfulCommand();
    expect(engine.asPlayerOne().playCard(archimedesMessengerOwl)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().quest(archimedesMessengerOwl)).not.toBeSuccessfulCommand();
    expect(engine.asPlayerOne().singSong(song, archimedesMessengerOwl)).not.toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().challenge(archimedesMessengerOwl, hawk),
    ).not.toBeSuccessfulCommand();
    expect(engine.asPlayerOne().isExerted(archimedesMessengerOwl)).toBe(false);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(0);
  });

  it("does not trigger when a different character is banished in a challenge", () => {
    const other = createMockCharacter({
      id: "owl-other-challenger",
      cost: 1,
      name: "Other",
      strength: 1,
      willpower: 1,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [archimedesMessengerOwl, other], deck: 3 },
      { play: [{ card: hawk, exerted: true }], deck: 3 },
    );
    expect(engine.asPlayerOne().challenge(other, hawk)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(other)).toBe("discard");
    expect(engine.asPlayerOne().getBagCount()).toBe(0);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(0);
  });
  it("player-two Rush banishment grants one spendable drop without changing opponent drops", () => {
    const purchase = createMockCharacter({ id: "owl-p2-purchase", name: "Purchase", cost: 1 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [hawk], inkDrops: 2, deck: 6 },
      { hand: [archimedesMessengerOwl, purchase], inkwell: 3, deck: 6 },
    );
    expect(engine.asPlayerOne().quest(hawk)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().playCard(archimedesMessengerOwl)).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(engine.asPlayerTwo().challenge(archimedesMessengerOwl, hawk)).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getCardZone(archimedesMessengerOwl)).toBe("discard");
    expect(engine.asPlayerOne().getDamage(hawk)).toBe(3);
    expect(engine.asPlayerTwo().getBagCount()).toBe(0);
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(engine.asPlayerTwo().playCard(purchase, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(0);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(engine.asPlayerTwo().getCardZone(purchase)).toBe("play");
  });
});

it("Player Two receives no drop for survival, another banishment, or effect banishment", () => {
  const weak = createMockCharacter({
    id: "owl-p2-weak",
    name: "Weak",
    cost: 1,
    strength: 1,
    willpower: 3,
  });
  const other = createMockCharacter({
    id: "owl-p2-other",
    name: "Other",
    cost: 1,
    strength: 1,
    willpower: 1,
  });
  const banish = createMockAction({
    id: "owl-p2-action",
    name: "Banish",
    cost: 1,
    text: "Banish chosen opposing character.",
    abilities: [
      {
        type: "action",
        effect: {
          type: "banish",
          target: {
            selector: "chosen",
            count: 1,
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
      },
    ],
  });
  const engine = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      play: [
        { card: weak, exerted: true },
        { card: hawk, exerted: true },
      ],
      hand: [banish],
      inkwell: 1,
      deck: 6,
    },
    { play: [archimedesMessengerOwl, other], deck: 6 },
  );
  expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(engine.asPlayerTwo().challenge(archimedesMessengerOwl, weak)).toBeSuccessfulCommand();
  expect(engine.asPlayerTwo().getCardZone(archimedesMessengerOwl)).toBe("play");
  expect(engine.asPlayerTwo().getDamage(archimedesMessengerOwl)).toBe(1);
  expect(engine.asPlayerTwo().challenge(other, hawk)).toBeSuccessfulCommand();
  expect(engine.asPlayerTwo().getCardZone(other)).toBe("discard");
  expect(engine.getInkDrops(PLAYER_TWO)).toBe(0);
  expect(engine.asPlayerTwo().getBagCount()).toBe(0);
  expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(
    engine.asPlayerOne().playCard(banish, { targets: [archimedesMessengerOwl] }),
  ).toBeSuccessfulCommand();
  expect(engine.asPlayerTwo().getCardZone(archimedesMessengerOwl)).toBe("discard");
  expect(engine.getInkDrops(PLAYER_TWO)).toBe(0);
  expect(engine.getInkDrops(PLAYER_ONE)).toBe(0);
  expect(engine.asPlayerOne().getBagCount()).toBe(0);
});
