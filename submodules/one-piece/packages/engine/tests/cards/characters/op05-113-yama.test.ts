import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op05Yama113 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-113 Yama", () => {
  test("redirects a Leader attack through the defending player's Blocker choice", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op05Yama113] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const yamaId = engine.findCardInZone("south", "character", op05Yama113);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Yama's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(yamaId);
    engine.resolveDecision("battleBlocker", { selectedIds: [yamaId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(yamaId);
    expect(view.prompts).toHaveLength(0);
  });
});
