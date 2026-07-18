import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op05UpperYard117,
  op08Wyper110,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-110 Wyper", () => {
  test("searches an Upper Yard, orders the remainder, then plays an Upper Yard from hand", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op08Wyper110, op05UpperYard117],
      deck: [
        op05UpperYard117,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
        eb01Fourtricks025,
      ],
      activeDon: op08Wyper110.cost,
    });
    const searchedId = engine.findCardInZone("south", "deck", op05UpperYard117);
    const handId = engine.findCardInZone("south", "hand", op05UpperYard117);

    engine.playCard(op08Wyper110, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Wyper's search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === searchedId)?.legal).toBe(
      true,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [searchedId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Wyper's remainder order.");
    const order = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: order }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Wyper's Upper Yard play.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([searchedId, handId]),
    );
    engine.resolveDecision("effectPlaySelection", { selectedIds: [searchedId] }, "south");

    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");
    const nestedRemainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (nestedRemainder?.kind !== "orderItems") {
      throw new Error("Expected the played Upper Yard's remainder order.");
    }
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: nestedRemainder.candidates.map((candidate) => candidate.ref.id) },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.stage?.instanceId).toBe(searchedId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(handId);
    expect(view.prompts).toHaveLength(0);
  });
});
