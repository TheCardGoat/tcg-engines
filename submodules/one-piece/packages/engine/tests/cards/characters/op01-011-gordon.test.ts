import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op01Gordon011 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-011 Gordon", () => {
  test("optionally places a chosen hand card on the deck bottom before drawing", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op01Gordon011, eb01Doma005],
      deck: [eb01Fourtricks025],
      activeDon: op01Gordon011.cost,
    });
    const paymentId = engine.findCardInZone("south", "hand", eb01Doma005);
    const drawnId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.playCard(op01Gordon011, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostReturnHandToDeck", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Gordon's ordered hand cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual([paymentId]);
    engine.resolveDecision("effectCostReturnHandToDeck", { selectedIds: [paymentId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([drawnId]);
    expect(engine.getState().players.south.deck).toEqual([paymentId]);
    expect(view.prompts).toHaveLength(0);
  });

  test("returns a foreign-owned hand card to its controller's deck", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op01Gordon011, eb01Doma005],
        deck: [eb01Fourtricks025],
        activeDon: op01Gordon011.cost,
      },
      {},
    );
    const paymentId = engine.findCardInZone("south", "hand", eb01Doma005);
    engine.getState().cards[paymentId]!.owner = "north";

    engine.playCard(op01Gordon011, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnHandToDeck", { selectedIds: [paymentId] }, "south");

    expect(engine.getState().players.south.deck.at(-1)).toBe(paymentId);
    expect(engine.getState().players.north.deck).not.toContain(paymentId);
    expect(engine.getState().cards[paymentId]).toMatchObject({
      owner: "north",
      controller: "south",
      zone: "deck",
    });
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op01Gordon011, eb01Doma005],
      deck: [eb01Fourtricks025],
      activeDon: op01Gordon011.cost,
    });
    engine.playCard(op01Gordon011, "south");
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
