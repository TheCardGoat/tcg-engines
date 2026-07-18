import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op06KouzukiHiyori106, op06TenguyamaHitetsu108 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-108 Tenguyama Hitetsu", () => {
  test("Life Trigger gives a compound Land of Wano Character +2000 for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { character: [op06KouzukiHiyori106], life: [op06TenguyamaHitetsu108] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const hiyoriId = engine.findCardInZone("north", "character", op06KouzukiHiyori106);
    const triggerId = engine.findCardInZone("north", "life", op06TenguyamaHitetsu108);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Hitetsu's power recipient.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(hiyoriId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [hiyoriId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.find((card) => card?.instanceId === hiyoriId)?.power).toBe(
      2000,
    );
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(triggerId);
    expect(view.prompts).toHaveLength(0);
  });
});
