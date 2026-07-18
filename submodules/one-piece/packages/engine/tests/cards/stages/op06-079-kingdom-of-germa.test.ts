import { describe, expect, test } from "vite-plus/test";
import {
  op06Cosette072,
  op06KingdomOfGerma079,
  op06VinsmokeSora063,
  op13Higuma013,
  op13Otama043,
  op13York094,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-079 Kingdom of GERMA", () => {
  test("pays both costs and searches cards with an included GERMA type", () => {
    const engine = OnePieceTestEngine.create({
      stage: op06KingdomOfGerma079,
      hand: [op13Otama043, op13York094],
      deck: [op06VinsmokeSora063, op13Higuma013, op06Cosette072, op13Otama043],
    });
    const stageId = engine.findCardInZone("south", "stage", op06KingdomOfGerma079);
    const keptHandId = engine.findCardInZone("south", "hand", op13Otama043);
    const costId = engine.findCardInZone("south", "hand", op13York094);
    const compositeEligibleId = engine.findCardInZone("south", "deck", op06VinsmokeSora063);
    const ineligibleId = engine.findCardInZone("south", "deck", op13Higuma013);
    const exactEligibleId = engine.findCardInZone("south", "deck", op06Cosette072);
    const untouchedBottomId = engine.findCardInZone("south", "deck", op13Otama043);

    engine.activateEffect(stageId, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [costId] }, "south");

    const searchDecision = engine.pendingDecision("effectSearchSelection", "south");
    const searchStep = searchDecision.steps[0];
    expect(searchDecision.actorId).toBe("south");
    expect(searchStep?.kind).toBe("selectEntity");
    if (searchStep?.kind !== "selectEntity") {
      throw new Error("Expected Kingdom of GERMA to publish its search selection.");
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
