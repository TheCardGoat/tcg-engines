import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op02Jinbe033,
  op05Jinbe066,
  op09ZoroJuurouSt18004004,
  op10Giolla066,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST18-004 Zoro-Juurou", () => {
  test("finds a purple card with an included Straw Hat Crew trait and orders the rest", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op09ZoroJuurouSt18004004],
      deck: [
        op05Jinbe066,
        op02Jinbe033,
        op10Giolla066,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
      ],
      activeDon: op09ZoroJuurouSt18004004.cost,
    });
    const eligibleId = engine.findCardInZone("south", "deck", op05Jinbe066);
    const wrongColorId = engine.findCardInZone("south", "deck", op02Jinbe033);
    const wrongTraitId = engine.findCardInZone("south", "deck", op10Giolla066);

    engine.playCard(op09ZoroJuurouSt18004004, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Zoro-Juurou's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === eligibleId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === wrongColorId)?.legal).toBe(
      false,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === wrongTraitId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eligibleId] }, "south");
    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") {
      throw new Error("Expected Zoro-Juurou's remainder order.");
    }
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
