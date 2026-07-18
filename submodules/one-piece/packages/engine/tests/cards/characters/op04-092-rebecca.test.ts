import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op04Hajrudin088, op04Rebecca092 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-092 Rebecca", () => {
  test("searches an included Dressrosa card other than Rebecca and trashes the rest", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op04Rebecca092],
      deck: [op04Hajrudin088, op04Rebecca092, eb01Doma005, eb01Fourtricks025],
      activeDon: op04Rebecca092.cost,
    });
    const eligibleId = engine.findCardInZone("south", "deck", op04Hajrudin088);
    const sameNameId = engine.findCardInZone("south", "deck", op04Rebecca092);
    const unrelatedId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op04Rebecca092, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Rebecca's search choice.");
    expect(search).toMatchObject({ min: 0, max: 1 });
    expect(search.candidates.find((candidate) => candidate.ref.id === eligibleId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === sameNameId)?.legal).toBe(
      false,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === unrelatedId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([sameNameId, unrelatedId]),
    );
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("may reveal no card and trashes all three looked cards", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op04Rebecca092],
      deck: [op04Hajrudin088, op04Rebecca092, eb01Doma005, eb01Fourtricks025],
      activeDon: op04Rebecca092.cost,
    });
    const lookedIds = engine.getState().players.south.deck.slice(0, 3);

    engine.playCard(op04Rebecca092, "south");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(lookedIds),
    );
    expect(view.players.south.hand).toHaveLength(0);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });
});
