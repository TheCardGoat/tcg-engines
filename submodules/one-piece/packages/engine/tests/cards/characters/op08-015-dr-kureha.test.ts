import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op07TonyTonyChopper103,
  op08DrKureha015,
  op08Robson013,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-015 Dr.Kureha", () => {
  test("searches four for either Tony Tony.Chopper or an included Drum Kingdom type", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op08DrKureha015],
      deck: [
        op07TonyTonyChopper103,
        op08Robson013,
        op08DrKureha015,
        eb01Doma005,
        eb01MountainGod018,
      ],
      activeDon: op08DrKureha015.cost,
    });
    const nameId = engine.findCardInZone("south", "deck", op07TonyTonyChopper103);
    const traitId = engine.findCardInZone("south", "deck", op08Robson013);
    const excludedNameId = engine.findCardInZone("south", "deck", op08DrKureha015);
    const unrelatedId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op08DrKureha015, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (search?.kind !== "selectEntity") throw new Error("Expected Dr.Kureha's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === nameId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === traitId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === excludedNameId)?.legal).toBe(
      false,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === unrelatedId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [traitId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Dr.Kureha's bottom order.");
    const bottomOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: bottomOrder }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      traitId,
    );
    expect(engine.getState().players.south.deck.slice(-3)).toEqual(bottomOrder);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may reveal no card and orders all four looked cards on the bottom", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op08DrKureha015],
      deck: [
        op07TonyTonyChopper103,
        op08Robson013,
        op08DrKureha015,
        eb01Doma005,
        eb01MountainGod018,
      ],
      activeDon: op08DrKureha015.cost,
    });

    engine.playCard(op08DrKureha015, "south");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");
    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Dr.Kureha's bottom order.");
    const bottomOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: bottomOrder }, "south");

    expect(engine.getView("south").players.south.hand).toHaveLength(0);
    expect(engine.getState().players.south.deck.slice(-4)).toEqual(bottomOrder);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
