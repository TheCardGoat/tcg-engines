import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op06HodyJones020,
  op09Shanks001,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Arlong042 } from "../../../../../cards/src/cards/OP14EB04/characters/042-arlong.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-042 Arlong", () => {
  test("with an included Fish-Man Leader searches the top four for a cost-2-or-more card and bottom-orders the rest", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op06HodyJones020,
      hand: [op14eb04Arlong042],
      deck: [eb01MountainGod018, eb01Doma005, eb01Fourtricks025, eb01Doma005, eb01Doma005],
      activeDon: op14eb04Arlong042.cost,
    });
    const selectedId = engine.findCardInZone("south", "deck", eb01MountainGod018);
    const lowCostId = engine.findCardInZone("south", "deck", eb01Doma005);
    const otherEligibleId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.playCard(op14eb04Arlong042, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Arlong's search choice.");
    expect(search).toMatchObject({ min: 0, max: 1 });
    expect(search.candidates.find((candidate) => candidate.ref.id === selectedId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === otherEligibleId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === lowCostId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Arlong's remainder order.");
    const order = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    expect(order).toEqual(expect.arrayContaining([lowCostId, otherEligibleId]));
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: order }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(selectedId);
    expect(engine.getState().players.south.deck.slice(-3)).toEqual(order);
    expect(view.prompts).toHaveLength(0);
  });

  test("without a Fish-Man Leader does not search or reveal the deck", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op09Shanks001,
      hand: [op14eb04Arlong042],
      deck: [eb01MountainGod018, eb01Doma005, eb01Fourtricks025, eb01Doma005],
      activeDon: op14eb04Arlong042.cost,
    });
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op14eb04Arlong042, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckBefore);
    expect(view.players.south.handCount).toBe(0);
    expect(view.prompts).toHaveLength(0);
  });
});
