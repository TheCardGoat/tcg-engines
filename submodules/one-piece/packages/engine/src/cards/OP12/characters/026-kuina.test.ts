import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op12RoronoaZoro020 } from "@tcg/op-cards";
import { op12Kuina026 } from "../../../../../cards/src/cards/OP12/characters/026-kuina.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-026 Kuina", () => {
  test("rests an eligible opponent, then gives three rested DON!! to Roronoa Zoro", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op12RoronoaZoro020,
        character: [op12Kuina026],
        restedDon: 3,
      },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const kuinaId = engine.findCardInZone("south", "character", op12Kuina026);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.activateEffect(kuinaId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Kuina's rest target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");
    engine.resolveDecision("effectGiveDonCount", { optionId: "3" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader.attachedDon).toBe(3);
    expect(view.players.south.restedDon).toBe(0);
    expect(view.players.south.characters.find((card) => card?.instanceId === kuinaId)?.rested).toBe(
      true,
    );
    expect(
      view.players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
