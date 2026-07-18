import { describe, expect, test } from "vite-plus/test";
import {
  op07BoaHancock038,
  op07IslandOfWomen058,
  op07Marguerite054,
  op07Salome043,
  op13Higuma013,
  op13Otama043,
  op13York094,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-058 Island of Women", () => {
  test("pays both costs and returns a chosen Amazon Lily or Kuja Pirates Character", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op07BoaHancock038,
      stage: op07IslandOfWomen058,
      hand: [op13Otama043, op13York094],
      deck: [op13Higuma013, op13Otama043],
      character: [op07Marguerite054, op07Salome043, op13Higuma013],
    });
    const stageId = engine.findCardInZone("south", "stage", op07IslandOfWomen058);
    const keptHandId = engine.findCardInZone("south", "hand", op13Otama043);
    const costId = engine.findCardInZone("south", "hand", op13York094);
    const amazonLilyId = engine.findCardInZone("south", "character", op07Marguerite054);
    const kujaPiratesId = engine.findCardInZone("south", "character", op07Salome043);
    const unrelatedId = engine.findCardInZone("south", "character", op13Higuma013);
    const boaDrawId = engine.findCardInZone("south", "deck", op13Higuma013);

    engine.activateEffect(stageId, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [costId] }, "south");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
    const targetStep = targetDecision.steps[0];
    expect(targetDecision.actorId).toBe("south");
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected Island of Women to publish its Character selection.");
    }
    expect(targetStep).toMatchObject({ min: 0, max: 1 });
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      amazonLilyId,
      kujaPiratesId,
    ]);
    expect(targetStep.candidates.some((candidate) => candidate.ref.id === unrelatedId)).toBe(false);

    engine.resolveDecision("effectTargetSelection", { selectedIds: [kujaPiratesId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.stage?.rested).toBe(true);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([
      keptHandId,
      kujaPiratesId,
      boaDrawId,
    ]);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(costId);
    expect(
      view.players.south.characters.flatMap((card) => (card ? [card.instanceId] : [])),
    ).toEqual([amazonLilyId, unrelatedId]);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
