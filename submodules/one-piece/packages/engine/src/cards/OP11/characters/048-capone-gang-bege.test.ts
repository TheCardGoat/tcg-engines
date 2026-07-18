import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op11CharlotteLola052,
  op11TonyTonyChopper053,
} from "@tcg/op-cards";
import { op11CaponeGangBege048 } from "../../../../../cards/src/cards/OP11/characters/048-capone-gang-bege.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe('OP11-048 Capone"Gang"Bege', () => {
  test("finds either included trait at cost 2 or more and bottom-orders the remainder", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op11CaponeGangBege048],
      deck: [
        op11CharlotteLola052,
        op11TonyTonyChopper053,
        op11CaponeGangBege048,
        eb01Doma005,
        eb01Fourtricks025,
      ],
      activeDon: op11CaponeGangBege048.cost,
    });
    const firetankId = engine.findCardInZone("south", "deck", op11CharlotteLola052);
    const strawHatId = engine.findCardInZone("south", "deck", op11TonyTonyChopper053);
    const belowCostId = engine.findCardInZone("south", "deck", op11CaponeGangBege048);
    const wrongTraitId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op11CaponeGangBege048, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (search?.kind !== "selectEntity") throw new Error("Expected Bege's search choice.");
    for (const eligibleId of [firetankId, strawHatId]) {
      expect(search.candidates.find((candidate) => candidate.ref.id === eligibleId)?.legal).toBe(
        true,
      );
    }
    for (const excludedId of [belowCostId, wrongTraitId]) {
      expect(search.candidates.find((candidate) => candidate.ref.id === excludedId)?.legal).toBe(
        false,
      );
    }
    engine.resolveDecision("effectSearchSelection", { selectedIds: [strawHatId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Bege's remainder order.");
    const chosenOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: chosenOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(strawHatId);
    expect(engine.getState().players.south.deck.slice(-3)).toEqual(chosenOrder);
    expect(view.prompts).toHaveLength(0);
  });
});
