import { describe, expect, test } from "vite-plus/test";
import {
  op09Buggy042,
  op09EmpteeBluffsIsland060,
  op13Higuma013,
  op13KouzukiMomonosuke105,
  op13Otama043,
  op13WindmillVillage022,
  op13York094,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-060 Emptee Bluffs Island", () => {
  test("orders 2 chosen hand cards on the deck bottom before a composite Cross Guild Leader draws 2", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op09Buggy042,
      stage: op09EmpteeBluffsIsland060,
      hand: [op13Otama043, op13York094, op13KouzukiMomonosuke105],
      deck: [op13Higuma013, op13WindmillVillage022],
    });
    const stageId = engine.findCardInZone("south", "stage", op09EmpteeBluffsIsland060);
    const firstBottomId = engine.findCardInZone("south", "hand", op13York094);
    const secondBottomId = engine.findCardInZone("south", "hand", op13Otama043);
    const unselectedId = engine.findCardInZone("south", "hand", op13KouzukiMomonosuke105);
    const firstDrawnId = engine.findCardInZone("south", "deck", op13Higuma013);
    const secondDrawnId = engine.findCardInZone("south", "deck", op13WindmillVillage022);

    engine.activateEffect(stageId, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const costDecision = engine.pendingDecision("effectCostReturnHandToDeck", "south");
    const costStep = costDecision.steps[0];
    expect(costDecision.actorId).toBe("south");
    expect(costStep?.kind).toBe("payCost");
    if (costStep?.kind !== "payCost") {
      throw new Error("Expected Emptee Bluffs Island to publish its ordered hand cost.");
    }
    expect(costStep).toMatchObject({ min: 2, max: 2, ordered: true });
    expect(costStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      secondBottomId,
      firstBottomId,
      unselectedId,
    ]);

    engine.resolveDecision(
      "effectCostReturnHandToDeck",
      { selectedIds: [firstBottomId, secondBottomId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.stage?.rested).toBe(true);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([
      unselectedId,
      firstDrawnId,
      secondDrawnId,
    ]);
    expect(engine.getState().players.south.deck).toEqual([firstBottomId, secondBottomId]);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("pays both activation costs before a nonmatching Leader makes the draw do nothing", () => {
    const engine = OnePieceTestEngine.create({
      stage: op09EmpteeBluffsIsland060,
      hand: [op13Otama043, op13York094],
      deck: [op13Higuma013],
    });
    const stageId = engine.findCardInZone("south", "stage", op09EmpteeBluffsIsland060);
    const firstBottomId = engine.findCardInZone("south", "hand", op13Otama043);
    const secondBottomId = engine.findCardInZone("south", "hand", op13York094);

    engine.activateEffect(stageId, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision(
      "effectCostReturnHandToDeck",
      { selectedIds: [secondBottomId, firstBottomId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.stage?.rested).toBe(true);
    expect(view.players.south.handCount).toBe(0);
    expect(engine.getState().players.south.deck).toEqual([
      engine.findCardInZone("south", "deck", op13Higuma013),
      secondBottomId,
      firstBottomId,
    ]);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
