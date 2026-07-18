import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op02Tsuru106,
  op03Jerry084,
  op05SaintMjosgard089,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-089 Saint Mjosgard", () => {
  test("rests one DON!!, itself, and another Character before recovering only a black cost-1 Character", () => {
    const engine = OnePieceTestEngine.create({
      character: [op05SaintMjosgard089, eb01Doma005, eb01Fourtricks025],
      trash: [op02Tsuru106, op03Jerry084, eb01Doma005],
      activeDon: 1,
    });
    const mjosgardId = engine.findCardInZone("south", "character", op05SaintMjosgard089);
    const paymentId = engine.findCardInZone("south", "character", eb01Doma005);
    const otherPaymentId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const eligibleId = engine.findCardInZone("south", "trash", op02Tsuru106);
    const tooExpensiveId = engine.findCardInZone("south", "trash", op03Jerry084);
    const wrongColorId = engine.findCardInZone("south", "trash", eb01Doma005);

    engine.activateEffect(mjosgardId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const payment = engine.pendingDecision("effectCostRestCards", "south").steps[0];
    expect(payment).toMatchObject({ kind: "payCost", min: 1, max: 1 });
    if (payment?.kind !== "payCost") throw new Error("Expected Mjosgard's Character-rest cost.");
    expect(payment.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([paymentId, otherPaymentId]),
    );
    expect(payment.candidates.map((candidate) => candidate.ref.id)).not.toContain(mjosgardId);
    engine.resolveDecision("effectCostRestCards", { selectedIds: [paymentId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Mjosgard's trash target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toEqual(
      expect.arrayContaining([tooExpensiveId, wrongColorId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 1 });
    expect(
      view.players.south.characters.find((card) => card?.instanceId === mjosgardId)?.rested,
    ).toBe(true);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === paymentId)?.rested,
    ).toBe(true);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === otherPaymentId)?.rested,
    ).toBe(false);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });
});
