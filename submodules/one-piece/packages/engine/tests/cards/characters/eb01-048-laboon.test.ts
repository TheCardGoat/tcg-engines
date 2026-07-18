import { describe, expect, test } from "vite-plus/test";
import { eb01Laboon048, eb01MountainGod018 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-048 Laboon", () => {
  test("rests itself and maps an opponent Character for the turn cost reduction", () => {
    const engine = OnePieceTestEngine.create(
      { character: [eb01Laboon048] },
      { character: [eb01MountainGod018] },
    );
    const laboonId = engine.findCardInZone("south", "character", eb01Laboon048);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.activateEffect(laboonId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === laboonId)?.rested,
    ).toBe(true);
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      1,
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
