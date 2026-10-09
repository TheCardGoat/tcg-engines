import { describe, expect, it } from "bun:test";
import { fanTheFlames } from "../../001/actions/131-fan-the-flames";

import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { brooklynFullThrottle } from "./050-brooklyn-full-throttle";

describe("Brooklyn - Full Throttle", () => {
  it("WILD RIDE 6 — pays 6 {I} to gain 1 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [brooklynFullThrottle],
      inkwell: 6,
      deck: 2,
    });

    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);

    expect(
      testEngine.asPlayerOne().activateAbility(brooklynFullThrottle, {
        abilityIndex: 0,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
  });

  it("WILD RIDE 6 is not playable without 6 ready ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [brooklynFullThrottle],
      inkwell: 5,
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(brooklynFullThrottle, {
        abilityIndex: 0,
      }),
    ).not.toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
  });

  it("STONE BY DAY — does not ready while you have 3 or more cards in hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: brooklynFullThrottle, exerted: true }],
        hand: [brooklynFullThrottle, brooklynFullThrottle, brooklynFullThrottle],
        inkwell: brooklynFullThrottle.cost,
        deck: 2,
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(brooklynFullThrottle)).toBe(true);
  });

  it("readies normally while you have fewer than 3 cards in hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: brooklynFullThrottle, exerted: true }],
        hand: [brooklynFullThrottle],
        inkwell: brooklynFullThrottle.cost,
        deck: 2,
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(brooklynFullThrottle)).toBe(false);
  });
  it("can pay six ink repeatedly while exerted and drying, without an exert cost", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: brooklynFullThrottle, exerted: true, isDrying: true }],
      inkwell: 12,
      deck: [],
    });
    expect(
      engine.asPlayerOne().activateAbility(brooklynFullThrottle, { abilityIndex: 0 }),
    ).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().activateAbility(brooklynFullThrottle, { abilityIndex: 0 }),
    ).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_ONE)).toBe(2);
    expect(engine.isExerted(brooklynFullThrottle)).toBe(true);
    expect(
      engine.asPlayerOne().activateAbility(brooklynFullThrottle, { abilityIndex: 0 }),
    ).not.toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_ONE)).toBe(2);
  });

  it("can pay with five ready ink and an ink drop", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [brooklynFullThrottle],
      inkwell: 5,
      inkDrops: 1,
      deck: [],
    });
    expect(
      engine.asPlayerOne().activateAbility(brooklynFullThrottle, { abilityIndex: 0, inkDrops: 1 }),
    ).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_ONE)).toBe(1);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(0);
  });

  for (const handCount of [2, 3]) {
    it(
      "checks player-two ready before draw with " +
        handCount +
        " cards and permits ink-only activation",
      () => {
        const engine = LorcanaMultiplayerTestEngine.createWithFixture(
          { deck: 6 },
          {
            play: [{ card: brooklynFullThrottle, exerted: true }],
            hand: Array.from({ length: handCount }, () => brooklynFullThrottle),
            inkwell: 6,
            deck: 6,
          },
        );
        expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
        expect(engine.isExerted(brooklynFullThrottle)).toBe(handCount >= 3);
        expect(engine.asPlayerTwo().getZonesCardCount().hand).toBe(handCount + 1);
        expect(
          engine.asPlayerTwo().activateAbility(brooklynFullThrottle, { abilityIndex: 0 }),
        ).toBeSuccessfulCommand();
        expect(engine.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
        expect(engine.getLore(PLAYER_TWO)).toBe(1);
        expect(engine.getLore(PLAYER_ONE)).toBe(0);
        expect(engine.isExerted(brooklynFullThrottle)).toBe(handCount >= 3);
      },
    );
  }

  it("readies with two cards before the start-of-turn draw raises the count to three", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: brooklynFullThrottle, exerted: true }],
        hand: [brooklynFullThrottle, brooklynFullThrottle],
        deck: 2,
      },
      { deck: 2 },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.isExerted(brooklynFullThrottle)).toBe(false);
    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(3);
  });
});

it("Player Two activates twice while Fresh Ink using eleven ink and one drop", () => {
  const engine = LorcanaMultiplayerTestEngine.createWithFixture(
    { deck: 6 },
    { hand: [brooklynFullThrottle], inkwell: 12, inkDrops: 1, deck: 6 },
  );
  expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(engine.asPlayerTwo().playCard(brooklynFullThrottle)).toBeSuccessfulCommand();
  expect(
    engine.asPlayerTwo().activateAbility(brooklynFullThrottle, { abilityIndex: 0 }),
  ).toBeSuccessfulCommand();
  expect(engine.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(5);
  expect(
    engine.asPlayerTwo().activateAbility(brooklynFullThrottle, { abilityIndex: 0, inkDrops: 1 }),
  ).toBeSuccessfulCommand();
  expect(engine.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(engine.getInkDrops(PLAYER_TWO)).toBe(0);
  expect(engine.getLore(PLAYER_TWO)).toBe(2);
  expect(engine.getLore(PLAYER_ONE)).toBe(0);
  expect(engine.isExerted(brooklynFullThrottle)).toBe(false);
  expect(
    engine.asPlayerTwo().activateAbility(brooklynFullThrottle, { abilityIndex: 0 }),
  ).not.toBeSuccessfulCommand();
  expect(engine.getLore(PLAYER_TWO)).toBe(2);
});

it("Player Two cannot ready through an effect at three hand cards but can at two", () => {
  const engine = LorcanaMultiplayerTestEngine.createWithFixture(
    { deck: 6 },
    {
      play: [{ card: brooklynFullThrottle, exerted: true }],
      hand: [fanTheFlames, fanTheFlames, brooklynFullThrottle],
      inkwell: 2,
      deck: 6,
    },
  );
  expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(engine.isExerted(brooklynFullThrottle)).toBe(true);
  const fans = engine.getCardInstanceIdsInZone("hand", PLAYER_TWO).slice(0, 2);
  expect(
    engine.asPlayerTwo().playCard(fans[0], { targets: [brooklynFullThrottle] }),
  ).toBeSuccessfulCommand();
  expect(engine.asPlayerTwo().getZonesCardCount().hand).toBe(3);
  expect(engine.isExerted(brooklynFullThrottle)).toBe(true);
  expect(
    engine.asPlayerTwo().playCard(fans[1], { targets: [brooklynFullThrottle] }),
  ).toBeSuccessfulCommand();
  expect(engine.asPlayerTwo().getZonesCardCount().hand).toBe(2);
  expect(engine.isExerted(brooklynFullThrottle)).toBe(false);
});
