import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op01Izo033 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-033 Izo", () => {
  test("on play rests only an opposing Character at the cost-4 boundary", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op01Izo033], activeDon: op01Izo033.cost },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const lowCostId = engine.findCardInZone("north", "character", eb01Doma005);
    const highCostId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op01Izo033, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Izo's rest target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([lowCostId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(highCostId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [lowCostId] }, "south");

    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === lowCostId)?.rested,
    ).toBe(true);
  });
});
