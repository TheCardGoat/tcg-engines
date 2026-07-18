import { describe, expect, test } from "vite-plus/test";
import type { CharacterCard } from "@tcg/op-types";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op08Ginrummy086 } from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const costZeroTarget: CharacterCard = {
  ...eb01Doma005,
  id: "TEST-OP08-086-COST-ZERO",
  canonicalId: "TEST-OP08-086-COST-ZERO",
  name: "Ginrummy Cost Zero Target",
  cost: 0,
};

registerCards([costZeroTarget]);

describe("OP08-086 Ginrummy", () => {
  test("when the opponent has a cost-0 Character draws two, then lets its controller trash two", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op08Ginrummy086, eb01Doma005],
        deck: [eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
        activeDon: op08Ginrummy086.cost,
      },
      { character: [costZeroTarget] },
    );
    const retainedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const firstDrawId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const secondDrawId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.playCard(op08Ginrummy086, "south");

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(trash).toMatchObject({ kind: "selectEntity", min: 2, max: 2 });
    if (trash?.kind !== "selectEntity") throw new Error("Expected Ginrummy's hand choice.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([retainedId, firstDrawId, secondDrawId]),
    );
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [firstDrawId, secondDrawId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(retainedId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstDrawId, secondDrawId]),
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("does not draw or trash when the opponent has no cost-0 Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op08Ginrummy086],
        deck: [eb01Fourtricks025, eb01MountainGod018],
        activeDon: op08Ginrummy086.cost,
      },
      { character: [eb01Doma005] },
    );
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op08Ginrummy086, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckBefore);
    expect(view.players.south.hand).toHaveLength(0);
    expect(view.players.south.trash).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });
});
