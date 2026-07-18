import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op05Kuween024 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-024 Kuween", () => {
  test("uses Blocker through the public battle decision", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op05Kuween024] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const kuweenId = engine.findCardInZone("south", "character", op05Kuween024);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Kuween's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(kuweenId);
    engine.resolveDecision("battleBlocker", { selectedIds: [kuweenId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(kuweenId);
    expect(view.prompts).toHaveLength(0);
  });
});
