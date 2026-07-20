import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op13SaintCharlos087,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op13Morgans093 } from "../../../../../cards/src/cards/OP13/characters/093-morgans.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-093 Morgans", () => {
  test("draws two cards, then trashes the controller's two selected physical hand cards", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13Morgans093, op13SaintCharlos087],
      deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      activeDon: op13Morgans093.cost,
    });
    const initialHandId = engine.findCardInZone("south", "hand", op13SaintCharlos087);
    const firstDrawId = engine.findCardInZone("south", "deck", eb01Doma005);
    const secondDrawId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.playCard(op13Morgans093, "south");
    const decision = engine.pendingDecision("effectTrashFromHandSelection", "south");
    expect(decision.actorId).toBe("south");
    const trash = decision.steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected Morgans's hand-trash choice.");
    expect(trash).toMatchObject({ min: 2, max: 2 });
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([initialHandId, firstDrawId, secondDrawId]),
    );
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [initialHandId, firstDrawId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([initialHandId, firstDrawId]),
    );
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([secondDrawId]);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("rests as the defender-owned Blocker and takes the attack instead of Leader Life", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [eb01Doma005], character: [op13Morgans093] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const morgansId = engine.findCardInZone("south", "character", op13Morgans093);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const decision = engine.pendingDecision("battleBlocker", "south");
    expect(decision.actorId).toBe("south");
    const blocker = decision.steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Morgans's Blocker choice.");
    expect(blocker).toMatchObject({ min: 0, max: 1 });
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(morgansId);
    engine.resolveDecision("battleBlocker", { selectedIds: [morgansId] }, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === morgansId)?.rested,
    ).toBe(true);
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(morgansId);
    expect(view.prompts).toHaveLength(0);
  });
});
