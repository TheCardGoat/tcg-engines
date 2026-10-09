import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockAction,
  createMockItem,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { neverGonnaLetYouCry } from "../actions/030-never-gonna-let-you-cry";
import { evasive } from "../../../helpers/abilities/evasive";
import { danteStrangeAndEndearing } from "./048-dante-strange-and-endearing";

const trash = createMockCharacter({
  id: "dante-endearing-trash",
  name: "Discarded Bauble",
  cost: 1,
  strength: 1,
  willpower: 1,
});

describe("Dante - Strange and Endearing", () => {
  it("has Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [danteStrangeAndEndearing],
      deck: 2,
    });

    expect(testEngine.hasKeyword(danteStrangeAndEndearing, "Evasive")).toBe(true);
  });

  it("has base 1 {L} while you have fewer than 10 cards in your discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [danteStrangeAndEndearing],
      discard: [trash, trash, trash],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().getCard(danteStrangeAndEndearing).lore).toBe(1);
  });

  it("gets +1 {L} while you have 10 or more cards in your discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [danteStrangeAndEndearing],
      discard: [trash, trash, trash, trash, trash, trash, trash, trash, trash, trash],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().getCard(danteStrangeAndEndearing).lore).toBe(2);
  });
  for (const count of [9, 10, 11]) {
    it(`quests for the correct lore with ${count} own discard cards`, () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: danteStrangeAndEndearing, isDrying: false }],
        discard: Array.from({ length: count }, () => trash),
        deck: [],
      });
      expect(engine.asPlayerOne().quest(danteStrangeAndEndearing)).toBeSuccessfulCommand();
      expect(engine.getLore(PLAYER_ONE)).toBe(count >= 10 ? 2 : 1);
    });
  }

  it("does not use the opponent's discard threshold", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: danteStrangeAndEndearing, isDrying: false }], deck: [] },
      { discard: Array.from({ length: 10 }, () => trash), deck: [] },
    );
    expect(engine.asPlayerOne().quest(danteStrangeAndEndearing)).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_ONE)).toBe(1);
  });

  it("removes the lore bonus immediately when a discard card returns to hand", () => {
    const returnItem = createMockItem({
      id: "dante-threshold-return",
      name: "Return Item",
      cost: 0,
      abilities: [
        {
          type: "activated",
          cost: { exert: true },
          effect: {
            type: "return-to-hand",
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["discard"],
              cardTypes: ["card"],
            },
          },
        },
      ],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: danteStrangeAndEndearing, isDrying: false }, returnItem],
      discard: Array.from({ length: 10 }, () => trash),
      deck: [],
    });
    expect(engine.asPlayerOne().getCard(danteStrangeAndEndearing).lore).toBe(2);
    const target = engine.getCardInstanceIdsInZone("discard", PLAYER_ONE)[0]!;
    expect(
      engine.asPlayerOne().activateAbility(returnItem, { abilityIndex: 0, targets: [target] }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getZonesCardCount().discard).toBe(9);
    expect(engine.asPlayerOne().quest(danteStrangeAndEndearing)).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_ONE)).toBe(1);
  });

  it("updates player-two lore when a played action becomes the tenth discard card", () => {
    const drawAction = createMockAction({
      id: "dante-tenth-card",
      name: "Tenth Card",
      cost: 0,
      text: "Draw a card.",
      abilities: [{ type: "action", effect: { type: "draw", amount: 1, target: "CONTROLLER" } }],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { discard: Array.from({ length: 11 }, () => trash), deck: 6 },
      {
        play: [danteStrangeAndEndearing],
        hand: [drawAction],
        discard: Array.from({ length: 9 }, () => trash),
        deck: 6,
      },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getCard(danteStrangeAndEndearing).lore).toBe(1);
    expect(engine.asPlayerTwo().playCard(drawAction)).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getZonesCardCount().discard).toBe(10);
    expect(engine.asPlayerTwo().getCard(danteStrangeAndEndearing).lore).toBe(2);
    expect(engine.asPlayerTwo().quest(danteStrangeAndEndearing)).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_TWO)).toBe(2);
    expect(engine.getLore(PLAYER_ONE)).toBe(0);
  });

  it("Evasive blocks ordinary challengers and allows Evasive challengers", () => {
    for (const canChallenge of [false, true]) {
      const attacker = createMockCharacter({
        id: "dante-endearing-attacker",
        name: "Attacker",
        cost: 2,
        strength: 1,
        willpower: 5,
        abilities: canChallenge ? [evasive] : [],
      });
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [{ card: danteStrangeAndEndearing, exerted: true }], deck: 2 },
        { play: [attacker], deck: 2 },
      );
      expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      const result = engine.asPlayerTwo().challenge(attacker, danteStrangeAndEndearing);
      if (canChallenge) {
        expect(result).toBeSuccessfulCommand();
        expect(engine.asPlayerOne().getCardZone(danteStrangeAndEndearing)).toBe("discard");
        expect(engine.isExerted(attacker)).toBe(true);
        expect(engine.asPlayerTwo().getCard(attacker).damage).toBe(0);
      } else {
        expect(result).not.toBeSuccessfulCommand();
        expect(engine.asPlayerOne().getCardZone(danteStrangeAndEndearing)).toBe("play");
        expect(engine.isExerted(attacker)).toBe(false);
        expect(engine.asPlayerOne().getCard(danteStrangeAndEndearing).damage).toBe(0);
      }
    }
  });
});

it("Player Two loses the lore bonus after a real song returns two cards below ten", () => {
  const engine = LorcanaMultiplayerTestEngine.createWithFixture(
    { discard: Array.from({ length: 11 }, () => trash), deck: 6 },
    {
      play: [danteStrangeAndEndearing],
      hand: [neverGonnaLetYouCry],
      discard: Array.from({ length: 10 }, () => trash),
      inkwell: 5,
      deck: 6,
    },
  );
  expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(engine.asPlayerTwo().getCard(danteStrangeAndEndearing).lore).toBe(2);
  const targets = engine.getCardInstanceIdsInZone("discard", PLAYER_TWO).slice(0, 2);
  expect(engine.asPlayerTwo().playCard(neverGonnaLetYouCry)).toBeSuccessfulCommand();
  expect(
    engine.asPlayerTwo().resolvePendingByCard(neverGonnaLetYouCry, { targets }),
  ).toBeSuccessfulCommand();
  expect(engine.asPlayerTwo().getZonesCardCount().discard).toBe(9);
  expect(engine.asPlayerTwo().getCard(danteStrangeAndEndearing).lore).toBe(1);
  expect(engine.asPlayerTwo().quest(danteStrangeAndEndearing)).toBeSuccessfulCommand();
  expect(engine.getLore(PLAYER_TWO)).toBe(1);
  expect(engine.asPlayerOne().getZonesCardCount().discard).toBe(11);
});

it("Player Two's Evasive Dante rejects plain attacks and deals zero retaliation to an Evasive attacker", () => {
  const plain = createMockCharacter({
    id: "dante-p2-plain",
    name: "Plain",
    cost: 2,
    strength: 2,
    willpower: 4,
  });
  const flying = createMockCharacter({
    id: "dante-p2-flying",
    name: "Flying",
    cost: 2,
    strength: 2,
    willpower: 4,
    abilities: [evasive],
  });
  const engine = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [plain, flying], deck: 6 },
    { play: [{ card: danteStrangeAndEndearing, exerted: true }], deck: 6 },
  );
  expect(
    engine.asPlayerOne().challenge(plain, danteStrangeAndEndearing),
  ).not.toBeSuccessfulCommand();
  expect(engine.isExerted(plain)).toBe(false);
  expect(engine.asPlayerOne().challenge(flying, danteStrangeAndEndearing)).toBeSuccessfulCommand();
  expect(engine.asPlayerTwo().getCardZone(danteStrangeAndEndearing)).toBe("discard");
  expect(engine.asPlayerOne().getCard(flying).damage).toBe(0);
});
