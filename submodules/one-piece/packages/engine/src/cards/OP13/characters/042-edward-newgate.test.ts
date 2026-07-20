import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op13EdwardNewgate042 } from "../../../../../cards/src/cards/OP13/characters/042-edward-newgate.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-042 Edward.Newgate", () => {
  test("draws two, trashes one selected card, then gives up to two DON!! each to its Leader and a Character", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13EdwardNewgate042, eb01Doma005],
      character: [eb01Fourtricks025, eb01MountainGod018],
      deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      activeDon: op13EdwardNewgate042.cost,
      restedDon: 4,
    });
    const discardedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const recipientId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const otherId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.playCard(op13EdwardNewgate042, "south");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected Newgate's hand-trash choice.");
    expect(trash).toMatchObject({ min: 1, max: 1 });
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toContain(discardedId);
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardedId] }, "south");

    engine.resolveDecision("effectGiveDonCount", { optionId: "2" }, "south");
    engine.resolveDecision("effectGiveDonCount", { optionId: "2" }, "south");
    const recipient = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (recipient?.kind !== "selectEntity") {
      throw new Error("Expected Newgate's Character DON!! recipient.");
    }
    expect(recipient.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([recipientId, otherId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [recipientId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader.attachedDon).toBe(2);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === recipientId)?.attachedDon,
    ).toBe(2);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === otherId)?.attachedDon,
    ).toBe(0);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardedId);
    expect(view.players.south).toMatchObject({ handCount: 2, deckCount: 1, restedDon: 10 });
    expect(view.prompts).toHaveLength(0);
  });

  test("rests as a Blocker and retargets an opposing attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op13EdwardNewgate042] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const newgateId = engine.findCardInZone("south", "character", op13EdwardNewgate042);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [newgateId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === newgateId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
