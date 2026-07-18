import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op04CorridaColiseum096,
  op10Bartolomeo052,
  op10Mansherry056,
  op10Usopp042,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP10-056 Mansherry", () => {
  test("rests a Dressrosa Stage, returns a high-cost Dressrosa Character, then bounces an opponent", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op10Usopp042,
        hand: [op10Mansherry056],
        character: [op10Bartolomeo052],
        stage: op04CorridaColiseum096,
        activeDon: op10Mansherry056.cost,
      },
      { character: [eb01Doma005] },
    );
    const leaderId = engine.leader("south");
    const stageId = engine.findCardInZone("south", "stage", op04CorridaColiseum096);
    const returnedId = engine.findCardInZone("south", "character", op10Bartolomeo052);
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op10Mansherry056, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const rest = engine.pendingDecision("effectCostRestCards", "south").steps[0];
    if (rest?.kind !== "payCost") throw new Error("Expected Mansherry's rest cost.");
    expect(rest.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([leaderId, stageId]),
    );
    engine.resolveDecision("effectCostRestCards", { selectedIds: [stageId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Mansherry's bounce choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(opposingId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposingId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.stage?.rested).toBe(true);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(returnedId);
    expect(engine.getState().players.north.hand).toContain(opposingId);
    expect(view.prompts).toHaveLength(0);
  });
});
