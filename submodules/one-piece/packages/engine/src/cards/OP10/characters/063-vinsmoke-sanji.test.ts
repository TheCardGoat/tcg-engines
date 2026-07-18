import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op06VinsmokeReiju042,
  op06VinsmokeSora063,
  op10VinsmokeSanji063,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-063 Vinsmoke Sanji", () => {
  test("with an included GERMA Leader finds an included GERMA card and bottom-orders the rest", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op06VinsmokeReiju042,
      hand: [op10VinsmokeSanji063],
      deck: [
        op06VinsmokeSora063,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
        eb01Fourtricks025,
      ],
      activeDon: op10VinsmokeSanji063.cost,
    });
    const soraId = engine.findCardInZone("south", "deck", op06VinsmokeSora063);
    const ineligibleId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op10VinsmokeSanji063, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Sanji's GERMA search.");
    expect(search).toMatchObject({ min: 0, max: 1 });
    expect(search.candidates.find((candidate) => candidate.ref.id === soraId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === ineligibleId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [soraId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Sanji's bottom order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id).reverse() },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(soraId);
    expect(view.prompts).toHaveLength(0);
  });
});
