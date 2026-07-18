import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01DraculeMihawk070,
  op02GeckoMoria054,
  op09Perona034,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-034 Perona", () => {
  test("finds either Dracule Mihawk by name or an included Thriller Bark Pirates card, orders the rest, then trashes from hand", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op09Perona034, eb01Doma005],
      deck: [
        op01DraculeMihawk070,
        op02GeckoMoria054,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
      ],
      activeDon: op09Perona034.cost,
    });
    const retainedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const mihawkId = engine.findCardInZone("south", "deck", op01DraculeMihawk070);
    const thrillerBarkId = engine.findCardInZone("south", "deck", op02GeckoMoria054);
    const wrongCardId = engine.findCardInZone("south", "deck", eb01Doma005);
    const untouchedId = engine.getState().players.south.deck[5]!;

    engine.playCard(op09Perona034, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Perona's search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === mihawkId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === thrillerBarkId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === wrongCardId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [mihawkId] }, "south");

    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(order?.kind).toBe("orderItems");
    if (order?.kind !== "orderItems") throw new Error("Expected Perona's bottom order.");
    const bottomOrder = order.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: bottomOrder }, "south");

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(trash).toMatchObject({ kind: "selectEntity", min: 1, max: 1 });
    if (trash?.kind !== "selectEntity") throw new Error("Expected Perona's hand-trash choice.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([retainedId, mihawkId]),
    );
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [retainedId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(mihawkId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(retainedId);
    expect(engine.getState().players.south.deck).toEqual([untouchedId, ...bottomOrder]);
    expect(view.prompts).toHaveLength(0);
  });
});
