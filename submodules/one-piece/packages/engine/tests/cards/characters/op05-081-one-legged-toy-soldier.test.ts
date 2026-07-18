import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op05OneLeggedToySoldier081 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-081 One-Legged Toy Soldier", () => {
  test("may trash itself and choose up to one opposing Character to lose 3 cost this turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op05OneLeggedToySoldier081], activeDon: 1 },
      { character: [eb01MountainGod018] },
    );
    const soldierId = engine.findCardInZone("south", "character", op05OneLeggedToySoldier081);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    engine.attachDon(soldierId, 1, "south");

    engine.activateEffect(soldierId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected the cost-reduction target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(soldierId);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 1 });
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      2,
    );

    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      eb01MountainGod018.cost,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without trashing itself or changing the opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op05OneLeggedToySoldier081] },
      { character: [eb01MountainGod018] },
    );
    const soldierId = engine.findCardInZone("south", "character", op05OneLeggedToySoldier081);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.activateEffect(soldierId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(soldierId);
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      eb01MountainGod018.cost,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
