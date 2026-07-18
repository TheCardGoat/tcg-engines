import { describe, expect, test } from "vite-plus/test";
import { op10FightingFish069, op10Giolla066, op10Sugar065 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP10-069 Fighting Fish", () => {
  test("with DON!! attached may return one DON!! to K.O. a cost-1-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op10FightingFish069, attachedDon: 1, playedOnTurn: 0 }],
        activeDon: 1,
      },
      { character: [op10Sugar065, op10Giolla066] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const fightingFishId = engine.findCardInZone("south", "character", op10FightingFish069);
    const eligibleId = engine.findCardInZone("north", "character", op10Sugar065);
    const expensiveId = engine.findCardInZone("north", "character", op10Giolla066);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.declareAttack(fightingFishId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Fighting Fish's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(expensiveId);
    expect(view.prompts).toHaveLength(0);
  });
});
