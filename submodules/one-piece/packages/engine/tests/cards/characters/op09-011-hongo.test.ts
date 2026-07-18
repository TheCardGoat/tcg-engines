import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op09Hongo011, op09Shanks001 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-011 Hongo", () => {
  test("rests itself to give an opposing Character minus 2000 power with a Red-Haired Pirates Leader", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op09Shanks001, character: [op09Hongo011] },
      { character: [eb01MountainGod018] },
    );
    const hongoId = engine.findCardInZone("south", "character", op09Hongo011);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.activateEffect(hongoId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Hongo's power target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === hongoId)?.rested).toBe(
      true,
    );
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      5000,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may pay the rest cost but gives no power without the required Leader type", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op09Hongo011] },
      { character: [eb01MountainGod018] },
    );
    const hongoId = engine.findCardInZone("south", "character", op09Hongo011);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.activateEffect(hongoId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === hongoId)?.rested).toBe(
      true,
    );
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      7000,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
