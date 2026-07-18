import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op03Shirahoshi116,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-116 Shirahoshi", () => {
  test("On Play draws three, then trashes the two chosen physical hand cards", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03Shirahoshi116],
      deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      activeDon: op03Shirahoshi116.cost,
    });
    const firstDrawId = engine.findCardInZone("south", "deck", eb01Doma005);
    const secondDrawId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const retainedDrawId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.playCard(op03Shirahoshi116, "south");

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(trash?.kind).toBe("selectEntity");
    if (trash?.kind !== "selectEntity") throw new Error("Expected Shirahoshi's hand-trash choice.");
    expect(trash).toMatchObject({ min: 2, max: 2 });
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([firstDrawId, secondDrawId, retainedDrawId]),
    );
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [firstDrawId, secondDrawId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(retainedDrawId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstDrawId, secondDrawId]),
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("Trigger plays the resolving physical card before drawing three and trashing two", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op03Shirahoshi116],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const shirahoshiId = engine.findCardInZone("north", "life", op03Shirahoshi116);
    const firstDrawId = engine.findCardInZone("north", "deck", eb01Doma005);
    const secondDrawId = engine.findCardInZone("north", "deck", eb01Fourtricks025);
    const retainedDrawId = engine.findCardInZone("north", "deck", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "north").steps[0];
    expect(trash?.kind).toBe("selectEntity");
    if (trash?.kind !== "selectEntity") throw new Error("Expected Shirahoshi's hand-trash choice.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([firstDrawId, secondDrawId, retainedDrawId]),
    );
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [firstDrawId, secondDrawId] },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === shirahoshiId)).toBe(
      true,
    );
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(retainedDrawId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstDrawId, secondDrawId]),
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline Trigger and takes the physical card into hand without resolving On Play", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op03Shirahoshi116],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const shirahoshiId = engine.findCardInZone("north", "life", op03Shirahoshi116);
    const deckBefore = engine.getView("north").players.north.deckCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "decline" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(shirahoshiId);
    expect(view.players.north.deckCount).toBe(deckBefore);
    expect(view.players.north.characters.some((card) => card?.instanceId === shirahoshiId)).toBe(
      false,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
