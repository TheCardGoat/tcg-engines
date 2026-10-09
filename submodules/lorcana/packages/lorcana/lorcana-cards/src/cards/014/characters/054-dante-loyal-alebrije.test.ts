import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockAction,
  createMockItem,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { evasive } from "../../../helpers/abilities/evasive";
import { danteLoyalAlebrije } from "./054-dante-loyal-alebrije";

const trash = createMockCharacter({
  id: "dante-loyal-trash",
  name: "Discarded Bauble",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const plainDante = createMockCharacter({
  id: "dante-loyal-shift-target",
  name: "Dante",
  cost: 3,
  strength: 2,
  willpower: 3,
});

const TEN_TRASH = [trash, trash, trash, trash, trash, trash, trash, trash, trash, trash];

describe("Dante - Loyal Alebrije", () => {
  it("has Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [danteLoyalAlebrije],
      deck: 2,
    });

    expect(testEngine.hasKeyword(danteLoyalAlebrije, "Evasive")).toBe(true);
  });

  it("stays at base 2 {L} while you have fewer than 10 cards in your discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [danteLoyalAlebrije],
      discard: [trash, trash, trash],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().getCard(danteLoyalAlebrije).lore).toBe(2);
  });

  it("gets +2 {L} while you have 10 or more cards in your discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [danteLoyalAlebrije],
      discard: TEN_TRASH,
      deck: 2,
    });

    expect(testEngine.asPlayerOne().getCard(danteLoyalAlebrije).lore).toBe(4);
  });

  it("can Shift 4 onto a character named Dante and keeps the discard boost", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [plainDante],
      hand: [danteLoyalAlebrije],
      inkwell: 4,
      discard: TEN_TRASH,
      deck: 2,
    });

    const shiftTargetId = testEngine.findCardInstanceId(plainDante, "play", "player_one");
    expect(
      testEngine.asPlayerOne().playCard(danteLoyalAlebrije, {
        cost: {
          cost: "shift",
          shiftTarget: shiftTargetId,
        },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(danteLoyalAlebrije)).toBe("play");
    expect(testEngine.hasKeyword(danteLoyalAlebrije, "Evasive")).toBe(true);
    expect(testEngine.asPlayerOne().getCard(danteLoyalAlebrije).lore).toBe(4);
  });
  for (const count of [9, 10, 11]) {
    it(`quests for the correct lore with ${count} own discard cards`, () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: danteLoyalAlebrije, isDrying: false }],
        discard: Array.from({ length: count }, () => trash),
        deck: [],
      });
      expect(engine.asPlayerOne().quest(danteLoyalAlebrije)).toBeSuccessfulCommand();
      expect(engine.getLore(PLAYER_ONE)).toBe(count >= 10 ? 4 : 2);
    });
  }

  it("does not count opposing discard cards toward Trash to Treasure", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: danteLoyalAlebrije, isDrying: false }], discard: [trash], deck: [] },
      { discard: TEN_TRASH, deck: [] },
    );
    expect(engine.asPlayerOne().quest(danteLoyalAlebrije)).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_ONE)).toBe(2);
  });

  it("loses the bonus immediately when a card leaves its controller's discard", () => {
    const returnItem = createMockItem({
      id: "loyal-return-item",
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
      play: [{ card: danteLoyalAlebrije, isDrying: false }, returnItem],
      discard: TEN_TRASH,
      deck: [],
    });
    const target = engine.getCardInstanceIdsInZone("discard", PLAYER_ONE)[0]!;
    expect(
      engine.asPlayerOne().activateAbility(returnItem, { abilityIndex: 0, targets: [target] }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getZonesCardCount().discard).toBe(9);
    expect(engine.asPlayerOne().quest(danteLoyalAlebrije)).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_ONE)).toBe(2);
  });

  it("Evasive prevents ordinary challenges and permits Evasive challenges", () => {
    for (const canChallenge of [false, true]) {
      const attacker = createMockCharacter({
        id: "loyal-attacker",
        name: "Attacker",
        cost: 2,
        strength: 1,
        willpower: 8,
        abilities: canChallenge ? [evasive] : [],
      });
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [{ card: danteLoyalAlebrije, exerted: true }], deck: 2 },
        { play: [attacker], deck: 2 },
      );
      expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      const result = engine.asPlayerTwo().challenge(attacker, danteLoyalAlebrije);
      if (canChallenge) {
        expect(result).toBeSuccessfulCommand();
        expect(engine.asPlayerOne().getCard(danteLoyalAlebrije).damage).toBe(1);
        expect(engine.asPlayerTwo().getCard(attacker).damage).toBe(6);
        expect(engine.isExerted(attacker)).toBe(true);
      } else {
        expect(result).not.toBeSuccessfulCommand();
        expect(engine.asPlayerOne().getCard(danteLoyalAlebrije).damage).toBe(0);
        expect(engine.asPlayerTwo().getCard(attacker).damage).toBe(0);
        expect(engine.isExerted(attacker)).toBe(false);
      }
    }
  });

  it("Shift requires four ink and a friendly character named Dante", () => {
    for (const kind of ["insufficient-ink", "wrong-name", "opponent-target"] as const) {
      const wrongName = createMockCharacter({ id: "loyal-wrong-name", name: "Hector", cost: 2 });
      const target = kind === "wrong-name" ? wrongName : plainDante;
      const opponentTarget = kind === "opponent-target";
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [danteLoyalAlebrije],
          play: opponentTarget ? [] : [target],
          inkwell: kind === "insufficient-ink" ? 3 : 4,
          deck: [],
        },
        { play: opponentTarget ? [target] : [], deck: [] },
      );
      const shiftTarget = engine.findCardInstanceId(
        target,
        "play",
        opponentTarget ? PLAYER_TWO : PLAYER_ONE,
      );
      expect(
        engine.asPlayerOne().playCard(danteLoyalAlebrije, { cost: { cost: "shift", shiftTarget } }),
      ).not.toBeSuccessfulCommand();
      expect(engine.asPlayerOne().getCardZone(danteLoyalAlebrije)).toBe("hand");
    }
  });

  it("Shift preserves exerted state and damage", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [danteLoyalAlebrije],
      play: [{ card: plainDante, exerted: true, damage: 2, isDrying: false }],
      inkwell: 4,
      discard: TEN_TRASH,
      deck: [],
    });
    const shiftTarget = engine.findCardInstanceId(plainDante, "play", PLAYER_ONE);
    expect(
      engine.asPlayerOne().playCard(danteLoyalAlebrije, { cost: { cost: "shift", shiftTarget } }),
    ).toBeSuccessfulCommand();
    expect(engine.isExerted(danteLoyalAlebrije)).toBe(true);
    expect(engine.asPlayerOne().getCard(danteLoyalAlebrije).damage).toBe(2);
    expect(engine.asPlayerOne().quest(danteLoyalAlebrije)).not.toBeSuccessfulCommand();
  });
  it("player-two Shift retains dry state and damage while the tenth discard doubles quest lore", () => {
    const draw = createMockAction({
      id: "loyal-p2-draw",
      name: "Draw",
      cost: 0,
      text: "Draw a card.",
      abilities: [{ type: "action", effect: { type: "draw", amount: 1, target: "CONTROLLER" } }],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { discard: TEN_TRASH, deck: 6 },
      {
        play: [{ card: plainDante, damage: 1, isDrying: false }],
        hand: [danteLoyalAlebrije, draw],
        discard: TEN_TRASH.slice(0, 9),
        inkwell: 4,
        deck: 6,
      },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const shiftTarget = engine.findCardInstanceId(plainDante, "play", PLAYER_TWO);
    expect(
      engine.asPlayerTwo().playCard(danteLoyalAlebrije, { cost: { cost: "shift", shiftTarget } }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(engine.asPlayerTwo().getCard(danteLoyalAlebrije).damage).toBe(1);
    expect(engine.asPlayerTwo().getCard(danteLoyalAlebrije).lore).toBe(2);
    expect(engine.asPlayerTwo().playCard(draw)).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getZonesCardCount().discard).toBe(10);
    expect(engine.asPlayerTwo().getCard(danteLoyalAlebrije).lore).toBe(4);
    expect(engine.asPlayerTwo().quest(danteLoyalAlebrije)).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_TWO)).toBe(4);
    expect(engine.getLore(PLAYER_ONE)).toBe(0);
  });
});
