// Rules grounding: Hyperia City ink drops — "Shift Remove 2 ink drops" removes
// 2 ink drops instead of paying ink; drops are spendable the turn they are
// gained. Supercharge is optional for each incoming ink drop; replacement
// happens before the drop is gained (CR 6.5.1–6.5.5 replacement effects).
// Shift retains the exact base, damage, drying and exertion (CR 8.10.1–8.10.6).
// https://files.disneylorcana.com/Comprehensive-Rules_2.2.0-EN.pdf
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { higitusFigitus } from "../actions/062-higitus-figitus";
import { baymaxAmpedUp } from "./158-baymax-amped-up";
import { khanTransportDelivery } from "../actions/199-khan-transport-delivery";
import { baymaxQualifiedPhysician } from "./140-baymax-qualified-physician";

const baymaxBase = baymaxQualifiedPhysician;

describe("Baymax - Amped Up", () => {
  for (const isDrying of [false, true]) {
    for (const exerted of [false, true]) {
      it(`drop-only Shift retains damage and exact stack; drying ${isDrying}, exerted ${exerted}`, () => {
        const g = LorcanaMultiplayerTestEngine.createWithFixture({
          hand: [baymaxAmpedUp],
          play: [{ card: baymaxBase, damage: 2, isDrying, exerted }],
          inkwell: 7,
          inkDrops: 3,
          deck: 3,
        });
        const base = g.findCardInstanceId(baymaxBase, "play", PLAYER_ONE)!;
        expect(
          g.asPlayerOne().playCard(baymaxAmpedUp, { cost: { cost: "shift", shiftTarget: base } }),
        ).toBeSuccessfulCommand();
        const top = g.findCardInstanceId(baymaxAmpedUp, "play", PLAYER_ONE)!;
        expect(g.getCardsUnder(top)).toEqual([base]);
        expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
        expect(g.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(7);
        expect(g.asPlayerOne().getDamage(top)).toBe(2);
        expect(g.asPlayerOne().isExerted(top)).toBe(exerted);
        expect(g.asPlayerOne().getBagCount()).toBe(0);
        if (isDrying || exerted) {
          expect(g.asPlayerOne().quest(top)).not.toBeSuccessfulCommand();
          expect(g.getLore(PLAYER_ONE)).toBe(0);
        } else {
          expect(g.asPlayerOne().quest(top)).toBeSuccessfulCommand();
          expect(g.getLore(PLAYER_ONE)).toBe(2);
        }
      });
    }
  }

  it("one drop cannot pay Shift even when seven ready ink is available", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [baymaxAmpedUp],
      play: [baymaxBase],
      inkwell: 7,
      inkDrops: 1,
      deck: 3,
    });
    const base = g.findCardInstanceId(baymaxBase, "play", PLAYER_ONE)!;
    expect(
      g.asPlayerOne().playCard(baymaxAmpedUp, { cost: { cost: "shift", shiftTarget: base } }),
    ).not.toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(7);
    expect(g.asPlayerOne().getCardZone(baymaxAmpedUp)).toBe("hand");
    expect(g.asPlayerOne().getCardZone(base)).toBe("play");
    expect(g.getCardsUnder(base)).toHaveLength(0);
  });

  for (const owner of [PLAYER_ONE, PLAYER_TWO]) {
    it(`rejects invalid Shift target from ${owner} without removing drops`, () => {
      const other = createMockCharacter({ id: "baymax-wrong-name", name: "Other", cost: 1 });
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        { hand: [baymaxAmpedUp], play: [other], inkDrops: 3, inkwell: 7, deck: 3 },
        { play: [baymaxBase], deck: 3 },
      );
      const base = g.findCardInstanceId(owner === PLAYER_ONE ? other : baymaxBase, "play", owner)!;
      expect(
        g.asPlayerOne().playCard(baymaxAmpedUp, { cost: { cost: "shift", shiftTarget: base } }),
      ).not.toBeSuccessfulCommand();
      expect(g.getInkDrops(PLAYER_ONE)).toBe(3);
      expect(g.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(7);
      expect(g.asPlayerOne().getCardZone(baymaxAmpedUp)).toBe("hand");
      expect(g.asPlayerOne().getCardZone(base)).toBe("play");
    });
  }
  it("cannot shift without 2 ink drops even with enough ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [baymaxAmpedUp],
      play: [baymaxBase],
      inkwell: 9,
      deck: 2,
    });

    const shiftTargetId = testEngine.findCardInstanceId(baymaxBase, "play", PLAYER_ONE);
    const result = testEngine.asPlayerOne().playCard(baymaxAmpedUp, {
      cost: { cost: "shift", shiftTarget: shiftTargetId },
    });
    expect(result).toMatchObject({ success: false, errorCode: "INSUFFICIENT_INK_DROPS" });
    expect(testEngine.asPlayerOne().getCardZone(baymaxAmpedUp)).toBe("hand");
  });

  it("shifts onto a Baymax by removing 2 ink drops", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [higitusFigitus, baymaxAmpedUp],
      play: [baymaxBase],
      inkwell: higitusFigitus.cost + 3,
      deck: 2,
    });

    // Bank 3 ink drops first.
    expect(testEngine.asPlayerOne().playCard(higitusFigitus)).toBeSuccessfulCommand();
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(3);

    const shiftTargetId = testEngine.findCardInstanceId(baymaxBase, "play", PLAYER_ONE);
    expect(
      testEngine.asPlayerOne().playCard(baymaxAmpedUp, {
        cost: { cost: "shift", shiftTarget: shiftTargetId },
      }),
    ).toBeSuccessfulCommand();

    // 3 drops - 2 spent = 1.
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(testEngine.asPlayerOne().getCardZone(baymaxAmpedUp)).toBe("play");
  });
});

describe("Baymax - Amped Up (Supercharge)", () => {
  it.each([0, 1])(
    "Player Two controls their own exact replacement and blocks opposing choice %s",
    (choiceIndex: number) => {
      const top = createMockCharacter({
        id: "baymax-p2-top",
        name: "Uninkable Top",
        cost: 1,
        inkable: false,
      });
      const draw = createMockCharacter({ id: "baymax-p2-draw", name: "Draw", cost: 1 });
      const start = createMockCharacter({ id: "baymax-p2-start", name: "Start", cost: 1 });
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        { deck: 3, inkwell: 1 },
        {
          play: [baymaxAmpedUp],
          hand: [khanTransportDelivery],
          deck: [top, draw, start],
          inkwell: 2,
        },
      );
      expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      const before = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
      const exactTop = g.findCardInstanceId(top, "deck", PLAYER_TWO)!;
      expect(g.asPlayerTwo().playCard(khanTransportDelivery)).toBeSuccessfulCommand();
      expect(g.asPlayerOne().resolveNextPending({ choiceIndex })).not.toBeSuccessfulCommand();
      expect(g.asPlayerTwo().resolveNextPending({ choiceIndex })).toBeSuccessfulCommand();
      expect(g.getInkDrops(PLAYER_TWO)).toBe(choiceIndex === 0 ? 0 : 1);
      expect(g.asPlayerTwo().getCardZone(exactTop)).toBe(choiceIndex === 0 ? "inkwell" : "deck");
      if (choiceIndex === 0) {
        expect(g.isCardFaceDown(exactTop, "inkwell", PLAYER_TWO)).toBe(true);
        expect(g.asPlayerTwo().isExerted(exactTop)).toBe(true);
      }
      expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(before);
      expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(1);
      expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
      expect(g.asPlayerTwo().getPendingEffects()).toHaveLength(0);
    },
  );

  it("two Baymax copies replace one incoming drop with only one deck card", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [baymaxAmpedUp, baymaxAmpedUp],
      hand: [khanTransportDelivery],
      inkwell: 2,
      deck: 4,
    });
    expect(g.asPlayerOne().playCard(khanTransportDelivery)).toBeSuccessfulCommand();
    const top = g.getCardInstanceIdsInZone("deck", PLAYER_ONE).at(-1)!;
    expect(g.asPlayerOne().resolveNextPending({ choiceIndex: 0 })).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(3);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toContain(top);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toHaveLength(2);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });
  it.each([0, 1])(
    "lets its controller replace or keep Khan's incoming drop (choice %s)",
    (choiceIndex: number) => {
      const top = createMockCharacter({ id: "baymax-top", name: "Deck Top", cost: 1 });
      const draw = createMockCharacter({ id: "baymax-draw", name: "Khan Draw", cost: 1 });
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [baymaxAmpedUp],
        hand: [khanTransportDelivery],
        inkwell: 2,
        deck: [top, draw],
      });
      expect(game.asPlayerOne().playCard(khanTransportDelivery)).toBeSuccessfulCommand();
      expect(game.asPlayerOne().getCardZone(draw)).toBe("hand");
      expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
      expect(game.asPlayerOne().getCardZone(top)).toBe("deck");
      expect(game.asPlayerOne().resolveNextPending({ choiceIndex })).toBeSuccessfulCommand();
      expect(game.getInkDrops(PLAYER_ONE)).toBe(choiceIndex === 0 ? 0 : 1);
      expect(game.asPlayerOne().getCardZone(top)).toBe(choiceIndex === 0 ? "inkwell" : "deck");
      if (choiceIndex === 0) {
        expect(game.asPlayerOne().isExerted(top)).toBe(true);
        expect(game.asServer().getCard(top).publicFaceState).toBe("faceDown");
        expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
      }
    },
  );

  it("offers a separate replacement for every drop of a three-drop gain", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [baymaxAmpedUp],
      hand: [higitusFigitus],
      inkwell: 6,
      deck: 5,
    });
    expect(game.asPlayerOne().playCard(higitusFigitus)).toBeSuccessfulCommand();
    for (const choiceIndex of [0, 1, 0]) {
      expect(game.asPlayerOne().resolveNextPending({ choiceIndex })).toBeSuccessfulCommand();
    }
    expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(game.asPlayerOne().getZonesCardCount().inkwell).toBe(8);
    expect(game.asPlayerOne().getZonesCardCount().deck).toBe(3);
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  });

  it("keeps the remaining drops when replacement uses the last deck card", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [baymaxAmpedUp],
      hand: [higitusFigitus],
      inkwell: 6,
      deck: 1,
    });
    expect(game.asPlayerOne().playCard(higitusFigitus)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().resolveNextPending({ choiceIndex: 0 })).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(game.asPlayerOne().getZonesCardCount().inkwell).toBe(7);
    expect(game.asPlayerOne().getZonesCardCount().deck).toBe(0);
  });

  it("gains the drop normally when Khan draws the last deck card", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [baymaxAmpedUp],
      hand: [khanTransportDelivery],
      inkwell: 2,
      deck: 1,
    });
    expect(game.asPlayerOne().playCard(khanTransportDelivery)).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(game.asPlayerOne().getZonesCardCount().deck).toBe(0);
  });

  it("does not replace an opponent's gain", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [khanTransportDelivery],
        inkwell: 2,
        deck: 3,
      },
      { play: [baymaxAmpedUp], deck: 3 },
    );
    expect(game.asPlayerOne().playCard(khanTransportDelivery)).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(3);
  });
});
