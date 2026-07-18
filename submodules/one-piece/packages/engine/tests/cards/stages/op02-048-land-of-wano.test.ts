import { describe, expect, test } from "vite-plus/test";
import {
  op02LandOfWano048,
  op13Higuma013,
  op13KouzukiMomonosuke105,
  op13Otama043,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-048 Land of Wano", () => {
  test("trashes a chosen Land of Wano card and lets its controller set up to 1 rested DON!! active", () => {
    const unavailableEngine = OnePieceTestEngine.create({
      stage: op02LandOfWano048,
      hand: [op13Higuma013],
      restedDon: 1,
    });
    const unavailableStageId = unavailableEngine.findCardInZone(
      "south",
      "stage",
      op02LandOfWano048,
    );
    expect(
      unavailableEngine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: unavailableStageId,
        trigger: "activateMain",
      }).reason,
    ).toBe("The activation costs cannot be paid.");
    expect(unavailableEngine.getView("south").players.south.stage?.rested).toBe(false);
    expect(unavailableEngine.getView("south").prompts).toHaveLength(0);

    const engine = OnePieceTestEngine.create({
      stage: op02LandOfWano048,
      hand: [op13Otama043, op13KouzukiMomonosuke105, op13Higuma013],
      restedDon: 2,
    });
    const stageId = engine.findCardInZone("south", "stage", op02LandOfWano048);
    const exactTraitId = engine.findCardInZone("south", "hand", op13Otama043);
    const includedTraitId = engine.findCardInZone("south", "hand", op13KouzukiMomonosuke105);
    const ineligibleId = engine.findCardInZone("south", "hand", op13Higuma013);

    engine.activateEffect(stageId, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const costDecision = engine.pendingDecision("effectCostTrashFromHand", "south");
    const costStep = costDecision.steps[0];
    expect(costDecision.actorId).toBe("south");
    expect(costStep?.kind).toBe("payCost");
    if (costStep?.kind !== "payCost") {
      throw new Error("Expected Land of Wano to publish its filtered hand cost.");
    }
    expect(costStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      exactTraitId,
      includedTraitId,
    ]);
    expect(costStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(ineligibleId);

    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [includedTraitId] }, "south");

    const donDecision = engine.pendingDecision("effectSetActiveDon", "south");
    const donStep = donDecision.steps[0];
    expect(donDecision.actorId).toBe("south");
    expect(donStep?.kind).toBe("chooseOption");
    if (donStep?.kind !== "chooseOption") {
      throw new Error("Expected Land of Wano to publish a DON!! count choice.");
    }
    expect(donStep.options.map((option) => option.id)).toEqual(["0", "1"]);

    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.stage?.rested).toBe(true);
    expect(view.players.south.activeDon).toBe(1);
    expect(view.players.south.restedDon).toBe(1);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(includedTraitId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([
      exactTraitId,
      ineligibleId,
    ]);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
