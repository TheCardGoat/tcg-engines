import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op09ShachiPenguin003 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-003 Shachi & Penguin", () => {
  test("when attacking gives one opposing Character -2000 through turn end", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op09ShachiPenguin003, playedOnTurn: 0 }] },
      { character: [eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", op09ShachiPenguin003);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Shachi & Penguin's target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe((eb01MountainGod018.power ?? 0) - 2000);
    engine.endTurn("south");
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe(eb01MountainGod018.power);
  });
});
