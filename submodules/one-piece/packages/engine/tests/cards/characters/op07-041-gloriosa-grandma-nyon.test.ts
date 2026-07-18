import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op07GloriosaGrandmaNyon041,
  op07Marguerite054,
  op07Salome043,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-041 Gloriosa (Grandma Nyon)", () => {
  test("finds either eligible compound type, excludes herself, and orders the rest at the bottom", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op07GloriosaGrandmaNyon041],
      deck: [
        op07Marguerite054,
        op07Salome043,
        op07GloriosaGrandmaNyon041,
        eb01Doma005,
        eb01Fourtricks025,
        eb01Doma005,
      ],
      activeDon: 1,
    });
    const amazonLilyId = engine.findCardInZone("south", "deck", op07Marguerite054);
    const kujaPiratesId = engine.findCardInZone("south", "deck", op07Salome043);
    const gloriosaId = engine.findCardInZone("south", "deck", op07GloriosaGrandmaNyon041);
    const unrelatedId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op07GloriosaGrandmaNyon041, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Gloriosa's search choice.");
    expect(search).toMatchObject({ min: 0, max: 1 });
    expect(search.candidates.find((candidate) => candidate.ref.id === amazonLilyId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === kujaPiratesId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === gloriosaId)?.legal).toBe(
      false,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === unrelatedId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [kujaPiratesId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Gloriosa's remainder order.");
    const chosenOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: chosenOrder }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      kujaPiratesId,
    );
    expect(engine.getState().players.south.deck.slice(-4)).toEqual(chosenOrder);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
