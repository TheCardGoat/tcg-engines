import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op09Izo044 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-044 Izo", () => {
  test("finds either included trait, orders the remainder, then trashes a card from hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01Doma005],
        character: [{ card: op09Izo044, playedOnTurn: 0 }],
        deck: [
          eb01MountainGod018,
          eb01Doma005,
          eb01Fourtricks025,
          eb01Doma005,
          eb01Fourtricks025,
          eb01MountainGod018,
        ],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const izoId = engine.findCardInZone("south", "character", op09Izo044);
    const landOfWanoId = engine.findCardInZone("south", "deck", eb01MountainGod018);
    const whitebeardId = engine.findCardInZone("south", "deck", eb01Doma005);
    const wrongTraitId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const discardId = engine.findCardInZone("south", "hand", eb01Doma005);
    const untouchedId = engine.getState().players.south.deck[5]!;

    engine.declareAttack(izoId, engine.leader("north"), "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (search?.kind !== "selectEntity") throw new Error("Expected Izo's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === landOfWanoId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === whitebeardId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === wrongTraitId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [whitebeardId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Izo's remainder order.");
    const order = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: order }, "south");

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(trash).toMatchObject({ kind: "selectEntity", min: 1, max: 1 });
    if (trash?.kind !== "selectEntity") throw new Error("Expected Izo's hand-trash choice.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([discardId, whitebeardId]),
    );
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(whitebeardId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardId);
    expect(engine.getState().players.south.deck).toEqual([untouchedId, ...order]);
    expect(view.prompts).toHaveLength(0);
  });
});
