import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op01ArtificialDevilFruitSmile116,
  op01BaoHuang105,
  op01KurozumiOrochi098,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-098 Kurozumi Orochi", () => {
  test("on play reveals only Artificial Devil Fruit SMILE, adds it to hand, then shuffles", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op01KurozumiOrochi098],
        deck: [op01ArtificialDevilFruitSmile116, eb01Doma005, op01BaoHuang105],
        activeDon: op01KurozumiOrochi098.cost,
      },
      {},
      { seed: "orochi-search-shuffle" },
    );
    const smileId = engine.findCardInZone("south", "deck", op01ArtificialDevilFruitSmile116);
    const domaId = engine.findCardInZone("south", "deck", eb01Doma005);
    const baoId = engine.findCardInZone("south", "deck", op01BaoHuang105);

    engine.playCard(op01KurozumiOrochi098, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Orochi's deck search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === smileId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === domaId)?.legal).toBe(false);
    expect(search.candidates.find((candidate) => candidate.ref.id === baoId)?.legal).toBe(false);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [smileId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems")
      throw new Error("Expected Orochi's deck remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id).reverse() },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(smileId);
    expect(view.players.south.deckCount).toBe(2);
    expect(view.logs.some((entry) => entry.message.includes("shuffles their deck"))).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
