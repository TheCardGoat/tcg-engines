import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op07Foxy059,
  op14eb04GroggyMonsters033,
  op14eb04Porche037,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB04-037 Porche", () => {
  test("searches the top 5 for an included Foxy Pirates card and orders the remainder", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op07Foxy059,
      hand: [op14eb04Porche037],
      deck: [
        op14eb04GroggyMonsters033,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
        eb01Fourtricks025,
      ],
      activeDon: 1,
    });
    const searchedId = engine.findCardInZone("south", "deck", op14eb04GroggyMonsters033);

    engine.playCard(op14eb04Porche037, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Porche's search choice.");
    expect(search.candidates.map((candidate) => candidate.ref.id)).toContain(searchedId);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [searchedId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Porche's deck-bottom order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id).reverse() },
      "south",
    );

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      searchedId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
