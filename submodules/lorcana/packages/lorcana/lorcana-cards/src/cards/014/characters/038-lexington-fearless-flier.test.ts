// CR 3.2.1.1, 3.2.3.1: Ready occurs before Draw.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockAction,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { lexingtonFearlessFlier } from "./038-lexington-fearless-flier";

const plainOpponent = createMockCharacter({
  id: "lexington-plain-opponent",
  name: "Plain Opponent",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const evasiveOpponent = createMockCharacter({
  id: "lexington-evasive-opponent",
  name: "Evasive Opponent",
  cost: 2,
  strength: 2,
  willpower: 3,
  abilities: [
    {
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
});

const handFiller = (id: string) =>
  createMockCharacter({
    id: `lexington-filler-${id}`,
    name: "Hand Filler",
    cost: 1,
  });

describe("Lexington - Fearless Flier", () => {
  it("has Evasive and cannot be challenged by a character without Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: lexingtonFearlessFlier, exerted: true }],
        deck: 1,
      },
      {
        play: [{ card: plainOpponent, isDrying: false }],
        deck: 1,
      },
    );

    expect(testEngine.hasKeyword(lexingtonFearlessFlier, "Evasive")).toBe(true);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(plainOpponent, lexingtonFearlessFlier),
    ).not.toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(lexingtonFearlessFlier)).toBe("play");
  });

  it("can be challenged by an opposing Evasive character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: lexingtonFearlessFlier, exerted: true }],
        deck: 1,
      },
      {
        play: [{ card: evasiveOpponent, isDrying: false }],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(evasiveOpponent, lexingtonFearlessFlier),
    ).toBeSuccessfulCommand();
  });

  it("does not ready at the start of your turn while you have 3 or more cards in hand", () => {
    const filler = ["one", "two", "three"].map(handFiller);
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: lexingtonFearlessFlier, exerted: true }],
        hand: filler,
        deck: 2,
      },
      { deck: 2 },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.isExerted(lexingtonFearlessFlier)).toBe(true);
  });

  it("readies at the start of your turn while you have fewer than 3 cards in hand", () => {
    // Ready checks the hand before the normal Draw step.
    const filler = [handFiller("one")];
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: lexingtonFearlessFlier, exerted: true }],
        hand: filler,
        deck: 2,
      },
      { deck: 2 },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.isExerted(lexingtonFearlessFlier)).toBe(false);
  });
  it("readies with two cards before the draw raises the hand to three", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: lexingtonFearlessFlier, exerted: true }],
        hand: [handFiller("one"), handFiller("two")],
        deck: 2,
      },
      { deck: 2 },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.isExerted(lexingtonFearlessFlier)).toBe(false);
    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(3);
  });

  it("uses player two's hand before Draw, then remains exerted at the next three-card Ready step", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 6 },
      {
        play: [{ card: lexingtonFearlessFlier, exerted: true }],
        hand: [handFiller("p2-one"), handFiller("p2-two")],
        deck: 6,
      },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getZonesCardCount().hand).toBe(3);
    expect(engine.isExerted(lexingtonFearlessFlier)).toBe(false);
    expect(engine.asPlayerTwo().quest(lexingtonFearlessFlier)).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_TWO)).toBe(2);
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getZonesCardCount().hand).toBe(4);
    expect(engine.isExerted(lexingtonFearlessFlier)).toBe(true);
    expect(engine.asPlayerTwo().quest(lexingtonFearlessFlier)).not.toBeSuccessfulCommand();
  });

  for (const remainingHand of [2, 3]) {
    it(`checks the current hand count for effect-based readying with ${remainingHand} cards`, () => {
      const readyAction = createMockAction({
        id: "lexington-ready-action",
        name: "Ready Action",
        cost: 0,
        text: "Ready chosen character.",
        abilities: [{ type: "action", effect: { type: "ready", target: "CHOSEN_CHARACTER" } }],
      });
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: lexingtonFearlessFlier, exerted: true }],
        hand: [
          readyAction,
          ...Array.from({ length: remainingHand }, (_, i) => handFiller(String(i))),
        ],
        deck: [],
      });
      expect(
        engine.asPlayerOne().playCard(readyAction, { targets: [lexingtonFearlessFlier] }),
      ).toBeSuccessfulCommand();
      expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(remainingHand);
      expect(engine.isExerted(lexingtonFearlessFlier)).toBe(remainingHand >= 3);
    });
  }
});

it("Player Two's Evasive Lexington rejects a plain attacker and accepts an Evasive attacker", () => {
  const engine = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [plainOpponent, evasiveOpponent], deck: 6 },
    { play: [{ card: lexingtonFearlessFlier, exerted: true }], deck: 6 },
  );
  expect(
    engine.asPlayerOne().challenge(plainOpponent, lexingtonFearlessFlier),
  ).not.toBeSuccessfulCommand();
  expect(engine.isExerted(plainOpponent)).toBe(false);
  expect(
    engine.asPlayerOne().challenge(evasiveOpponent, lexingtonFearlessFlier),
  ).toBeSuccessfulCommand();
  expect(engine.asPlayerTwo().getCardZone(lexingtonFearlessFlier)).toBe("discard");
  expect(engine.asPlayerOne().getCardZone(evasiveOpponent)).toBe("discard");
});
