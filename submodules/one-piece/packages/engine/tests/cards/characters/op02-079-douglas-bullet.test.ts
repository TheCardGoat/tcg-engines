import { describe, expect, test } from "vite-plus/test";
import { op02DouglasBullet079, op02Shiki075, op02Shiryu076 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-079 Douglas Bullet", () => {
  test("may return DON!! and rest only an opposing cost-4-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op02DouglasBullet079], activeDon: op02DouglasBullet079.cost + 1 },
      { character: [op02Shiki075, op02Shiryu076, op02DouglasBullet079] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lowerCostEligible = engine.findCardInZone("north", "character", op02Shiki075);
    const eligible = engine.findCardInZone("north", "character", op02Shiryu076);
    const excluded = engine.findCardInZone("north", "character", op02DouglasBullet079);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op02DouglasBullet079, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Douglas Bullet's rest target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(lowerCostEligible);
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligible);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excluded);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligible] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === eligible)?.rested,
    ).toBe(true);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without returning DON!! or resting a Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op02DouglasBullet079], activeDon: op02DouglasBullet079.cost + 1 },
      { character: [op02Shiki075] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const target = engine.findCardInZone("north", "character", op02Shiki075);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op02DouglasBullet079, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === target)?.rested).toBe(
      false,
    );
    expect(view.players.south.donDeckCount).toBe(donDeckBefore);
    expect(view.prompts).toHaveLength(0);
  });
});
