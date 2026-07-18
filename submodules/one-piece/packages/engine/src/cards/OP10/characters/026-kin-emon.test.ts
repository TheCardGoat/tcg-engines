import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op04KinEmon102, op10KinEmon026, op10KinEmon027 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-026 Kin'emon", () => {
  test("cannot activate without a 0-power Kin'emon in trash for its bottom-deck cost", () => {
    const engine = OnePieceTestEngine.create({
      character: [op10KinEmon026],
      hand: [op04KinEmon102],
    });
    const kinemonId = engine.findCardInZone("south", "character", op10KinEmon026);

    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: kinemonId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });

  test("bottom-decks itself and a 0-power Kin'emon from trash, then plays a cost-6 Kin'emon", () => {
    const engine = OnePieceTestEngine.create({
      character: [op10KinEmon026],
      hand: [op04KinEmon102],
      trash: [op10KinEmon027, op10KinEmon027, op10KinEmon026],
      deck: [eb01Doma005],
    });
    const sourceId = engine.findCardInZone("south", "character", op10KinEmon026);
    const paymentId = engine.findCardInZone("south", "trash", op10KinEmon027);
    const wrongPowerId = engine.findCardInZone("south", "trash", op10KinEmon026);
    const playedId = engine.findCardInZone("south", "hand", op04KinEmon102);

    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostReturnTrashToDeck", "south").steps[0];
    expect(cost).toMatchObject({ kind: "payCost", min: 1, max: 1 });
    if (cost?.kind !== "payCost") throw new Error("Expected Kin'emon's trash payment.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toContain(paymentId);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongPowerId);
    engine.resolveDecision("effectCostReturnTrashToDeck", { selectedIds: [paymentId] }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (play?.kind !== "selectEntity") throw new Error("Expected the cost-6 Kin'emon choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([playedId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [playedId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(3);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(playedId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(sourceId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(wrongPowerId);
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(paymentId);
    expect(engine.findCardInZone("south", "deck", op10KinEmon026)).toBe(sourceId);
    expect(engine.findCardInZone("south", "deck", op10KinEmon027)).toBe(paymentId);
    expect(view.prompts).toHaveLength(0);
  });
});
