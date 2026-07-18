import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op04Sugar024, op05Monet036 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-036 Monet", () => {
  test("blocks an attack, then may rest only an opposing cost-4-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op05Monet036] },
      {
        character: [eb01Doma005, eb01MountainGod018, { card: op04Sugar024, playedOnTurn: 0 }],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const monetId = engine.findCardInZone("south", "character", op05Monet036);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const ineligibleId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const attackerId = engine.findCardInZone("north", "character", op04Sugar024);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Monet's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(monetId);
    engine.resolveDecision("battleBlocker", { selectedIds: [monetId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Monet's On Block target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(ineligibleId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.characters.find((card) => card?.instanceId === monetId)?.rested).toBe(
      true,
    );
    expect(
      view.players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
