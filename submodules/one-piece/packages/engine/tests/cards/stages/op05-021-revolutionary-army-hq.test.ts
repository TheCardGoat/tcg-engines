import { describe, expect, test } from "vite-plus/test";
import {
  op05BunnyJoe013,
  op05Hack012,
  op05RevolutionaryArmyHq021,
  op13Higuma013,
  op13Otama043,
  op13York094,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-021 Revolutionary Army HQ", () => {
  test("pays both costs and searches included Revolutionary Army types", () => {
    const engine = OnePieceTestEngine.create({
      stage: op05RevolutionaryArmyHq021,
      hand: [op13Otama043, op13York094],
      deck: [op05Hack012, op13Higuma013, op05BunnyJoe013, op13York094],
    });
    const stageId = engine.findCardInZone("south", "stage", op05RevolutionaryArmyHq021);
    const keptHandId = engine.findCardInZone("south", "hand", op13Otama043);
    const costId = engine.findCardInZone("south", "hand", op13York094);
    const compositeEligibleId = engine.findCardInZone("south", "deck", op05Hack012);
    const ineligibleId = engine.findCardInZone("south", "deck", op13Higuma013);
    const pureEligibleId = engine.findCardInZone("south", "deck", op05BunnyJoe013);
    const untouchedBottomId = engine.findCardInZone("south", "deck", op13York094);

    engine.activateEffect(stageId, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [costId] }, "south");

    const searchDecision = engine.pendingDecision("effectSearchSelection", "south");
    const searchStep = searchDecision.steps[0];
    expect(searchStep?.kind).toBe("selectEntity");
    if (searchStep?.kind !== "selectEntity") {
      throw new Error("Expected Revolutionary Army HQ to publish its search selection.");
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
      { id: pureEligibleId, legal: true },
    ]);

    engine.resolveDecision(
      "effectSearchSelection",
      { selectedIds: [compositeEligibleId] },
      "south",
    );
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: [pureEligibleId, ineligibleId] },
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
      pureEligibleId,
      ineligibleId,
    ]);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
