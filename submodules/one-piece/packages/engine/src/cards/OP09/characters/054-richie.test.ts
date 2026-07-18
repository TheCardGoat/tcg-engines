import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op09Richie054 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-054 Richie", () => {
  test("rests through the defender-owned Blocker choice and redirects the attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op09Richie054] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const richieId = engine.findCardInZone("south", "character", op09Richie054);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Richie's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(richieId);
    engine.resolveDecision("battleBlocker", { selectedIds: [richieId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(richieId);
    expect(view.prompts).toHaveLength(0);
  });
});
