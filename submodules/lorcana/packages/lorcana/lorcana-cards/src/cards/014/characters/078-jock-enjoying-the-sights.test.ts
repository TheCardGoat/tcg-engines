import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { evasive } from "../../../helpers/abilities/evasive";
import { jockEnjoyingTheSights } from "./078-jock-enjoying-the-sights";

const plainOpponent = createMockCharacter({
  id: "jock-plain-opponent",
  name: "Plain Opponent",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const evasiveOpponent = createMockCharacter({
  id: "jock-evasive-opponent",
  name: "Evasive Opponent",
  cost: 2,
  strength: 2,
  willpower: 3,
  abilities: [evasive],
});

describe("Jock - Enjoying the Sights", () => {
  it("has Evasive and cannot be challenged by a character without Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: jockEnjoyingTheSights, exerted: true }],
        deck: 6,
      },
      {
        play: [{ card: plainOpponent, isDrying: false }],
        deck: 6,
      },
    );

    const cardUnderTest = testEngine.asPlayerOne();
    expect(cardUnderTest).toHaveKeyword({
      card: jockEnjoyingTheSights,
      keyword: "Evasive",
    });

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(plainOpponent, jockEnjoyingTheSights),
    ).not.toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(jockEnjoyingTheSights)).toBe("play");
    expect(testEngine.asPlayerOne().getDamage(jockEnjoyingTheSights)).toBe(0);
    expect(testEngine.asPlayerTwo().isExerted(plainOpponent)).toBe(false);
  });

  it("can be challenged by an opposing Evasive character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: jockEnjoyingTheSights, exerted: true }],
        deck: 6,
      },
      {
        play: [{ card: evasiveOpponent, isDrying: false }],
        deck: 6,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(evasiveOpponent, jockEnjoyingTheSights),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getDamage(jockEnjoyingTheSights)).toBe(2);
    expect(testEngine.asPlayerTwo().getCardZone(evasiveOpponent)).toBe("discard");
  });
});

for (const defender of [plainOpponent, evasiveOpponent]) {
  it(`can challenge an exerted ${defender.name} and deals four damage`, () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: jockEnjoyingTheSights, isDrying: false }], deck: 6 },
      { play: [{ card: defender, exerted: true }], deck: 6 },
    );
    expect(game.asPlayerOne().challenge(jockEnjoyingTheSights, defender)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(defender)).toBe("discard");
    expect(game.asPlayerOne().getDamage(jockEnjoyingTheSights)).toBe(2);
    expect(game.asPlayerOne().isExerted(jockEnjoyingTheSights)).toBe(true);
  });
}
it("quests for one lore and cannot quest again while exerted", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [{ card: jockEnjoyingTheSights, isDrying: false }],
    deck: 6,
  });
  expect(game.asPlayerOne().quest(jockEnjoyingTheSights)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(1);
  expect(game.asPlayerOne().quest(jockEnjoyingTheSights)).not.toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(1);
});
it("still cannot be challenged while ready even by an Evasive character", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [jockEnjoyingTheSights], deck: 6 },
    { play: [{ card: evasiveOpponent, isDrying: false }], deck: 6 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().challenge(evasiveOpponent, jockEnjoyingTheSights),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getDamage(jockEnjoyingTheSights)).toBe(0);
});

for (const defender of [plainOpponent, evasiveOpponent]) {
  it(`player two can challenge an exerted ${defender.name} with Jock`, () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: defender, exerted: true }], deck: 6 },
      { play: [{ card: jockEnjoyingTheSights, isDrying: false }], deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().challenge(jockEnjoyingTheSights, defender)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(defender)).toBe("discard");
    expect(game.asPlayerTwo().getDamage(jockEnjoyingTheSights)).toBe(2);
    expect(game.asPlayerTwo().isExerted(jockEnjoyingTheSights)).toBe(true);
    expect(game.asPlayerTwo().quest(jockEnjoyingTheSights)).not.toBeSuccessfulCommand();
  });
}
