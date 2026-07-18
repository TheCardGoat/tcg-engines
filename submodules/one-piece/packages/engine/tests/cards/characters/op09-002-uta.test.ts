import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op08EdwardWeevil042,
  op09Shanks004,
  op09Uta002,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-002 Uta", () => {
  test("finds an included Red-Haired Pirates type and orders the four-card remainder", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op09Uta002],
      deck: [
        op09Shanks004,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        op08EdwardWeevil042,
        eb01Doma005,
      ],
      activeDon: op09Uta002.cost,
    });
    const selectedId = engine.findCardInZone("south", "deck", op09Shanks004);
    const unrelatedId = engine.findCardInZone("south", "deck", op08EdwardWeevil042);

    engine.playCard(op09Uta002, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Uta's search choice.");
    expect(search).toMatchObject({ min: 0, max: 1 });
    expect(search.candidates.find((candidate) => candidate.ref.id === selectedId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === unrelatedId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedId] }, "south");

    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected Uta's remainder order.");
    const chosenOrder = order.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: chosenOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(selectedId);
    expect(engine.getState().players.south.deck.slice(-4)).toEqual(chosenOrder);
    expect(view.prompts).toHaveLength(0);
  });
});
