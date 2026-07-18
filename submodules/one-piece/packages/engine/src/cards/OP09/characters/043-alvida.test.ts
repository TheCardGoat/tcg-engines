import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op09Alvida043,
  op09Buggy042,
  op09Crocodile046,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-043 Alvida", () => {
  test("on K.O. plays an eligible non-Alvida Character under an included Cross Guild Leader trait", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op09Buggy042,
        hand: [eb01Doma005, op09Alvida043, op09Crocodile046],
        character: [{ card: op09Alvida043, rested: true }],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const alvidaId = engine.findCardInZone("south", "character", op09Alvida043);
    const eligibleId = engine.findCardInZone("south", "hand", eb01Doma005);
    const otherAlvidaId = engine.findCardInZone("south", "hand", op09Alvida043);
    const expensiveId = engine.findCardInZone("south", "hand", op09Crocodile046);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, alvidaId, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Alvida's play choice.");
    const candidates = play.candidates
      .filter((candidate) => candidate.legal)
      .map((candidate) => candidate.ref.id);
    expect(candidates).toContain(eligibleId);
    expect(candidates).not.toContain(otherAlvidaId);
    expect(candidates).not.toContain(expensiveId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(eligibleId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(alvidaId);
    expect(view.prompts).toHaveLength(0);
  });
});
