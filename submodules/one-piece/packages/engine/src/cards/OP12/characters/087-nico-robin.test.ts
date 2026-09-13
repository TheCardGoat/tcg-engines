import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op12Koala081 } from "@tcg/op-cards";
import { op12NicoRobin087 } from "../../../../../cards/src/cards/OP12/characters/087-nico-robin.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-087 Nico Robin", () => {
  test("with a Koala Leader gains cost and can block", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op12Koala081, character: [op12NicoRobin087] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const robinId = engine.findCardInZone("south", "character", op12NicoRobin087);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === robinId)
        ?.cost,
    ).toBe(op12NicoRobin087.cost + 3);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [robinId] }, "south");

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });

  test("trashes a chosen own card before making the opponent trash two at five cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op12Koala081,
        hand: [op12NicoRobin087, eb01Doma005, eb01MountainGod018],
        activeDon: op12NicoRobin087.cost,
      },
      { hand: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005] },
    );
    const ownDiscardId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op12NicoRobin087, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [ownDiscardId] }, "south");
    const opponentDiscard = engine.pendingDecision("effectTrashFromHandSelection", "north")
      .steps[0];
    if (opponentDiscard?.kind !== "selectEntity") {
      throw new Error("Expected Nico Robin's opposing discard.");
    }
    const opponentIds = opponentDiscard.candidates.slice(0, 2).map((candidate) => candidate.ref.id);
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: opponentIds }, "north");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      ownDiscardId,
    );
    expect(engine.getView("north").players.north.handCount).toBe(3);
    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(opponentIds),
    );
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op12Koala081,
        hand: [op12NicoRobin087, eb01Doma005, eb01MountainGod018],
        activeDon: op12NicoRobin087.cost,
      },
      { hand: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005] },
    );
    engine.playCard(op12NicoRobin087, "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
