import { describe, expect, test } from "vite-plus/test";
import type { CharacterCard } from "@tcg/op-types";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op05BeloBetty015,
  op05Inazuma003,
  op05Morley016,
} from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const compoundRevolutionary: CharacterCard = {
  ...eb01Doma005,
  id: "TEST-OP05-015-COMPOUND-REVOLUTIONARY",
  canonicalId: "TEST-OP05-015-COMPOUND-REVOLUTIONARY",
  name: "Compound Revolutionary",
  traits: ["Test Fleet/Revolutionary Army"],
};

registerCards([compoundRevolutionary]);

describe("OP05-015 Belo Betty", () => {
  test("searches top five for Revolutionary Army other than Belo Betty and orders the remainder", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op05BeloBetty015],
      deck: [
        op05Inazuma003,
        compoundRevolutionary,
        op05BeloBetty015,
        eb01Doma005,
        op05Morley016,
        eb01MountainGod018,
      ],
      activeDon: op05BeloBetty015.cost,
    });
    const inazumaId = engine.findCardInZone("south", "deck", op05Inazuma003);
    const compoundId = engine.findCardInZone("south", "deck", compoundRevolutionary);
    const excludedNameId = engine.findCardInZone("south", "deck", op05BeloBetty015);
    const unrelatedId = engine.findCardInZone("south", "deck", eb01Doma005);
    const morleyId = engine.findCardInZone("south", "deck", op05Morley016);
    const untouchedId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.playCard(op05BeloBetty015, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Belo Betty's search.");
    expect(
      search.candidates.map((candidate) => ({ id: candidate.ref.id, legal: candidate.legal })),
    ).toEqual([
      { id: inazumaId, legal: true },
      { id: compoundId, legal: true },
      { id: excludedNameId, legal: false },
      { id: unrelatedId, legal: false },
      { id: morleyId, legal: true },
    ]);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [compoundId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected bottom-deck ordering.");
    const bottomOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: bottomOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(compoundId);
    expect(engine.getState().players.south.deck).toEqual([untouchedId, ...bottomOrder]);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may reveal no card and orders all five looked cards on the bottom", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op05BeloBetty015],
      deck: [
        op05Inazuma003,
        compoundRevolutionary,
        op05BeloBetty015,
        eb01Fourtricks025,
        op05Morley016,
      ],
      activeDon: op05BeloBetty015.cost,
    });

    engine.playCard(op05BeloBetty015, "south");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");
    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected bottom-deck ordering.");
    const bottomOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: bottomOrder }, "south");

    expect(engine.getState().players.south.deck).toEqual(bottomOrder);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
