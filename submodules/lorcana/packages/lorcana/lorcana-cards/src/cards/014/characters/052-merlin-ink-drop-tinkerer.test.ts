import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { khanTransportDelivery } from "../actions/199-khan-transport-delivery";
import { merlinInkDropTinkerer } from "./052-merlin-ink-drop-tinkerer";

const olderMerlin = createMockCharacter({
  id: "tinkerer-older-merlin",
  name: "Merlin",
  cost: 3,
  strength: 2,
  willpower: 3,
});

describe("Merlin - Ink Drop Tinkerer", () => {
  it("gets 1 ink drop when played without Shift", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [merlinInkDropTinkerer],
      inkwell: merlinInkDropTinkerer.cost,
      deck: 2,
    });

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(testEngine.asPlayerOne().playCard(merlinInkDropTinkerer)).toBeSuccessfulCommand();
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
  });

  it("gets 2 ink drops instead when played with Shift", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [olderMerlin],
      hand: [merlinInkDropTinkerer],
      inkwell: 5,
      deck: 2,
    });

    const shiftTarget = testEngine.findCardInstanceId(olderMerlin, "play", PLAYER_ONE);
    expect(
      testEngine.asPlayerOne().playCard(merlinInkDropTinkerer, {
        cost: {
          cost: "shift",
          shiftTarget,
        },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(2);
  });

  it("ink drops pay ink costs the same turn they are created", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [merlinInkDropTinkerer, khanTransportDelivery],
      inkwell: merlinInkDropTinkerer.cost + 1,
      deck: [olderMerlin, olderMerlin],
    });

    expect(testEngine.asPlayerOne().playCard(merlinInkDropTinkerer)).toBeSuccessfulCommand();
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);

    // Only 1 ready ink remains; Khan Transport Delivery (cost 2) needs 1 more
    // {I} — exactly the freshly gained ink drop.
    expect(
      testEngine.asPlayerOne().playCard(khanTransportDelivery, { inkDrops: 1 }),
    ).toBeSuccessfulCommand();
    // 1 drop removed to pay + 1 gained from Khan Transport Delivery itself.
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
  });

  it("unspent ink drops persist into later turns", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [merlinInkDropTinkerer],
      inkwell: merlinInkDropTinkerer.cost,
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(merlinInkDropTinkerer)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
  });
  it("Shift requires five ink and a friendly character named Merlin", () => {
    for (const kind of ["insufficient-ink", "wrong-name", "opponent-target"] as const) {
      const wrongName = createMockCharacter({ id: "merlin-wrong-name", name: "Arthur", cost: 2 });
      const target = kind === "wrong-name" ? wrongName : olderMerlin;
      const opponentTarget = kind === "opponent-target";
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [merlinInkDropTinkerer],
          play: opponentTarget ? [] : [target],
          inkwell: kind === "insufficient-ink" ? 4 : 5,
          deck: [],
        },
        { play: opponentTarget ? [target] : [], deck: [] },
      );
      const shiftTarget = engine.findCardInstanceId(
        target,
        "play",
        opponentTarget ? PLAYER_TWO : PLAYER_ONE,
      );
      expect(
        engine
          .asPlayerOne()
          .playCard(merlinInkDropTinkerer, { cost: { cost: "shift", shiftTarget } }),
      ).not.toBeSuccessfulCommand();
      expect(engine.asPlayerOne().getCardZone(merlinInkDropTinkerer)).toBe("hand");
      expect(engine.getInkDrops(PLAYER_ONE)).toBe(0);
      expect(engine.getInkDrops(PLAYER_TWO)).toBe(0);
    }
  });

  it("Shift preserves exerted state and gives exactly two drops to its controller", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [merlinInkDropTinkerer],
      play: [{ card: olderMerlin, exerted: true, isDrying: false }],
      inkwell: 5,
      deck: [],
    });
    const shiftTarget = engine.findCardInstanceId(olderMerlin, "play", PLAYER_ONE);
    expect(
      engine
        .asPlayerOne()
        .playCard(merlinInkDropTinkerer, { cost: { cost: "shift", shiftTarget } }),
    ).toBeSuccessfulCommand();
    expect(engine.isExerted(merlinInkDropTinkerer)).toBe(true);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(0);
  });
  it("player-two Shift retains damage and dry state and spends both new drops immediately", () => {
    const purchase = createMockCharacter({ id: "merlin-p2-purchase", name: "Purchase", cost: 2 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { inkDrops: 3, deck: 6 },
      {
        play: [{ card: olderMerlin, damage: 1, isDrying: false }],
        hand: [merlinInkDropTinkerer, purchase],
        inkwell: 5,
        deck: 6,
      },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const shiftTarget = engine.findCardInstanceId(olderMerlin, "play", PLAYER_TWO);
    expect(
      engine
        .asPlayerTwo()
        .playCard(merlinInkDropTinkerer, { cost: { cost: "shift", shiftTarget } }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(engine.asPlayerTwo().getCard(merlinInkDropTinkerer).damage).toBe(1);
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(2);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(3);
    expect(engine.asPlayerTwo().quest(merlinInkDropTinkerer)).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_TWO)).toBe(3);
    expect(engine.asPlayerTwo().playCard(purchase, { inkDrops: 2 })).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(0);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(3);
    expect(engine.asPlayerTwo().getCardZone(purchase)).toBe("play");
  });
});

it("Player Two normal entry grants one controller drop that pays a card immediately", () => {
  const purchase = createMockCharacter({ id: "tinkerer-p2-one-drop", name: "Purchase", cost: 1 });
  const engine = LorcanaMultiplayerTestEngine.createWithFixture(
    { inkDrops: 3, deck: 6 },
    { hand: [merlinInkDropTinkerer, purchase], inkwell: 7, deck: 6 },
  );
  expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(engine.asPlayerTwo().playCard(merlinInkDropTinkerer)).toBeSuccessfulCommand();
  expect(engine.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(engine.getInkDrops(PLAYER_TWO)).toBe(1);
  expect(engine.getInkDrops(PLAYER_ONE)).toBe(3);
  expect(engine.asPlayerTwo().playCard(purchase, { inkDrops: 1 })).toBeSuccessfulCommand();
  expect(engine.getInkDrops(PLAYER_TWO)).toBe(0);
  expect(engine.getInkDrops(PLAYER_ONE)).toBe(3);
  expect(engine.asPlayerTwo().getCardZone(purchase)).toBe("play");
});

it("Player Two mixed Shift payment preserves exertion and damage and grants only two drops", () => {
  const engine = LorcanaMultiplayerTestEngine.createWithFixture(
    { inkDrops: 3, deck: 6 },
    {
      play: [{ card: olderMerlin, damage: 1, isDrying: false }],
      hand: [merlinInkDropTinkerer],
      inkwell: 4,
      inkDrops: 1,
      deck: 6,
    },
  );
  expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(engine.asPlayerTwo().quest(olderMerlin)).toBeSuccessfulCommand();
  const shiftTarget = engine.findCardInstanceId(olderMerlin, "play", PLAYER_TWO);
  expect(
    engine
      .asPlayerTwo()
      .playCard(merlinInkDropTinkerer, { cost: { cost: "shift", shiftTarget }, inkDrops: 1 }),
  ).toBeSuccessfulCommand();
  expect(engine.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(engine.isExerted(merlinInkDropTinkerer)).toBe(true);
  expect(engine.asPlayerTwo().getCard(merlinInkDropTinkerer).damage).toBe(1);
  expect(engine.getInkDrops(PLAYER_TWO)).toBe(2);
  expect(engine.getInkDrops(PLAYER_ONE)).toBe(3);
  expect(engine.asPlayerTwo().quest(merlinInkDropTinkerer)).not.toBeSuccessfulCommand();
});
