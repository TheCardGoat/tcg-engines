import { eb01Doma005, op01Shanks120, op14eb04Shanks027 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04MonkeyDLuffyOp1434034 } from "../../../../../cards/src/cards/OP14EB04/characters/034-monkey-d-luffy-op14-34.ts";
import { op14eb04PeronaOp14033033 } from "../../../../../cards/src/cards/OP14EB04/characters/033-perona-op14-033.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-033 Perona", () => {
  test("on play protects up to two cost-5-or-less opposing Characters from resting through their next End Phase", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04PeronaOp14033033],
        activeDon: op14eb04PeronaOp14033033.cost,
      },
      {
        character: [
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: op14eb04MonkeyDLuffyOp1434034, playedOnTurn: 0 },
          { card: op14eb04Shanks027, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "south" },
    );
    const firstProtectedId = engine.findCardInZone("north", "character", eb01Doma005);
    const secondProtectedId = engine.findCardInZone(
      "north",
      "character",
      op14eb04MonkeyDLuffyOp1434034,
    );
    const expensiveId = engine.findCardInZone("north", "character", op14eb04Shanks027);

    engine.playCard(op14eb04PeronaOp14033033, "south");
    const decision = engine.pendingDecision("effectTargetSelection", "south");
    expect(decision.actorId).toBe("south");
    const target = decision.steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Perona's protection targets.");
    expect(target).toMatchObject({ min: 0, max: 2 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([firstProtectedId, secondProtectedId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [firstProtectedId, secondProtectedId] },
      "south",
    );

    engine.endTurn("south");
    for (const attackerId of [firstProtectedId, secondProtectedId]) {
      const failure = engine.expectFailure({
        type: "declareAttack",
        seat: "north",
        attackerId,
        targetId: engine.leader("south"),
      });
      expect(failure.reason).toBe("The selected attacker cannot attack.");
    }

    engine.endTurn("north");
    engine.endTurn("south");
    engine.declareAttack(firstProtectedId, engine.leader("south"), "north");

    const view = engine.getView("north");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === firstProtectedId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("on play may choose no Character and leaves an eligible attacker unrestricted", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04PeronaOp14033033],
        activeDon: op14eb04PeronaOp14033033.cost,
      },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "south" },
    );
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op14eb04PeronaOp14033033, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    engine.endTurn("south");
    engine.declareAttack(opposingId, engine.leader("south"), "north");

    const view = engine.getView("north");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opposingId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("on K.O. may rest one own card to play one selected green cost-5-or-less Character from hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op14eb04PeronaOp14033033, rested: true }, eb01Doma005],
        hand: [op14eb04MonkeyDLuffyOp1434034, op14eb04Shanks027, eb01Doma005],
      },
      { character: [{ card: op01Shanks120, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const peronaId = engine.findCardInZone("south", "character", op14eb04PeronaOp14033033);
    const allyId = engine.findCardInZone("south", "character", eb01Doma005);
    const attackerId = engine.findCardInZone("north", "character", op01Shanks120);
    const eligibleId = engine.findCardInZone("south", "hand", op14eb04MonkeyDLuffyOp1434034);
    const expensiveId = engine.findCardInZone("south", "hand", op14eb04Shanks027);
    const wrongColorId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.declareAttack(attackerId, peronaId, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostRestCards", "south").steps[0];
    if (cost?.kind !== "payCost") throw new Error("Expected Perona's rest-card cost.");
    expect(cost).toMatchObject({ min: 1, max: 1 });
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), allyId]),
    );
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(peronaId);
    engine.resolveDecision("effectCostRestCards", { selectedIds: [allyId] }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Perona's hand-play choice.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongColorId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(peronaId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(eligibleId);
    expect(view.players.south.hand.map((card) => card.instanceId)).not.toContain(eligibleId);
    expect(view.players.south.characters.find((card) => card?.instanceId === allyId)?.rested).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("on K.O. may decline without resting a card or playing from hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op14eb04PeronaOp14033033, rested: true }, eb01Doma005],
        hand: [op14eb04MonkeyDLuffyOp1434034],
      },
      { character: [{ card: op01Shanks120, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const peronaId = engine.findCardInZone("south", "character", op14eb04PeronaOp14033033);
    const allyId = engine.findCardInZone("south", "character", eb01Doma005);
    const attackerId = engine.findCardInZone("north", "character", op01Shanks120);
    const handId = engine.findCardInZone("south", "hand", op14eb04MonkeyDLuffyOp1434034);

    engine.declareAttack(attackerId, peronaId, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(peronaId);
    expect(view.players.south.characters.find((card) => card?.instanceId === allyId)?.rested).toBe(
      false,
    );
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(handId);
    expect(view.prompts).toHaveLength(0);
  });
});
