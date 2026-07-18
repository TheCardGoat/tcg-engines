import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op05Morley016,
  op05Sabo007,
  op06EmporioIvankov003,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-003 Emporio.Ivankov", () => {
  test("plays an included Revolutionary Army Character and bottoms the ordered remainder", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op06EmporioIvankov003],
      deck: [op05Sabo007, op05Morley016, eb01Doma005, eb01MountainGod018],
      activeDon: op06EmporioIvankov003.cost,
    });
    const eligibleId = engine.findCardInZone("south", "deck", op05Morley016);
    const overPowerId = engine.findCardInZone("south", "deck", op05Sabo007);
    const unrelatedId = engine.findCardInZone("south", "deck", eb01Doma005);
    const untouchedId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.playCard(op06EmporioIvankov003, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Ivankov's search.");
    expect(
      search.candidates.map((candidate) => ({ id: candidate.ref.id, legal: candidate.legal })),
    ).toEqual([
      { id: overPowerId, legal: false },
      { id: eligibleId, legal: true },
      { id: unrelatedId, legal: false },
    ]);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eligibleId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected bottom-deck ordering.");
    const bottomOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: bottomOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === eligibleId)).toBe(
      true,
    );
    expect(engine.getState().players.south.deck).toEqual([untouchedId, ...bottomOrder]);
  });
});
