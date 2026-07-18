import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op07GeckoMoria042,
  op07PerfumeFemur057,
  op07Sengoku046,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-046 Sengoku", () => {
  test("finds a compound Warlords card of any category and orders the other looked cards at deck bottom", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op07Sengoku046],
      deck: [
        op07PerfumeFemur057,
        op07GeckoMoria042,
        eb01Doma005,
        eb01Fourtricks025,
        eb01Doma005,
        eb01Fourtricks025,
      ],
      activeDon: op07Sengoku046.cost,
    });
    const eventId = engine.findCardInZone("south", "deck", op07PerfumeFemur057);
    const characterId = engine.findCardInZone("south", "deck", op07GeckoMoria042);
    const unrelatedId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op07Sengoku046, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (search?.kind !== "selectEntity") throw new Error("Expected Sengoku's Warlords search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === eventId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === characterId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === unrelatedId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eventId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Sengoku's remainder order.");
    const chosenOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: chosenOrder }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      eventId,
    );
    expect(engine.getState().players.south.deck.slice(-4)).toEqual(chosenOrder);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
