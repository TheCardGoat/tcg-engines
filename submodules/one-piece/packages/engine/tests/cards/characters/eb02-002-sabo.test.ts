import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Inazuma022, eb02Sabo002 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-002 Sabo", () => {
  test("rests itself and maps only another included Revolutionary Army Character", () => {
    const engine = OnePieceTestEngine.create({
      character: [eb02Sabo002, eb01Inazuma022, eb01Doma005],
    });
    const saboId = engine.findCardInZone("south", "character", eb02Sabo002);
    const inazumaId = engine.findCardInZone("south", "character", eb01Inazuma022);

    engine.activateEffect(saboId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") {
      throw new Error("Expected Sabo's other Revolutionary Army Character choice.");
    }
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([inazumaId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [inazumaId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === saboId)?.rested).toBe(
      true,
    );
    expect(
      view.players.south.characters.find((card) => card?.instanceId === inazumaId)?.power,
    ).toBe(9000);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
