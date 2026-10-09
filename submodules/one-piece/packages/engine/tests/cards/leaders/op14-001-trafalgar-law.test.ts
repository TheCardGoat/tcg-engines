import { describe, expect, test } from "vite-plus/test";
import {
  op04TrafalgarLaw087,
  op14eb04MonkeyDLuffyOp14013013,
  op14eb04TrafalgarLawOp14001001,
  op14eb04Urouge002,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP14-001 Trafalgar Law", () => {
  test("maps the two-trait selection and swaps printed base power without erasing DON!! power", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op14eb04TrafalgarLawOp14001001,
      character: [
        op14eb04MonkeyDLuffyOp14013013,
        op04TrafalgarLaw087,
        op14eb04Urouge002,
        "EB01-005",
      ],
      activeDon: 1,
    });
    const luffyId = engine.findCardInZone("south", "character", op14eb04MonkeyDLuffyOp14013013);
    const lawId = engine.findCardInZone("south", "character", op04TrafalgarLaw087);

    engine.attachDon(luffyId, 1, "south");
    engine.activateEffect(engine.leader("south"), "activateMain", "south");

    const selection = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(selection?.kind).toBe("selectEntity");
    if (selection?.kind !== "selectEntity") throw new Error("Expected Law's swap selection.");
    expect(selection.candidates.map((candidate) => candidate.ref.id)).toEqual([
      luffyId,
      lawId,
      engine.findCardInZone("south", "character", op14eb04Urouge002),
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [luffyId, lawId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === luffyId)?.power).toBe(
      8000,
    );
    expect(view.players.south.characters.find((card) => card?.instanceId === lawId)?.power).toBe(0);

    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === luffyId)?.power).toBe(
      0,
    );
    expect(view.players.south.characters.find((card) => card?.instanceId === lawId)?.power).toBe(
      7000,
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
  test("keeps the swapped base power after the other selected Character leaves", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op14eb04TrafalgarLawOp14001001,
      character: [op14eb04MonkeyDLuffyOp14013013, op04TrafalgarLaw087, op14eb04Urouge002],
      hand: ["OP01-047"],
      activeDon: 5,
    });
    const luffy = engine.findCardInZone("south", "character", op14eb04MonkeyDLuffyOp14013013);
    const law = engine.findCardInZone("south", "character", op04TrafalgarLaw087);
    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [luffy, law] }, "south");
    engine.playCard("OP01-047", "south");
    engine.accept("south");
    engine.resolveDecision("effectCostReturnCharacter", { selectedIds: [luffy] }, "south");
    engine.resolveDecision("effectPlaySelection", { selectedIds: [] }, "south");
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      luffy,
    );
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === law)
        ?.power,
    ).toBe(0);
    engine.endTurn("south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === law)
        ?.power,
    ).toBe(7000);
  });
});
