import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01Komurasaki042, op07Caribou023, op07Otama022 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-022 Otama", () => {
  test("finds a green compound Land of Wano card other than Otama and bottoms the rest in order", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op07Otama022],
      deck: [
        op01Komurasaki042,
        op07Otama022,
        op07Caribou023,
        eb01Doma005,
        eb01Doma005,
        eb01Doma005,
      ],
      activeDon: op07Otama022.cost,
    });
    const eligibleId = engine.findCardInZone("south", "deck", op01Komurasaki042);
    const excludedOtamaId = engine.findCardInZone("south", "deck", op07Otama022);
    const wrongTraitId = engine.findCardInZone("south", "deck", op07Caribou023);
    const wrongColorId = engine.findCardInZone("south", "deck", eb01Doma005);
    const untouchedId = engine.getState().players.south.deck[5]!;

    engine.playCard(op07Otama022, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (search?.kind !== "selectEntity") throw new Error("Expected Otama's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === eligibleId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === excludedOtamaId)?.legal).toBe(
      false,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === wrongTraitId)?.legal).toBe(
      false,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === wrongColorId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eligibleId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Otama's remainder order.");
    const submittedOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: submittedOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eligibleId);
    expect(engine.getState().players.south.deck).toEqual([untouchedId, ...submittedOrder]);
    expect(view.prompts).toHaveLength(0);
  });
});
