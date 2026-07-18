import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op06BearKing012,
  op06GildTesoro071,
  op06RaiseMax016,
  op06Ratchet014,
  op06Uta001,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-071 Gild Tesoro", () => {
  test("returns DON!! to recover up to 2 low-cost FILM Characters from trash", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op06Uta001,
      hand: [op06GildTesoro071],
      trash: [op06RaiseMax016, op06Ratchet014, op06BearKing012, eb01Doma005],
      activeDon: 6,
      restedDon: 1,
    });
    const raiseMaxId = engine.findCardInZone("south", "trash", op06RaiseMax016);
    const ratchetId = engine.findCardInZone("south", "trash", op06Ratchet014);
    const expensiveFilmId = engine.findCardInZone("south", "trash", op06BearKing012);
    const nonFilmId = engine.findCardInZone("south", "trash", eb01Doma005);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op06GildTesoro071, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    const recovery = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(recovery).toMatchObject({ kind: "selectEntity", min: 0, max: 2 });
    if (recovery?.kind !== "selectEntity") throw new Error("Expected Tesoro's trash recovery.");
    const candidateIds = recovery.candidates.map((candidate) => candidate.ref.id);
    expect(candidateIds).toEqual(expect.arrayContaining([raiseMaxId, ratchetId]));
    expect(candidateIds).not.toContain(expensiveFilmId);
    expect(candidateIds).not.toContain(nonFilmId);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [raiseMaxId, ratchetId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([raiseMaxId, ratchetId]),
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([expensiveFilmId, nonFilmId]),
    );
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.prompts).toHaveLength(0);
  });

  test("may return DON!! with a non-FILM Leader but does not recover a Character", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op06GildTesoro071],
      trash: [op06RaiseMax016],
      activeDon: 6,
      restedDon: 1,
    });
    const candidateId = engine.findCardInZone("south", "trash", op06RaiseMax016);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op06GildTesoro071, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(candidateId);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.prompts).toHaveLength(0);
  });
});
