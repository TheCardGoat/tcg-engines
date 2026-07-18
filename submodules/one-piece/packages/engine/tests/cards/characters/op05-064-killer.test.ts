import { describe, expect, test } from "vite-plus/test";
import type { CharacterCard } from "@tcg/op-types";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Killer039,
  op05EustassCaptainKid074,
  op05Killer064,
} from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const compoundKidPirates: CharacterCard = {
  ...eb01Doma005,
  id: "TEST-OP05-064-COMPOUND-KID-PIRATES",
  canonicalId: "TEST-OP05-064-COMPOUND-KID-PIRATES",
  name: "Heat",
  traits: ["Supernovas/Kid Pirates"],
};

registerCards([compoundKidPirates]);

describe("OP05-064 Killer", () => {
  test("finds an included Kid Pirates card other than Killer and bottom-orders the rest", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op05Killer064],
      deck: [
        compoundKidPirates,
        op05Killer064,
        eb01Fourtricks025,
        op01Killer039,
        op05EustassCaptainKid074,
        eb01MountainGod018,
      ],
      activeDon: 1,
    });
    const compoundId = engine.findCardInZone("south", "deck", compoundKidPirates);
    const sameNameIds = [
      engine.findCardInZone("south", "deck", op05Killer064),
      engine.findCardInZone("south", "deck", op01Killer039),
    ];
    const exactTraitId = engine.findCardInZone("south", "deck", op05EustassCaptainKid074);
    const untouchedId = engine.getState().players.south.deck[5]!;

    engine.playCard(op05Killer064, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Killer's search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === compoundId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === exactTraitId)?.legal).toBe(
      true,
    );
    expect(
      search.candidates
        .filter((candidate) => sameNameIds.includes(candidate.ref.id))
        .every((candidate) => !candidate.legal),
    ).toBe(true);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [compoundId] }, "south");
    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(order?.kind).toBe("orderItems");
    if (order?.kind !== "orderItems") throw new Error("Expected Killer's bottom order.");
    const bottomOrder = order.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: bottomOrder }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      compoundId,
    );
    expect(engine.getState().players.south.deck).toEqual([untouchedId, ...bottomOrder]);
  });

  test("may reveal nothing", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op05Killer064],
      deck: [compoundKidPirates, eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      activeDon: 1,
    });
    engine.playCard(op05Killer064, "south");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");
    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(order?.kind).toBe("orderItems");
    if (order?.kind !== "orderItems") throw new Error("Expected Killer's bottom order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: order.candidates.map((candidate) => candidate.ref.id).reverse() },
      "south",
    );
    expect(engine.getView("south").players.south.hand).toHaveLength(0);
  });
});
