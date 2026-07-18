import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op04CorridaColiseum096,
  op10Brook091,
  op10Usopp042,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-091 Brook", () => {
  test("cannot activate without resting a Dressrosa Leader or Stage alongside itself", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op10Brook091],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { character: [eb01Doma005] },
    );
    const brookId = engine.findCardInZone("south", "character", op10Brook091);

    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: brookId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });

  test("pays both rest costs, K.O.'s cost 1 or less, then trashes the top 2 deck cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op10Usopp042,
        character: [op10Brook091],
        stage: op04CorridaColiseum096,
        deck: [eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const brookId = engine.findCardInZone("south", "character", op10Brook091);
    const stageId = engine.findCardInZone("south", "stage", op04CorridaColiseum096);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.activateEffect(brookId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostRestCards", { selectedIds: [stageId] }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Brook's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === brookId)?.rested).toBe(
      true,
    );
    expect(view.players.south.stage?.rested).toBe(true);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(targetId);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.players.south.trash).toHaveLength(2);
    expect(view.prompts).toHaveLength(0);
  });
});
