import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Shirahoshi057, op06Camie025, op06IkarosMuch024 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-025 Camie", () => {
  test("searches either included Fish-Man or Merfolk type, excludes Camie, and bottoms the rest in order", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op06Camie025],
      deck: [op06IkarosMuch024, eb01Shirahoshi057, op06Camie025, eb01Doma005, eb01Doma005],
      activeDon: op06Camie025.cost,
    });
    const fishManId = engine.findCardInZone("south", "deck", op06IkarosMuch024);
    const merfolkId = engine.findCardInZone("south", "deck", eb01Shirahoshi057);
    const excludedCamieId = engine.findCardInZone("south", "deck", op06Camie025);
    const wrongTraitId = engine.findCardInZone("south", "deck", eb01Doma005);
    const untouchedId = engine.getState().players.south.deck[4]!;

    engine.playCard(op06Camie025, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Camie's search choice.");
    expect(search).toMatchObject({ min: 0, max: 1 });
    expect(search.candidates.find((candidate) => candidate.ref.id === fishManId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === merfolkId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === excludedCamieId)?.legal).toBe(
      false,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === wrongTraitId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [merfolkId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Camie's remainder order.");
    const submittedOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: submittedOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(merfolkId);
    expect(engine.getState().players.south.deck).toEqual([untouchedId, ...submittedOrder]);
    expect(view.prompts).toHaveLength(0);
  });
});
