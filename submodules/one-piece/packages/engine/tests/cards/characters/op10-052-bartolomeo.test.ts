import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op10Bartolomeo052,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP10-052 Bartolomeo", () => {
  test("may bottom-deck either player's cost-1 Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op10Bartolomeo052],
        character: [eb01Doma005],
        deck: [eb01Fourtricks025],
        activeDon: op10Bartolomeo052.cost,
      },
      { character: [eb01Doma005] },
    );
    const ownId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);
    const untouchedId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.playCard(op10Bartolomeo052, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity")
      throw new Error("Expected Bartolomeo's bottom-deck choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([ownId, opposingId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(ownId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(opposingId);
    expect(engine.getState().players.south.deck).toEqual([untouchedId, ownId]);
    expect(view.prompts).toHaveLength(0);
  });

  test("may block an attack and become its target", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op10Bartolomeo052] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const bartolomeoId = engine.findCardInZone("south", "character", op10Bartolomeo052);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Bartolomeo's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(bartolomeoId);
    engine.resolveDecision("battleBlocker", { selectedIds: [bartolomeoId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.prompts).toHaveLength(0);
  });
});
