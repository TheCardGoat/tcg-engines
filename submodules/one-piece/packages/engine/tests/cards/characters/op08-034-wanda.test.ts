import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Nekomamushi048,
  op08Wanda034,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-034 Wanda", () => {
  test("looks at 5, adds a non-Wanda card whose type includes Minks, and orders the rest on bottom", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op08Wanda034],
      activeDon: op08Wanda034.cost,
      deck: [op01Nekomamushi048, op08Wanda034, eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
    });
    const eligibleId = engine.findCardInZone("south", "deck", op01Nekomamushi048);
    const wandaId = engine.findCardInZone("south", "deck", op08Wanda034);
    const wrongTraitId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op08Wanda034, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (search?.kind !== "selectEntity") throw new Error("Expected Wanda's five-card search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === eligibleId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === wandaId)?.legal).toBe(false);
    expect(search.candidates.find((candidate) => candidate.ref.id === wrongTraitId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eligibleId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Wanda's remainder order.");
    const bottomOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: bottomOrder }, "south");

    expect(engine.findCardInZone("south", "hand", op01Nekomamushi048)).toBe(eligibleId);
    expect(engine.getState().players.south.deck).toEqual(bottomOrder);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
