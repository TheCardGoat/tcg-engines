import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op02JaguarDSaul109, op06Tashigi050 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-050 Tashigi", () => {
  test("finds composite Navy, excludes every Tashigi, and orders the remainder", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op06Tashigi050],
      deck: [op02JaguarDSaul109, op06Tashigi050, eb01Doma005, op06Tashigi050, eb01Fourtricks025],
      activeDon: op06Tashigi050.cost,
    });
    const navyId = engine.findCardInZone("south", "deck", op02JaguarDSaul109);
    const unrelatedIds = [
      engine.findCardInZone("south", "deck", eb01Doma005),
      engine.findCardInZone("south", "deck", eb01Fourtricks025),
    ];
    const tashigiIds = engine
      .getState()
      .players.south.deck.filter(
        (instanceId) => engine.getState().cards[instanceId]?.cardId === op06Tashigi050.id,
      );

    engine.playCard(op06Tashigi050, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Tashigi's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === navyId)?.legal).toBe(true);
    for (const unrelatedId of unrelatedIds) {
      expect(search.candidates.find((candidate) => candidate.ref.id === unrelatedId)?.legal).toBe(
        false,
      );
    }
    const excludedTashigis = search.candidates.filter((candidate) =>
      tashigiIds.includes(candidate.ref.id),
    );
    expect(excludedTashigis).toHaveLength(2);
    expect(excludedTashigis.every((candidate) => !candidate.legal)).toBe(true);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [navyId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Tashigi's remainder order.");
    const chosenOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: chosenOrder }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      navyId,
    );
    expect(engine.getState().players.south.deck).toEqual(chosenOrder);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
