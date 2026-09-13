import { describe, expect, test } from "vite-plus/test";
import {
  op14eb04CrocodileOp14079079,
  op14eb04Diamante066,
  op14eb04Kumacy102,
  op14eb04MissDoublefingerZala086,
  op14eb04Mr9095,
  op14eb04SpiderMice081,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP14-079 Crocodile", () => {
  test("K.O.s a Baroque Works cost, reduces an opposing Character's cost, and may mill two", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op14eb04CrocodileOp14079079,
        character: [op14eb04Mr9095, op14eb04MissDoublefingerZala086],
        deck: [op14eb04Mr9095, op14eb04Mr9095, op14eb04Mr9095],
      },
      { character: [op14eb04Diamante066] },
    );
    const paymentId = engine.findCardInZone("south", "character", op14eb04Mr9095);
    const targetId = engine.findCardInZone("north", "character", op14eb04Diamante066);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostKoCharacter", { selectedIds: [paymentId] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");
    engine.resolveDecision("effectActionChoice", { optionId: "0" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(paymentId);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      0,
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("prevents its own effects from removing opposing Characters", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op14eb04CrocodileOp14079079,
        character: [{ card: op14eb04SpiderMice081, rested: true, playedOnTurn: 0 }],
      },
      {
        character: [
          { card: op14eb04Diamante066, playedOnTurn: 0 },
          { card: op14eb04Kumacy102, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const spiderMiceId = engine.findCardInZone("south", "character", op14eb04SpiderMice081);
    const attackerId = engine.findCardInZone("north", "character", op14eb04Diamante066);
    const protectedId = engine.findCardInZone("north", "character", op14eb04Kumacy102);

    engine.declareAttack(attackerId, spiderMiceId, "north");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Spider Mice's K.O. target.");
    expect(target.candidates).toEqual([]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(protectedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    expect(
      engine.getView("south").players.north.characters.map((card) => card?.instanceId),
    ).toContain(protectedId);
    expect(engine.getView("south").players.north.trash).toEqual([]);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op14eb04CrocodileOp14079079,
        character: [op14eb04Mr9095, op14eb04MissDoublefingerZala086],
        deck: [op14eb04Mr9095, op14eb04Mr9095, op14eb04Mr9095],
      },
      { character: [op14eb04Diamante066] },
    );
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
});
