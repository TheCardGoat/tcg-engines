import { describe, expect, test } from "vite-plus/test";
import { op06VinsmokeReiju042, op06VinsmokeReiju068, op06VinsmokeReiju069 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-068 Vinsmoke Reiju", () => {
  test("returns DON!! and trashes itself to play the cost-4 Reiju from trash with a GERMA 66 Leader", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op06VinsmokeReiju042,
      character: [{ card: op06VinsmokeReiju068, attachedDon: 1 }],
      trash: [op06VinsmokeReiju069],
      activeDon: 1,
    });
    const sourceId = engine.findCardInZone("south", "character", op06VinsmokeReiju068);
    const playableId = engine.findCardInZone("south", "trash", op06VinsmokeReiju069);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (play?.kind !== "selectEntity") throw new Error("Expected Reiju's play selection.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([playableId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [playableId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(sourceId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(playableId);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.prompts).toHaveLength(0);
  });

  test("may pay both costs with a non-GERMA Leader but does not play Reiju", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op06VinsmokeReiju069],
      character: [{ card: op06VinsmokeReiju068, attachedDon: 1 }],
      activeDon: 1,
    });
    const sourceId = engine.findCardInZone("south", "character", op06VinsmokeReiju068);
    const playableId = engine.findCardInZone("south", "hand", op06VinsmokeReiju069);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(sourceId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(playableId);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.prompts).toHaveLength(0);
  });
});
