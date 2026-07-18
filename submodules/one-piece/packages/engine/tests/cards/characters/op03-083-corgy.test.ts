import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01Funkfreed044,
  eb01MountainGod018,
  op03Corgy083,
  op03Jerry084,
  op03Kumadori082,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

const LOOKED_CARDS = [
  eb01Doma005,
  eb01Fourtricks025,
  eb01Funkfreed044,
  eb01MountainGod018,
  op03Kumadori082,
] as const;

describe("OP03-083 Corgy", () => {
  test("may trash two looked-at cards, then orders only the remainder at the bottom", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03Corgy083],
      deck: [...LOOKED_CARDS, op03Jerry084],
      activeDon: op03Corgy083.cost,
    });
    const untouchedId = engine.findCardInZone("south", "deck", op03Jerry084);

    engine.playCard(op03Corgy083, "south");
    const trash = engine.pendingDecision("effectRearrangeDeckTrashSelection", "south").steps[0];
    expect(trash?.kind).toBe("selectEntity");
    if (trash?.kind !== "selectEntity") throw new Error("Expected Corgy's trash choice.");
    expect(trash).toMatchObject({ min: 0, max: 2 });
    expect(trash.candidates).toHaveLength(5);
    const trashedIds = trash.candidates.slice(0, 2).map((candidate) => candidate.ref.id);
    engine.resolveDecision(
      "effectRearrangeDeckTrashSelection",
      { selectedIds: trashedIds },
      "south",
    );

    const order = engine.pendingDecision("effectRearrangeDeckOrder", "south").steps[0];
    expect(order?.kind).toBe("orderItems");
    if (order?.kind !== "orderItems") throw new Error("Expected Corgy's remainder order.");
    expect(order.candidates.map((candidate) => candidate.ref.id)).not.toEqual(
      expect.arrayContaining(trashedIds),
    );
    const remainderOrder = order.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectRearrangeDeckOrder", { selectedIds: remainderOrder }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(trashedIds),
    );
    expect(engine.getState().players.south.deck).toEqual([untouchedId, ...remainderOrder]);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may trash no cards and orders all five directly at the fixed bottom", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03Corgy083],
      deck: [...LOOKED_CARDS, op03Jerry084],
      activeDon: op03Corgy083.cost,
    });
    const untouchedId = engine.findCardInZone("south", "deck", op03Jerry084);

    engine.playCard(op03Corgy083, "south");
    engine.resolveDecision("effectRearrangeDeckTrashSelection", { selectedIds: [] }, "south");
    const order = engine.pendingDecision("effectRearrangeDeckOrder", "south").steps[0];
    expect(order?.kind).toBe("orderItems");
    if (order?.kind !== "orderItems") throw new Error("Expected all five cards to be ordered.");
    const chosenOrder = order.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectRearrangeDeckOrder", { selectedIds: chosenOrder }, "south");

    expect(engine.getState().players.south.deck).toEqual([untouchedId, ...chosenOrder]);
    expect(engine.getView("south").players.south.trash).toHaveLength(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("keeps a foreign-owned looked card in the deck being rearranged", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op03Corgy083],
        deck: [...LOOKED_CARDS, op03Jerry084],
        activeDon: op03Corgy083.cost,
      },
      {},
    );
    const foreignId = engine.findCardInZone("south", "deck", eb01Doma005);
    engine.getState().cards[foreignId]!.owner = "north";

    engine.playCard(op03Corgy083, "south");
    engine.resolveDecision("effectRearrangeDeckTrashSelection", { selectedIds: [] }, "south");
    const order = engine.pendingDecision("effectRearrangeDeckOrder", "south").steps[0];
    expect(order?.kind).toBe("orderItems");
    if (order?.kind !== "orderItems") throw new Error("Expected Corgy's deck order.");
    const chosenOrder = order.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectRearrangeDeckOrder", { selectedIds: chosenOrder }, "south");

    expect(engine.getState().players.south.deck).toContain(foreignId);
    expect(engine.getState().players.north.deck).not.toContain(foreignId);
    expect(engine.getState().cards[foreignId]).toMatchObject({
      owner: "north",
      controller: "south",
      zone: "deck",
    });
  });
});
