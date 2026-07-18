import { describe, expect, test } from "vite-plus/test";
import { eb01Bingoh016, eb01Blueno017, eb01Doma005, eb01ScratchmenApoo015 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-016 Bingoh", () => {
  test("rests as its cost and maps only a rested opposing 1-cost Character for K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { character: [eb01Bingoh016] },
      {
        character: [
          { card: eb01Doma005, rested: true },
          eb01ScratchmenApoo015,
          { card: eb01Blueno017, rested: true },
        ],
      },
    );
    const bingohId = engine.findCardInZone("south", "character", eb01Bingoh016);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const activeId = engine.findCardInZone("north", "character", eb01ScratchmenApoo015);
    const highCostId = engine.findCardInZone("north", "character", eb01Blueno017);

    engine.activateEffect(bingohId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") {
      throw new Error("Expected Bingoh's rested 1-cost Character choice.");
    }
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(activeId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(highCostId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === bingohId)?.rested,
    ).toBe(true);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
  });
});
