// Rules grounding: Hyperia City ink-drop mechanic — each ink drop may be
// removed to pay 1 {I} of any color; drops persist between turns.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { kitCloudkickerIrrepressibleBear } from "./074-kit-cloudkicker-irrepressible-bear";

describe("Kit Cloudkicker - Irrepressible Bear", () => {
  it("LUCKY DAY gives you and another chosen player 1 ink drop each when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [kitCloudkickerIrrepressibleBear],
      inkwell: kitCloudkickerIrrepressibleBear.cost,
      deck: 6,
    });

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(testEngine.getInkDrops(PLAYER_TWO)).toBe(0);

    expect(
      testEngine.asPlayerOne().playCard(kitCloudkickerIrrepressibleBear),
    ).toBeSuccessfulCommand();

    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(kitCloudkickerIrrepressibleBear, { targets: [PLAYER_TWO] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(testEngine.getInkDrops(PLAYER_TWO)).toBe(1);
  });

  it("ink drops persist across turns until spent", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [kitCloudkickerIrrepressibleBear],
      inkwell: kitCloudkickerIrrepressibleBear.cost,
      deck: 6,
    });

    expect(
      testEngine.asPlayerOne().playCard(kitCloudkickerIrrepressibleBear),
    ).toBeSuccessfulCommand();
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(kitCloudkickerIrrepressibleBear, { targets: [PLAYER_TWO] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(testEngine.getInkDrops(PLAYER_TWO)).toBe(1);
  });
});

it("rejects choosing yourself as the other player before granting any drops", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      hand: [kitCloudkickerIrrepressibleBear],
      inkwell: kitCloudkickerIrrepressibleBear.cost,
      deck: 6,
    },
    { deck: 6 },
  );
  expect(game.asPlayerOne().playCard(kitCloudkickerIrrepressibleBear)).toBeSuccessfulCommand();
  expect(
    game
      .asPlayerOne()
      .resolvePendingByCard(kitCloudkickerIrrepressibleBear, { targets: [PLAYER_ONE] }),
  ).not.toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
  expect(
    game
      .asPlayerOne()
      .resolvePendingByCard(kitCloudkickerIrrepressibleBear, { targets: [PLAYER_TWO] }),
  ).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
});

it("adds exactly one to each existing pool on every play", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      hand: [kitCloudkickerIrrepressibleBear, kitCloudkickerIrrepressibleBear],
      inkwell: kitCloudkickerIrrepressibleBear.cost * 2,
      inkDrops: 2,
      deck: 6,
    },
    { inkDrops: 3, deck: 6 },
  );
  const copies = game.getCardInstanceIdsInZone("hand", PLAYER_ONE);
  for (const [index, copy] of copies.entries()) {
    const expected = index + 3;
    expect(game.asPlayerOne().playCard(copy)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(copy, { targets: [PLAYER_TWO] }),
    ).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(expected);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(expected + 1);
  }
});

it("cannot use its future reward to pay its play cost", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      hand: [kitCloudkickerIrrepressibleBear],
      inkwell: kitCloudkickerIrrepressibleBear.cost - 1,
      deck: 6,
    },
    { deck: 6 },
  );
  expect(game.asPlayerOne().playCard(kitCloudkickerIrrepressibleBear)).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(kitCloudkickerIrrepressibleBear)).toBe("hand");
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
});

it("player two pays with saved drops and can spend the reward immediately", () => {
  const purchase = createMockCharacter({
    id: "kit-player-two-purchase",
    name: "Purchase",
    cost: 1,
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { inkDrops: 4, deck: 6 },
    { hand: [kitCloudkickerIrrepressibleBear, purchase], inkwell: 1, inkDrops: 2, deck: 6 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().playCard(kitCloudkickerIrrepressibleBear, { inkDrops: 2 }),
  ).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
  expect(
    game
      .asPlayerTwo()
      .resolvePendingByCard(kitCloudkickerIrrepressibleBear, { targets: [PLAYER_TWO] }),
  ).not.toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(4);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
  expect(
    game
      .asPlayerTwo()
      .resolvePendingByCard(kitCloudkickerIrrepressibleBear, { targets: [PLAYER_ONE] }),
  ).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(5);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(game.asPlayerTwo().playCard(purchase, { inkDrops: 1 })).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(5);
  expect(game.asPlayerTwo().getCardZone(purchase)).toBe("play");
});

it("Player Two's exact entries keep independent choices and both pools persist", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { inkDrops: 4, deck: 6 },
    {
      hand: [kitCloudkickerIrrepressibleBear, kitCloudkickerIrrepressibleBear],
      inkwell: kitCloudkickerIrrepressibleBear.cost * 2,
      inkDrops: 2,
      deck: 6,
    },
  );
  const copies = game.getCardInstanceIdsInZone("hand", PLAYER_TWO);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  for (const [index, copy] of copies.entries()) {
    expect(game.asPlayerTwo().playCard(copy)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(copy, { targets: [PLAYER_ONE] }),
    ).not.toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(4 + index);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(2 + index);
    expect(
      game.asPlayerTwo().resolvePendingByCard(copy, { targets: [PLAYER_ONE] }),
    ).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(5 + index);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(3 + index);
  }
  expect(game.asPlayerTwo().getBagCount()).toBe(0);
  expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(6);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(4);
});
