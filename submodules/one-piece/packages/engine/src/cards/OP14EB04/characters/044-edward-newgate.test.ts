import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op01Shanks120 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04EdwardNewgate044 } from "../../../../../cards/src/cards/OP14EB04/characters/044-edward-newgate.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-044 Edward.Newgate", () => {
  test("revealing a card whose compound type includes Whitebeard Pirates draws two then trashes one selected hand card", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op14eb04EdwardNewgate044, op01Shanks120],
      deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      activeDon: op14eb04EdwardNewgate044.cost,
    });
    const revealedId = engine.findCardInZone("south", "deck", eb01Doma005);
    const secondDrawId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const selectedDiscardId = engine.findCardInZone("south", "hand", op01Shanks120);

    engine.playCard(op14eb04EdwardNewgate044, "south");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected Newgate's hand-trash choice.");
    expect(trash).toMatchObject({ min: 1, max: 1 });
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([revealedId, secondDrawId, selectedDiscardId]),
    );
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [selectedDiscardId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([revealedId, secondDrawId]),
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(selectedDiscardId);
    expect(view.prompts).toHaveLength(0);
  });

  test("revealing a nonmatching type does not draw or trash a hand card", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op14eb04EdwardNewgate044, op01Shanks120],
      deck: [eb01Fourtricks025, eb01Doma005, eb01MountainGod018],
      activeDon: op14eb04EdwardNewgate044.cost,
    });
    const retainedHandId = engine.findCardInZone("south", "hand", op01Shanks120);
    const deckCountBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op14eb04EdwardNewgate044, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([retainedHandId]);
    expect(view.players.south.deckCount).toBe(deckCountBefore);
    expect(view.players.south.trash).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });

  test("rests as a Blocker and retargets an opposing attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op14eb04EdwardNewgate044] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const newgateId = engine.findCardInZone("south", "character", op14eb04EdwardNewgate044);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Newgate's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(newgateId);
    engine.resolveDecision("battleBlocker", { selectedIds: [newgateId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === newgateId)?.rested,
    ).toBe(true);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(newgateId);
    expect(view.prompts).toHaveLength(0);
  });
});
