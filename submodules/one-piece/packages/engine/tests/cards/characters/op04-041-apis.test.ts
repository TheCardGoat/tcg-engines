import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op03Alvida023,
  op04Apis041,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-041 Apis", () => {
  test("trashes 2 chosen cards, finds an included East Blue card, and orders the remainder", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op04Apis041, eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      deck: [op03Alvida023, eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      activeDon: 1,
    });
    const firstPaymentId = engine.findCardInZone("south", "hand", eb01Doma005);
    const secondPaymentId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const paymentIds = [firstPaymentId, secondPaymentId];
    const eastBlueId = engine.findCardInZone("south", "deck", op03Alvida023);
    const unrelatedId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.playCard(op04Apis041, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const payment = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(payment?.kind).toBe("payCost");
    if (payment?.kind !== "payCost") throw new Error("Expected Apis's hand-trash cost.");
    expect(payment).toMatchObject({ min: 2, max: 2 });
    expect(payment.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([
        firstPaymentId,
        secondPaymentId,
        engine.findCardInZone("south", "hand", eb01MountainGod018),
      ]),
    );
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: paymentIds }, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Apis's top-five search.");
    expect(search).toMatchObject({ min: 0, max: 1 });
    expect(search.candidates.find((candidate) => candidate.ref.id === eastBlueId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === unrelatedId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eastBlueId] }, "south");

    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(order?.kind).toBe("orderItems");
    if (order?.kind !== "orderItems") throw new Error("Expected Apis's bottom-deck ordering.");
    const remainderOrder = order.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: remainderOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(paymentIds),
    );
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eastBlueId);
    // Exact hidden deck order is not projected; this is the narrow identity boundary.
    expect(engine.getState().players.south.deck).toEqual(remainderOrder);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without trashing cards or looking at the deck", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op04Apis041, eb01Doma005, eb01Fourtricks025],
      deck: [op03Alvida023, eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      activeDon: op04Apis041.cost,
    });
    const keptIds = [
      engine.findCardInZone("south", "hand", eb01Doma005),
      engine.findCardInZone("south", "hand", eb01Fourtricks025),
    ];
    const deckBefore = [...engine.getState().players.south.deck];

    engine.playCard(op04Apis041, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(keptIds),
    );
    expect(view.players.south.trash).toHaveLength(0);
    expect(engine.getState().players.south.deck).toEqual(deckBefore);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not offer the optional effect without 2 post-play hand cards", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op04Apis041, eb01Doma005],
      deck: [op03Alvida023, eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      activeDon: op04Apis041.cost,
    });
    const keptId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op04Apis041, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(keptId);
    expect(view.players.south.trash).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });
});
