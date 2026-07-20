import {
  eb01Doma005,
  eb01Fourtricks025,
  eb02Enel052,
  op01Shanks120,
  op06GeckoMoria086,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04CrocodileOp14120120 } from "../../../../../cards/src/cards/OP14EB04/characters/120-crocodile-op14-120.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-120 Crocodile", () => {
  test("on play restricts an eligible opponent and draws for their cost-8 Character until the correct expiry", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04CrocodileOp14120120],
        deck: [eb01Fourtricks025, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        activeDon: op14eb04CrocodileOp14120120.cost,
      },
      {
        character: [
          { card: op06GeckoMoria086, playedOnTurn: 0 },
          { card: eb02Enel052, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "south" },
    );
    const eligibleId = engine.findCardInZone("north", "character", op06GeckoMoria086);
    const expensiveId = engine.findCardInZone("north", "character", eb02Enel052);
    const drawnId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.playCard(op14eb04CrocodileOp14120120, "south");
    const decision = engine.pendingDecision("effectTargetSelection", "south");
    expect(decision.actorId).toBe("south");
    const target = decision.steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Crocodile's attack target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      drawnId,
    );
    engine.endTurn("south");
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "north",
        attackerId: eligibleId,
        targetId: engine.leader("south"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");

    engine.endTurn("north");
    engine.endTurn("south");
    engine.declareAttack(eligibleId, engine.leader("south"), "north");
    expect(engine.getView("north").prompts).toHaveLength(0);
  });

  test("on play does not draw when only its controller has a cost-8 Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04CrocodileOp14120120],
        deck: [eb01Fourtricks025, eb01Doma005],
        activeDon: op14eb04CrocodileOp14120120.cost,
      },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
    );
    const deckTopId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.playCard(op14eb04CrocodileOp14120120, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).not.toContain(deckTopId);
    expect(engine.findCardInZone("south", "deck", eb01Fourtricks025)).toBe(deckTopId);
    expect(view.prompts).toHaveLength(0);
  });

  test("on K.O. may trash one selected physical hand card to replay only this Crocodile", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op14eb04CrocodileOp14120120, rested: true }],
        hand: [eb01Doma005, eb01Fourtricks025],
      },
      { character: [{ card: op01Shanks120, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const crocodileId = engine.findCardInZone("south", "character", op14eb04CrocodileOp14120120);
    const paymentId = engine.findCardInZone("south", "hand", eb01Doma005);
    const retainedId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const attackerId = engine.findCardInZone("north", "character", op01Shanks120);

    engine.declareAttack(attackerId, crocodileId, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    if (cost?.kind !== "payCost") throw new Error("Expected Crocodile's hand-trash cost.");
    expect(cost).toMatchObject({ min: 1, max: 1 });
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([paymentId, retainedId]),
    );
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paymentId] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(crocodileId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(paymentId);
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(crocodileId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(retainedId);
    expect(view.prompts).toHaveLength(0);
  });

  test("on K.O. may decline without paying or replaying itself", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op14eb04CrocodileOp14120120, rested: true }],
        hand: [eb01Doma005],
      },
      { character: [{ card: op01Shanks120, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const crocodileId = engine.findCardInZone("south", "character", op14eb04CrocodileOp14120120);
    const handId = engine.findCardInZone("south", "hand", eb01Doma005);
    const attackerId = engine.findCardInZone("north", "character", op01Shanks120);

    engine.declareAttack(attackerId, crocodileId, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(crocodileId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(
      crocodileId,
    );
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(handId);
    expect(view.prompts).toHaveLength(0);
  });
});
