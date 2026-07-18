import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op11TonyTonyChopper053,
  op13CurlyDadan009,
  op13NefeltariCobra011,
} from "@tcg/op-cards";
import { op13NefeltariVivi012 } from "../../../../../cards/src/cards/OP13/characters/012-nefeltari-vivi.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-012 Nefeltari Vivi", () => {
  test("finds either included trait at cost 2 or more and bottom-orders the remainder", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13NefeltariVivi012],
      deck: [
        op13NefeltariCobra011,
        op11TonyTonyChopper053,
        op13CurlyDadan009,
        eb01Doma005,
        eb01Fourtricks025,
      ],
      activeDon: op13NefeltariVivi012.cost,
    });
    const alabastaId = engine.findCardInZone("south", "deck", op13NefeltariCobra011);
    const strawHatId = engine.findCardInZone("south", "deck", op11TonyTonyChopper053);
    const belowCostId = engine.findCardInZone("south", "deck", op13CurlyDadan009);
    const wrongTraitId = engine.findCardInZone("south", "deck", eb01Doma005);
    const untouchedId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.playCard(op13NefeltariVivi012, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Vivi's search choice.");
    for (const eligibleId of [alabastaId, strawHatId]) {
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
    if (remainder?.kind !== "orderItems") throw new Error("Expected Vivi's remainder order.");
    const submittedOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: submittedOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(strawHatId);
    expect(engine.getState().players.south.deck).toEqual([untouchedId, ...submittedOrder]);
    expect(view.prompts).toHaveLength(0);
  });
});
