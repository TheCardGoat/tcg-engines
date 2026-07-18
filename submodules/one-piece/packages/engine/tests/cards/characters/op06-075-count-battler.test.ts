import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op02Shiki075,
  op06CountBattler075,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-075 Count Battler", () => {
  test("returns one DON!! before resting up to two opposing cost-2-or-less Characters", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op06CountBattler075], activeDon: op06CountBattler075.cost + 1 },
      { character: [eb01Doma005, op02Shiki075, eb01Fourtricks025, eb01MountainGod018] },
    );
    const costOneId = engine.findCardInZone("north", "character", eb01Doma005);
    const costTwoId = engine.findCardInZone("north", "character", op02Shiki075);
    const costThreeId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const costFiveId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op06CountBattler075, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Count Battler's rest targets.");
    expect(target).toMatchObject({ min: 0, max: 2 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([costOneId, costTwoId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(costThreeId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(costFiveId);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [costOneId, costTwoId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === costOneId)?.rested,
    ).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === costTwoId)?.rested,
    ).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === costThreeId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without returning DON!! or resting a Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op06CountBattler075], activeDon: op06CountBattler075.cost + 1 },
      { character: [eb01Doma005] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op06CountBattler075, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });
});
