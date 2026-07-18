import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Laboon047,
  eb01Laboon048,
  eb01Spandine043,
  eb01TBone049,
  eb02AllHuntGrount042,
  op05Mansherry088,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-088 Mansherry", () => {
  test("pays all three ordered costs before recovering only a black cost-3-to-5 Character", () => {
    const engine = OnePieceTestEngine.create({
      character: [op05Mansherry088],
      trash: [
        eb01Spandine043,
        eb01Laboon048,
        eb01TBone049,
        eb01Laboon047,
        eb02AllHuntGrount042,
        eb01Doma005,
      ],
      activeDon: 1,
    });
    const mansherryId = engine.findCardInZone("south", "character", op05Mansherry088);
    const cost3Id = engine.findCardInZone("south", "trash", eb01Spandine043);
    const cost4Id = engine.findCardInZone("south", "trash", eb01Laboon048);
    const cost5Id = engine.findCardInZone("south", "trash", eb01TBone049);
    const cost2Id = engine.findCardInZone("south", "trash", eb01Laboon047);
    const cost6Id = engine.findCardInZone("south", "trash", eb02AllHuntGrount042);
    const nonBlackId = engine.findCardInZone("south", "trash", eb01Doma005);

    engine.activateEffect(mansherryId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostReturnTrashToDeck", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Mansherry's ordered trash cost.");
    engine.resolveDecision(
      "effectCostReturnTrashToDeck",
      { selectedIds: [nonBlackId, cost2Id] },
      "south",
    );

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Mansherry's recovery target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([
      cost3Id,
      cost4Id,
      cost5Id,
    ]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toEqual(
      expect.arrayContaining([cost2Id, cost6Id, nonBlackId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [cost4Id] }, "south");

    expect(engine.getState().players.south.deck.slice(-2)).toEqual([nonBlackId, cost2Id]);
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      cost4Id,
    );
    expect(engine.getState().cards[mansherryId]?.rested).toBe(true);
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 1 });
    expect(op05Mansherry088.traits).toEqual(["The Tontattas", "Dressrosa"]);
  });

  test("may recover zero and cannot activate without all costs", () => {
    const optional = OnePieceTestEngine.create({
      character: [op05Mansherry088],
      trash: [eb01Doma005, eb01Laboon047, eb01Spandine043],
      activeDon: 1,
    });
    const optionalId = optional.findCardInZone("south", "character", op05Mansherry088);
    optional.activateEffect(optionalId, "activateMain", "south");
    optional.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    optional.resolveDecision(
      "effectCostReturnTrashToDeck",
      { selectedIds: optional.getState().players.south.trash.slice(0, 2) },
      "south",
    );
    optional.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    expect(optional.getView("south").prompts).toHaveLength(0);

    const unavailable = OnePieceTestEngine.create({
      character: [op05Mansherry088],
      trash: [eb01Doma005],
      activeDon: 1,
    });
    const unavailableId = unavailable.findCardInZone("south", "character", op05Mansherry088);
    expect(
      unavailable.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: unavailableId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });
});
