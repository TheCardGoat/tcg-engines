import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op07Capote063,
  op07Foxy071,
  op07Pickles069,
  op07Porche072,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-072 Porche", () => {
  test("returns DON!!, searches an included Foxy Pirates card, orders the rest, then plays an eligible purple Character", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op07Porche072, op07Pickles069, op07Foxy071],
      deck: [
        op07Capote063,
        eb01Doma005,
        eb01Fourtricks025,
        eb01Doma005,
        eb01Fourtricks025,
        eb01Doma005,
      ],
      activeDon: op07Porche072.cost + 1,
    });
    const searchedId = engine.findCardInZone("south", "deck", op07Capote063);
    const handEligibleId = engine.findCardInZone("south", "hand", op07Pickles069);
    const highPowerId = engine.findCardInZone("south", "hand", op07Foxy071);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op07Porche072, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Porche's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === searchedId)?.legal).toBe(
      true,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [searchedId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Porche's bottom order.");
    const order = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: order }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Porche's play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([searchedId, handEligibleId]),
    );
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(highPowerId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [handEligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(handEligibleId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(searchedId);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(engine.getState().players.south.deck.slice(-4)).toEqual(order);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without returning DON!!, searching, or playing", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op07Porche072, op07Pickles069],
      deck: [op07Capote063, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      activeDon: op07Porche072.cost + 1,
    });
    const candidateId = engine.findCardInZone("south", "hand", op07Pickles069);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op07Porche072, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(candidateId);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore);
    expect(view.prompts).toHaveLength(0);
  });
});
