import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op10Bartolomeo052, op10Bian053 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-052 Bartolomeo", () => {
  test("On Play may put either player's cost-1 Character at the bottom of its owner's deck", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op10Bartolomeo052],
        character: [op10Bian053],
        activeDon: op10Bartolomeo052.cost,
      },
      { character: [eb01Doma005] },
    );
    const ownId = engine.findCardInZone("south", "character", op10Bian053);
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op10Bartolomeo052, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Bartolomeo's target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([ownId, opposingId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownId] }, "south");

    expect(engine.getState().players.south.deck.at(-1)).toBe(ownId);
    expect(
      engine.getView("south").players.south.characters.map((card) => card?.instanceId),
    ).not.toContain(ownId);
  });

  test("Blocker redirects a public attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op10Bartolomeo052] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const blockerId = engine.findCardInZone("south", "character", op10Bartolomeo052);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "south");
    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      blockerId,
    );
  });
});
