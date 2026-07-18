import { describe, expect, test } from "vite-plus/test";
import { op02Saldeath074, op02Shiki075, op02Shiryu076 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-076 Shiryu", () => {
  test("may return DON!! and K.O. only an opposing cost-1-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op02Shiryu076], activeDon: op02Shiryu076.cost + 1 },
      { character: [op02Saldeath074, op02Shiki075] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const eligible = engine.findCardInZone("north", "character", op02Saldeath074);
    const excluded = engine.findCardInZone("north", "character", op02Shiki075);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op02Shiryu076, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Shiryu's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligible);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excluded);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligible] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligible);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without returning DON!! or K.O.ing a Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op02Shiryu076], activeDon: op02Shiryu076.cost + 1 },
      { character: [op02Saldeath074] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const target = engine.findCardInZone("north", "character", op02Saldeath074);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op02Shiryu076, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.some((card) => card?.instanceId === target)).toBe(true);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore);
    expect(view.prompts).toHaveLength(0);
  });
});
