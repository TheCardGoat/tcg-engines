import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op01Pacifista075 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-075 Pacifista", () => {
  test("is selected as a Blocker through the public battle decision", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op01Pacifista075, playedOnTurn: 0 }] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const pacifistaId = engine.findCardInZone("south", "character", op01Pacifista075);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Pacifista's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(pacifistaId);
    engine.resolveDecision("battleBlocker", { selectedIds: [pacifistaId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      pacifistaId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
