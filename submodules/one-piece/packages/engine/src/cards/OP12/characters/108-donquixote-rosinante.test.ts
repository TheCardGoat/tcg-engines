import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op10TrafalgarLaw119 } from "@tcg/op-cards";
import { op12DonquixoteRosinante108 } from "../../../../../cards/src/cards/OP12/characters/108-donquixote-rosinante.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-108 Donquixote Rosinante", () => {
  test("finds only Trafalgar Law among the top five and orders the remainder on the bottom", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op12DonquixoteRosinante108],
      deck: [
        op10TrafalgarLaw119,
        eb01Doma005,
        eb01MountainGod018,
        eb01Doma005,
        eb01MountainGod018,
        eb01Doma005,
      ],
      activeDon: op12DonquixoteRosinante108.cost,
    });
    const lawId = engine.findCardInZone("south", "deck", op10TrafalgarLaw119);
    const excludedId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op12DonquixoteRosinante108, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (search?.kind !== "selectEntity") throw new Error("Expected Rosinante's search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === lawId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === excludedId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [lawId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected bottom-deck ordering.");
    const order = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: order }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      lawId,
    );
    expect(engine.getState().players.south.deck.slice(-4)).toEqual(order);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
