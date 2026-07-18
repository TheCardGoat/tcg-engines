import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op04MissMerrychristmasDrophy067,
  op09DraculeMihawk048,
  op09Mr3Galdino056,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-056 Mr.3(Galdino)", () => {
  test("finds either included trait, excludes its own name, and bottom-orders the rest", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op09Mr3Galdino056],
      deck: [
        op04MissMerrychristmasDrophy067,
        op09DraculeMihawk048,
        op09Mr3Galdino056,
        eb01Doma005,
        eb01MountainGod018,
      ],
      activeDon: op09Mr3Galdino056.cost,
    });
    const baroqueWorksId = engine.findCardInZone("south", "deck", op04MissMerrychristmasDrophy067);
    const crossGuildId = engine.findCardInZone("south", "deck", op09DraculeMihawk048);
    const sameNameId = engine.findCardInZone("south", "deck", op09Mr3Galdino056);

    engine.playCard(op09Mr3Galdino056, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Mr.3's search choice.");
    expect(search).toMatchObject({ min: 0, max: 1 });
    expect(search.candidates.find((candidate) => candidate.ref.id === baroqueWorksId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === crossGuildId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === sameNameId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [baroqueWorksId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Mr.3's bottom order.");
    const order = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: order }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(baroqueWorksId);
    expect(engine.getState().players.south.deck.slice(-3)).toEqual(order);
    expect(view.prompts).toHaveLength(0);
  });
});
