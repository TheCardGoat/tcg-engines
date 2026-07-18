import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op04CorridaColiseum096,
  op10RoronoaZoro095,
  op10Usopp042,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-095 Roronoa Zoro", () => {
  test("rests a Dressrosa Leader or Stage, K.O.'s cost 4 or less, then trashes the top 2 deck cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op10Usopp042,
        hand: [op10RoronoaZoro095],
        stage: op04CorridaColiseum096,
        deck: [eb01Doma005, eb01Doma005, eb01Doma005],
        activeDon: op10RoronoaZoro095.cost,
      },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const stageId = engine.findCardInZone("south", "stage", op04CorridaColiseum096);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op10RoronoaZoro095, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostRestCards", "south").steps[0];
    if (cost?.kind !== "payCost") throw new Error("Expected Zoro's Dressrosa payment.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), stageId]),
    );
    engine.resolveDecision("effectCostRestCards", { selectedIds: [stageId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Zoro's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.stage?.rested).toBe(true);
    expect(view.players.south.leader.rested).toBe(false);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.south.deckCount).toBe(deckBefore - 2);
    expect(view.prompts).toHaveLength(0);
  });
});
