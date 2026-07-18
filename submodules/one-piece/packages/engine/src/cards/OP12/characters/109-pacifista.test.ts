import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018 } from "@tcg/op-cards";
import { op12Pacifista109 } from "../../../../../cards/src/cards/OP12/characters/109-pacifista.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-109 Pacifista", () => {
  test("its Life Trigger K.O.s only an opponent cost-1 Character and adds itself to hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [eb01Doma005, eb01MountainGod018] },
      { life: [op12Pacifista109] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const eligibleId = engine.findCardInZone("south", "character", eb01Doma005);
    const excludedId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const pacifistaId = engine.findCardInZone("north", "life", op12Pacifista109);

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    expect(engine.pendingDecision("lifeTrigger", "north").actorId).toBe("north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Pacifista's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "north");

    const view = engine.getView("north");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(pacifistaId);
    expect(view.prompts).toHaveLength(0);
  });
});
