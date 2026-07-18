import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op08TashigiSp006 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST06-006 Tashigi", () => {
  test("rests itself to give an opposing Character -2 cost for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op08TashigiSp006] },
      { character: [eb01MountainGod018] },
    );
    const tashigiId = engine.findCardInZone("south", "character", op08TashigiSp006);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.activateEffect(tashigiId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Tashigi's cost target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    let view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === tashigiId)?.rested,
    ).toBe(true);
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      3,
    );

    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      5,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
