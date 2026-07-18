import { describe, expect, test } from "vite-plus/test";
import {
  op09Fullalead099,
  op09JesusBurgess086,
  op09Peachbeard094,
  op13Higuma013,
  op13Otama043,
  op13WindmillVillage022,
  op13York094,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-099 Fullalead", () => {
  test("pays both costs, reveals a composite Blackbeard Pirates card, and orders the remainder", () => {
    const engine = OnePieceTestEngine.create({
      stage: op09Fullalead099,
      hand: [op13Otama043, op13York094],
      deck: [op09Peachbeard094, op13Higuma013, op09JesusBurgess086, op13WindmillVillage022],
    });
    const stageId = engine.findCardInZone("south", "stage", op09Fullalead099);
    const keptHandId = engine.findCardInZone("south", "hand", op13Otama043);
    const costId = engine.findCardInZone("south", "hand", op13York094);
    const compositeEligibleId = engine.findCardInZone("south", "deck", op09Peachbeard094);
    const ineligibleId = engine.findCardInZone("south", "deck", op13Higuma013);
    const exactEligibleId = engine.findCardInZone("south", "deck", op09JesusBurgess086);
    const untouchedBottomId = engine.findCardInZone("south", "deck", op13WindmillVillage022);

    engine.activateEffect(stageId, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const costDecision = engine.pendingDecision("effectCostTrashFromHand", "south");
    expect(costDecision.steps[0]).toMatchObject({ kind: "payCost", min: 1, max: 1 });
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [costId] }, "south");

    const searchDecision = engine.pendingDecision("effectSearchSelection", "south");
    const searchStep = searchDecision.steps[0];
    expect(searchDecision.actorId).toBe("south");
    expect(searchStep?.kind).toBe("selectEntity");
    if (searchStep?.kind !== "selectEntity") {
      throw new Error("Expected Fullalead to publish its revealed-card selection.");
    }
    expect(searchStep).toMatchObject({ min: 0, max: 1 });
    expect(
      searchStep.candidates.map((candidate) => ({
        id: candidate.ref.id,
        legal: candidate.legal,
      })),
    ).toEqual([
      { id: compositeEligibleId, legal: true },
      { id: ineligibleId, legal: false },
      { id: exactEligibleId, legal: true },
    ]);

    engine.resolveDecision(
      "effectSearchSelection",
      { selectedIds: [compositeEligibleId] },
      "south",
    );

    const orderDecision = engine.pendingDecision("effectSearchRemainderOrder", "south");
    expect(orderDecision.steps[0]?.kind).toBe("orderItems");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: [exactEligibleId, ineligibleId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.stage?.rested).toBe(true);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([
      keptHandId,
      compositeEligibleId,
    ]);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(costId);
    expect(engine.getState().players.south.deck).toEqual([
      untouchedBottomId,
      exactEligibleId,
      ineligibleId,
    ]);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
