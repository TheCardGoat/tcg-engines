import { describe, expect, test } from "vite-plus/test";
import {
  op02Blugori084,
  op02ImpelDown092,
  op02MonkeyDLuffy062,
  op02Saldeath074,
  op13Higuma013,
  op13Otama043,
  op13York094,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-092 Impel Down", () => {
  test("pays both costs, reveals an eligible top card, and orders the remainder on the deck bottom", () => {
    const engine = OnePieceTestEngine.create({
      stage: op02ImpelDown092,
      hand: [op13Otama043, op13York094],
      deck: [op02MonkeyDLuffy062, op13Higuma013, op02Saldeath074, op02Blugori084],
    });
    const stageId = engine.findCardInZone("south", "stage", op02ImpelDown092);
    const keptHandId = engine.findCardInZone("south", "hand", op13Otama043);
    const costId = engine.findCardInZone("south", "hand", op13York094);
    const luffyId = engine.findCardInZone("south", "deck", op02MonkeyDLuffy062);
    const higumaId = engine.findCardInZone("south", "deck", op13Higuma013);
    const saldeathId = engine.findCardInZone("south", "deck", op02Saldeath074);
    const untouchedBottomId = engine.findCardInZone("south", "deck", op02Blugori084);

    engine.activateEffect(stageId, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const costDecision = engine.pendingDecision("effectCostTrashFromHand", "south");
    expect(costDecision.steps[0]).toMatchObject({
      kind: "payCost",
      min: 1,
      max: 1,
    });
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [costId] }, "south");

    const searchDecision = engine.pendingDecision("effectSearchSelection", "south");
    const searchStep = searchDecision.steps[0];
    expect(searchStep?.kind).toBe("selectEntity");
    if (searchStep?.kind !== "selectEntity") {
      throw new Error("Expected Impel Down to publish its revealed-card selection.");
    }
    expect(searchStep.min).toBe(0);
    expect(searchStep.max).toBe(1);
    expect(
      searchStep.candidates.map((candidate) => ({
        id: candidate.ref.id,
        legal: candidate.legal,
      })),
    ).toEqual([
      { id: luffyId, legal: true },
      { id: higumaId, legal: false },
      { id: saldeathId, legal: true },
    ]);

    engine.resolveDecision("effectSearchSelection", { selectedIds: [luffyId] }, "south");

    const orderDecision = engine.pendingDecision("effectSearchRemainderOrder", "south");
    const orderStep = orderDecision.steps[0];
    expect(orderDecision.kind).toBe("orderItems");
    expect(orderStep?.kind).toBe("orderItems");
    if (orderStep?.kind !== "orderItems") {
      throw new Error("Expected Impel Down to publish bottom-deck ordering.");
    }
    expect(orderStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      higumaId,
      saldeathId,
    ]);

    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: [saldeathId, higumaId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.stage?.rested).toBe(true);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([keptHandId, luffyId]);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(costId);
    expect(engine.getState().players.south.deck).toEqual([untouchedBottomId, saldeathId, higumaId]);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
