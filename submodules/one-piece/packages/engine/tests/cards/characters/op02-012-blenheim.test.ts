import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op02Blenheim012 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-012 Blenheim", () => {
  test("rests as a Blocker, redirects a Leader attack, and is battle K.O.'d", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        character: [{ card: op02Blenheim012, playedOnTurn: 0 }],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const blenheimId = engine.findCardInZone("north", "character", op02Blenheim012);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");

    const blocker = engine.pendingDecision("battleBlocker", "north").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Blenheim's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(blenheimId);
    engine.resolveDecision("battleBlocker", { selectedIds: [blenheimId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(blenheimId);
    expect(view.players.north.lifeCount).toBe(lifeBefore);
    expect(view.prompts).toHaveLength(0);
  });
});
