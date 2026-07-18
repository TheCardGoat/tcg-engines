import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op06Cerberus087 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-087 Cerberus", () => {
  test("rests to block an opposing attack and protects its Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op06Cerberus087] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const cerberusId = engine.findCardInZone("south", "character", op06Cerberus087);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Cerberus's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(cerberusId);
    engine.resolveDecision("battleBlocker", { selectedIds: [cerberusId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(cerberusId);
  });
});
