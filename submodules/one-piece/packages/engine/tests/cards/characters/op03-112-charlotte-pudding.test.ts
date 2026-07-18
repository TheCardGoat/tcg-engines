import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op03CharlottePudding112, op03Napoleon117, op03Sanji102 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-112 Charlotte Pudding", () => {
  test("searches either named Sanji or an included Big Mom Pirates type, excluding Pudding", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03CharlottePudding112],
      deck: [op03Sanji102, op03Napoleon117, op03CharlottePudding112, eb01Doma005],
      activeDon: op03CharlottePudding112.cost,
    });
    const sanjiId = engine.findCardInZone("south", "deck", op03Sanji102);
    const compoundTraitId = engine.findCardInZone("south", "deck", op03Napoleon117);
    const excludedPuddingId = engine.findCardInZone("south", "deck", op03CharlottePudding112);
    const unrelatedId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op03CharlottePudding112, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Pudding's search choice.");
    expect(
      search.candidates.map((candidate) => ({ id: candidate.ref.id, legal: candidate.legal })),
    ).toEqual([
      { id: sanjiId, legal: true },
      { id: compoundTraitId, legal: true },
      { id: excludedPuddingId, legal: false },
      { id: unrelatedId, legal: false },
    ]);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [sanjiId] }, "south");

    const remainderOrder = [unrelatedId, excludedPuddingId, compoundTraitId];
    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Pudding's remainder order.");
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: remainderOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(sanjiId);
    expect(engine.getState().players.south.deck).toEqual(remainderOrder);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may reveal no card and orders all four looked cards on the deck bottom", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03CharlottePudding112],
      deck: [op03Sanji102, op03Napoleon117, op03CharlottePudding112, eb01Doma005],
      activeDon: op03CharlottePudding112.cost,
    });
    const lookedIds = [...engine.getState().players.south.deck];

    engine.playCard(op03CharlottePudding112, "south");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");

    const bottomOrder = [...lookedIds].reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: bottomOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand).toHaveLength(0);
    expect(engine.getState().players.south.deck).toEqual(bottomOrder);
    expect(view.prompts).toHaveLength(0);
  });
});
