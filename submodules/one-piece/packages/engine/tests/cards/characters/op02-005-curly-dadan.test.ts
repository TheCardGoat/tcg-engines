import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op02CurlyDadan005,
  op02Makino015,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-005 Curly.Dadan", () => {
  test("finds only a red cost-1 Character among the top five and lets its controller order the remainder", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op02CurlyDadan005],
      deck: [op02Makino015, eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      activeDon: op02CurlyDadan005.cost,
    });
    const makinoId = engine.findCardInZone("south", "deck", op02Makino015);
    const domaId = engine.findCardInZone("south", "deck", eb01Doma005);
    const fourtricksId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.playCard(op02CurlyDadan005, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Curly.Dadan's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === makinoId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === domaId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === fourtricksId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [makinoId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems")
      throw new Error("Expected Curly.Dadan's remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id).reverse() },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(makinoId);
    expect(view.players.south.deckCount).toBe(4);
    expect(view.prompts).toHaveLength(0);
  });
});
