import { describe, expect, it } from "bun:test";
// CR 8.6.1: only Evasive characters can challenge Evasive characters.
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { evasive } from "../../../helpers/abilities/evasive";
import { jasperDodgyBoater } from "./114-jasper-dodgy-boater";

const plainOpponent = createMockCharacter({
  id: "jasper-plain-opponent",
  name: "Plain Opponent",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const evasiveOpponent = createMockCharacter({
  id: "jasper-evasive-opponent",
  name: "Evasive Opponent",
  cost: 2,
  strength: 2,
  willpower: 3,
  abilities: [evasive],
});

describe("Jasper - Dodgy Boater", () => {
  it("has Evasive and cannot be challenged by a character without Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: jasperDodgyBoater, exerted: true }],
        deck: 1,
      },
      {
        play: [{ card: plainOpponent, isDrying: false }],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne()).toHaveKeyword({
      card: jasperDodgyBoater,
      keyword: "Evasive",
    });

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(plainOpponent, jasperDodgyBoater),
    ).not.toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(jasperDodgyBoater)).toBe("play");
    expect(testEngine.asPlayerOne().getDamage(jasperDodgyBoater)).toBe(0);
    expect(testEngine.asPlayerTwo().isExerted(plainOpponent)).toBe(false);
  });

  it("can be challenged by an opposing Evasive character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: jasperDodgyBoater, exerted: true }],
        deck: 1,
      },
      {
        play: [{ card: evasiveOpponent, isDrying: false }],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(evasiveOpponent, jasperDodgyBoater),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getDamage(jasperDodgyBoater)).toBe(2);
    expect(testEngine.asPlayerTwo().getCardZone(evasiveOpponent)).toBe("discard");
  });

  for (const opponent of [plainOpponent, evasiveOpponent]) {
    it(`can challenge ${opponent.name} and deal five printed damage`, () => {
      const sturdy = createMockCharacter({
        id: `${opponent.id}-sturdy`,
        name: opponent.name,
        cost: 2,
        strength: 2,
        willpower: 10,
        abilities: opponent.abilities,
      });
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: jasperDodgyBoater, isDrying: false }],
        },
        { play: [{ card: sturdy, exerted: true }] },
      );
      expect(game.asPlayerOne().challenge(jasperDodgyBoater, sturdy)).toBeSuccessfulCommand();
      expect(game.asPlayerTwo().getDamage(sturdy)).toBe(5);
      expect(game.asPlayerOne().getDamage(jasperDodgyBoater)).toBe(2);
      expect(game.asPlayerOne().isExerted(jasperDodgyBoater)).toBe(true);
    });
  }

  it("Evasive does not bypass the ready-defender limit", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: jasperDodgyBoater, isDrying: false }],
      },
      { play: [evasiveOpponent] },
    );
    expect(
      game.asPlayerOne().challenge(jasperDodgyBoater, evasiveOpponent),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().isExerted(jasperDodgyBoater)).toBe(false);
    expect(game.asPlayerTwo().getDamage(evasiveOpponent)).toBe(0);
  });

  it("pays five ink and must dry before questing or challenging", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [jasperDodgyBoater],
        inkwell: 5,
        deck: 3,
      },
      { deck: 3, play: [{ card: plainOpponent, exerted: true }] },
    );
    expect(game.asPlayerOne().playCard(jasperDodgyBoater)).toBeSuccessfulCommand();
    expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().getBagEffects()).toHaveLength(0);
    expect(game.asPlayerOne().quest(jasperDodgyBoater)).not.toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().challenge(jasperDodgyBoater, plainOpponent),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().hasKeyword(jasperDodgyBoater, "Evasive")).toBe(true);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().quest(jasperDodgyBoater)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(2);
  });

  it("rejects insufficient ink without payment", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [jasperDodgyBoater],
      inkwell: 4,
    });
    expect(game.asPlayerOne().playCard(jasperDodgyBoater)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(jasperDodgyBoater)).toBe("hand");
    expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(4);
  });

  it("can be put into the inkwell instead of played", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({ hand: [jasperDodgyBoater] });
    expect(
      game.asPlayerOne().putIntoInkwell(PLAYER_ONE, jasperDodgyBoater),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(jasperDodgyBoater)).toBe("inkwell");
  });
});

it("player two pays for Jasper, waits for drying and challenges an opposing plain character", () => {
  const sturdy = createMockCharacter({
    id: "jasper-p2-sturdy",
    name: "Sturdy",
    cost: 1,
    strength: 2,
    willpower: 10,
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [sturdy], inkwell: 5, deck: 6 },
    { hand: [jasperDodgyBoater], inkwell: 5, deck: 6 },
  );
  expect(game.asPlayerOne().quest(sturdy)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(jasperDodgyBoater)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getAvailableInk("player_two")).toBe(0);
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(5);
  expect(game.asPlayerTwo().challenge(jasperDodgyBoater, sturdy)).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().quest(jasperDodgyBoater)).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().quest(sturdy)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().hasKeyword(jasperDodgyBoater, "Evasive")).toBe(true);
  expect(game.asPlayerTwo().challenge(jasperDodgyBoater, sturdy)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getDamage(sturdy)).toBe(5);
  expect(game.asPlayerTwo().getDamage(jasperDodgyBoater)).toBe(2);
  expect(game.asPlayerTwo().isExerted(jasperDodgyBoater)).toBe(true);
});
