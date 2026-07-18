import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op06VinsmokeIchiji061,
  op06VinsmokeNiji064,
  op06VinsmokeSora063,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-063 Vinsmoke Sora", () => {
  test("at equal DON!!, trashes a hand card before recovering a low-power Family Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op06VinsmokeSora063, eb01Doma005, eb01Fourtricks025],
        trash: [op06VinsmokeNiji064, op06VinsmokeIchiji061, eb01Doma005],
        activeDon: 1,
      },
      { activeDon: 1 },
    );
    const discardId = engine.findCardInZone("south", "hand", eb01Doma005);
    const eligibleId = engine.findCardInZone("south", "trash", op06VinsmokeNiji064);
    const tooPowerfulId = engine.findCardInZone("south", "trash", op06VinsmokeIchiji061);
    const wrongTraitId = engine.findCardInZone("south", "trash", eb01Doma005);

    engine.playCard(op06VinsmokeSora063, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discardId] }, "south");
    const recovery = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(recovery).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (recovery?.kind !== "selectEntity") throw new Error("Expected Sora's trash recovery.");
    expect(recovery.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(recovery.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooPowerfulId);
    expect(recovery.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardId);
  });

  test("still pays the optional hand-trash cost when the later DON!! comparison fails", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op06VinsmokeSora063, eb01Doma005, eb01Fourtricks025],
      trash: [op06VinsmokeNiji064],
      activeDon: 2,
    });
    const discardId = engine.findCardInZone("south", "hand", eb01Doma005);
    const unrecoveredId = engine.findCardInZone("south", "trash", op06VinsmokeNiji064);

    engine.playCard(op06VinsmokeSora063, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discardId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([discardId, unrecoveredId]),
    );
    expect(view.prompts).toHaveLength(0);
  });
});
