import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01ParadiseWaterfall057,
  op02Seaquake021,
  op03Buggy008,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-008 Buggy", () => {
  test("finds only a red Event and orders the rest of the looked-at cards", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03Buggy008],
      deck: [
        op02Seaquake021,
        op01ParadiseWaterfall057,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        op02Seaquake021,
      ],
      activeDon: op03Buggy008.cost,
    });
    const redEventId = engine.findCardInZone("south", "deck", op02Seaquake021);
    const greenEventId = engine.findCardInZone("south", "deck", op01ParadiseWaterfall057);
    const redCharacterId = engine.findCardInZone("south", "deck", eb01Doma005);
    // Deck identity/order is intentionally asserted at the raw hidden-zone boundary.
    const deckBefore = [...engine.getState().players.south.deck];

    engine.playCard(op03Buggy008, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Buggy's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === redEventId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === greenEventId)?.legal).toBe(
      false,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === redCharacterId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [redEventId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Buggy's deck order.");
    const remainderOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: remainderOrder }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      redEventId,
    );
    expect(engine.getState().players.south.deck).toEqual([deckBefore[5], ...remainderOrder]);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may reveal no Event and order every looked card at the deck bottom", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03Buggy008],
      deck: [
        op02Seaquake021,
        op01ParadiseWaterfall057,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        op02Seaquake021,
      ],
      activeDon: op03Buggy008.cost,
    });
    // Deck identity/order is intentionally asserted at the raw hidden-zone boundary.
    const deckBefore = [...engine.getState().players.south.deck];

    engine.playCard(op03Buggy008, "south");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");
    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Buggy's deck order.");
    const remainderOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: remainderOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand).toHaveLength(0);
    expect(engine.getState().players.south.deck).toEqual([deckBefore[5], ...remainderOrder]);
    expect(view.prompts).toHaveLength(0);
  });

  test("is not K.O.'d in battle by a Slash attribute card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01Fourtricks025, playedOnTurn: 0 }] },
      { character: [{ card: op03Buggy008, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const buggyId = engine.findCardInZone("north", "character", op03Buggy008);

    engine.declareAttack(attackerId, buggyId, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.some((card) => card?.instanceId === buggyId)).toBe(true);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(buggyId);
  });

  test("is K.O.'d in battle by a non-Slash attribute card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { character: [{ card: op03Buggy008, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const buggyId = engine.findCardInZone("north", "character", op03Buggy008);

    engine.declareAttack(attackerId, buggyId, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      buggyId,
    );
  });
});
