import { describe, expect, test } from "vite-plus/test";
import {
  eb01Fourtricks025,
  op04CorridaColiseum096,
  op04Rebecca039,
  op10KouzukiMomonosuke083,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-083 Kouzuki Momonosuke", () => {
  test("rests itself and a chosen Dressrosa Leader or Stage before reducing cost", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op04Rebecca039,
        character: [op10KouzukiMomonosuke083],
        stage: op04CorridaColiseum096,
      },
      { character: [eb01Fourtricks025] },
    );
    const momonosukeId = engine.findCardInZone("south", "character", op10KouzukiMomonosuke083);
    const stageId = engine.findCardInZone("south", "stage", op04CorridaColiseum096);
    const targetId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.activateEffect(momonosukeId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostRestCards", "south").steps[0];
    if (cost?.kind !== "payCost") {
      throw new Error("Expected Momonosuke's Dressrosa Leader-or-Stage rest cost.");
    }
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), stageId]),
    );
    engine.resolveDecision("effectCostRestCards", { selectedIds: [stageId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Momonosuke's cost target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    let view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === momonosukeId)?.rested,
    ).toBe(true);
    expect(view.players.south.stage?.rested).toBe(true);
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      1,
    );
    expect(view.prompts).toHaveLength(0);

    engine.endTurn("south");
    view = engine.getView("north");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      3,
    );
  });
});
