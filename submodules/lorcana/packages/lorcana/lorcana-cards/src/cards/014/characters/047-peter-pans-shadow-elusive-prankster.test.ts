import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { evasive } from "../../../helpers/abilities/evasive";
import { peterPansShadowElusivePrankster } from "./047-peter-pans-shadow-elusive-prankster";

const plainOpponent = createMockCharacter({
  id: "shadow-plain-opponent",
  name: "Plain Opponent",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const evasiveOpponent = createMockCharacter({
  id: "shadow-evasive-opponent",
  name: "Evasive Opponent",
  cost: 2,
  strength: 2,
  willpower: 3,
  abilities: [evasive],
});

describe("Peter Pan's Shadow - Elusive Prankster", () => {
  it("has Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [peterPansShadowElusivePrankster],
      deck: 2,
    });

    expect(testEngine.hasKeyword(peterPansShadowElusivePrankster, "Evasive")).toBe(true);
  });

  it("exerts a chosen opposing character when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [peterPansShadowElusivePrankster],
        inkwell: peterPansShadowElusivePrankster.cost,
        deck: 2,
      },
      {
        play: [{ card: plainOpponent, isDrying: false }],
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(peterPansShadowElusivePrankster),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(peterPansShadowElusivePrankster, {
        resolveOptional: true,
        targets: [plainOpponent],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().isExerted(plainOpponent)).toBe(true);
  });

  it("can decline the exert, leaving the opposing character ready", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [peterPansShadowElusivePrankster],
        inkwell: peterPansShadowElusivePrankster.cost,
        deck: 2,
      },
      {
        play: [{ card: plainOpponent, isDrying: false }],
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(peterPansShadowElusivePrankster),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(peterPansShadowElusivePrankster, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().isExerted(plainOpponent)).toBe(false);
  });

  it("cannot be challenged by a character without Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: peterPansShadowElusivePrankster, exerted: true }],
        deck: 2,
      },
      {
        play: [{ card: plainOpponent, isDrying: false }],
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerTwo().challenge(plainOpponent, peterPansShadowElusivePrankster),
    ).not.toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(peterPansShadowElusivePrankster)).toBe("play");
  });

  it("can be challenged by an opposing Evasive character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: peterPansShadowElusivePrankster, exerted: true }],
        deck: 2,
      },
      {
        play: [{ card: evasiveOpponent, isDrying: false }],
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerTwo().challenge(evasiveOpponent, peterPansShadowElusivePrankster),
    ).toBeSuccessfulCommand();
    // 2 {S} vs 2 {W}: the Shadow is banished.
    expect(testEngine.asPlayerOne().getCardZone(peterPansShadowElusivePrankster)).toBe("discard");
  });
  it("rejects a friendly target without consuming the optional opposing choice", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [peterPansShadowElusivePrankster],
        play: [plainOpponent],
        inkwell: peterPansShadowElusivePrankster.cost,
        deck: [],
      },
      { play: [evasiveOpponent], deck: [] },
    );
    expect(engine.asPlayerOne().playCard(peterPansShadowElusivePrankster)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolvePendingByCard(peterPansShadowElusivePrankster, {
        resolveOptional: true,
        targets: [plainOpponent],
      }),
    ).not.toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolvePendingByCard(peterPansShadowElusivePrankster, {
        resolveOptional: true,
        targets: [evasiveOpponent],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.isExerted(plainOpponent)).toBe(false);
    expect(engine.isExerted(evasiveOpponent)).toBe(true);
  });

  it("lets player two exert only the selected opponent and enters with fresh ink", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [plainOpponent, evasiveOpponent], deck: 6 },
      {
        hand: [peterPansShadowElusivePrankster],
        inkwell: 3,
        deck: 6,
      },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().playCard(peterPansShadowElusivePrankster)).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(
      engine.asPlayerTwo().resolvePendingByCard(peterPansShadowElusivePrankster, {
        resolveOptional: true,
        targets: [plainOpponent],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.isExerted(plainOpponent)).toBe(true);
    expect(engine.isExerted(evasiveOpponent)).toBe(false);
    expect(engine.asPlayerTwo().getBagCount()).toBe(0);
    expect(engine.asPlayerTwo().quest(peterPansShadowElusivePrankster)).not.toBeSuccessfulCommand();
    expect(engine.hasKeyword(peterPansShadowElusivePrankster, "Evasive")).toBe(true);
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.isExerted(plainOpponent)).toBe(false);
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().quest(peterPansShadowElusivePrankster)).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_TWO)).toBe(1);
    expect(engine.getLore(PLAYER_ONE)).toBe(0);
  });

  it("can select an already exerted opponent without changing the other opponent", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [peterPansShadowElusivePrankster], inkwell: 3, deck: 6 },
      { play: [{ card: plainOpponent, exerted: true }, evasiveOpponent], deck: 6 },
    );
    expect(engine.asPlayerOne().playCard(peterPansShadowElusivePrankster)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolvePendingByCard(peterPansShadowElusivePrankster, {
        resolveOptional: true,
        targets: [plainOpponent],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.isExerted(plainOpponent)).toBe(true);
    expect(engine.isExerted(evasiveOpponent)).toBe(false);
    expect(engine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("can be played with no opposing characters and still enters play normally", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [peterPansShadowElusivePrankster],
      inkwell: peterPansShadowElusivePrankster.cost,
      deck: [],
    });
    expect(engine.asPlayerOne().playCard(peterPansShadowElusivePrankster)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(peterPansShadowElusivePrankster)).toBe("play");
    expect(engine.asPlayerOne().getBagCount()).toBe(0);
  });
});

it("Player Two's Evasive Shadow rejects a plain attacker but accepts an Evasive attacker", () => {
  const engine = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [plainOpponent, evasiveOpponent], deck: 6 },
    { play: [{ card: peterPansShadowElusivePrankster, exerted: true }], deck: 6 },
  );
  expect(
    engine.asPlayerOne().challenge(plainOpponent, peterPansShadowElusivePrankster),
  ).not.toBeSuccessfulCommand();
  expect(engine.isExerted(plainOpponent)).toBe(false);
  expect(
    engine.asPlayerOne().challenge(evasiveOpponent, peterPansShadowElusivePrankster),
  ).toBeSuccessfulCommand();
  expect(engine.asPlayerTwo().getCardZone(peterPansShadowElusivePrankster)).toBe("discard");
});

it("Player Two's no-opponent entry completes with no pending choice or fabricated exert outcome", () => {
  const engine = LorcanaMultiplayerTestEngine.createWithFixture(
    { deck: 6 },
    { hand: [peterPansShadowElusivePrankster], play: [plainOpponent], inkwell: 3, deck: 6 },
  );
  expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(engine.asPlayerTwo().playCard(peterPansShadowElusivePrankster)).toBeSuccessfulCommand();
  expect(engine.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(engine.isExerted(plainOpponent)).toBe(false);
  expect(engine.asPlayerTwo().getBagCount()).toBe(0);
  expect(engine.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  expect(
    engine
      .asServer()
      .getMoveLogHistory()
      .flatMap((log) => log.public)
      .filter((message) => message.key === "lorcana.outcome.cardExerted"),
  ).toHaveLength(0);
});
