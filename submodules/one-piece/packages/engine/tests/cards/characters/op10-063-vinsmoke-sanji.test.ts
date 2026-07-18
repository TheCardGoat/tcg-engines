import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op06VinsmokeReiju042,
  op06VinsmokeReiju069,
  op10VinsmokeSanji063,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP10-063 Vinsmoke Sanji", () => {
  test("an included GERMA Leader trait enables a search for an included GERMA card trait", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op06VinsmokeReiju042,
      hand: [op10VinsmokeSanji063],
      deck: [
        op06VinsmokeReiju069,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
        eb01Fourtricks025,
      ],
      activeDon: op10VinsmokeSanji063.cost,
    });
    const eligibleId = engine.findCardInZone("south", "deck", op06VinsmokeReiju069);
    const unrelatedId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.playCard(op10VinsmokeSanji063, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Sanji's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === eligibleId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === unrelatedId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eligibleId] }, "south");
    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Sanji's remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id).reverse() },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });
});
