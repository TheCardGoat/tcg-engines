import { describe, expect, test } from "vite-plus/test";
import { op04Bartolomeo089, op04Ideo077 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-089 Bartolomeo", () => {
  test("uses Blocker through the public battle decision", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04Bartolomeo089] },
      { character: [{ card: op04Ideo077, attachedDon: 2, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const blockerId = engine.findCardInZone("south", "character", op04Bartolomeo089);
    const attackerId = engine.findCardInZone("north", "character", op04Ideo077);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Bartolomeo's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(blockerId);
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(blockerId);
    expect(view.prompts).toHaveLength(0);
  });
});
