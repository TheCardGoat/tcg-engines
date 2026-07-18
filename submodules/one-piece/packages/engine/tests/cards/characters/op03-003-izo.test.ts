import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb01TonyTonyChopper006,
  op03Izo003,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-003 Izo", () => {
  test("finds a compound Whitebeard Pirates card other than Izo and orders the rest", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03Izo003],
      deck: [
        eb01Doma005,
        op03Izo003,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01TonyTonyChopper006,
        eb01Doma005,
      ],
      activeDon: op03Izo003.cost,
    });
    const domaId = engine.findCardInZone("south", "deck", eb01Doma005);
    const izoId = engine.findCardInZone("south", "deck", op03Izo003);
    const nonWhitebeardId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    // Deck identity/order is intentionally asserted at the raw hidden-zone boundary.
    const deckBefore = [...engine.getState().players.south.deck];

    engine.playCard(op03Izo003, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Izo's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === domaId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === izoId)?.legal).toBe(false);
    expect(search.candidates.find((candidate) => candidate.ref.id === nonWhitebeardId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [domaId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Izo's deck order.");
    const remainderOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: remainderOrder }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      domaId,
    );
    expect(engine.getState().players.south.deck).toEqual([deckBefore[5], ...remainderOrder]);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may reveal no card and order every looked card at the deck bottom", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03Izo003],
      deck: [
        eb01Doma005,
        op03Izo003,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01TonyTonyChopper006,
        eb01Doma005,
      ],
      activeDon: op03Izo003.cost,
    });
    // Deck identity/order is intentionally asserted at the raw hidden-zone boundary.
    const deckBefore = [...engine.getState().players.south.deck];

    engine.playCard(op03Izo003, "south");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");
    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Izo's deck order.");
    const remainderOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: remainderOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand).toHaveLength(0);
    expect(engine.getState().players.south.deck).toEqual([deckBefore[5], ...remainderOrder]);
    expect(view.prompts).toHaveLength(0);
  });
});
