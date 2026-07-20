import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018 } from "@tcg/op-cards";
import { op14eb04TrafalgarLawOp14009009 } from "../../../../../cards/src/cards/OP14EB04/characters/009-trafalgar-law-op14-009.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-009 Trafalgar Law", () => {
  test("keeps all three official traits", () => {
    expect(op14eb04TrafalgarLawOp14009009.traits).toEqual([
      "Heart Pirates Supernovas The Seven Warlords of the Sea",
    ]);
  });

  test("trashes two selected hand cards to swap its Leader's and one own Character's base power during the battle", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op14eb04TrafalgarLawOp14009009, eb01Doma005],
        hand: [
          op14eb04TrafalgarLawOp14009009,
          op14eb04TrafalgarLawOp14009009,
          op14eb04TrafalgarLawOp14009009,
        ],
      },
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
        hand: [],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const lawId = engine.findCardInZone("south", "character", op14eb04TrafalgarLawOp14009009);
    const ownCharacterId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingCharacterId = engine.findCardInZone("north", "character", eb01Doma005);
    const firstAttackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const secondAttackerId = opposingCharacterId;
    const paymentIds = engine
      .getView("south")
      .players.south.hand.filter((card) => card.cardId === op14eb04TrafalgarLawOp14009009.id)
      .map((card) => card.instanceId)
      .filter((instanceId): instanceId is string => Boolean(instanceId));
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(firstAttackerId, engine.leader("south"), "north");
    const optional = engine.pendingDecision("effectOptional", "south");
    expect(optional.actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const payment = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    if (payment?.kind !== "payCost") throw new Error("Expected Law's two-card trash cost.");
    expect(payment).toMatchObject({ min: 2, max: 2 });
    expect(payment.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining(paymentIds),
    );
    engine.resolveDecision(
      "effectCostTrashFromHand",
      { selectedIds: paymentIds.slice(0, 2) },
      "south",
    );

    const decision = engine.pendingDecision("effectTargetSelection", "south");
    expect(decision.actorId).toBe("south");
    const target = decision.steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Law's Character choice.");
    expect(target).toMatchObject({ min: 1, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([lawId, ownCharacterId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      opposingCharacterId,
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [lawId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.leader.power).toBe(op14eb04TrafalgarLawOp14009009.power);
    expect(view.players.south.characters.find((card) => card?.instanceId === lawId)?.power).toBe(
      5000,
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(paymentIds.slice(0, 2)),
    );

    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.leader.power).toBe(5000);
    expect(view.players.south.characters.find((card) => card?.instanceId === lawId)?.power).toBe(
      op14eb04TrafalgarLawOp14009009.power,
    );
    expect(view.prompts).toHaveLength(0);

    engine.declareAttack(secondAttackerId, engine.leader("south"), "north");
    expect(() => engine.pendingDecision("effectOptional", "south")).toThrow();
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      paymentIds[2],
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may decline the hand cost without swapping power or trashing a card", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op14eb04TrafalgarLawOp14009009],
        hand: [op14eb04TrafalgarLawOp14009009, op14eb04TrafalgarLawOp14009009],
      },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }], hand: [] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const lawId = engine.findCardInZone("south", "character", op14eb04TrafalgarLawOp14009009);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const handIds = engine.getView("south").players.south.hand.map((card) => card.instanceId);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(handIds),
    );
    expect(view.players.south.leader.power).toBe(5000);
    expect(view.players.south.characters.find((card) => card?.instanceId === lawId)?.power).toBe(
      op14eb04TrafalgarLawOp14009009.power,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("Rush allows Law to attack on the turn it is played", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04TrafalgarLawOp14009009],
        activeDon: op14eb04TrafalgarLawOp14009009.cost,
      },
      { hand: [] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.playCard(op14eb04TrafalgarLawOp14009009, "south");
    const lawId = engine.findCardInZone("south", "character", op14eb04TrafalgarLawOp14009009);
    engine.declareAttack(lawId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.north.lifeCount).toBe(lifeBefore - 1);
    expect(view.players.south.characters.find((card) => card?.instanceId === lawId)?.rested).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
