import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01Bepo049, op02MonkeyDLuffy041, op09TrafalgarLaw069 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-069 Trafalgar Law", () => {
  test("finds either included trait at cost 2 or more and bottoms the remainder in order", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op09TrafalgarLaw069],
      deck: [op01Bepo049, op02MonkeyDLuffy041, op09TrafalgarLaw069, eb01Doma005, eb01Doma005],
      activeDon: op09TrafalgarLaw069.cost,
    });
    const heartPiratesId = engine.findCardInZone("south", "deck", op01Bepo049);
    const strawHatId = engine.findCardInZone("south", "deck", op02MonkeyDLuffy041);
    const tooCheapId = engine.findCardInZone("south", "deck", op09TrafalgarLaw069);
    const unrelatedId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op09TrafalgarLaw069, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (search?.kind !== "selectEntity") throw new Error("Expected Law's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === heartPiratesId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === strawHatId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === tooCheapId)?.legal).toBe(
      false,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === unrelatedId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [heartPiratesId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Law's bottom order.");
    const bottomOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: bottomOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(heartPiratesId);
    expect(engine.getState().players.south.deck.slice(-3)).toEqual(bottomOrder);
    expect(view.prompts).toHaveLength(0);
  });
});
