import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op02Sakazuki099,
  op10Urouge101,
  op11Hibari010,
  op11Koby001,
  op11XDrake017,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP11-001 Koby", () => {
  test("lets a newly played SWORD Character attack only a Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op11Koby001,
        character: [{ card: op11XDrake017, playedOnTurn: 1 }],
      },
      { character: [{ card: op10Urouge101, rested: true, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", op11XDrake017);
    const targetId = engine.findCardInZone("north", "character", op10Urouge101);

    engine.declareAttack(attackerId, targetId, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === attackerId)?.rested,
    ).toBe(true);
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("returns exactly 3 trash cards to protect a qualifying Navy Character from an opposing effect K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op02Sakazuki099, eb01Doma005], activeDon: 6 },
      {
        leaderCardId: op11Koby001,
        character: [{ card: op11Hibari010, rested: true, playedOnTurn: 0 }],
        trash: [eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "north" },
    );
    const protectedId = engine.findCardInZone("north", "character", op11Hibari010);
    const paymentId = engine.findCardInZone("south", "hand", eb01Doma005);
    const returnedIds = [...engine.getState().players.north.trash];

    engine.endTurn("north");
    engine.playCard(op02Sakazuki099, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paymentId] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [protectedId] }, "south");
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "north");

    const orderStep = engine.pendingDecision("effectReturnToDeckOwnerOrder", "north").steps[0];
    expect(orderStep).toMatchObject({ kind: "orderItems", min: 3, max: 3 });
    if (!orderStep || orderStep.kind !== "orderItems") {
      throw new Error("Expected Koby's owner-only Trash-to-Deck order prompt.");
    }
    expect(orderStep.candidates.map((candidate) => candidate.ref.id)).toEqual(returnedIds);
    const returnedOrder = [...returnedIds].reverse();
    engine.resolveDecision("effectReturnToDeckOwnerOrder", { selectedIds: returnedOrder }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === protectedId)).toBe(
      true,
    );
    expect(view.players.north.trash).toHaveLength(0);
    expect(view.players.north.deckCount).toBe(13);
    expect(engine.getState().players.north.deck.slice(-3)).toEqual(returnedOrder);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
