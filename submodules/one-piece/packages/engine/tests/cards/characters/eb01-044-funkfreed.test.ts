import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Funkfreed044, op03Spandam086 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-044 Funkfreed", () => {
  test("rests itself and maps only a Spandam Character for the turn power bonus", () => {
    const engine = OnePieceTestEngine.create({
      character: [eb01Funkfreed044, op03Spandam086, eb01Doma005],
    });
    const funkfreedId = engine.findCardInZone("south", "character", eb01Funkfreed044);
    const spandamId = engine.findCardInZone("south", "character", op03Spandam086);

    engine.activateEffect(funkfreedId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") {
      throw new Error("Expected Funkfreed's Spandam power target choice.");
    }
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([spandamId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [spandamId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === funkfreedId)?.rested,
    ).toBe(true);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === spandamId)?.power,
    ).toBe(5000);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
