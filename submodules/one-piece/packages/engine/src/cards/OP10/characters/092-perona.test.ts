import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op10Perona092, op10Ryuma094 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-092 Perona", () => {
  test("accepts compound Thriller Bark Pirates cards for its ordered trash-to-deck cost", () => {
    const engine = OnePieceTestEngine.create({
      character: [op10Perona092, eb01Doma005],
      trash: [op10Ryuma094, op10Ryuma094, eb01Doma005],
    });
    const peronaId = engine.findCardInZone("south", "character", op10Perona092);
    const paymentIds = engine
      .getView("south")
      .players.south.trash.filter((card) => card.cardId === op10Ryuma094.id)
      .flatMap((card) => (card.instanceId ? [card.instanceId] : []));
    const wrongTraitId = engine.findCardInZone("south", "trash", eb01Doma005);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.activateEffect(peronaId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostReturnTrashToDeck", "south").steps[0];
    expect(cost).toMatchObject({ kind: "payCost", min: 2, max: 2 });
    if (cost?.kind !== "payCost") throw new Error("Expected Perona's trash-to-deck payment.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(paymentIds);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectCostReturnTrashToDeck", { selectedIds: paymentIds }, "south");

    const targetId = engine.findCardInZone("south", "character", eb01Doma005);
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Perona's power target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckBefore + 2);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual([wrongTraitId]);
    expect(view.players.south.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      5000,
    );
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: peronaId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });
});
