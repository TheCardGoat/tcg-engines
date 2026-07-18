import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op10EustassCaptainKid112,
} from "@tcg/op-cards";
import { op10MonkeyDLuffy111 } from "../../../../../cards/src/cards/OP10/characters/111-monkey-d-luffy.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-111 Monkey.D.Luffy", () => {
  test("finds an included Supernovas card, excludes its own name, and orders the rest", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op10MonkeyDLuffy111],
      deck: [
        op10EustassCaptainKid112,
        op10MonkeyDLuffy111,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
      ],
      activeDon: op10MonkeyDLuffy111.cost,
    });
    const kidId = engine.findCardInZone("south", "deck", op10EustassCaptainKid112);
    const luffyId = engine.findCardInZone("south", "deck", op10MonkeyDLuffy111);

    engine.playCard(op10MonkeyDLuffy111, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Luffy's search choice.");
    expect(search).toMatchObject({ min: 0, max: 1 });
    expect(search.candidates.find((candidate) => candidate.ref.id === kidId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === luffyId)?.legal).toBe(false);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [kidId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Luffy's bottom order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id).reverse() },
      "south",
    );

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      kidId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
