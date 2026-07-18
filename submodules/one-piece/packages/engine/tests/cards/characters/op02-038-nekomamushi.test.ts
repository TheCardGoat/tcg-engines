import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op02Nekomamushi038 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-038 Nekomamushi", () => {
  test("rests as a Blocker, redirects a Leader attack, and is battle K.O.'d", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        character: [{ card: op02Nekomamushi038, playedOnTurn: 0 }],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const nekomamushiId = engine.findCardInZone("north", "character", op02Nekomamushi038);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");

    const blocker = engine.pendingDecision("battleBlocker", "north").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Nekomamushi's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(nekomamushiId);
    engine.resolveDecision("battleBlocker", { selectedIds: [nekomamushiId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(nekomamushiId);
    expect(view.players.north.lifeCount).toBe(lifeBefore);
    expect(view.prompts).toHaveLength(0);
  });
});
