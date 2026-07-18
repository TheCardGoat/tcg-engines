import { describe, expect, test } from "vite-plus/test";
import { eb01Fourtricks025, op02BoaHancock059, op02Buggy058, op02Saldeath074 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-058 Buggy", () => {
  test("finds a compound-trait blue Impel Down card other than Buggy", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op02Buggy058],
      deck: [op02BoaHancock059, op02Buggy058, op02Saldeath074, eb01Fourtricks025, op02Buggy058],
      activeDon: op02Buggy058.cost,
    });
    const eligibleId = engine.findCardInZone("south", "deck", op02BoaHancock059);
    const buggyId = engine.findCardInZone("south", "deck", op02Buggy058);
    const wrongColorId = engine.findCardInZone("south", "deck", op02Saldeath074);
    const unrelatedId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.playCard(op02Buggy058, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Buggy's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === eligibleId)?.legal).toBe(
      true,
    );
    for (const excludedId of [buggyId, wrongColorId, unrelatedId]) {
      expect(search.candidates.find((candidate) => candidate.ref.id === excludedId)?.legal).toBe(
        false,
      );
    }
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eligibleId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Buggy's remainder order.");
    const orderedRemainder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: orderedRemainder },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eligibleId);
    expect(engine.getState().players.south.deck.slice(-4)).toEqual(orderedRemainder);
    expect(view.prompts).toHaveLength(0);
  });
});
