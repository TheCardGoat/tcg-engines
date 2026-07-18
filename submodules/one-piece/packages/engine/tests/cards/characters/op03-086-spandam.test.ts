import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op03Spandam086, op07Hattori088, op07RobLucci079 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-086 Spandam", () => {
  test("a compound CP Leader finds only a different card whose type includes CP", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op07RobLucci079,
      hand: [op03Spandam086],
      deck: [op07Hattori088, op03Spandam086, eb01Doma005, eb01Doma005],
      activeDon: op03Spandam086.cost,
    });
    const eligibleId = engine.findCardInZone("south", "deck", op07Hattori088);
    const excludedNameId = engine.findCardInZone("south", "deck", op03Spandam086);
    const wrongTraitId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op03Spandam086, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Spandam's CP search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === eligibleId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === excludedNameId)?.legal).toBe(
      false,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === wrongTraitId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([excludedNameId, wrongTraitId]),
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("does not search when the Leader's type does not include CP", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03Spandam086],
      deck: [op07Hattori088, eb01Doma005, eb01Doma005, eb01Doma005],
      activeDon: op03Spandam086.cost,
    });
    const deckBefore = [...engine.getState().players.south.deck];

    engine.playCard(op03Spandam086, "south");

    expect(engine.getState().players.south.deck).toEqual(deckBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
