import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { hiroHamadaVersatileInventor } from "./071-hiro-hamada-versatile-inventor";

const wingmate = createMockCharacter({
  id: "hiro-test-wingmate",
  name: "Wingmate",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const plainOpponent = createMockCharacter({
  id: "hiro-test-plain-opponent",
  name: "Plain Opponent",
  cost: 2,
  strength: 2,
  willpower: 4,
});

describe("Hiro Hamada - Versatile Inventor", () => {
  // CR 8.6.1: Evasive limits who can challenge the source itself.
  it("printed Evasive rejects a plain attacker and permits an Evasive attacker", () => {
    const evasiveOpponent = createMockCharacter({
      id: "hiro-evasive-opponent",
      name: "Evasive Opponent",
      cost: 2,
      strength: 1,
      willpower: 4,
      abilities: [{ type: "keyword", keyword: "Evasive" }],
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: hiroHamadaVersatileInventor, exerted: true }], deck: 6 },
      { play: [plainOpponent, evasiveOpponent], deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().challenge(plainOpponent, hiroHamadaVersatileInventor),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().isExerted(plainOpponent)).toBe(false);
    expect(game.asPlayerOne().getCardZone(hiroHamadaVersatileInventor)).toBe("play");
    expect(
      game.asPlayerTwo().challenge(evasiveOpponent, hiroHamadaVersatileInventor),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(hiroHamadaVersatileInventor)).toBe("discard");
    expect(game.asPlayerTwo().getDamage(evasiveOpponent)).toBe(3);
  });

  it("can pay 1 {I} on play to give a chosen character of yours Evasive until your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [hiroHamadaVersatileInventor],
      play: [wingmate],
      inkwell: hiroHamadaVersatileInventor.cost + 1,
      deck: 2,
    });

    expect(testEngine.hasKeyword(wingmate, "Evasive")).toBe(false);
    expect(testEngine.asPlayerOne().playCard(hiroHamadaVersatileInventor)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(hiroHamadaVersatileInventor, {
        resolveOptional: true,
        targets: [wingmate],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.hasKeyword(wingmate, "Evasive")).toBe(true);
    expect(testEngine.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  });

  it("the granted Evasive expires at the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [hiroHamadaVersatileInventor],
      play: [wingmate],
      inkwell: hiroHamadaVersatileInventor.cost + 1,
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(hiroHamadaVersatileInventor)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(hiroHamadaVersatileInventor, {
        resolveOptional: true,
        targets: [wingmate],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.hasKeyword(wingmate, "Evasive")).toBe(true);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.hasKeyword(wingmate, "Evasive")).toBe(true);
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.hasKeyword(wingmate, "Evasive")).toBe(false);
  });

  it("can decline to pay, leaving the chosen character without Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [hiroHamadaVersatileInventor],
      play: [wingmate],
      inkwell: hiroHamadaVersatileInventor.cost + 1,
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(hiroHamadaVersatileInventor)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(hiroHamadaVersatileInventor, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.hasKeyword(wingmate, "Evasive")).toBe(false);
    expect(testEngine.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
  });

  it("cannot grant Evasive without 1 available {I}", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [hiroHamadaVersatileInventor],
      play: [wingmate],
      inkwell: hiroHamadaVersatileInventor.cost,
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(hiroHamadaVersatileInventor)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(hiroHamadaVersatileInventor, {
        resolveOptional: true,
        targets: [wingmate],
      }),
    ).not.toBeSuccessfulCommand();

    expect(testEngine.hasKeyword(wingmate, "Evasive")).toBe(false);
  });

  it("the boosted wingmate can only be challenged by an Evasive attacker", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [hiroHamadaVersatileInventor],
        play: [{ card: wingmate, exerted: true }],
        inkwell: hiroHamadaVersatileInventor.cost + 1,
        deck: 2,
      },
      {
        play: [{ card: plainOpponent, isDrying: false }],
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().playCard(hiroHamadaVersatileInventor)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(hiroHamadaVersatileInventor, {
        resolveOptional: true,
        targets: [wingmate],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().challenge(plainOpponent, wingmate)).not.toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(wingmate)).toBe("play");
  });
});

describe("Turbo Thrusters target boundaries", () => {
  it("rejects an opposing character without paying the extra ink", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [hiroHamadaVersatileInventor], play: [wingmate], inkwell: 3, deck: 6 },
      { play: [plainOpponent], deck: 6 },
    );
    expect(game.asPlayerOne().playCard(hiroHamadaVersatileInventor)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(hiroHamadaVersatileInventor, {
        resolveOptional: true,
        targets: [plainOpponent],
      }),
    ).not.toBeSuccessfulCommand();
    expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(game.hasKeyword(plainOpponent, "Evasive")).toBe(false);
    expect(
      game.asPlayerOne().resolvePendingByCard(hiroHamadaVersatileInventor, {
        resolveOptional: true,
        targets: [wingmate],
      }),
    ).toBeSuccessfulCommand();
    expect(game.hasKeyword(wingmate, "Evasive")).toBe(true);
  });

  it("can choose Hiro himself and preserves his printed Evasive after the grant expires", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [hiroHamadaVersatileInventor], inkwell: 3, deck: 6 },
      { deck: 6 },
    );
    expect(game.asPlayerOne().playCard(hiroHamadaVersatileInventor)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(hiroHamadaVersatileInventor, {
        resolveOptional: true,
        targets: [hiroHamadaVersatileInventor],
      }),
    ).toBeSuccessfulCommand();
    expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.hasKeyword(hiroHamadaVersatileInventor, "Evasive")).toBe(true);
  });
  it("an unaffordable trigger leaves normal play available", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [hiroHamadaVersatileInventor], play: [wingmate], inkwell: 2, deck: 6 },
      { deck: 6 },
    );
    expect(game.asPlayerOne().playCard(hiroHamadaVersatileInventor)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().getBagCount()).toBe(0);
    expect(game.hasKeyword(wingmate, "Evasive")).toBe(false);
    expect(game.asPlayerOne().quest(wingmate)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(wingmate.lore);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  });
  // CR 8.15: friendly Ward remains selectable; only the controller chooses.
  it("Player Two's exact copies grant friendly Ward, decline independently and expire on the owner's start", () => {
    const ward = createMockCharacter({
      id: "hiro-ward",
      name: "Ward Wingmate",
      cost: 2,
      abilities: [{ type: "keyword", keyword: "Ward" }],
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [wingmate], deck: 8 },
      {
        play: [ward],
        hand: [hiroHamadaVersatileInventor, hiroHamadaVersatileInventor],
        inkwell: 6,
        deck: 8,
      },
    );
    const hiros = game
      .getCardInstanceIdsInZone("hand", PLAYER_TWO)
      .filter(
        (id) =>
          game.asServer().getCardDefinitionByInstanceId(id).id === hiroHamadaVersatileInventor.id,
      );
    const wardId = game.findCardInstanceId(ward, "play", PLAYER_TWO);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(hiros[0]!)).toBeSuccessfulCommand();
    expect(
      game
        .asPlayerOne()
        .resolvePendingByCard(hiros[0]!, { resolveOptional: true, targets: [wardId] }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(4);
    expect(
      game
        .asPlayerTwo()
        .resolvePendingByCard(hiros[0]!, { resolveOptional: true, targets: [wardId] }),
    ).toBeSuccessfulCommand();
    expect(game.hasKeyword(wardId, "Evasive")).toBe(true);
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(3);
    expect(game.asPlayerTwo().playCard(hiros[1]!)).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().resolvePendingByCard(hiros[1]!, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(1);
    expect(game.hasKeyword(wingmate, "Evasive")).toBe(false);
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.hasKeyword(wardId, "Evasive")).toBe(true);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.hasKeyword(wardId, "Evasive")).toBe(false);
    for (const hiro of hiros) expect(game.hasKeyword(hiro, "Evasive")).toBe(true);
  });
});
