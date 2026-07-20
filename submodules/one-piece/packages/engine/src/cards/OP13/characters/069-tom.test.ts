import { eb01Doma005, op06TheArkNoah041, op08Zou039 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op13Tom069 } from "../../../../../cards/src/cards/OP13/characters/069-tom.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-069 Tom", () => {
  test("may return one DON!! to recover only a cost-3-or-less Stage from trash", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13Tom069],
      trash: [op08Zou039, op06TheArkNoah041, eb01Doma005],
      activeDon: op13Tom069.cost + 1,
    });
    const eligibleId = engine.findCardInZone("south", "trash", op08Zou039);
    const expensiveId = engine.findCardInZone("south", "trash", op06TheArkNoah041);
    const nonStageId = engine.findCardInZone("south", "trash", eb01Doma005);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op13Tom069, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Tom's Stage choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(nonStageId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without returning DON!! or recovering a Stage", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13Tom069],
      trash: [op08Zou039],
      activeDon: op13Tom069.cost + 1,
    });
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op13Tom069, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore);
    expect(view.players.south.trash).toHaveLength(1);
    expect(view.prompts).toHaveLength(0);
  });
});
