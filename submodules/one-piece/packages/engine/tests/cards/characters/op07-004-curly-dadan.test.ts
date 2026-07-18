import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op02Seaquake021,
  op07CurlyDadan004,
  op13York094,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-004 Curly.Dadan", () => {
  test("trashes a chosen hand card, finds a power-2000-or-less Character, and orders the rest", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op07CurlyDadan004, eb01Doma005, eb01MountainGod018],
      deck: [
        op13York094,
        op02Seaquake021,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
      ],
      activeDon: op07CurlyDadan004.cost,
    });
    const discardId = engine.findCardInZone("south", "hand", eb01MountainGod018);
    const eligibleId = engine.findCardInZone("south", "deck", op13York094);
    const eventId = engine.findCardInZone("south", "deck", op02Seaquake021);
    const highPowerId = engine.findCardInZone("south", "deck", eb01Doma005);
    const deckBefore = [...engine.getState().players.south.deck];
    const untouchedId = deckBefore[5]!;

    engine.playCard(op07CurlyDadan004, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const payment = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(payment?.kind).toBe("payCost");
    if (payment?.kind !== "payCost") throw new Error("Expected Dadan's hand cost.");
    expect(payment.candidates.map((candidate) => candidate.ref.id)).toContain(discardId);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discardId] }, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Dadan's top-five search.");
    expect(search).toMatchObject({ min: 0, max: 1 });
    expect(search.candidates.find((candidate) => candidate.ref.id === eligibleId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === eventId)?.legal).toBe(false);
    expect(search.candidates.find((candidate) => candidate.ref.id === highPowerId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eligibleId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Dadan's bottom order.");
    const bottomOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: bottomOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eligibleId);
    expect(engine.getState().players.south.deck).toEqual([untouchedId, ...bottomOrder]);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without trashing a card or looking at the deck", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op07CurlyDadan004, eb01Doma005],
      deck: [op13York094, op02Seaquake021, eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      activeDon: op07CurlyDadan004.cost,
    });
    const retainedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const deckBefore = [...engine.getState().players.south.deck];

    engine.playCard(op07CurlyDadan004, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(retainedId);
    expect(engine.getState().players.south.deck).toEqual(deckBefore);
    expect(view.prompts).toHaveLength(0);
  });
});
