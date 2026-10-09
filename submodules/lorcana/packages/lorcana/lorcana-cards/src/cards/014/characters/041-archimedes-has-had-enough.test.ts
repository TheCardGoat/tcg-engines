import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { evasive } from "../../../helpers/abilities/evasive";
import { archimedesHasHadEnough } from "./041-archimedes-has-had-enough";

const plainOpponent = createMockCharacter({
  id: "archimedes-plain-opponent",
  name: "Plain Opponent",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const evasiveOpponent = createMockCharacter({
  id: "archimedes-evasive-opponent",
  name: "Evasive Opponent",
  cost: 2,
  strength: 2,
  willpower: 3,
  abilities: [evasive],
});

describe("Archimedes - Has Had Enough", () => {
  it("protects player two's defender from plain attackers while allowing Evasive attackers", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [plainOpponent, evasiveOpponent], deck: 6 },
      { play: [{ card: archimedesHasHadEnough, exerted: true }], deck: 6 },
    );

    expect(
      engine.asPlayerOne().challenge(plainOpponent, archimedesHasHadEnough),
    ).not.toBeSuccessfulCommand();
    expect(engine.isExerted(plainOpponent)).toBe(false);
    expect(engine.asPlayerOne().getDamage(plainOpponent)).toBe(0);
    expect(engine.asPlayerTwo().getDamage(archimedesHasHadEnough)).toBe(0);

    expect(
      engine.asPlayerOne().challenge(evasiveOpponent, archimedesHasHadEnough),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getDamage(evasiveOpponent)).toBe(2);
    expect(engine.asPlayerTwo().getDamage(archimedesHasHadEnough)).toBe(2);
    expect(engine.asPlayerTwo().getCardZone(archimedesHasHadEnough)).toBe("play");
    expect(engine.isExerted(evasiveOpponent)).toBe(true);
    expect(engine.isExerted(plainOpponent)).toBe(false);
  });

  it("has Evasive and cannot be challenged by a character without Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: archimedesHasHadEnough, exerted: true }],
        deck: 1,
      },
      {
        play: [{ card: plainOpponent, isDrying: false }],
        deck: 1,
      },
    );

    const cardUnderTest = testEngine.asPlayerOne();
    expect(cardUnderTest).toHaveKeyword({
      card: archimedesHasHadEnough,
      keyword: "Evasive",
    });

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(plainOpponent, archimedesHasHadEnough),
    ).not.toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(archimedesHasHadEnough)).toBe("play");
    expect(testEngine.isExerted(plainOpponent)).toBe(false);
    expect(testEngine.asPlayerOne().getDamage(archimedesHasHadEnough)).toBe(0);
    expect(testEngine.asPlayerTwo().getDamage(plainOpponent)).toBe(0);
  });

  it("can be challenged by an opposing Evasive character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: archimedesHasHadEnough, exerted: true }],
        deck: 1,
      },
      {
        play: [{ card: evasiveOpponent, isDrying: false }],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(evasiveOpponent, archimedesHasHadEnough),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getDamage(archimedesHasHadEnough)).toBe(2);
    expect(testEngine.asPlayerTwo().getDamage(evasiveOpponent)).toBe(2);
    expect(testEngine.isExerted(evasiveOpponent)).toBe(true);
  });
  it("can challenge an exerted character without Evasive but cannot challenge a ready one", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: archimedesHasHadEnough, isDrying: false }], deck: 2 },
      { play: [plainOpponent], deck: 2 },
    );
    expect(
      engine.asPlayerOne().challenge(archimedesHasHadEnough, plainOpponent),
    ).not.toBeSuccessfulCommand();
    expect(engine.isExerted(archimedesHasHadEnough)).toBe(false);
    // An opposing turn action supplies the exerted target through normal play.
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().quest(plainOpponent)).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().challenge(archimedesHasHadEnough, plainOpponent),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getDamage(plainOpponent)).toBe(2);
  });
  it("requires player two's paid entry to dry before questing for two lore", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 6 },
      { hand: [archimedesHasHadEnough], inkwell: 4, deck: 6 },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().playCard(archimedesHasHadEnough)).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(engine.asPlayerTwo().quest(archimedesHasHadEnough)).not.toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_TWO)).toBe(0);
    expect(engine.isExerted(archimedesHasHadEnough)).toBe(false);
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().quest(archimedesHasHadEnough)).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_TWO)).toBe(2);
    expect(engine.getLore(PLAYER_ONE)).toBe(0);
    expect(engine.isExerted(archimedesHasHadEnough)).toBe(true);
  });
});
