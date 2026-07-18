import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Bepo049,
  op01Penguin050,
  op05TrafalgarLaw069,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-069 Trafalgar Law", () => {
  test("with fewer DON!!, searches five for an included Heart Pirates card and orders the rest", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op05TrafalgarLaw069, playedOnTurn: 0 }],
        activeDon: 1,
        deck: [
          op01Bepo049,
          op01Penguin050,
          eb01Doma005,
          eb01Fourtricks025,
          eb01MountainGod018,
          eb01Doma005,
        ],
      },
      { activeDon: 2 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lawId = engine.findCardInZone("south", "character", op05TrafalgarLaw069);
    const compoundId = engine.findCardInZone("south", "deck", op01Bepo049);
    const exactId = engine.findCardInZone("south", "deck", op01Penguin050);
    const unrelatedId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.declareAttack(lawId, engine.leader("north"), "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Law's Heart Pirates search.");
    expect(search).toMatchObject({ min: 0, max: 1 });
    expect(search.candidates.find((candidate) => candidate.ref.id === compoundId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === exactId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === unrelatedId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [compoundId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Law's deck-bottom order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id).reverse() },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(compoundId);
    expect(view.players.south.deckCount).toBe(5);
    expect(view.prompts).toHaveLength(0);
  });

  test("at equal DON!! counts, attacking does not look at the deck", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op05TrafalgarLaw069, playedOnTurn: 0 }],
        activeDon: 1,
        deck: [
          op01Bepo049,
          op01Penguin050,
          eb01Doma005,
          eb01Fourtricks025,
          eb01MountainGod018,
          eb01Doma005,
        ],
      },
      { activeDon: 1 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lawId = engine.findCardInZone("south", "character", op05TrafalgarLaw069);
    const deckCountBefore = engine.getView("south").players.south.deckCount;

    engine.declareAttack(lawId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckCountBefore);
    expect(view.players.south.hand).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });
});
