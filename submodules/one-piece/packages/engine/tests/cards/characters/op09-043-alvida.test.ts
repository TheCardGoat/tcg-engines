import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op09Alvida043,
  op09Buggy042,
  op09DraculeMihawk048,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-043 Alvida", () => {
  test("with an included Cross Guild Leader, plays a non-Alvida Character costing 5 or less on K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op09Buggy042,
        hand: [eb01Doma005, op09Alvida043, op09DraculeMihawk048],
        character: [{ card: op09Alvida043, rested: true, playedOnTurn: 0 }],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const alvidaId = engine.findCardInZone("south", "character", op09Alvida043);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const eligibleId = engine.findCardInZone("south", "hand", eb01Doma005);
    const excludedNameId = engine.findCardInZone("south", "hand", op09Alvida043);
    const expensiveId = engine.findCardInZone("south", "hand", op09DraculeMihawk048);

    engine.declareAttack(attackerId, alvidaId, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (play?.kind !== "selectEntity") throw new Error("Expected Alvida's On K.O. play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedNameId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(alvidaId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });
});
