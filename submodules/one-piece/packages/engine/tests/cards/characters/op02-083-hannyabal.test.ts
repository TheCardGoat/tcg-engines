import { describe, expect, test } from "vite-plus/test";
import {
  op02Blugori084,
  op02Buggy058,
  op02Hannyabal083,
  op02Saldeath074,
  op02Shiki075,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-083 Hannyabal", () => {
  test("searches a purple exact or compound Impel Down card other than Hannyabal", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op02Hannyabal083],
      deck: [op02Saldeath074, op02Blugori084, op02Hannyabal083, op02Buggy058, op02Shiki075],
      activeDon: 1,
    });
    const exactTraitId = engine.findCardInZone("south", "deck", op02Saldeath074);
    const compoundTraitId = engine.findCardInZone("south", "deck", op02Blugori084);
    const excludedNameId = engine.findCardInZone("south", "deck", op02Hannyabal083);
    const wrongColorId = engine.findCardInZone("south", "deck", op02Buggy058);
    const unrelatedId = engine.findCardInZone("south", "deck", op02Shiki075);

    engine.playCard(op02Hannyabal083, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Hannyabal's search choice.");
    expect(
      search.candidates.map((candidate) => ({ id: candidate.ref.id, legal: candidate.legal })),
    ).toEqual([
      { id: exactTraitId, legal: true },
      { id: compoundTraitId, legal: true },
      { id: excludedNameId, legal: false },
      { id: wrongColorId, legal: false },
      { id: unrelatedId, legal: false },
    ]);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [compoundTraitId] }, "south");

    const remainderOrder = [unrelatedId, wrongColorId, excludedNameId, exactTraitId];
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: remainderOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(compoundTraitId);
    expect(engine.getState().players.south.deck).toEqual(remainderOrder);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the up-to-one reveal and place every looked card at the bottom", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op02Hannyabal083],
      deck: [op02Saldeath074, op02Blugori084, op02Hannyabal083, op02Buggy058, op02Shiki075],
      activeDon: 1,
    });
    const remainderOrder = [
      op02Shiki075,
      op02Buggy058,
      op02Hannyabal083,
      op02Blugori084,
      op02Saldeath074,
    ].map((card) => engine.findCardInZone("south", "deck", card));

    engine.playCard(op02Hannyabal083, "south");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: remainderOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand).toHaveLength(0);
    expect(engine.getState().players.south.deck).toEqual(remainderOrder);
    expect(view.prompts).toHaveLength(0);
  });
});
