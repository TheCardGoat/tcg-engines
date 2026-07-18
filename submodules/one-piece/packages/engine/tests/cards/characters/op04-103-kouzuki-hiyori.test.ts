import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op04KouzukiHiyori103 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-103 Kouzuki Hiyori", () => {
  test("gives an included Land of Wano Character +1000 for this turn", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op04KouzukiHiyori103],
      character: [eb01MountainGod018],
      activeDon: op04KouzukiHiyori103.cost,
    });
    const mountainGodId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.playCard(op04KouzukiHiyori103, "south");
    const hiyoriId = engine.findCardInZone("south", "character", op04KouzukiHiyori103);
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Hiyori's power target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([
      mountainGodId,
      hiyoriId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [mountainGodId] }, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === mountainGodId)?.power,
    ).toBe(8000);

    engine.endTurn("south");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === mountainGodId)?.power,
    ).toBe(7000);
  });

  test("Life Trigger plays the resolving physical card before its On Play choice", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op04KouzukiHiyori103] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const hiyoriId = engine.findCardInZone("north", "life", op04KouzukiHiyori103);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Hiyori's On Play choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([hiyoriId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [hiyoriId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === hiyoriId)).toBe(true);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(hiyoriId);
    expect(view.prompts).toHaveLength(0);
  });
});
