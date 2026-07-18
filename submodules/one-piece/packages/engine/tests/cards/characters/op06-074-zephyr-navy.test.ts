import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op01Kanjuro038, op06ZephyrNavy074 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-074 Zephyr (Navy)", () => {
  test("returns DON!!, negates, then K.O.s the same power-5000-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op06ZephyrNavy074],
        activeDon: op06ZephyrNavy074.cost + 1,
      },
      {
        hand: [eb01Doma005],
        character: [op01Kanjuro038],
      },
    );
    const targetId = engine.findCardInZone("north", "character", op01Kanjuro038);
    const opposingHandBefore = engine.getView("north").players.north.handCount;
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op06ZephyrNavy074, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Zephyr's negate target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(targetId);
    expect(view.players.north.handCount).toBe(opposingHandBefore);
    expect(view.prompts).toHaveLength(0);
  });

  test("negates but does not K.O. a Character above 5000 power", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op06ZephyrNavy074], activeDon: op06ZephyrNavy074.cost + 1 },
      { character: [eb01MountainGod018] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op06ZephyrNavy074, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.some((card) => card?.instanceId === targetId)).toBe(true);
    expect(view.players.north.trash).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without returning DON!! or selecting a Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op06ZephyrNavy074], activeDon: op06ZephyrNavy074.cost + 1 },
      { character: [eb01Doma005] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    const before = engine.getView("south").players.south;

    engine.playCard(op06ZephyrNavy074, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({
      activeDon: before.activeDon - op06ZephyrNavy074.cost,
      donDeckCount: before.donDeckCount,
    });
    expect(view.players.north.characters.some((card) => card?.instanceId === targetId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
