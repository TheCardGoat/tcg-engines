import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op08Ginrummy086,
  op08Queen080,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-080 Queen", () => {
  test("finds an included Animal Kingdom Pirates card other than Queen and orders the remainder", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op08Queen080],
      deck: [
        op08Ginrummy086,
        op08Queen080,
        eb01Doma005,
        eb01MountainGod018,
        eb01Doma005,
        eb01Fourtricks025,
      ],
      activeDon: op08Queen080.cost,
    });
    const compoundTraitId = engine.findCardInZone("south", "deck", op08Ginrummy086);
    const excludedQueenId = engine.findCardInZone("south", "deck", op08Queen080);
    const untouchedId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.playCard(op08Queen080, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Queen's search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === compoundTraitId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === excludedQueenId)?.legal).toBe(
      false,
    );
    expect(search.candidates.filter((candidate) => candidate.legal)).toHaveLength(1);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [compoundTraitId] }, "south");

    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(order?.kind).toBe("orderItems");
    if (order?.kind !== "orderItems") throw new Error("Expected Queen's bottom-deck order.");
    const bottomOrder = order.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: bottomOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(compoundTraitId);
    expect(engine.getState().players.south.deck).toEqual([untouchedId, ...bottomOrder]);
    expect(view.prompts).toHaveLength(0);
  });
});
