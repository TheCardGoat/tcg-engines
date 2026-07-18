import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb02Carrot013, op08Zou039 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-013 Carrot", () => {
  test("searches seven cards, orders the rest, and plays the revealed Zou from hand", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb02Carrot013],
      deck: [
        op08Zou039,
        eb01Doma005,
        eb01Doma005,
        eb01Doma005,
        eb01Doma005,
        eb01Doma005,
        eb01Doma005,
        eb01Doma005,
      ],
      activeDon: 3,
    });
    const zouId = engine.findCardInZone("south", "deck", op08Zou039);

    engine.playCard(eb02Carrot013, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Carrot's Zou search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === zouId)?.legal).toBe(true);
    expect(search.candidates.filter((candidate) => candidate.legal)).toHaveLength(1);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [zouId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Carrot's deck order.");
    const orderedRemainder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: orderedRemainder },
      "south",
    );

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Carrot's Zou play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([zouId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [zouId] }, "south");

    expect(engine.getView("south").players.south.stage?.instanceId).toBe(zouId);
    expect(engine.getView("south").players.south.deckCount).toBe(7);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("does not search or play Zou with only two DON!! cards on the field", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb02Carrot013, op08Zou039],
      deck: [eb01Doma005],
      activeDon: 2,
    });
    const zouId = engine.findCardInZone("south", "hand", op08Zou039);

    engine.playCard(eb02Carrot013, "south");

    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      zouId,
    );
    expect(engine.getView("south").players.south.stage).toBeNull();
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
