import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01RadicalBeam029, op12Sanji041 } from "@tcg/op-cards";
import { op12Patty074 } from "../../../../../cards/src/cards/characters/op12-074-patty.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-074 Patty", () => {
  test("with a Sanji Leader trashes one selected Event to add an active DON!!", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op12Sanji041,
      hand: [op12Patty074, op01RadicalBeam029, op01RadicalBeam029, eb01Doma005],
      activeDon: op12Patty074.cost,
    });
    const firstEventId = engine.findCardInZone("south", "hand", op01RadicalBeam029);
    const nonEventId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op12Patty074, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    if (payment?.kind !== "payCost") throw new Error("Expected Patty's Event cost.");
    expect(payment.candidates.map((candidate) => candidate.ref.id)).not.toContain(nonEventId);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [firstEventId] }, "south");

    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(addDon?.kind).toBe("chooseOption");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(1);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(firstEventId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op12Sanji041,
      hand: [op12Patty074, op01RadicalBeam029, op01RadicalBeam029, eb01Doma005],
      activeDon: op12Patty074.cost,
    });
    engine.playCard(op12Patty074, "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
