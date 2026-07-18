import { describe, expect, test } from "vite-plus/test";
import { op14eb04JinbeOp14040040, op14eb04Mr9095, op14eb04Shirahoshi047 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP14-040 Jinbe", () => {
  test("trashes from hand and maps either Fish-Man or Merfolk recipients for rested DON!!", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op14eb04JinbeOp14040040,
      hand: [op14eb04Mr9095, op14eb04Mr9095],
      character: [op14eb04Shirahoshi047, op14eb04Mr9095],
      restedDon: 2,
    });
    const paymentId = engine.findCardInZone("south", "hand", op14eb04Mr9095);
    const shirahoshiId = engine.findCardInZone("south", "character", op14eb04Shirahoshi047);
    const excludedId = engine.findCardInZone("south", "character", op14eb04Mr9095);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paymentId] }, "south");
    engine.resolveDecision("effectGiveDonCount", { optionId: "2" }, "south");

    const recipient = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(recipient?.kind).toBe("selectEntity");
    if (recipient?.kind !== "selectEntity") throw new Error("Expected Jinbe's recipient choice.");
    expect(recipient.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("south"),
      shirahoshiId,
    ]);
    expect(recipient.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [shirahoshiId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.restedDon).toBe(0);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === shirahoshiId)?.attachedDon,
    ).toBe(2);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(paymentId);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
