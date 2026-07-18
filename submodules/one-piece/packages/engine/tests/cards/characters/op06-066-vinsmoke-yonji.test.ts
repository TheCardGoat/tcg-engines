import { describe, expect, test } from "vite-plus/test";
import { op06VinsmokeReiju042, op06VinsmokeYonji066, op06VinsmokeYonji067 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-066 Vinsmoke Yonji", () => {
  test("returns DON!! and trashes itself to play the cost-4 Yonji from hand with a GERMA 66 Leader", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op06VinsmokeReiju042,
      hand: [op06VinsmokeYonji067],
      character: [{ card: op06VinsmokeYonji066, attachedDon: 1 }],
      activeDon: 1,
    });
    const sourceId = engine.findCardInZone("south", "character", op06VinsmokeYonji066);
    const playableId = engine.findCardInZone("south", "hand", op06VinsmokeYonji067);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const donCost = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    expect(donCost).toMatchObject({ kind: "payCost", min: 1, max: 1 });
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (play?.kind !== "selectEntity") throw new Error("Expected Yonji's play selection.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([playableId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [playableId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(sourceId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(playableId);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.prompts).toHaveLength(0);
  });

  test("may pay both costs with a non-GERMA Leader but does not play Yonji", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op06VinsmokeYonji067],
      character: [{ card: op06VinsmokeYonji066, attachedDon: 1 }],
      activeDon: 1,
    });
    const sourceId = engine.findCardInZone("south", "character", op06VinsmokeYonji066);
    const playableId = engine.findCardInZone("south", "hand", op06VinsmokeYonji067);
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
