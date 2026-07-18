import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op06Hyouzou034, op06Ratchet014 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-034 Hyouzou", () => {
  test("once per turn may rest a cost-4-or-less opponent, gains power, and takes Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op06Hyouzou034],
        life: [op06Ratchet014],
      },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const hyouzouId = engine.findCardInZone("south", "character", op06Hyouzou034);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const tooExpensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeId = engine.findCardInZone("south", "life", op06Ratchet014);

    engine.activateEffect(hyouzouId, "activateMain", "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Hyouzou's rest target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === hyouzouId)?.power,
    ).toBe(7000);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(lifeId);
    expect(view.players.south.lifeCount).toBe(0);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: hyouzouId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });
});
