import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op02Hydra090, op06VinsmokeReiju042 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-042 Vinsmoke Reiju", () => {
  test("draws once when a public Event cost returns DON!! to the DON!! deck", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op06VinsmokeReiju042,
        hand: [op02Hydra090, op02Hydra090],
        deck: [eb01Doma005, eb01MountainGod018],
        activeDon: 4,
      },
      { character: [eb01Doma005] },
    );
    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op02Hydra090);
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["rested-don:0"] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);

    engine.playCard(op02Hydra090);
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["rested-don:0"] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([drawnId]);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 2);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
