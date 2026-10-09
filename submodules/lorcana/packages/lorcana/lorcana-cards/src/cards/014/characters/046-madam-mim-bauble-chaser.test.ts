import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
} from "@tcg/lorcana-engine/testing";
import { evasive } from "../../../helpers/abilities/evasive";
import { khanTransportDelivery } from "../actions/199-khan-transport-delivery";
import { madamMimBaubleChaser } from "./046-madam-mim-bauble-chaser";

const plainOpponent = createMockCharacter({
  id: "mim-bauble-plain-opponent",
  name: "Plain Opponent",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const evasiveOpponent = createMockCharacter({
  id: "mim-bauble-evasive-opponent",
  name: "Evasive Opponent",
  cost: 2,
  strength: 2,
  willpower: 3,
  abilities: [evasive],
});

function engineWithMimInPlay() {
  return LorcanaMultiplayerTestEngine.createWithFixture(
    {
      play: [{ card: madamMimBaubleChaser, isDrying: false }],
      hand: [khanTransportDelivery],
      inkwell: khanTransportDelivery.cost,
      deck: 3,
    },
    {
      play: [
        { card: plainOpponent, isDrying: false },
        { card: evasiveOpponent, isDrying: false },
      ],
      deck: 2,
    },
  );
}

describe("Madam Mim - Bauble Chaser", () => {
  it("tracks player two's partial and last-drop payments and regains Evasive after a new drop", () => {
    const first = createMockCharacter({ id: "mim-p2-first-payment", name: "First", cost: 1 });
    const second = createMockCharacter({ id: "mim-p2-second-payment", name: "Second", cost: 1 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { inkDrops: 3, deck: 6 },
      {
        play: [madamMimBaubleChaser],
        hand: [first, second, khanTransportDelivery],
        inkDrops: 2,
        inkwell: khanTransportDelivery.cost,
        deck: 6,
      },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().playCard(first, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(engine.hasKeyword(madamMimBaubleChaser, "Evasive")).toBe(true);
    expect(engine.asPlayerTwo().playCard(second, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(0);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(3);
    expect(engine.hasKeyword(madamMimBaubleChaser, "Evasive")).toBe(false);
    expect(engine.asPlayerTwo().playCard(khanTransportDelivery)).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(engine.hasKeyword(madamMimBaubleChaser, "Evasive")).toBe(true);
  });
  it("has no Evasive while you have no ink drop", () => {
    const testEngine = engineWithMimInPlay();

    expect(testEngine.hasKeyword(madamMimBaubleChaser, "Evasive")).toBe(false);
  });

  it("gains Evasive while you have an ink drop", () => {
    const testEngine = engineWithMimInPlay();

    // Khan Transport Delivery: "Draw a card. Get 1 ink drop."
    expect(testEngine.asPlayerOne().playCard(khanTransportDelivery)).toBeSuccessfulCommand();

    expect(testEngine.hasKeyword(madamMimBaubleChaser, "Evasive")).toBe(true);
  });

  it("keeps Evasive across turns while the ink drop persists", () => {
    const testEngine = engineWithMimInPlay();

    expect(testEngine.asPlayerOne().playCard(khanTransportDelivery)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.hasKeyword(madamMimBaubleChaser, "Evasive")).toBe(true);
  });

  it("cannot be challenged by a character without Evasive while it has Evasive", () => {
    const testEngine = engineWithMimInPlay();

    expect(testEngine.asPlayerOne().playCard(khanTransportDelivery)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().quest(madamMimBaubleChaser)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerTwo().challenge(plainOpponent, madamMimBaubleChaser),
    ).not.toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(madamMimBaubleChaser)).toBe("play");
    expect(testEngine.isExerted(plainOpponent)).toBe(false);
    expect(testEngine.asPlayerTwo().getDamage(plainOpponent)).toBe(0);
    expect(testEngine.asPlayerOne().getDamage(madamMimBaubleChaser)).toBe(0);
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
  });

  it("can still be challenged by an opposing Evasive character while it has Evasive", () => {
    const testEngine = engineWithMimInPlay();

    expect(testEngine.asPlayerOne().playCard(khanTransportDelivery)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().quest(madamMimBaubleChaser)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerTwo().challenge(evasiveOpponent, madamMimBaubleChaser),
    ).toBeSuccessfulCommand();
    // 2 {S} vs 1 {W}: Mim is banished.
    expect(testEngine.asPlayerOne().getCardZone(madamMimBaubleChaser)).toBe("discard");
    expect(testEngine.asPlayerTwo().getDamage(evasiveOpponent)).toBe(2);
  });
  it("loses Evasive after its last ink drop is spent and can then be challenged normally", () => {
    const spell = createMockAction({
      id: "mim-drop-payment",
      name: "Payment",
      cost: 1,
      text: "Gain 1 lore.",
      abilities: [
        { type: "action", effect: { type: "gain-lore", amount: 1, target: "CONTROLLER" } },
      ],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: madamMimBaubleChaser, isDrying: false }],
        hand: [spell],
        inkDrops: 1,
        deck: 2,
      },
      { play: [plainOpponent], deck: 2 },
    );
    expect(engine.hasKeyword(madamMimBaubleChaser, "Evasive")).toBe(true);
    expect(engine.asPlayerOne().playCard(spell, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(engine.hasKeyword(madamMimBaubleChaser, "Evasive")).toBe(false);
    expect(engine.asPlayerOne().quest(madamMimBaubleChaser)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      engine.asPlayerTwo().challenge(plainOpponent, madamMimBaubleChaser),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(madamMimBaubleChaser)).toBe("discard");
  });

  it("does not gain Evasive from an opponent's ink drops", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [madamMimBaubleChaser], deck: [] },
      { inkDrops: 2, deck: [] },
    );
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(2);
    expect(engine.hasKeyword(madamMimBaubleChaser, "Evasive")).toBe(false);
  });
});
