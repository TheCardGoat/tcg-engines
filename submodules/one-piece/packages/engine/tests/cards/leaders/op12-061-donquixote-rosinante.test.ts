import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op12DonquixoteRosinante061,
  op12Issho082,
  op12TrafalgarLaw106,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP12-061 Donquixote Rosinante", () => {
  test("discounts the next qualifying Law without revealing a hand choice", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op12DonquixoteRosinante061,
      hand: [op12TrafalgarLaw106],
      activeDon: 5,
    });
    const lawId = engine.findCardInZone("south", "hand", op12TrafalgarLaw106);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    // DON!! −1 is optional; accept (cost may auto-pay with a single active DON!!).
    engine.accept("south");
    try {
      engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");
    } catch {
      // Cost auto-paid.
    }

    expect(
      engine.getView("south").players.south.hand.find((card) => card.instanceId === lawId)?.cost,
    ).toBe(6);
    engine.playCard(op12TrafalgarLaw106, "south");
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 4 });
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("retains the discount through an unrelated play and a newly drawn Law", () => {
    let engine = OnePieceTestEngine.create({
      leaderCardId: op12DonquixoteRosinante061,
      hand: ["OP07-096"],
      deck: [op12TrafalgarLaw106, eb01Doma005],
      activeDon: 6,
    });
    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.accept("south");
    expect(engine.getView("south").players.south.activeDon).toBe(5);
    engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
    engine.playCard("OP07-096");
    engine.playCard(op12TrafalgarLaw106);
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 5 });
    expect(
      engine
        .getView("south")
        .players.south.characters.some((card) => card?.cardId === op12TrafalgarLaw106.id),
    ).toBe(true);
  });

  test("spends one Life to replace a Trafalgar Law battle K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op12Issho082, playedOnTurn: 0 }] },
      {
        leaderCardId: op12DonquixoteRosinante061,
        character: [{ card: op12TrafalgarLaw106, rested: true, playedOnTurn: 0 }],
        life: [eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", op12Issho082);
    const lawId = engine.findCardInZone("north", "character", op12TrafalgarLaw106);

    engine.declareAttack(attackerId, lawId, "south");
    engine.resolveDecision("battleKoReplacement", { optionId: "yes" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === lawId)).toBe(true);
    expect(view.players.north.lifeCount).toBe(0);
    expect(view.players.north.hand).toHaveLength(1);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op12DonquixoteRosinante061,
      hand: [op12TrafalgarLaw106],
      activeDon: 5,
    });
    engine.activateEffect(engine.leader("south"), "activateMain", "south");

    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("playing a Law with cost below four retains the next qualifying Law discount", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op12DonquixoteRosinante061,
      hand: ["OP02-035", op12TrafalgarLaw106],
      activeDon: 7,
    });
    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.accept("south");
    engine.playCard("OP02-035", "south");
    expect(engine.getView("south").players.south.activeDon).toBe(4);
    engine.playCard(op12TrafalgarLaw106, "south");
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 6 });
  });

  test("cannot replace a Law battle K.O. with no Life", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op12Issho082, playedOnTurn: 0 }] },
      {
        leaderCardId: op12DonquixoteRosinante061,
        character: [{ card: op12TrafalgarLaw106, rested: true }],
        life: [],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const law = engine.findCardInZone("north", "character", op12TrafalgarLaw106);
    engine.declareAttack(engine.findCardInZone("south", "character", op12Issho082), law, "south");
    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      law,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
