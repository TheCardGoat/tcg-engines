import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op10CloneSoldier064 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP10-064 Clone Soldier", () => {
  test("blocks an attack aimed at its Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op10CloneSoldier064] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const blockerId = engine.findCardInZone("south", "character", op10CloneSoldier064);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Clone Soldier's Blocker.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(blockerId);
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(blockerId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(blockerId);
  });
});
