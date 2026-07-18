import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op04CorridaColiseum096,
  op04Rebecca039,
  op10Baby5076,
  op10Usopp081,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-081 Usopp", () => {
  test("rests a Dressrosa Leader or Stage, K.O.s cost 2 or less, then trashes two deck cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op04Rebecca039,
        hand: [op10Usopp081],
        life: 5,
        stage: op04CorridaColiseum096,
        deck: [eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
        activeDon: op10Usopp081.cost,
      },
      { character: [eb01Doma005, op10Baby5076] },
    );
    const stageId = engine.findCardInZone("south", "stage", op04CorridaColiseum096);
    const koId = engine.findCardInZone("north", "character", eb01Doma005);
    const tooExpensiveId = engine.findCardInZone("north", "character", op10Baby5076);
    const firstDeckId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const secondDeckId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.playCard(op10Usopp081, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostRestCards", "south").steps[0];
    expect(cost).toMatchObject({ kind: "payCost", min: 1, max: 1 });
    if (cost?.kind !== "payCost") throw new Error("Expected Usopp's Leader-or-Stage cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), stageId]),
    );
    engine.resolveDecision("effectCostRestCards", { selectedIds: [stageId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Usopp's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([koId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [koId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.stage?.instanceId).toBe(stageId);
    expect(view.players.south.stage?.rested).toBe(true);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(koId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstDeckId, secondDeckId]),
    );
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });
});
